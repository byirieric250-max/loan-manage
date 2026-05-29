import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeId, setActiveId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: "How do I apply for a loan?",
      answer: "Applying is simple! Just create an account, browse our loan products, choose the one that fits your needs, and click 'Apply Now'. You'll need to fill out a short form and upload required documents."
    },
    {
      id: 2,
      question: "What documents do I need to provide?",
      answer: "Typically, you'll need a valid government-issued ID, proof of income (pay stubs or bank statements), and proof of address. Specific requirements may vary depending on the loan product."
    },
    {
      id: 3,
      question: "How long does the approval process take?",
      answer: "Most applications are reviewed within 24-48 business hours. Once approved, funds are usually disbursed to your account within one business day."
    },
    {
      id: 4,
      question: "Can I repay my loan early?",
      answer: "Yes! You can repay your loan in full at any time without any prepayment penalties. In fact, early repayment can help you save on interest costs."
    },
    {
      id: 5,
      question: "What happens if I miss a payment?",
      answer: "If you think you'll miss a payment, please contact us immediately. Late payments may incur fees and can negatively impact your credit score. We're often able to work out a temporary arrangement if you reach out in advance."
    },
    {
      id: 6,
      question: "Is my personal information secure?",
      answer: "Absolutely. We use bank-level encryption and security protocols to ensure your data is always protected. For more details, please review our Privacy Policy."
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <div className="faq-page fade-in">
      <div className="page-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find quick answers to your questions about our loan services.</p>
      </div>

      <div className="card mb-4">
        <div className="search-bar" style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#95a5a6' }} size={20} />
          <input 
            type="text" 
            placeholder="Search for answers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '45px', width: '100%', borderRadius: '50px' }}
          />
        </div>
      </div>

      <div className="faq-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map(faq => (
            <div key={faq.id} className="card mb-2" style={{ padding: 0, cursor: 'pointer' }} onClick={() => toggleAccordion(faq.id)}>
              <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <HelpCircle size={20} color="#667eea" />
                  {faq.question}
                </h3>
                {activeId === faq.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
              {activeId === faq.id && (
                <div style={{ padding: '0 20px 20px 50px', borderTop: '1px solid #ecf0f1', color: '#7f8c8d' }}>
                  <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card text-center">
            <p>No results found for "{searchTerm}". Please try a different search term.</p>
          </div>
        )}
      </div>

      <div className="card alert alert-success text-center mt-4">
        <h2>Still have questions?</h2>
        <p>Our support team is ready to help you with anything else you need.</p>
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary">Visit Help Center</button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
