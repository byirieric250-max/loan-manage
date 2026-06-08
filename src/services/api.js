import axios from 'axios';

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Global handling for 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login/', credentials),
  register: (userData) => {
    if (userData instanceof FormData) {
      return api.post('/api/auth/register/', userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/api/auth/register/', userData);
  },
  logout: () => api.post('/api/auth/logout/'),
  getCurrentUser: () => api.get('/api/auth/me/'),
  requestPasswordReset: (email) => api.post('/api/auth/password-reset/request/', email),
  confirmPasswordReset: (data) => api.post('/api/auth/password-reset/confirm/', data),
};

// Customer API
export const customerAPI = {
  getProfile: () => api.get('/api/customers/profile/'),
  updateProfile: (data) => {
    if (data instanceof FormData) {
      return api.put('/api/customers/update/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.put('/api/customers/update/', data);
  },
  uploadDocument: (formData) => api.post('/api/customers/upload-document/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Loan Products API
export const loanProductsAPI = {
  getAll: () => api.get('/api/loan-products/'),
  getById: (id) => api.get(`/api/loan-products/${id}/`),
};

// Loan Applications API
export const loanApplicationsAPI = {
  getAll: () => api.get('/api/loan-applications/'),
  getById: (id) => api.get(`/api/loan-applications/${id}/`),
  create: (data) => api.post('/api/loan-applications/create/', data),
  update: (id, data) => api.put(`/api/loan-applications/${id}/update/`, data),
  cancel: (id) => api.post(`/api/loan-applications/${id}/cancel/`),
};

// Admin Services API
export const adminServicesAPI = {
  getLoanApplications: (status) => api.get('/api/admin/loan-applications/', {
    params: status && status !== 'all' ? { status } : {},
  }),
  markCrbClear: (id, data = {}) => api.post(`/api/admin/loan-applications/${id}/crb-clear/`, data),
  approveLoan: (id) => api.post(`/api/admin/loan-applications/${id}/approve/`),
  rejectLoan: (id, data = {}) => api.post(`/api/admin/loan-applications/${id}/reject/`, data),
  activateLoan: (id) => api.post(`/api/admin/loan-applications/${id}/activate/`),
  confirmLoanCompletion: (id, data = {}) => api.post(`/api/admin/loan-applications/${id}/confirm-completion/`, data),
  activateAllServices: () => api.post('/api/admin/services/activate-all/'),
  getPayments: (params) => api.get('/api/admin/payments/', { params }),
  markPaymentPaid: (id) => api.post(`/api/admin/payments/${id}/paid/`),
  markPaymentOverdue: (id) => api.post(`/api/admin/payments/${id}/overdue/`),
  markPaymentFailed: (id) => api.post(`/api/admin/payments/${id}/failed/`),
};

// Repayment API
export const repaymentAPI = {
  getSchedule: (loanId) => api.get(`/api/repayments/schedule/${loanId}/`),
  getPayments: (loanId) => api.get(`/api/repayments/payments/${loanId}/`),
  getAllPayments: (params) => api.get('/api/repayments/payments/', { params }),
  makePayment: (data) => api.post('/api/repayments/pay/', data),
  getUpcomingPayments: () => api.get('/api/repayments/upcoming/'),
  getOverduePayments: () => api.get('/api/repayments/overdue/'),
};

// Notifications API
export const notificationsAPI = {
  getAll: () => api.get('/api/notifications/'),
  markAsRead: (id) => api.post(`/api/notifications/${id}/read/`),
  markAllAsRead: () => api.post('/api/notifications/read-all/'),
  savePreferences: (data) => api.put('/api/notifications/preferences/save/', data),
  getPreferences: () => api.get('/api/notifications/preferences/'),
};

export default api;
