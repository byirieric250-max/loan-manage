import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wallet, 
  CheckCircle, 
  BarChart3, 
  FileText, 
  PlusCircle, 
  CreditCard, 
  User, 
  Bell, 
  Sparkles,
  ChevronDown,
  CalendarClock,
  HelpCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { loanApplicationsAPI, repaymentAPI, loanProductsAPI, API_BASE_URL } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const Dashboard = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [isRelatedMenuOpen, setIsRelatedMenuOpen] = useState(false);
  const [isLoanMenuOpen, setIsLoanMenuOpen] = useState(true);
  const [stats, setStats] = useState({
    activeLoans: 0,
    pendingReviewLoans: 0,
    totalBorrowed: 0,
    totalRepaid: 0,
    remainingBalance: 0,
    upcomingPayments: 0,
    overduePayments: 0,
  });
  const [activeLoans, setActiveLoans] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [reviewLoans, setReviewLoans] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [loanProducts, setLoanProducts] = useState([]);

  const getProductImage = (product) => {
    const images = {
      personal: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
      education: 'https://www.google.com/about/philanthropy/images/education-hero.jpg',
      home: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      auto: 'https://images.unsplash.com/photo-1492144534773-5bcb4c7b6c1c?w=400&h=250&fit=crop',
    };
    if (product?.name === 'Education Support Loan') {
      return images.education;
    }
    return images[product?.category] || images.personal;
  };

  const featuredLoanProducts = useMemo(() => {
    return [...loanProducts]
      .sort((a, b) => {
        const aEducation = a?.name === 'Education Support Loan' ? 0 : 1;
        const bEducation = b?.name === 'Education Support Loan' ? 0 : 1;
        if (aEducation !== bEducation) {
          return aEducation - bEducation;
        }
        return (a?.id || 0) - (b?.id || 0);
      })
      .slice(0, 3);
  }, [loanProducts]);

  const loanMenuItems = [
    { label: 'Loan Products', to: '/loan-products', icon: PlusCircle },
    { label: 'My Loans', to: '/my-loans', icon: FileText },
    { label: 'Payments', to: '/payments', icon: CreditCard },
  ];

  const relatedMenuItems = [
    { label: 'Repayment Schedule', to: activeLoans[0] ? `/repayment-schedule/${activeLoans[0].id}` : '/my-loans', icon: CalendarClock },
    { label: 'Notifications', to: '/notifications', icon: Bell },
    { label: 'Profile', to: '/profile', icon: User },
    { label: 'Help Center', to: '/help', icon: HelpCircle },
  ];

  const fetchDashboardData = useCallback(async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      // Fetch recent loans
      const loansResponse = await loanApplicationsAPI.getAll();
      const allLoans = loansResponse.data || [];
      const approvedWaitingActivation = allLoans.filter(loan => loan.status === 'approved');
      const activeOnlyLoans = allLoans.filter(loan => loan.status === 'active');
      const pendingLoans = allLoans.filter(loan => loan.status === 'pending');

      setApprovedLoans(approvedWaitingActivation.slice(0, 5));
      setActiveLoans(activeOnlyLoans.slice(0, 5));
      setReviewLoans(pendingLoans.slice(0, 3));

      // Fetch loan products
      try {
        const productsResponse = await loanProductsAPI.getAll();
        setLoanProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Error fetching loan products:', error);
        setLoanProducts([]);
      }

      // Calculate stats
      const totalBorrowed = activeOnlyLoans.reduce((sum, loan) => sum + parseFloat(loan.amount || 0), 0);
      const totalRepaid = activeOnlyLoans.reduce((sum, loan) => 
        sum + (loan.total_repaid || 0), 0
      );
      
      setStats({
        activeLoans: activeOnlyLoans.length,
        pendingReviewLoans: pendingLoans.length,
        totalBorrowed,
        totalRepaid,
        remainingBalance: totalBorrowed - totalRepaid,
        upcomingPayments: 0,
        overduePayments: 0,
      });

      // Fetch upcoming payments
      try {
        const paymentsResponse = await repaymentAPI.getUpcomingPayments();
        setUpcomingPayments(paymentsResponse.data.slice(0, 3));
        setStats(prev => ({
          ...prev,
          upcomingPayments: paymentsResponse.data.length,
        }));
      } catch (error) {
        console.error('Error fetching upcoming payments:', error);
      }

      // Fetch overdue payments
      try {
        const overdueResponse = await repaymentAPI.getOverduePayments();
        setStats(prev => ({
          ...prev,
          overduePayments: overdueResponse.data.length,
        }));
      } catch (error) {
        console.error('Error fetching overdue payments:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(getErrorMessage(error, 'Failed to load dashboard data'));
      // Set default values on error
      setStats({
        activeLoans: 0,
        pendingReviewLoans: 0,
        totalBorrowed: 0,
        totalRepaid: 0,
        remainingBalance: 0,
        upcomingPayments: 0,
        overduePayments: 0,
      });
      setActiveLoans([]);
      setApprovedLoans([]);
      setReviewLoans([]);
      setLoanProducts([]);
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboardData({ initialLoad: true });
  }, [fetchDashboardData]);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-text">
            <h1>Welcome back, {user?.first_name}!</h1>
            <p>Here's an overview of your loan portfolio</p>
          </div>
          <div className="dashboard-header-actions">
            <div className="dashboard-related-menu">
              <button
                type="button"
                className="btn btn-primary dashboard-related-button"
                onClick={() => setIsRelatedMenuOpen((isOpen) => !isOpen)}
                aria-expanded={isRelatedMenuOpen}
                aria-haspopup="menu"
              >
                Related Menu
                <ChevronDown
                  size={18}
                  className={isRelatedMenuOpen ? 'dropdown-icon open' : 'dropdown-icon'}
                />
              </button>
              <button
                type="button"
                className="btn btn-outline dashboard-refresh-button"
                onClick={() => window.location.reload()}
                disabled={refreshing}
                aria-label="Refresh dashboard"
              >
                <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
                <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
              </button>
              {isRelatedMenuOpen && (
                <div className="dashboard-related-dropdown" role="menu">
                  <button
                    type="button"
                    className="dashboard-submenu-toggle"
                    onClick={() => setIsLoanMenuOpen((isOpen) => !isOpen)}
                    aria-expanded={isLoanMenuOpen}
                  >
                    <span>Loan Menu</span>
                    <ChevronDown
                      size={16}
                      className={isLoanMenuOpen ? 'dropdown-icon open' : 'dropdown-icon'}
                    />
                  </button>
                  {isLoanMenuOpen && (
                    <div className="dashboard-submenu-links">
                      {loanMenuItems.map(({ label, to, icon: Icon }) => (
                        <Link
                          key={label}
                          to={to}
                          role="menuitem"
                          onClick={() => setIsRelatedMenuOpen(false)}
                        >
                          <Icon size={18} />
                          <span>{label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="dashboard-menu-divider" />
                  <div className="dashboard-menu-section">
                    <div className="dashboard-menu-section-title">Related Menu</div>
                    {relatedMenuItems.map(({ label, to, icon: Icon }) => (
                      <Link
                        key={label}
                        to={to}
                        role="menuitem"
                        onClick={() => setIsRelatedMenuOpen(false)}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="dashboard-header-image">
              <img
                src={user?.passport_photo ? `${API_BASE_URL}${user.passport_photo}` : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"}
                alt="Profile"
                className="dashboard-avatar"
              />
            </div>
          </div>
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

      <div className="grid grid-3">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Stats Grid */}
          <div className="stats-grid grid grid-4">
            <div className="card stat-card">
              <div className="stat-icon"><Wallet size={32} color="#667eea" /></div>
              <div className="stat-value">{formatUsdAsRwf(stats.totalBorrowed)}</div>
              <div className="stat-label">Total Borrowed</div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon"><CheckCircle size={32} color="#27ae60" /></div>
              <div className="stat-value">{formatUsdAsRwf(stats.totalRepaid)}</div>
              <div className="stat-label">Total Repaid</div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon"><BarChart3 size={32} color="#3498db" /></div>
              <div className="stat-value">{formatUsdAsRwf(stats.remainingBalance)}</div>
              <div className="stat-label">Remaining Balance</div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon"><FileText size={32} color="#f39c12" /></div>
              <div className="stat-value">{stats.activeLoans}</div>
              <div className="stat-label">Active Loans</div>
            </div>
          </div>

          {reviewLoans.length > 0 && (
            <div className="card alert alert-info">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={24} /> Your application is under admin CRB review
              </h3>
              <p>
                {reviewLoans.length} loan application{reviewLoans.length > 1 ? 's are' : ' is'} waiting for the admin to check CRB for debts at other banks and approve or reject them.
              </p>
              <Link to="/my-loans" className="btn btn-primary">View Applications</Link>
            </div>
          )}

          <div className="grid grid-2">
            {/* Recent Loans */}
            <div className="card">
              <div className="card-header">
                <h2>Active Loans</h2>
                <Link to="/my-loans" className="btn btn-outline">View All</Link>
              </div>
              {activeLoans.length > 0 ? (
                <div className="loan-list">
                  {activeLoans.map(loan => (
                    <div key={loan.id} className="loan-item">
                      <div className="loan-info">
                        <h3>Loan #{loan.id}</h3>
                        <p className="loan-amount">{formatUsdAsRwf(loan.amount)}</p>
                        <span className="badge badge-active">Active</span>
                      </div>
                      <Link to={`/repayment-schedule/${loan.id}`} className="btn btn-secondary">
                        View Schedule
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No active loans</p>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-header">
                <h2>Approved, Awaiting Activation</h2>
                <Link to="/my-loans" className="btn btn-outline">View All</Link>
              </div>
              {approvedLoans.length > 0 ? (
                <div className="loan-list">
                  {approvedLoans.map(loan => (
                    <div key={loan.id} className="loan-item">
                      <div className="loan-info">
                        <h3>Loan #{loan.id}</h3>
                        <p className="loan-amount">{formatUsdAsRwf(loan.amount)}</p>
                        <span className="badge badge-approved">Approved</span>
                      </div>
                      <button className="btn btn-secondary" disabled>
                        Awaiting Activation
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No loans waiting for activation</p>
                </div>
              )}
            </div>

            {/* Upcoming Payments */}
            <div className="card">
              <div className="card-header">
                <h2>Upcoming Payments</h2>
                <Link to="/payments" className="btn btn-outline">View All</Link>
              </div>
              {upcomingPayments.length > 0 ? (
                <div className="payment-list">
                  {upcomingPayments.map(payment => (
                    <div key={payment.id} className="payment-item">
                      <div className="payment-info">
                        <h3>Payment #{payment.id}</h3>
                        <p className="payment-amount">{formatUsdAsRwf(payment.amount)}</p>
                        <p className="payment-due">Due: {new Date(payment.due_date).toLocaleDateString()}</p>
                      </div>
                      <button className="btn btn-primary">Pay Now</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No upcoming payments</p>
                </div>
              )}
            </div>

            {/* Loan Products */}
            <div className="card">
              <div className="card-header">
                <h2>Available Loan Products</h2>
                <Link to="/loan-products" className="btn btn-outline">View All</Link>
              </div>
              {loanProducts.length > 0 ? (
                <div className="products-grid">
                  {featuredLoanProducts.map(product => (
                    <div
                      key={product.id}
                      className={product?.name === 'Education Support Loan' ? 'product-card education-support-product' : 'product-card'}
                    >
                      <div className="product-image">
                        <Link to={`/apply-loan/${product.id}`}>
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="product-img"
                          />
                        </Link>
                      </div>
                      <div className="product-header">
                        <h3 className={product?.name === 'Education Support Loan' ? 'education-support-title' : ''}>{product.name}</h3>
                        <span className="badge badge-info education-support-badge">{product.category}</span>
                      </div>
                      <div className="product-details education-support-text">
                        <div className="detail-row">
                          <span>Amount:</span>
                          <strong>{formatUsdAsRwf(product.min_amount)} - {formatUsdAsRwf(product.max_amount)}</strong>
                        </div>
                        <div className="detail-row">
                          <span>Interest:</span>
                          <strong>{product.interest_rate}%</strong>
                        </div>
                        <div className="detail-row">
                          <span>Term:</span>
                          <strong>{product.min_term} - {product.max_term} months</strong>
                        </div>
                      </div>
                      <Link to={`/apply-loan/${product.id}`} className="btn btn-primary">
                        Apply Now
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No loan products available</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2>Quick Actions</h2>
            <div className="quick-actions grid grid-4">
              <Link to="/loan-products" className="quick-action">
                <div className="action-icon"><PlusCircle size={32} /></div>
                <span>Apply for Loan</span>
              </Link>
              <Link to="/my-loans" className="quick-action">
                <div className="action-icon"><FileText size={32} /></div>
                <span>My Loans</span>
              </Link>
              <Link to="/payments" className="quick-action">
                <div className="action-icon"><CreditCard size={32} /></div>
                <span>Make Payment</span>
              </Link>
              <Link to="/profile" className="quick-action">
                <div className="action-icon"><User size={32} /></div>
                <span>Update Profile</span>
              </Link>
            </div>
          </div>

          {/* Prominent CTA for New Loan */}
          {activeLoans.length === 0 && approvedLoans.length === 0 && (
            <div className="card alert alert-success">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={24} /> Welcome to Loan Management System!
              </h3>
              <p>You haven't applied for any loans yet. Get started by applying for your first loan today!</p>
              <Link to="/loan-products" className="btn btn-primary">Browse Loan Products</Link>
            </div>
          )}

          {/* Notifications Alert */}
          {unreadCount > 0 && (
            <div className="card alert alert-info">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={24} /> You have {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
              </h3>
              <Link to="/notifications" className="btn btn-primary">View Notifications</Link>
            </div>
          )}
        </div>

        {/* Right Sidebar - Profile Summary */}
        <div className="col-span-1">
          <div className="card profile-sidebar">
            <h2>Profile</h2>
            <div className="profile-summary-vertical">
              <div className="profile-summary-photo-vertical">
                <img
                  src={user?.passport_photo ? `${API_BASE_URL}${user.passport_photo}` : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop"}
                  alt="Profile"
                  className="profile-summary-avatar-vertical"
                />
              </div>
              <div className="profile-summary-details-vertical">
                <div className="profile-summary-item-vertical">
                  <label>Name:</label>
                  <span>{user?.first_name} {user?.last_name}</span>
                </div>
                <div className="profile-summary-item-vertical">
                  <label>Email:</label>
                  <span>{user?.email}</span>
                </div>
                <div className="profile-summary-item-vertical">
                  <label>Phone:</label>
                  <span>{user?.phone || 'Not provided'}</span>
                </div>
                <div className="profile-summary-item-vertical">
                  <label>Identity Number:</label>
                  <span>{user?.identity_number || 'Not provided'}</span>
                </div>
                <div className="profile-summary-item-vertical">
                  <label>CRB Status:</label>
                  <span className={`badge badge-${user?.crb_status === 'clear' ? 'success' : user?.crb_status === 'debt_found' ? 'danger' : 'warning'}`}>
                    {user?.crb_status || 'Pending'}
                  </span>
                </div>
              </div>
              <div className="profile-summary-actions-vertical">
                <Link to="/profile" className="btn btn-primary btn-block">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
