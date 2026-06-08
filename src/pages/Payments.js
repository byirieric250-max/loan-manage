import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Building2, 
  CreditCard, 
  Smartphone, 
  Mail,
  RefreshCw,
  X 
} from 'lucide-react';
import { repaymentAPI, loanApplicationsAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const Payments = () => {
  const navigate = useNavigate();
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [overduePayments, setOverduePayments] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedLoan, setSelectedLoan] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const location = useLocation();

  const getLoanStatusLabel = (status) => {
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved',
      active: 'Active',
      progress: 'In Progress',
      pending_completion: 'Pending Completion',
      completed: 'Completed',
      rejected: 'Rejected',
      defaulted: 'Defaulted',
    };
    return labels[status] || status;
  };

  const isPayableLoan = (loan) => ['approved', 'active', 'progress'].includes(loan.status);
  const isSelectableLoan = (loan) => !['rejected', 'defaulted', 'pending_completion', 'completed'].includes(loan.status);

  const payableLoans = useMemo(
    () => loans.filter(isPayableLoan),
    [loans]
  );

  const fetchPaymentData = useCallback(async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const [upcoming, overdue, recent, loansData] = await Promise.all([
        repaymentAPI.getUpcomingPayments(),
        repaymentAPI.getOverduePayments(),
        repaymentAPI.getAllPayments(), // Get all recent payments
        loanApplicationsAPI.getAll(),
      ]);

      setUpcomingPayments(upcoming.data || []);
      setOverduePayments(overdue.data || []);
      setRecentPayments((recent.data || []).slice(0, 10));
      const orderedLoans = (loansData.data || [])
        .filter(isSelectableLoan)
        .sort((a, b) => {
          const rank = { active: 0, progress: 1, approved: 2, pending: 3, completed: 4 };
          return (rank[a.status] ?? 99) - (rank[b.status] ?? 99) || (b.id - a.id);
        });
      setLoans(orderedLoans);
      setError('');
    } catch (error) {
      console.error('Error fetching payment data:', error);
      setError(getErrorMessage(error, 'Failed to load payment data'));
      // Set default values on error
      setUpcomingPayments([]);
      setOverduePayments([]);
      setRecentPayments([]);
      setLoans([]);
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchPaymentData({ initialLoad: true });
    
    // Check if user is returning from payment processing
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('payment') === 'completed') {
      setPaymentCompleted(true);
      // Clear the flag after showing the message
      window.history.replaceState({}, '', location.pathname);
    }
  }, [fetchPaymentData, location]);

  useEffect(() => {
    if (payableLoans.length === 0) {
      setSelectedLoan('');
      return;
    }

    setSelectedLoan((currentSelected) => {
      const currentIsValid = payableLoans.some(
        (loan) => String(loan.id) === String(currentSelected)
      );
      return currentIsValid ? currentSelected : String(payableLoans[0].id);
    });
  }, [payableLoans]);

  useEffect(() => {
    if (!payableLoans.length) {
      return;
    }

    const params = new URLSearchParams(location.search);
    const loanParam = params.get('loan');
    const amountParam = params.get('amount');
    const paymentCompletedParam = params.get('payment');

    if (paymentCompletedParam === 'completed') {
      setPaymentCompleted(true);
      // Clear the URL parameter without reloading
      window.history.replaceState({}, '', '/payments');
    }

    if (!loanParam) {
      return;
    }

    const matchingLoan = payableLoans.find(loan => String(loan.id) === String(loanParam));
    if (matchingLoan) {
      setSelectedLoan(String(matchingLoan.id));
      if (amountParam) {
        setPaymentAmount(amountParam);
      } else if (matchingLoan.monthly_payment) {
        setPaymentAmount(String(matchingLoan.monthly_payment));
      }
    }
  }, [location.search, payableLoans]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedLoan || !paymentAmount) {
      setError('Please select a loan and enter payment amount');
      return;
    }

    const loanToPay = payableLoans.find(loan => String(loan.id) === String(selectedLoan));
    if (!loanToPay || !isPayableLoan(loanToPay)) {
      setError('Please select an approved, active, or in-progress loan to pay');
      return;
    }

    // Redirect to PaymentProcessing page with payment details
    navigate(`/payment-processing?loan=${selectedLoan}&amount=${paymentAmount}&method=${paymentMethod}`);
  };

  const handleQuickPay = async (payment) => {
    setError('');

    const loanToPay = payableLoans.find(loan => String(loan.id) === String(payment.loan_id));
    if (!loanToPay) {
      setError('This loan cannot be paid right now');
      return;
    }

    // Redirect to PaymentProcessing page with payment details
    navigate(`/payment-processing?loan=${payment.loan_id}&amount=${payment.amount}&method=${paymentMethod}`);
  };

  if (loading) {
    return <div className="loading">Loading payment information...</div>;
  }

  return (
    <div className="payments-page fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Payments</h1>
            <p>Manage your loan repayments</p>
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

      {/* Payment Stats */}
      <div className="stats-grid grid grid-3">
        <div className="card stat-card">
          <div className="stat-icon"><Calendar size={32} color="#667eea" /></div>
          <div className="stat-value">{upcomingPayments.length}</div>
          <div className="stat-label">Upcoming Payments</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><AlertTriangle size={32} color="#e74c3c" /></div>
          <div className="stat-value">{overduePayments.length}</div>
          <div className="stat-label">Overdue Payments</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon"><CheckCircle size={32} color="#27ae60" /></div>
          <div className="stat-value">{recentPayments.length}</div>
          <div className="stat-label">Recent Payments</div>
        </div>
      </div>

      <div className="grid grid-2">
        {/* Make Payment */}
        {paymentCompleted ? (
          <div className="card">
            <div className="payment-success-message">
              <CheckCircle size={48} color="#27ae60" />
              <h2>Payment Completed Successfully!</h2>
              <p>Your payment has been processed and will be reflected in your account shortly.</p>
              <button 
                className="btn btn-primary" 
                onClick={() => setPaymentCompleted(false)}
              >
                Make Another Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="card">
            <h2>Make a Payment</h2>
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label htmlFor="loan">Select Loan to Pay</label>
                <select
                  id="loan"
                  value={selectedLoan}
                  onChange={(e) => setSelectedLoan(e.target.value)}
                  required
                >
                  <option value="">Select a loan</option>
                  {payableLoans.map(loan => (
                    <option key={loan.id} value={loan.id}>
                      Loan #{loan.id} - {formatUsdAsRwf(loan.amount)} - {getLoanStatusLabel(loan.status)}
                    </option>
                  ))}
                </select>
                {payableLoans.length === 0 && (
                  <small className="form-help">
                    No payable loans are available right now.
                  </small>
                )}
                {loans.some(loan => !isPayableLoan(loan)) && payableLoans.length > 0 && (
                  <small className="form-help">
                    Only approved, active, and in-progress loans are shown here.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="amount">Payment Amount (RWF)</label>
                <input
                  type="number"
                  id="amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  placeholder="Enter amount"
                />
              </div>

              <div className="form-group">
                <label htmlFor="method">Payment Method</label>
                <select
                  id="method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="check">Check</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={payableLoans.length === 0}>
                Proceed to Payment
              </button>
            </form>
          </div>
        )}

        {/* Overdue Payments */}
        <div className="card">
          <h2>Overdue Payments</h2>
          {overduePayments.length > 0 ? (
            <div className="payment-list">
              {overduePayments.map(payment => (
                <div key={payment.id} className="payment-item overdue">
                  <div className="payment-info">
                    <h3>Loan #{payment.loan_id}</h3>
                    <p className="payment-amount">{formatUsdAsRwf(payment.amount)}</p>
                    <p className="payment-due">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                    <p className="payment-days-overdue">
                      {Math.ceil((new Date() - new Date(payment.due_date)) / (1000 * 60 * 60 * 24))} days overdue
                    </p>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleQuickPay(payment)}>Pay Now</button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>No overdue payments. Great job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="card">
        <h2>Upcoming Payments</h2>
        {upcomingPayments.length > 0 ? (
          <div className="payment-list">
            {upcomingPayments.map(payment => (
              <div key={payment.id} className="payment-item">
                  <div className="payment-info">
                  <h3>Loan #{payment.loan_id}</h3>
                  <p className="payment-amount">{formatUsdAsRwf(payment.amount)}</p>
                  <p className="payment-due">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                </div>
                <div className="payment-actions">
                  <button className="btn btn-primary" onClick={() => handleQuickPay(payment)}>Pay Now</button>
                  <Link to={`/repayment-schedule/${payment.loan_id}`} className="btn btn-outline">
                    View Schedule
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No upcoming payments.</p>
          </div>
        )}
      </div>

      {/* Recent Payment History */}
      <div className="card">
        <h2>Recent Payment History</h2>
        {recentPayments.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Loan ID</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPayments.map(payment => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>#{payment.loan_id}</td>
                    <td>{formatUsdAsRwf(payment.amount)}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.payment_method}</td>
                    <td>
                      <span className={`badge badge-${payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}`}>
                        {payment.status || 'paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No payment history yet.</p>
          </div>
        )}
      </div>

      {/* Payment Methods Info */}
      <div className="card">
        <h2>Accepted Payment Methods</h2>
        <div className="payment-methods grid grid-4">
          <div className="payment-method">
            <div className="method-icon"><Building2 size={32} color="#667eea" /></div>
            <h3>Bank Transfer</h3>
            <p>Direct transfer from your bank account</p>
          </div>
          <div className="payment-method">
            <div className="method-icon"><CreditCard size={32} color="#667eea" /></div>
            <h3>Credit/Debit Card</h3>
            <p>Pay with your credit or debit card</p>
          </div>
          <div className="payment-method">
            <div className="method-icon"><Smartphone size={32} color="#667eea" /></div>
            <h3>Mobile Money</h3>
            <p>Pay using mobile money services</p>
          </div>
          <div className="payment-method">
            <div className="method-icon"><Mail size={32} color="#667eea" /></div>
            <h3>Check</h3>
            <p>Pay by check (processing time applies)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
