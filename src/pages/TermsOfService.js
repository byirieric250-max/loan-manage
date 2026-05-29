import React from 'react';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Scale, 
  ShieldAlert 
} from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="terms-of-service-page fade-in">
      <div className="page-header">
        <h1>Terms of Service</h1>
        <p>Please read these terms carefully before using our services.</p>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><Scale size={32} /></div>
          <h2>Agreement to Terms</h2>
        </div>
        <p>
          By accessing or using our website and services, you agree to be bound by these Terms of Service. 
          If you do not agree to all of these terms, do not use our services. We reserve the right to 
          modify these terms at any time, and such modifications shall be effective immediately upon posting.
        </p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><CheckCircle size={24} /></div>
            <h3>Eligibility</h3>
          </div>
          <p>To use our services, you must:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#7f8c8d' }}>
            <li>Be at least 18 years of age</li>
            <li>Be a legal resident of the country</li>
            <li>Provide accurate and complete information</li>
            <li>Maintain the security of your account</li>
          </ul>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><ShieldAlert size={24} /></div>
            <h3>Prohibited Activities</h3>
          </div>
          <p>You agree not to:</p>
          <ul style={{ paddingLeft: '20px', marginTop: '10px', color: '#7f8c8d' }}>
            <li>Use the service for illegal purposes</li>
            <li>Provide false financial information</li>
            <li>Interfere with site security features</li>
            <li>Attempt to defraud the institution</li>
          </ul>
        </div>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#667eea' }}><FileText size={32} /></div>
          <h2>Loan Applications & Approval</h2>
        </div>
        <p>
          Submission of a loan application does not guarantee approval. All applications are subject 
          to our credit assessment and verification process. We reserve the right to reject any 
          application at our sole discretion without providing a reason.
        </p>
        <p style={{ marginTop: '15px' }}>
          Approved loans are subject to specific loan agreements which will be provided to you 
          upon approval. The terms of those specific agreements will take precedence over these 
          general Terms of Service.
        </p>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
          <div style={{ color: '#e74c3c' }}><AlertTriangle size={32} /></div>
          <h2>Late Payments & Default</h2>
        </div>
        <p>
          Failure to make payments according to your repayment schedule may result in late fees, 
          increased interest rates, and a negative impact on your credit score. In the event of 
          a default, we may take legal action to recover the outstanding balance.
        </p>
      </div>

      <div className="card mb-4 text-center">
        <h2>Questions about these Terms?</h2>
        <p>Contact our legal department if you have any inquiries regarding these terms.</p>
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary">Contact Legal</button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
