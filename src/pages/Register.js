import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Lock, Mail, MapPin, Phone, ShieldCheck, UserPlus, Camera, FileText, Fingerprint, Upload, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    identity_number: '',
    password: '',
    confirm_password: '',
  });
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [crbDocument, setCrbDocument] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      if (name === 'passport_photo') setPassportPhoto(files[0]);
      if (name === 'crb_document') setCrbDocument(files[0]);
    } else {
      setFormData((current) => ({ ...current, [name]: value }));
    }
  };

  const validate = () => {
    const fields = [
      ['first_name', 'First name'],
      ['last_name', 'Last name'],
      ['email', 'Email address'],
      ['phone', 'Phone number'],
      ['address', 'Address'],
      ['identity_number', 'Identity number'],
      ['password', 'Password'],
      ['confirm_password', 'Confirm password'],
    ];

    const missing = fields.find(([field]) => !(formData[field] || '').trim());
    if (missing) {
      return `${missing[1]} is required`;
    }

    if (!passportPhoto) {
      return 'Passport photo is required';
    }

    if (!crbDocument) {
      return 'CRB document is required';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirm_password) {
      return 'Passwords do not match';
    }

    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key !== 'confirm_password') {
          data.append(key, formData[key]);
        }
      });
      data.append('passport_photo', passportPhoto);
      data.append('crb_document', crbDocument);

      const result = await register(data);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-register fade-in">
      <div className="auth-register-shell">
        <aside className="auth-register-panel">
          <div className="auth-register-panel-inner">
            <div className="auth-register-kicker">
              <UserPlus size={18} />
              <span>Create account</span>
            </div>
            <h2>Open your bank account in minutes</h2>
            <p>
              Register once and manage your loan applications, payments, and profile from one place.
            </p>

            <div className="auth-register-points">
              <div className="auth-register-point">
                <CheckCircle2 size={18} />
                <span>Fast account setup</span>
              </div>
              <div className="auth-register-point">
                <ShieldCheck size={18} />
                <span>Secure login flow</span>
              </div>
              <div className="auth-register-point">
                <Lock size={18} />
                <span>Password protected access</span>
              </div>
            </div>

            <div className="auth-register-note">
              Already registered? <Link to="/login">Go to login</Link>
            </div>
          </div>
        </aside>

        <section className="auth-register-form-wrap">
          <div className="card auth-register-card">
            <div className="auth-register-header">
              <h1>Create Your Account</h1>
              <p>Fill in your details to get started.</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
                <button className="alert-close" onClick={() => setError('')}>
                  <X size={18} />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="auth-register-form">
              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="first_name">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="email">
                    <Mail size={16} />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="identity_number">
                    <Fingerprint size={16} />
                    <span>Identity Number</span>
                  </label>
                  <input
                    type="text"
                    id="identity_number"
                    name="identity_number"
                    value={formData.identity_number}
                    onChange={handleChange}
                    placeholder="Enter ID number"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="phone">
                    <Phone size={16} />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">
                    <MapPin size={16} />
                    <span>Address</span>
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="passport_photo">
                    <Camera size={16} />
                    <span>Passport Photo</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="passport_photo"
                      name="passport_photo"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden-file-input"
                    />
                    <label htmlFor="passport_photo" className="file-input-label">
                      <Upload size={14} />
                      <span>{passportPhoto ? passportPhoto.name : 'Upload Photo'}</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="crb_document">
                    <FileText size={16} />
                    <span>CRB Document</span>
                  </label>
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      id="crb_document"
                      name="crb_document"
                      onChange={handleChange}
                      accept=".pdf,.doc,.docx,image/*"
                      className="hidden-file-input"
                    />
                    <label htmlFor="crb_document" className="file-input-label">
                      <Upload size={14} />
                      <span>{crbDocument ? crbDocument.name : 'Upload CRB'}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label htmlFor="password">
                    <Lock size={16} />
                    <span>Password</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                  />
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
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-register-submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Register;
