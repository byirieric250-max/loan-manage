import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, X } from 'lucide-react';
import { loanProductsAPI } from '../services/api';
import { formatUsdAsRwf } from '../utils/currency';
import { getErrorMessage } from '../utils/errors';

const LoanProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const fetchProducts = useCallback(async ({ initialLoad = false } = {}) => {
    if (initialLoad) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const response = await loanProductsAPI.getAll();
      setProducts(response.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching loan products:', error);
      setError(getErrorMessage(error, 'Failed to load loan products'));
      setProducts([]);
    } finally {
      if (initialLoad) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchProducts({ initialLoad: true });
  }, [fetchProducts]);

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true;
    return product.category === filter;
  });

  const getProductImage = (product) => {
    const images = {
      personal: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop',
      business: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
      education: 'https://www.google.com/about/philanthropy/images/education-hero.jpg',
      home: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop',
      auto: 'https://images.unsplash.com/photo-1492144534773-5bcb4c7b6c1c?w=400&h=250&fit=crop',
    };
    if (product?.name === 'Education Support Loan') {
      return images.education;
    }
    return images[product?.category] || images.personal;
  };

  if (loading) {
    return <div className="loading">Loading loan products...</div>;
  }

  return (
    <div className="loan-products-page fade-in">
      <div className="page-header">
        <div className="page-header-row">
          <div>
            <h1>Loan Products</h1>
            <p>Choose the loan that best fits your needs</p>
          </div>
          <button
            type="button"
            className="btn btn-outline page-refresh-button"
            onClick={() => window.location.reload()}
            disabled={refreshing}
          >
            <RefreshCw size={18} className={refreshing ? 'spin' : ''} />
            <span>{refreshing ? 'Refreshing' : 'Refresh'}</span>
          </button>
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

      {/* Filter Section */}
      <div className="card">
        <div className="filter-section">
          <label>Filter by Category:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Loans</option>
            <option value="personal">Personal Loans</option>
            <option value="business">Business Loans</option>
            <option value="education">Education Loans</option>
            <option value="home">Home Loans</option>
            <option value="auto">Auto Loans</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid grid grid-3">
        {filteredProducts.map(product => (
          <div key={product.id} className="card product-card">
            <div className="product-image">
              <Link to={`/apply-loan/${product.id}`}>
                <img 
                  src={getProductImage(product)} 
                  alt={product.name} 
                  className="product-img"
                />
              </Link>
            </div>
            <div className="product-header">
              <Link to={`/apply-loan/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3>{product.name}</h3>
              </Link>
              <span className="badge badge-info">{product.category}</span>
            </div>
            
            <div className="product-details">
              <div className="detail-row">
                <span>Loan Amount:</span>
                <strong>{formatUsdAsRwf(product.min_amount)} - {formatUsdAsRwf(product.max_amount)}</strong>
              </div>
              <div className="detail-row">
                <span>Interest Rate:</span>
                <strong>{product.interest_rate}% APR</strong>
              </div>
              <div className="detail-row">
                <span>Term:</span>
                <strong>{product.min_term} - {product.max_term} months</strong>
              </div>
              <div className="detail-row">
                <span>Processing Fee:</span>
                <strong>{product.processing_fee}%</strong>
              </div>
            </div>

            <div className="product-features">
              <h4>Features:</h4>
              <ul>
                {product.features && product.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
            </div>

            <div className="product-requirements">
              <h4>Requirements:</h4>
              <ul>
                {product.requirements && product.requirements.map((req, index) => (
                  <li key={index}>• {req}</li>
                ))}
              </ul>
            </div>

            <Link 
              to={`/apply-loan/${product.id}`} 
              className="btn btn-primary"
            >
              Apply Now
            </Link>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="card empty-state">
          <p>No loan products found for this category.</p>
        </div>
      )}
    </div>
  );
};

export default LoanProducts;
