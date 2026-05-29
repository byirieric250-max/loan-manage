import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { RefreshCw, X } from 'lucide-react';
import { loanApplicationsAPI, repaymentAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const RepaymentSchedule = () => {
  const { loanId } = useParams();
  const [loan, setLoan] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingInstallmentId, setProcessingInstallmentId] = useState(null);
  const [error, setError] = useState('');

  const fetchLoanData = useCallback(async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      // Fetch loan details
      const loanResponse = await loanApplicationsAPI.getById(loanId);
      setLoan(loanResponse.data);

      // Fetch repayment schedule
      const scheduleResponse = await repaymentAPI.getSchedule(loanId);
      setSchedule(scheduleResponse.data || []);

      // Fetch payment history
      const paymentsResponse = await repaymentAPI.getPayments(loanId);
      setPayments(paymentsResponse.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching loan data:', error);
      setError(getErrorMessage(error, 'Failed to load loan data'));
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, [loanId]);

  useEffect(() => {
    fetchLoanData({ initialLoad: true });
  }, [fetchLoanData]);

  const getPaymentStatus = (scheduledPayment) => {
    const payment = payments.find(p => p.scheduled_payment_id === scheduledPayment.id);
    if (payment) {
      return { status: 'paid', date: payment.payment_date };
    }
    if (new Date(scheduledPayment.due_date) < new Date()) {
      return { status: 'overdue', date: scheduledPayment.due_date };
    }
    return { status: 'upcoming', date: scheduledPayment.due_date };
  };

  const handlePayInstallment = async (scheduledPayment) => {
    if (!loan || processingInstallmentId) {
      return;
    }

    const status = getPaymentStatus(scheduledPayment);
    if (status.status === 'paid') {
      return;
    }

    setProcessingInstallmentId(scheduledPayment.id);
    setError('');

    try {
      await repaymentAPI.makePayment({
        loan: loan.id,
        scheduled_payment: scheduledPayment.id,
        amount: scheduledPayment.amount,
        payment_method: 'bank_transfer',
      });
      await fetchLoanData();
    } catch (error) {
      console.error('Error paying installment:', error);
      setError(getErrorMessage(error, 'Failed to process installment payment'));
    } finally {
      setProcessingInstallmentId(null);
    }
  };

  const handleRepayFullAmount = async () => {
    if (!loan || remainingBalance <= 0 || processingInstallmentId) {
      return;
    }

    setProcessingInstallmentId('full-repayment');
    setError('');

    try {
      await repaymentAPI.makePayment({
        loan: loan.id,
        amount: remainingBalance,
        payment_method: 'bank_transfer',
        notes: 'Early repayment - full outstanding balance',
      });
      await fetchLoanData();
    } catch (error) {
      console.error('Error processing full repayment:', error);
      setError(getErrorMessage(error, 'Failed to process full repayment'));
    } finally {
      setProcessingInstallmentId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading repayment schedule...</div>;
  }

  if (!loan) {
    return <div className="card">Loan not found</div>;
  }

  if (loan.status === 'approved' && (!schedule || schedule.length === 0)) {
    return (
      <div className="repayment-schedule-page fade-in">
        <div className="page-header">
          <h1>Repayment Schedule</h1>
          <p>Loan #{loanId}</p>
        </div>
        <div className="card alert alert-info">
          <h3>Awaiting admin activation</h3>
          <p>This loan has been approved, but the repayment schedule will appear after the admin activates it.</p>
        </div>
      </div>
    );
  }

  const totalRepaid = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  const remainingBalance = parseFloat(loan.amount || 0) - totalRepaid;
  const progressPercentage = loan.amount ? (totalRepaid / parseFloat(loan.amount)) * 100 : 0;

  return (
    <div className="repayment-schedule-page fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Repayment Schedule</h1>
            <p>Loan #{loanId}</p>
          </div>
          <button
            type="button"
            className="btn btn-outline page-refresh-button"
            onClick={() => window.location.reload()}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button className="alert-close" onClick={() => setError('')}>
            <X size={18} />
          </button>
        </div>
      )}

      {/* Loan Summary */}
      <div className="card loan-summary">
        <h2>Loan Summary</h2>
        <div className="grid grid-4">
          <div className="summary-item">
            <label>Total Amount:</label>
            <strong>{formatUsdAsRwf(loan.amount)}</strong>
          </div>
          <div className="summary-item">
            <label>Total Repaid:</label>
            <strong>{formatUsdAsRwf(totalRepaid)}</strong>
          </div>
          <div className="summary-item">
            <label>Remaining Balance:</label>
            <strong>{formatUsdAsRwf(remainingBalance)}</strong>
          </div>
          <div className="summary-item">
            <label>Progress:</label>
            <strong>{progressPercentage.toFixed(1)}%</strong>
          </div>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Repayment Schedule */}
      <div className="card">
        <h2>Payment Schedule</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Installment</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance After</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((payment, index) => {
                const status = getPaymentStatus(payment);
                return (
                  <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>{new Date(status.date).toLocaleDateString()}</td>
                    <td>{formatUsdAsRwf(payment.amount)}</td>
                    <td>{formatUsdAsRwf(payment.principal)}</td>
                    <td>{formatUsdAsRwf(payment.interest)}</td>
                    <td>{formatUsdAsRwf(payment.balance_after)}</td>
                    <td>
                      <span className={`badge badge-${status.status === 'paid' ? 'success' : status.status === 'overdue' ? 'danger' : 'warning'}`}>
                        {status.status}
                      </span>
                    </td>
                    <td>
                      {status.status === 'upcoming' && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handlePayInstallment(payment)}
                          disabled={processingInstallmentId === payment.id}
                        >
                          {processingInstallmentId === payment.id ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                      {status.status === 'overdue' && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handlePayInstallment(payment)}
                          disabled={processingInstallmentId === payment.id}
                        >
                          {processingInstallmentId === payment.id ? 'Processing...' : 'Pay Now'}
                        </button>
                      )}
                      {status.status === 'paid' && (
                        <span className="text-muted">Paid</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment History */}
      <div className="card">
        <h2>Payment History</h2>
        {payments.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(payment => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{formatUsdAsRwf(payment.amount)}</td>
                    <td>{payment.payment_method}</td>
                    <td>
                      <span className="badge badge-success">Completed</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No payments made yet.</p>
        )}
      </div>

      {/* Early Repayment Option */}
      {remainingBalance > 0 && (
        <div className="card">
          <h2>Early Repayment</h2>
          <p>You can repay your loan early without any penalties.</p>
          <div className="early-repayment-info">
            <div className="detail">
              <label>Outstanding Balance:</label>
              <strong>{formatUsdAsRwf(remainingBalance)}</strong>
            </div>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleRepayFullAmount}
              disabled={processingInstallmentId === 'full-repayment'}
            >
              {processingInstallmentId === 'full-repayment' ? 'Processing...' : 'Repay Full Amount'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RepaymentSchedule;
