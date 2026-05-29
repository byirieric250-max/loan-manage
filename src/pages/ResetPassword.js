import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Lock, ShieldCheck, X } from 'lucide-react';
import { authAPI } from '../services/api';
import { getErrorMessage } from '../utils/errors';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=1920&h=1080&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const authPageStyle = {
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out'
  };

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setError('Invalid reset link. Please request a new password reset.');
      setTokenValid(false);
    } else {
      setToken(tokenParam);
      setTokenValid(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await authAPI.confirmPasswordReset({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to reset password'));
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="auth-page fade-in" style={authPageStyle}>
        <div className="auth-container">
          <div className="auth-content">
            <div className="auth-overlay">
              <div className="card auth-card">
                <div className="auth-header">
                  <Link to="/forgot-password" className="auth-back-link">
                    <ArrowLeft size={18} />
                    <span>Back to Forgot Password</span>
                  </Link>
                </div>
                
                <h2>Invalid Reset Link</h2>
                <p>The password reset link is invalid or has expired.</p>
                
                <Link to="/forgot-password" className="btn btn-primary">
                  Request New Reset Link
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page fade-in" style={authPageStyle}>
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-overlay">
            <div className="card auth-card">
              <div className="auth-header">
                <Link to="/login" className="auth-back-link">
                  <ArrowLeft size={18} />
                  <span>Back to Login</span>
                </Link>
              </div>
              
              <h2>Reset Password</h2>
              <p>Enter your new password below.</p>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                  <button className="alert-close" onClick={() => setError('')}>
                    <X size={18} />
                  </button>
                </div>
              )}

              {success && (
                <div className="alert alert-success">
                  <span>Password reset successful! Redirecting to login...</span>
                  <button className="alert-close" onClick={() => setSuccess(false)}>
                    <X size={18} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="new_password">
                    <Lock size={16} />
                    <span>New Password</span>
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    name="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <small>Must be at least 6 characters long</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password">
                    <ShieldCheck size={16} />
                    <span>Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    minLength={6}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading || success}
                >
                  {loading ? 'Resetting...' : success ? 'Success!' : 'Reset Password'}
                </button>
              </form>

              <div className="auth-footer">
                <p>Remember your password? <Link to="/login">Login here</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
