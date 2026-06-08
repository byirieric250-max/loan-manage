import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  CreditCard, 
  Smartphone, 
  Mail, 
  CheckCircle, 
  X, 
  Loader,
  Copy,
  Lock
} from 'lucide-react';
import { repaymentAPI, loanApplicationsAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const PaymentProcessing = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [loanId, setLoanId] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loan, setLoan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);
  
  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [mobileProvider, setMobileProvider] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [transferConfirmed, setTransferConfirmed] = useState(false);

  useEffect(() => {
    const loanParam = searchParams.get('loan');
    const amountParam = searchParams.get('amount');
    const methodParam = searchParams.get('method');

    if (!loanParam || !amountParam || !methodParam) {
      setError('Missing required payment information');
      setLoading(false);
      return;
    }

    setLoanId(loanParam);
    setAmount(amountParam);
    setPaymentMethod(methodParam);

    fetchLoanDetails(loanParam);
  }, [searchParams]);

  const fetchLoanDetails = async (id) => {
    try {
      const response = await loanApplicationsAPI.getById(id);
      setLoan(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load loan details'));
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setProcessing(true);
    setError('');

    try {
      await repaymentAPI.makePayment({
        loan: loanId,
        amount: amount,
        payment_method: paymentMethod,
        notes: getPaymentNotes(),
      });
      setSuccess(true);
      
      // Redirect to payments page after 3 seconds with payment completed flag
      setTimeout(() => {
        navigate('/payments?payment=completed');
      }, 3000);
    } catch (err) {
      setError(getErrorMessage(err, 'Payment failed'));
      setProcessing(false);
    }
  };

  const getPaymentNotes = () => {
    switch (paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        return `Card ending in ${cardNumber.slice(-4)}`;
      case 'mobile_money':
        return `${mobileProvider.toUpperCase()} - ${phoneNumber}`;
      case 'check':
        return `Check #${checkNumber}`;
      case 'bank_transfer':
        return 'Bank transfer confirmed by user';
      default:
        return '';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateCardForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      setError('Please enter a valid card number');
      return false;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    if (!cardCvv || cardCvv.length < 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    if (!cardName) {
      setError('Please enter the cardholder name');
      return false;
    }
    return true;
  };

  const validateMobileMoneyForm = () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return false;
    }
    return true;
  };

  const validateCheckForm = () => {
    if (!checkNumber) {
      setError('Please enter the check number');
      return false;
    }
    return true;
  };

  const validateBankTransferForm = () => {
    if (!transferConfirmed) {
      setError('Please confirm that you have initiated the bank transfer');
      return false;
    }
    return true;
  };

  const handleProceed = () => {
    setError('');
    let isValid = true;

    switch (paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        isValid = validateCardForm();
        break;
      case 'mobile_money':
        isValid = validateMobileMoneyForm();
        break;
      case 'check':
        isValid = validateCheckForm();
        break;
      case 'bank_transfer':
        isValid = validateBankTransferForm();
        break;
      default:
        break;
    }

    if (isValid) {
      setStep(2);
    }
  };

  const getPaymentMethodInfo = () => {
    switch (paymentMethod) {
      case 'bank_transfer':
        return {
          icon: <Building2 size={48} color="#667eea" />,
          title: 'Bank Transfer',
          description: 'Transfer funds directly to our bank account',
          details: [
            { label: 'Bank Name', value: 'Bank of Kigali' },
            { label: 'Account Name', value: 'Loan Management System' },
            { label: 'Account Number', value: '1234567890' },
            { label: 'Reference', value: `Loan #${loanId}` },
          ]
        };
      case 'credit_card':
        return {
          icon: <CreditCard size={48} color="#667eea" />,
          title: 'Credit Card',
          description: 'Pay securely with your credit card',
          details: [
            { label: 'Card Type', value: 'Visa, Mastercard, Amex' },
            { label: 'Processing Time', value: 'Instant' },
            { label: 'Security', value: '256-bit SSL Encryption' },
          ]
        };
      case 'debit_card':
        return {
          icon: <CreditCard size={48} color="#667eea" />,
          title: 'Debit Card',
          description: 'Pay directly from your bank account',
          details: [
            { label: 'Card Type', value: 'Visa Debit, Mastercard Debit' },
            { label: 'Processing Time', value: 'Instant' },
            { label: 'Security', value: '256-bit SSL Encryption' },
          ]
        };
      case 'mobile_money':
        return {
          icon: <Smartphone size={48} color="#667eea" />,
          title: 'Mobile Money',
          description: 'Pay using MTN Mobile Money or Airtel Money',
          details: [
            { label: 'MTN Mobile Money', value: '*182*1*1*1234567890#' },
            { label: 'Airtel Money', value: '*182*2*1234567890#' },
            { label: 'Reference', value: `Loan #${loanId}` },
          ]
        };
      case 'check':
        return {
          icon: <Mail size={48} color="#667eea" />,
          title: 'Check Payment',
          description: 'Pay by check (processing time: 3-5 business days)',
          details: [
            { label: 'Payable To', value: 'Loan Management System' },
            { label: 'Processing Time', value: '3-5 business days' },
            { label: 'Reference', value: `Loan #${loanId}` },
          ]
        };
      default:
        return {
          icon: <Building2 size={48} color="#667eea" />,
          title: 'Payment',
          description: 'Complete your payment',
          details: []
        };
    }
  };

  if (loading) {
    return (
      <div className="payment-processing-page fade-in">
        <div className="loading-container">
          <Loader size={48} className="spin" />
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error && !loan) {
    return (
      <div className="payment-processing-page fade-in">
        <div className="card payment-card">
          <div className="payment-header">
            <button className="back-button" onClick={() => navigate('/payments')}>
              <ArrowLeft size={18} />
              <span>Back to Payments</span>
            </button>
          </div>
          <div className="error-state">
            <X size={48} color="#e74c3c" />
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const paymentInfo = getPaymentMethodInfo();

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case 'credit_card':
      case 'debit_card':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label htmlFor="cardNumber">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cardExpiry">Expiry Date</label>
                <input
                  type="text"
                  id="cardExpiry"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardCvv">CVV</label>
                <input
                  type="password"
                  id="cardCvv"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="cardName">Cardholder Name</label>
              <input
                type="text"
                id="cardName"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="security-note">
              <Lock size={16} />
              <span>Your card information is secure and encrypted</span>
            </div>
          </div>
        );
      case 'mobile_money':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label htmlFor="mobileProvider">Mobile Money Provider</label>
              <select
                id="mobileProvider"
                value={mobileProvider}
                onChange={(e) => setMobileProvider(e.target.value)}
                required
              >
                <option value="mtn">MTN Mobile Money</option>
                <option value="airtel">Airtel Money</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="250788123456"
                maxLength={12}
                required
              />
              <small>Enter your mobile money phone number</small>
            </div>
            <div className="payment-instructions">
              <p><strong>Instructions:</strong></p>
              <ul>
                <li>Dial {mobileProvider === 'mtn' ? '*182*1*1#' : '*182*2#'}</li>
                <li>Enter the amount: {formatUsdAsRwf(amount)}</li>
                <li>Enter your PIN to confirm</li>
                <li>Use reference: Loan #{loanId}</li>
              </ul>
            </div>
          </div>
        );
      case 'check':
        return (
          <div className="payment-form">
            <div className="form-group">
              <label htmlFor="checkNumber">Check Number</label>
              <input
                type="text"
                id="checkNumber"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                placeholder="Enter check number"
                required
              />
            </div>
            <div className="payment-instructions">
              <p><strong>Instructions:</strong></p>
              <ul>
                <li>Make check payable to: Loan Management System</li>
                <li>Write the amount: {formatUsdAsRwf(amount)}</li>
                <li>Include reference: Loan #{loanId}</li>
                <li>Processing time: 3-5 business days</li>
              </ul>
            </div>
          </div>
        );
      case 'bank_transfer':
        return (
          <div className="payment-form">
            {paymentInfo.details.length > 0 && (
              <div className="payment-details">
                {paymentInfo.details.map((detail, index) => (
                  <div key={index} className="detail-item">
                    <span className="detail-label">{detail.label}:</span>
                    <div className="detail-value-container">
                      <span className="detail-value">{detail.value}</span>
                      {detail.label === 'Account Number' ? (
                        <button 
                          className="copy-button" 
                          onClick={() => copyToClipboard(detail.value)}
                          title="Copy to clipboard"
                        >
                          <Copy size={16} />
                          {copied && <span className="copied-text">Copied!</span>}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="transferConfirmed"
                  checked={transferConfirmed}
                  onChange={(e) => setTransferConfirmed(e.target.checked)}
                  required
                  style={{ width: '20px', height: '20px', marginRight: '10px', cursor: 'pointer' }}
                />
                <span style={{ cursor: 'pointer' }}>I confirm that I have initiated the bank transfer to the account above</span>
              </label>
            </div>
            <div className="payment-instructions">
              <p><strong>Instructions:</strong></p>
              <ul>
                <li>Transfer {formatUsdAsRwf(amount)} to the account above</li>
                <li>Use reference: Loan #{loanId}</li>
                <li>Processing time: 1-2 business days</li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="payment-processing-page fade-in">
      <div className="card payment-card">
        <div className="payment-header">
          <button className="back-button" onClick={() => navigate('/payments')}>
            <ArrowLeft size={18} />
            <span>Back to Payments</span>
          </button>
        </div>

        {success ? (
          <div className="success-state">
            <CheckCircle size={64} color="#27ae60" />
            <h2>Payment Successful!</h2>
            <p>Your payment of {formatUsdAsRwf(amount)} has been processed successfully.</p>
            <p>Redirecting to payments page...</p>
          </div>
        ) : (
          <>
            <div className="payment-summary">
              <h2>Payment Summary</h2>
              <div className="summary-details">
                <div className="summary-item">
                  <span className="label">Loan:</span>
                  <span className="value">#{loanId}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Amount:</span>
                  <span className="value">{formatUsdAsRwf(amount)}</span>
                </div>
                <div className="summary-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">{paymentInfo.title}</span>
                </div>
              </div>
            </div>

            <div className="payment-method-info">
              <div className="method-icon">{paymentInfo.icon}</div>
              <h2>{paymentInfo.title}</h2>
              <p>{paymentInfo.description}</p>
            </div>

            {step === 1 ? (
              <>
                {renderPaymentForm()}

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                    <button className="alert-close" onClick={() => setError('')}>
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div className="payment-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handleProceed}
                  >
                    Proceed to Confirmation
                  </button>
                  
                  <button 
                    className="btn btn-outline" 
                    onClick={() => navigate('/payments')}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="payment-confirmation">
                  <h3>Confirm Payment</h3>
                  <p>Please review your payment details before confirming:</p>
                  
                  <div className="confirmation-details">
                    <div className="confirmation-item">
                      <span className="label">Loan ID:</span>
                      <span className="value">#{loanId}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="label">Amount:</span>
                      <span className="value">{formatUsdAsRwf(amount)}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="label">Payment Method:</span>
                      <span className="value">{paymentInfo.title}</span>
                    </div>
                    {paymentMethod === 'credit_card' || paymentMethod === 'debit_card' ? (
                      <div className="confirmation-item">
                        <span className="label">Card:</span>
                        <span className="value">**** **** **** {cardNumber.slice(-4)}</span>
                      </div>
                    ) : null}
                    {paymentMethod === 'mobile_money' ? (
                      <div className="confirmation-item">
                        <span className="label">Phone:</span>
                        <span className="value">{phoneNumber}</span>
                      </div>
                    ) : null}
                    {paymentMethod === 'check' ? (
                      <div className="confirmation-item">
                        <span className="label">Check #:</span>
                        <span className="value">{checkNumber}</span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                    <button className="alert-close" onClick={() => setError('')}>
                      <X size={18} />
                    </button>
                  </div>
                )}

                <div className="payment-actions">
                  <button 
                    className="btn btn-primary" 
                    onClick={handlePayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <Loader size={18} className="spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      `Confirm Payment of ${formatUsdAsRwf(amount)}`
                    )}
                  </button>
                  
                  <button 
                    className="btn btn-outline" 
                    onClick={() => setStep(1)}
                    disabled={processing}
                  >
                    Back
                  </button>
                </div>
              </>
            )}

            <div className="payment-note">
              <p><strong>Note:</strong> After confirming your payment, please allow a few moments for processing. You will be redirected to the payments page automatically.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;
