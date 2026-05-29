import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw, X } from 'lucide-react';
import { customerAPI, API_BASE_URL } from '../services/api';
import { getErrorMessage } from '../utils/errors';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    identity_number: '',
  });
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [crbDocument, setCrbDocument] = useState(null);
  const [previewPassport, setPreviewPassport] = useState(null);
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        identity_number: user.identity_number || '',
      });
      setPreviewPassport(user.passport_photo || null);
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePassportPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPassportPhoto(file);
      setPreviewPassport(URL.createObjectURL(file));
    }
  };

  const handleCrbDocumentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCrbDocument(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      if (passportPhoto) {
        formDataToSend.append('passport_photo', passportPhoto);
      }
      
      if (crbDocument) {
        formDataToSend.append('crb_document', crbDocument);
      }

      const response = await customerAPI.updateProfile(formDataToSend);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setPassportPhoto(null);
      setCrbDocument(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error, 'Failed to update profile') 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', e.target.name);

    try {
      await customerAPI.uploadDocument(formData);
      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      // Refresh documents list
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error, 'Failed to upload document') 
      });
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="profile-page fade-in">
      <div className="grid grid-2">
        {/* Profile Information */}
        <div className="card">
          <div className="page-header-row">
            <h2>Profile Information</h2>
            <button
              type="button"
              className="btn btn-outline page-refresh-button"
              onClick={handleRefresh}
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              <span>{message.text}</span>
              <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>
                <X size={18} />
              </button>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Profile Photo Section */}
            <div className="form-group">
              <label htmlFor="passport_photo">Profile Photo</label>
              <div className="profile-photo-section">
                {previewPassport && (
                  <div className="profile-photo-preview">
                    <img 
                      src={typeof previewPassport === 'string' ? `${API_BASE_URL}${previewPassport}` : previewPassport} 
                      alt="Profile"
                      className="profile-photo-image"
                    />
                  </div>
                )}
                <input
                  type="file"
                  id="passport_photo"
                  name="passport_photo"
                  onChange={handlePassportPhotoChange}
                  accept="image/*"
                  className="profile-photo-input"
                />
                <small>Upload your profile photo (JPG, PNG)</small>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
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
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
              />
              <small>Email cannot be changed</small>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="identity_number">Identity Number</label>
              <input
                type="text"
                id="identity_number"
                name="identity_number"
                value={formData.identity_number}
                onChange={handleChange}
                placeholder="Enter your national ID number"
              />
              <small>Your national identity number for verification</small>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        {/* Account Details */}
        <div className="card">
          <h2>Account Details</h2>
          <div className="account-details">
            <div className="detail-item">
              <label>Account Status:</label>
              <span className="badge badge-success">Active</span>
            </div>
            <div className="detail-item">
              <label>Member Since:</label>
              <span>{user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>Customer ID:</label>
              <span>#{user?.id || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <label>CRB Status:</label>
              <span className={`badge badge-${user?.crb_status === 'clear' ? 'success' : user?.crb_status === 'debt_found' ? 'danger' : 'warning'}`}>
                {user?.crb_status || 'Pending'}
              </span>
            </div>
          </div>

          <h3 className="mt-4">Security</h3>
          <button className="btn btn-secondary mb-2">Change Password</button>
          <button className="btn btn-outline">Enable Two-Factor Authentication</button>
        </div>
      </div>

      {/* CRB Document Upload */}
      <div className="card">
        <h2>CRB Document</h2>
        <p>Upload your Credit Reference Bureau document for loan eligibility verification</p>
        
        <div className="document-upload-section">
          <div className="form-group">
            <label htmlFor="crb_document">CRB Document (PDF)</label>
            <input
              type="file"
              id="crb_document"
              name="crb_document"
              onChange={handleCrbDocumentChange}
              accept=".pdf"
              className="document-input"
            />
            {user?.crb_document && (
              <div className="document-link">
                <a href={`${API_BASE_URL}${user.crb_document}`} target="_blank" rel="noopener noreferrer">
                  View Current CRB Document
                </a>
              </div>
            )}
            <small>Upload your CRB clearance document (PDF only)</small>
          </div>

          <button 
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading || !crbDocument}
          >
            {loading ? 'Uploading...' : 'Upload CRB Document'}
          </button>
        </div>
      </div>

      {/* Document Upload */}
      <div className="card">
        <h2>Additional Documents</h2>
        <p>Upload required documents for loan applications</p>
        
        <div className="document-upload-section">
          <div className="form-group">
            <label htmlFor="id_document">Government ID</label>
            <input
              type="file"
              id="id_document"
              name="id_document"
              onChange={handleDocumentUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="form-group">
            <label htmlFor="income_proof">Income Proof</label>
            <input
              type="file"
              id="income_proof"
              name="income_proof"
              onChange={handleDocumentUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address_proof">Address Proof</label>
            <input
              type="file"
              id="address_proof"
              name="address_proof"
              onChange={handleDocumentUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
