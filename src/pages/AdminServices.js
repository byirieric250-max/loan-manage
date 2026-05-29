import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, PlayCircle, ShieldCheck, X, XCircle, CreditCard } from 'lucide-react';
import { adminServicesAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const statusLabels = {
  pending: 'Pending',
  approved: 'Approved',
  active: 'Active',
  progress: 'In Progress',
  rejected: 'Rejected',
  completed: 'Completed',
  defaulted: 'Defaulted',
};

const AdminServices = () => {
  const [loans, setLoans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [busyPaymentId, setBusyPaymentId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLoans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentFilter]);

  const stats = useMemo(() => ({
    pending: loans.filter((loan) => loan.status === 'pending').length,
    approved: loans.filter((loan) => loan.status === 'approved' || loan.status === 'progress').length,
    active: loans.filter((loan) => loan.status === 'active').length,
  }), [loans]);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const response = await adminServicesAPI.getLoanApplications(filter);
      setLoans(response.data || []);
      setMessage({ type: '', text: '' });
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load admin services') });
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await adminServicesAPI.getPayments(
        paymentFilter && paymentFilter !== 'all' ? { status: paymentFilter } : {},
      );
      setPayments(response.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load payment records') });
      setPayments([]);
    }
  };

  const runAction = async (id, action, successText) => {
    setBusyId(id);
    setMessage({ type: '', text: '' });
    try {
      await action(id);
      setMessage({ type: 'success', text: successText });
      await fetchLoans();
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Action failed') });
    } finally {
      setBusyId(null);
    }
  };

  const activateAll = async () => {
    setBusyId('all');
    setMessage({ type: '', text: '' });
    try {
      const response = await adminServicesAPI.activateAllServices();
      setMessage({ type: 'success', text: response.data.message || 'All approved services activated' });
      await fetchLoans();
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to activate services') });
    } finally {
      setBusyId(null);
    }
  };

  const runPaymentAction = async (id, action, successText) => {
    setBusyPaymentId(id);
    setMessage({ type: '', text: '' });
    try {
      await action(id);
      setMessage({ type: 'success', text: successText });
      await fetchPayments();
    } catch (error) {
      setMessage({ type: 'error', text: getErrorMessage(error, 'Payment action failed') });
    } finally {
      setBusyPaymentId(null);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin services...</div>;
  }

  return (
    <div className="admin-services-page fade-in">
      <div className="page-header">
        <h1>Admin Services</h1>
        <p>Review user loan requests, approve eligible applications, and activate services.</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="stats-grid grid grid-3">
        <div className="card stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending Review</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.approved}</div>
          <div className="stat-label">Ready to Activate</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{stats.active}</div>
          <div className="stat-label">Active Services</div>
        </div>
      </div>

      <div className="card">
        <div className="admin-services-toolbar">
          <div className="filter-section">
            <label>Filter by Status:</label>
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="progress">In Progress</option>
              <option value="active">Active</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            type="button"
            className="btn btn-success"
            onClick={activateAll}
            disabled={busyId === 'all'}
          >
            <PlayCircle size={18} />
            {busyId === 'all' ? 'Activating...' : 'Activate All Approved'}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CreditCard size={20} /> Payment Management
          </h2>
          <div className="admin-services-toolbar">
            <div className="filter-section">
              <label>Filter by Payment Status:</label>
              <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
        {payments.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Loan</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>#{payment.loan_id}</td>
                    <td>{payment.loan?.customer?.first_name} {payment.loan?.customer?.last_name}</td>
                    <td>{formatUsdAsRwf(payment.amount)}</td>
                    <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                    <td>{payment.payment_method}</td>
                    <td>
                      <span className={`badge badge-${payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'warning' : 'danger'}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <div className="loan-actions">
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled={busyPaymentId === payment.id}
                          onClick={() => runPaymentAction(payment.id, adminServicesAPI.markPaymentPaid, 'Payment marked as paid')}
                        >
                          Paid
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={busyPaymentId === payment.id}
                          onClick={() => runPaymentAction(payment.id, adminServicesAPI.markPaymentOverdue, 'Payment marked as overdue')}
                        >
                          Overdue
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger"
                          disabled={busyPaymentId === payment.id}
                          onClick={() => runPaymentAction(payment.id, adminServicesAPI.markPaymentFailed, 'Payment marked as failed')}
                        >
                          Failed
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <p>No payments found for this filter.</p>
          </div>
        )}
      </div>

      {loans.length > 0 ? (
        <div className="loans-list">
          {loans.map((loan) => (
            <div key={loan.id} className="card loan-item">
              <div className="loan-header">
                <div className="loan-title">
                  <h3>Loan #{loan.id}</h3>
                  <span className={`badge badge-${loan.status}`}>{statusLabels[loan.status] || loan.status}</span>
                  <span className={`badge badge-${loan.crb_review_status === 'clear' ? 'success' : loan.crb_review_status === 'debt_found' ? 'danger' : 'warning'}`}>
                    CRB: {loan.crb_review_status || 'pending'}
                  </span>
                </div>
                <div className="loan-amount">
                  <strong>{formatUsdAsRwf(loan.amount)}</strong>
                </div>
              </div>

              <div className="loan-details grid grid-3">
                <div className="detail">
                  <label>Customer:</label>
                  <span>{loan.customer?.first_name} {loan.customer?.last_name}</span>
                </div>
                <div className="detail">
                  <label>Email:</label>
                  <span>{loan.customer?.email}</span>
                </div>
                <div className="detail">
                  <label>Product:</label>
                  <span>{loan.loan_product?.name || 'N/A'}</span>
                </div>
                <div className="detail">
                  <label>Term:</label>
                  <span>{loan.term_months} months</span>
                </div>
                <div className="detail">
                  <label>Monthly Payment:</label>
                  <span>{formatUsdAsRwf(loan.monthly_payment || 0)}</span>
                </div>
                <div className="detail">
                  <label>Purpose:</label>
                  <span>{loan.purpose}</span>
                </div>
              </div>

              <div className="loan-actions">
                {loan.status === 'pending' && (
                  <>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={busyId === loan.id}
                      onClick={() => runAction(loan.id, adminServicesAPI.markCrbClear, 'CRB marked clear')}
                    >
                      <ShieldCheck size={18} />
                      CRB Clear
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={busyId === loan.id}
                      onClick={() => runAction(loan.id, adminServicesAPI.approveLoan, 'Loan approved')}
                    >
                      <CheckCircle size={18} />
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={busyId === loan.id}
                      onClick={() => runAction(loan.id, adminServicesAPI.rejectLoan, 'Loan rejected')}
                    >
                      <XCircle size={18} />
                      Reject
                    </button>
                  </>
                )}
                {(loan.status === 'approved' || loan.status === 'progress') && (
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={busyId === loan.id}
                    onClick={() => runAction(loan.id, adminServicesAPI.activateLoan, 'Loan service activated')}
                  >
                    <PlayCircle size={18} />
                    Activate Service
                  </button>
                )}
                {loan.status === 'active' && (
                  <button type="button" className="btn btn-secondary" disabled>Service Active</button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>No user services found for this filter.</p>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
