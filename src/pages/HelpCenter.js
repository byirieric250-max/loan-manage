import React from 'react';
import { 
  LifeBuoy, 
  BookOpen, 
  MessageSquare, 
  PhoneCall, 
  Settings, 
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';

const HelpCenter = () => {
  const categories = [
    {
      icon: <Zap size={32} />,
      title: "Getting Started",
      links: ["Creating an Account", "How to Apply", "Identity Verification", "Eligibility Criteria"]
    },
    {
      icon: <ShieldCheck size={32} />,
      title: "Security & Privacy",
      links: ["Account Security", "Privacy Policy", "Data Protection", "Secure Payments"]
    },
    {
      icon: <FileText size={32} />,
      title: "Loans & Applications",
      links: ["Application Status", "Required Documents", "Loan Interest Rates", "Approval Process"]
    },
    {
      icon: <Settings size={32} />,
      title: "Account Management",
      links: ["Update Profile", "Password Reset", "Notification Settings", "Close Account"]
    }
  ];

  return (
    <div className="help-center-page fade-in">
      <div className="page-header">
        <h1>Help Center</h1>
        <p>Welcome to our support portal. How can we assist you today?</p>
      </div>

      {/* Hero Search Section */}
      <div className="card mb-4 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '40px' }}>
        <h2 style={{ color: 'white', border: 'none' }}>We're here for you</h2>
        <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: '30px' }}>Search our help database for tutorials, guides, and more.</p>
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Describe your issue..." 
            style={{ width: '100%', padding: '15px 25px', borderRadius: '50px', border: 'none', fontSize: '16px' }}
          />
        </div>
      </div>

      {/* Help Categories */}
      <div className="grid grid-2 mb-4">
        {categories.map((cat, index) => (
          <div key={index} className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
              <div style={{ color: '#667eea' }}>{cat.icon}</div>
              <h3 style={{ margin: 0 }}>{cat.title}</h3>
            </div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {cat.links.map((link, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <span style={{ cursor: 'pointer', color: '#667eea', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={16} /> {link}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <h2 className="section-title">Other ways to get help</h2>
      <div className="grid grid-3 mb-4">
        <div className="card text-center">
          <div style={{ color: '#667eea', marginBottom: '15px' }}><MessageSquare size={40} /></div>
          <h3>Live Chat</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Average response time: 2 mins</p>
          <button className="btn btn-primary mt-3">Start Chat</button>
        </div>
        <div className="card text-center">
          <div style={{ color: '#667eea', marginBottom: '15px' }}><PhoneCall size={40} /></div>
          <h3>Phone Support</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Available Mon-Fri, 9am - 6pm</p>
          <button className="btn btn-primary mt-3">Call Us</button>
        </div>
        <div className="card text-center">
          <div style={{ color: '#667eea', marginBottom: '15px' }}><LifeBuoy size={40} /></div>
          <h3>Community Forum</h3>
          <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Get help from other users</p>
          <button className="btn btn-primary mt-3">Visit Forum</button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
