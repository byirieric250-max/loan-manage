import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Bell 
} from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page fade-in">
      <div className="page-header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: May 20, 2024</p>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><ShieldCheck size={32} /></div>
          <h2>Introduction</h2>
        </div>
        <p>
          At Loan Management System, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you visit our website and use our services. 
          By using our services, you consent to the data practices described in this policy.
        </p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><FileText size={24} /></div>
            <h3>Information We Collect</h3>
          </div>
          <p>We may collect personal information that you voluntarily provide to us when you:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#7f8c8d' }}>
            <li>Register for an account</li>
            <li>Apply for a loan product</li>
            <li>Contact our support team</li>
            <li>Upload required documentation</li>
          </ul>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><Eye size={24} /></div>
            <h3>How We Use Your Info</h3>
          </div>
          <p>We use the information we collect to:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#7f8c8d' }}>
            <li>Process your loan applications</li>
            <li>Verify your identity and eligibility</li>
            <li>Maintain and manage your account</li>
            <li>Send you important notifications</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><Lock size={32} /></div>
          <h2>Data Security</h2>
        </div>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information. 
          Your personal information is contained behind secured networks and is only accessible by a limited 
          number of persons who have special access rights to such systems.
        </p>
        <p style={{ marginTop: '15px' }}>
          All sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology. 
          We regularly scan our website for security holes and known vulnerabilities in order to make your 
          visit to our site as safe as possible.
        </p>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><UserCheck size={32} /></div>
          <h2>Your Rights</h2>
        </div>
        <p>You have certain rights regarding your personal information, including:</p>
        <div className="grid grid-2" style={{ marginTop: '20px' }}>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <strong>Access & Correction</strong>
            <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
              The right to request copies of your personal information and ask that we correct any inaccuracies.
            </p>
          </div>
          <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
            <strong>Data Deletion</strong>
            <p style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '5px' }}>
              The right to request that we delete your personal information under certain conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><Bell size={32} /></div>
          <h2>Changes to This Policy</h2>
        </div>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
          the new Privacy Policy on this page and updating the "Last Updated" date at the top. 
          You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </div>

      <div className="card alert alert-info text-center">
        <h2>Questions?</h2>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary">Contact Legal Team</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
