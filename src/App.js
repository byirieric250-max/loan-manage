import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import LoanProducts from './pages/LoanProducts';
import LoanApplication from './pages/LoanApplication';
import MyLoans from './pages/MyLoans';
import RepaymentSchedule from './pages/RepaymentSchedule';
import Payments from './pages/Payments';
import PaymentProcessing from './pages/PaymentProcessing';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import HelpCenter from './pages/HelpCenter';
import AdminServices from './pages/AdminServices';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const isStaff = Boolean(user?.is_staff || user?.user?.is_staff);
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return isStaff ? children : <Navigate to="/dashboard" />;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return children;
  }

  const isStaff = Boolean(user?.is_staff || user?.user?.is_staff);
  return <Navigate to={isStaff ? '/admin-services' : '/dashboard'} />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/help" element={<HelpCenter />} />
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <Login />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <PublicRoute>
                        <Register />
                      </PublicRoute>
                    } 
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Protected Routes */}
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/loan-products" 
                    element={
                      <ProtectedRoute>
                        <LoanProducts />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/apply-loan/:productId" 
                    element={
                      <ProtectedRoute>
                        <LoanApplication />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/my-loans" 
                    element={
                      <ProtectedRoute>
                        <MyLoans />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/repayment-schedule/:loanId" 
                    element={
                      <ProtectedRoute>
                        <RepaymentSchedule />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payments" 
                    element={
                      <ProtectedRoute>
                        <Payments />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/payment-processing" 
                    element={
                      <ProtectedRoute>
                        <PaymentProcessing />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/notifications" 
                    element={
                      <ProtectedRoute>
                        <Notifications />
                      </ProtectedRoute>
                    } 
                  />
                  <Route
                    path="/admin-services"
                    element={
                      <AdminRoute>
                        <AdminServices />
                      </AdminRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
