import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, X } from 'lucide-react';
import { authAPI } from '../services/api';
import { getErrorMessage } from '../utils/errors';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setResetLink('');

    const emailValue = email.trim().toLowerCase();

    if (!emailValue) {
      setError('Email address is required');
      return;
    }

    if (!emailValue.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.requestPasswordReset({ email: emailValue });
      
      setSuccess(true);
      
      // In development, show the reset link
      if (response.data.reset_link) {
        setResetLink(response.data.reset_link);
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send password reset email'));
    } finally {
      setLoading(false);
    }
  };

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
              
              <h2>Forgot Password</h2>
              <p>Enter your email address and we'll send you a link to reset your password.</p>

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
                  <span>Password reset link sent to your email. Check your inbox!</span>
                  <button className="alert-close" onClick={() => setSuccess(false)}>
                    <X size={18} />
                  </button>
                </div>
              )}

              {resetLink && (
                <div className="alert alert-info">
                  <div>
                    <strong>Development Mode:</strong>
                    <p style={{ marginTop: '8px', fontSize: '14px', wordBreak: 'break-all' }}>
                      Reset Link: <a href={resetLink} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>{resetLink}</a>
                    </p>
                  </div>
                  <button className="alert-close" onClick={() => setResetLink('')}>
                    <X size={18} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword;
