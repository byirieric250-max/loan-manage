import React from 'react';
import { 
  FileEdit, 
  CheckCircle, 
  XCircle, 
  CircleDollarSign, 
  AlertTriangle, 
  User, 
  FileText, 
  Bell,
  RefreshCw
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const Notifications = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

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
              <input type="checkbox" defaultChecked />
              <span>Email Notifications</span>
            </label>
            <small>Receive notifications via email</small>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              <span>SMS Notifications</span>
            </label>
            <small>Receive SMS alerts for important updates</small>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Push Notifications</span>
            </label>
            <small>Receive in-app notifications</small>
          </div>
          <div className="setting-item">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Payment Reminders</span>
            </label>
            <small>Get reminded before payment due dates</small>
          </div>
        </div>

        <button className="btn btn-primary mt-4">Save Preferences</button>
      </div>
    </div>
  );
};

export default Notifications;
