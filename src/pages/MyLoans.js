import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, X } from 'lucide-react';
import { loanApplicationsAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchLoans = useCallback(async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await loanApplicationsAPI.getAll();
      setLoans(response.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching loans:', error);
      setError(getErrorMessage(error, 'Failed to load your loans'));
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
    fetchLoans({ initialLoad: true });
  }, [fetchLoans]);

  const filteredLoans = loans.filter(loan => {
    if (filter === 'all') return true;
    return loan.status === filter;
  });

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Pending Review',
      approved: 'Approved, Awaiting Activation',
      active: 'Active',
      progress: 'In Progress',
      completed: 'Completed',
      rejected: 'Rejected',
      defaulted: 'Defaulted',
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'pending',
      approved: 'approved',
      rejected: 'rejected',
      active: 'active',
      progress: 'progress',
      completed: 'done',
      defaulted: 'defaulted',
    };
    return `badge-${statusMap[status] || 'info'}`;
  };

  const getCrbStatusLabel = (loan) => {
    if (loan.status === 'pending') {
      if (loan.crb_review_status === 'clear') {
        return 'CRB clear, awaiting final approval';
      }
      if (loan.crb_review_status === 'debt_found') {
        return 'CRB review found debt obligations';
      }
      return 'Pending admin CRB review';
    }

    if (loan.status === 'rejected' && loan.crb_review_status === 'debt_found') {
      return 'Rejected after CRB review';
    }

    return '';
  };

  if (loading) {
    return <div className="loading">Loading your loans...</div>;
  }

  return (
    <div className="my-loans-page fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>My Loans</h1>
            <p>View and manage all your loan applications, including those awaiting admin activation</p>
          </div>
          <button type="button" className="btn btn-outline page-refresh-button" onClick={() => window.location.reload()} disabled={refreshing}>
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

      <div className="card alert alert-info">
        <h3>Approval flow</h3>
        <p>
          New applications stay in <strong>Pending</strong> until an admin checks the CRB details and approves or rejects the loan.
        </p>
      </div>

      {/* Filter Section */}
      <div className="card">
        <div className="filter-section">
          <label>Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Loans</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
            <option value="defaulted">Defaulted</option>
          </select>
        </div>
      </div>

      {/* Loans List */}
      {filteredLoans.length > 0 ? (
        <div className="loans-list">
          {filteredLoans.map(loan => (
            <div key={loan.id} className="card loan-item">
              <div className="loan-header">
                <div className="loan-title">
                  <h3>Loan #{loan.id}</h3>
                  <span className={`badge ${getStatusBadge(loan.status)}`}>
                    {getStatusLabel(loan.status)}
                  </span>
                </div>
                {getCrbStatusLabel(loan) && (
                  <div className="loan-crb-status">{getCrbStatusLabel(loan)}</div>
                )}
                <div className="loan-amount">
                  <strong>{formatUsdAsRwf(loan.amount)}</strong>
                </div>
              </div>

              <div className="loan-details grid grid-3">
                <div className="detail">
                  <label>Interest Rate:</label>
                  <span>{loan.interest_rate}%</span>
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
                  <label>Application Date:</label>
                  <span>{new Date(loan.application_date).toLocaleDateString()}</span>
                </div>
                <div className="detail">
                  <label>Due Date:</label>
                  <span>{loan.due_date ? new Date(loan.due_date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="detail">
                  <label>Purpose:</label>
                  <span>{loan.purpose}</span>
                </div>
              </div>

              {loan.status === 'active' && (
                <div className="loan-progress">
                  <label>Repayment Progress</label>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${loan.progress_percentage || 0}%` }}
                    ></div>
                  </div>
                  <span>{loan.progress_percentage || 0}% repaid</span>
                </div>
              )}

              <div className="loan-actions">
                {loan.status === 'active' && (
                  <>
                    <Link to={`/repayment-schedule/${loan.id}`} className="btn btn-primary">
                      View Schedule
                    </Link>
                    <Link
                      to={`/payments?loan=${loan.id}&amount=${loan.monthly_payment || loan.amount || ''}`}
                      className="btn btn-success"
                    >
                      Make Payment
                    </Link>
                  </>
                )}
                {loan.status === 'approved' && (
                  <button className="btn btn-secondary" disabled>Awaiting Admin Activation</button>
                )}
                {loan.status === 'pending' && (
                  <>
                    <button className="btn btn-secondary" disabled>Awaiting Admin Review</button>
                    <button className="btn btn-danger">Cancel Application</button>
                  </>
                )}
                {loan.status === 'rejected' && loan.crb_review_status === 'debt_found' && (
                  <button className="btn btn-danger" disabled>Rejected After CRB Review</button>
                )}
                {loan.status === 'active' && (
                  <Link to={`/repayment-schedule/${loan.id}`} className="btn btn-outline">
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>No loans found.</p>
          {filter === 'all' && (
            <Link to="/loan-products" className="btn btn-primary">
              Apply for a Loan
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default MyLoans;
