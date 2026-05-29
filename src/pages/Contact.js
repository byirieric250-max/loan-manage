import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Globe,
  Camera
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="contact-page fade-in">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We're here to help. Reach out to us with any questions or feedback.</p>
      </div>

      <div className="grid grid-2 mb-4">
        {/* Contact Form */}
        <div className="card">
          <h2>Send us a Message</h2>
          {submitted ? (
            <div className="alert alert-success">
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. We will get back to you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
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
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Send size={18} /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="contact-info-container">
          <div className="card mb-3">
            <h2>Contact Information</h2>
            <div className="contact-details" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ color: '#667eea' }}><MapPin size={24} /></div>
                <div>
                  <h4 style={{ margin: 0 }}>Our Office</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>123 Finance Street, New York, NY 10001</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ color: '#667eea' }}><Phone size={24} /></div>
                <div>
                  <h4 style={{ margin: 0 }}>Phone Number</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>+1 (555) 123-4567</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ color: '#667eea' }}><Mail size={24} /></div>
                <div>
                  <h4 style={{ margin: 0 }}>Email Address</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>support@loanhub.com</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ color: '#667eea' }}><Clock size={24} /></div>
                <div>
                  <h4 style={{ margin: 0 }}>Business Hours</h4>
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Sat: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2>Follow Us</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>Stay connected with us on social media for the latest updates and news.</p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#3b5998' }}><MessageCircle size={28} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#1da1f2' }}><Send size={28} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0077b5' }}><Globe size={28} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#e1306c' }}><Camera size={28} /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="card mb-4" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ height: '300px', width: '100%', background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7f8c8d' }}>
          <div className="text-center">
            <MapPin size={48} style={{ marginBottom: '10px' }} />
            <p>Interactive Map Integration</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
