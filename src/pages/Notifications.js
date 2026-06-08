import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  CheckCircle, 
  XCircle, 
  CircleDollarSign, 
  AlertTriangle, 
  User, 
  FileText, 
  Bell,
  RefreshCw,
  Save
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { notificationsAPI } from '../services/api';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    sms_notifications: true,
    push_notifications: true,
    payment_reminders: true,
  });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await notificationsAPI.getPreferences();
      if (response.data) {
        setPreferences(response.data);
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      // Keep default preferences if fetch fails
    }
  };

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    try {
      await notificationsAPI.savePreferences(preferences);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      setSaveError('Failed to save preferences. Please try again.');
      setTimeout(() => setSaveError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getNotificationIcon = (type) => {
    const iconSize = 24;
    const icons = {
      loan_submitted: <FileEdit size={iconSize} />,
      loan_approved: <CheckCircle size={iconSize} />,
      loan_rejected: <XCircle size={iconSize} />,
      payment_reminder: <CircleDollarSign size={iconSize} />,
      payment_received: <CheckCircle size={iconSize} />,
      overdue_notice: <AlertTriangle size={iconSize} />,
      profile_update: <User size={iconSize} />,
      document_uploaded: <FileText size={iconSize} />,
      system: <Bell size={iconSize} />,
    };
    return icons[type] || <Bell size={iconSize} />;
  };

  const getNotificationColor = (type) => {
    const colors = {
      loan_submitted: 'info',
      loan_approved: 'success',
      loan_rejected: 'danger',
      payment_reminder: 'warning',
      payment_received: 'success',
      overdue_notice: 'danger',
      profile_update: 'info',
      document_uploaded: 'info',
      system: 'info',
    };
    return colors[type] || 'info';
  };

  return (
    <div className="notifications-page fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Notifications</h1>
            <p>Stay updated with your loan activities</p>
          </div>
          <button type="button" className="btn btn-outline page-refresh-button" onClick={() => window.location.reload()}>
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Notification Actions */}
      <div className="card notification-actions">
        <div className="notification-stats">
          <span className="stat">
            <strong>{unreadCount}</strong> unread notifications
          </span>
          <span className="stat">
            <strong>{notifications?.length || 0}</strong> total notifications
          </span>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="btn btn-primary">
            Mark All as Read
          </button>
        )}
      </div>

      {/* Notifications List */}
      {notifications && notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className={`notification-icon ${getNotificationColor(notification.notification_type)}`}>
                {getNotificationIcon(notification.notification_type)}
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className="notification-time">
                  {new Date(notification.created_at).toLocaleString()}
                </div>
              </div>
              {!notification.read && (
                <div className="notification-indicator"></div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card empty-state">
          <p>No notifications yet.</p>
          <p>You'll receive updates about your loans and payments here.</p>
        </div>
      )}

      {/* Notification Settings */}
      <div className="card notification-settings">
        <h2>Notification Preferences</h2>
        <p>Choose how you want to receive notifications</p>
        
        <div className="settings-grid grid grid-2">
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.email_notifications}
                onChange={() => handlePreferenceChange('email_notifications')}
              />
              <span>Email Notifications</span>
            </label>
            <small>Receive notifications via email</small>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.sms_notifications}
                onChange={() => handlePreferenceChange('sms_notifications')}
              />
              <span>SMS Notifications</span>
            </label>
            <small>Receive SMS alerts for important updates</small>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.push_notifications}
                onChange={() => handlePreferenceChange('push_notifications')}
              />
              <span>Push Notifications</span>
            </label>
            <small>Receive in-app notifications</small>
          </div>
          <div className="setting-item">
            <label>
              <input 
                type="checkbox" 
                checked={preferences.payment_reminders}
                onChange={() => handlePreferenceChange('payment_reminders')}
              />
              <span>Payment Reminders</span>
            </label>
            <small>Get reminded before payment due dates</small>
          </div>
        </div>

        {saveSuccess && (
          <div className="alert alert-success mt-4">
            Preferences saved successfully!
          </div>
        )}

        {saveError && (
          <div className="alert alert-error mt-4">
            {saveError}
          </div>
        )}

        <button 
          className="btn btn-primary mt-4" 
          onClick={handleSavePreferences}
          disabled={saving}
        >
          {saving ? (
            <>
              <RefreshCw size={18} className="spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} />
              <span>Save Preferences</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Notifications;
