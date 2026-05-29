import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { loanProductsAPI, loanApplicationsAPI } from '../services/api';
import { convertRwfToUsd, convertUsdToRwf, formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const LoanApplication = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    amount: '',
    term_months: '',
    purpose: '',
    income: '',
    employment_status: '',
    employer_name: '',
    employment_duration: '',
    collateral_type: '',
    collateral_value: '',
  });

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await loanProductsAPI.getById(productId);
      setProduct(response.data);
      setFormData(prev => ({
        ...prev,
        amount: convertUsdToRwf(response.data.min_amount).toFixed(0),
        term_months: response.data.min_term,
      }));
    } catch (error) {
      console.error('Error fetching product:', error);
      setMessage({ type: 'error', text: getErrorMessage(error, 'Failed to load loan product') });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateMonthlyPayment = () => {
    if (!product || !formData.amount || !formData.term_months) return 0;
    
    const principal = parseFloat(formData.amount);
    const rate = product.interest_rate / 100 / 12;
    const term = parseInt(formData.term_months);
    
    if (rate === 0) {
      return principal / term;
    }
    
    const monthlyPayment = principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1);
    return monthlyPayment.toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const applicationData = {
        ...formData,
        amount: convertRwfToUsd(formData.amount).toFixed(2),
        income: formData.income ? convertRwfToUsd(formData.income).toFixed(2) : formData.income,
        collateral_value: formData.collateral_value ? convertRwfToUsd(formData.collateral_value).toFixed(2) : formData.collateral_value,
        loan_product: productId,
        monthly_payment: convertRwfToUsd(calculateMonthlyPayment()).toFixed(2),
      };

      const response = await loanApplicationsAPI.create(applicationData);
      
      setMessage({ 
        type: 'success', 
        text: response.data.message || 'Application submitted successfully. It is now pending admin CRB review for existing debts and loan eligibility.' 
      });
      
      setTimeout(() => {
        navigate('/my-loans');
      }, 2000);
    } catch (error) {
      console.error('Application submission error:', error);
      setMessage({ 
        type: 'error', 
        text: getErrorMessage(error, 'Failed to submit application')
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading application form...</div>;
  }

  if (!product) {
    return <div className="card">Loan product not found</div>;
  }

  return (
    <div className="loan-application-page fade-in">
      <div className="page-header">
        <h1>Apply for {product.name}</h1>
        <p>Complete the form below to submit your loan application</p>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          <span>{message.text}</span>
          <button className="alert-close" onClick={() => setMessage({ type: '', text: '' })}>
            <X size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-2">
        {/* Application Form */}
        <div className="card">
          <h2>Application Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="amount">Loan Amount (RWF)</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min={convertUsdToRwf(product.min_amount)}
                max={convertUsdToRwf(product.max_amount)}
                required
              />
              <small>Range: {formatUsdAsRwf(product.min_amount)} - {formatUsdAsRwf(product.max_amount)}</small>
            </div>

            <div className="form-group">
              <label htmlFor="term_months">Repayment Period (Months)</label>
              <input
                type="number"
                id="term_months"
                name="term_months"
                value={formData.term_months}
                onChange={handleChange}
                min={product.min_term}
                max={product.max_term}
                required
              />
              <small>Range: {product.min_term} - {product.max_term} months</small>
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Loan Purpose</label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
                placeholder="Describe why you need this loan"
              />
            </div>

            <h3>Employment Information</h3>
            
            <div className="form-group">
              <label htmlFor="employment_status">Employment Status</label>
              <select
                id="employment_status"
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="employed">Employed</option>
                <option value="self-employed">Self-Employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
                <option value="student">Student</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="income">Monthly Income (RWF)</label>
              <input
                type="number"
                id="income"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
                placeholder="Your monthly income"
              />
            </div>

            <div className="form-group">
              <label htmlFor="employer_name">Employer Name</label>
              <input
                type="text"
                id="employer_name"
                name="employer_name"
                value={formData.employer_name}
                onChange={handleChange}
                placeholder="Current employer (if applicable)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="employment_duration">Employment Duration (Months)</label>
              <input
                type="number"
                id="employment_duration"
                name="employment_duration"
                value={formData.employment_duration}
                onChange={handleChange}
                placeholder="How long have you been employed?"
              />
            </div>

            <h3>Collateral Information (Optional)</h3>
            
            <div className="form-group">
              <label htmlFor="collateral_type">Collateral Type</label>
              <select
                id="collateral_type"
                name="collateral_type"
                value={formData.collateral_type}
                onChange={handleChange}
              >
                <option value="">None</option>
                <option value="property">Property</option>
                <option value="vehicle">Vehicle</option>
                <option value="savings">Savings Account</option>
                <option value="investments">Investments</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="collateral_value">Collateral Value (RWF)</label>
              <input
                type="number"
                id="collateral_value"
                name="collateral_value"
                value={formData.collateral_value}
                onChange={handleChange}
                placeholder="Estimated value of collateral"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>

        {/* Loan Summary */}
        <div className="card loan-summary">
          <h2>Loan Summary</h2>
          
          <div className="summary-item">
            <label>Loan Product:</label>
            <strong>{product.name}</strong>
          </div>
          
          <div className="summary-item">
            <label>Interest Rate:</label>
            <strong>{product.interest_rate}% APR</strong>
          </div>
          
          <div className="summary-item">
            <label>Loan Amount:</label>
            <strong>{formatUsdAsRwf(formData.amount)}</strong>
          </div>
          
          <div className="summary-item">
            <label>Repayment Period:</label>
            <strong>{formData.term_months} months</strong>
          </div>
          
          <div className="summary-item highlight">
            <label>Monthly Payment:</label>
            <strong>{formatUsdAsRwf(calculateMonthlyPayment())}</strong>
          </div>
          
          <div className="summary-item">
            <label>Total Repayment:</label>
            <strong>{formatUsdAsRwf(parseFloat(calculateMonthlyPayment()) * parseInt(formData.term_months))}</strong>
          </div>
          
          <div className="summary-item">
            <label>Total Interest:</label>
            <strong>{formatUsdAsRwf((parseFloat(calculateMonthlyPayment()) * parseInt(formData.term_months)) - parseFloat(formData.amount))}</strong>
          </div>

          <div className="summary-fee">
            <label>Processing Fee:</label>
            <strong>{formatUsdAsRwf(parseFloat(formData.amount) * (product.processing_fee / 100))}</strong>
          </div>

          <div className="summary-total">
            <label>Total Amount to Repay:</label>
            <strong>{formatUsdAsRwf((parseFloat(calculateMonthlyPayment()) * parseInt(formData.term_months)) + (parseFloat(formData.amount) * (product.processing_fee / 100)))}</strong>
          </div>

          <div className="terms-notice">
            <p>By submitting this application, you agree to the terms and conditions of this loan product.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplication;
