import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  Search, 
  FileEdit, 
  CheckCircle2, 
  CreditCard,
  ShieldCheck,
  Smartphone,
  Headphones,
  Calendar,
  Layers,
  Zap,
  Home as HomeIcon,
  Car,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const educationSupportImage = 'https://www.google.com/about/philanthropy/images/education-hero.jpg';

  const backgroundImages = [
    'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1920&h=1080&fit=crop',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&h=1080&fit=crop'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change background every 5 seconds

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const heroStyle = {
    backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    transition: 'background-image 1s ease-in-out'
  };

  return (
    <div className="home-page fade-in">
      {/* Hero Section */}
      <section className="hero" style={heroStyle}>
        <div className="hero-overlay">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Welcome to Loan Management System</h1>
              <p>Your trusted digital loan management solution</p>
              <p className="hero-subtitle">
                Apply for loans easily, track repayments, and manage your finances all in one place.
              </p>
              <div className="hero-buttons">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-white">
                      Create Account
                    </Link>
                    <Link to="/login" className="btn btn-outline">
                      Login
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose Loan Management System?</h2>
          <div className="grid grid-4">
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop" 
                alt="Easy Application" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Zap size={40} />
                </div>
                <h3>Easy Application</h3>
                <p>Apply for loans online in minutes with our simple and intuitive application process.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop" 
                alt="Flexible Terms" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Layers size={40} />
                </div>
                <h3>Flexible Terms</h3>
                <p>Choose from various loan products with flexible repayment terms to suit your needs.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" 
                alt="Track Progress" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Calendar size={40} />
                </div>
                <h3>Track Progress</h3>
                <p>Monitor your loan status, repayment schedule, and payment history in real-time.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop" 
                alt="Secure & Private" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <ShieldCheck size={40} />
                </div>
                <h3>Secure & Private</h3>
                <p>Your personal and financial information is protected with bank-level security.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop" 
                alt="Mobile Friendly" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Smartphone size={40} />
                </div>
                <h3>Mobile Friendly</h3>
                <p>Access your account from anywhere with our responsive mobile-friendly design.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src={educationSupportImage}
                alt="Education Support" 
                className="feature-img"
                loading="lazy"
              />
              <div className="feature-content education-support-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <GraduationCap size={40} />
                </div>
                <h3 className="education-support-title">Education Support</h3>
                <p className="education-support-text">Get educational resources and guidance for financial literacy and loan management.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop" 
                alt="24/7 Support" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Headphones size={40} />
                </div>
                <h3>24/7 Support</h3>
                <p>Get help whenever you need it with our round-the-clock customer support.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop" 
                alt="Home Loans" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <HomeIcon size={40} />
                </div>
                <h3>Home Loans</h3>
                <p>Competitive rates for your dream home with easy documentation and quick processing.</p>
              </div>
            </div>
            <div className="card feature-card">
              <img 
                src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop" 
                alt="Auto Loans" 
                className="feature-img"
              />
              <div className="feature-content">
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px', color: '#667eea' }}>
                  <Car size={40} />
                </div>
                <h3>Auto Loans</h3>
                <p>Drive your dream car today with our flexible and affordable vehicle financing options.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number"><UserPlus size={32} /></div>
              <h3>Create</h3>
              <p>Sign up for a free account in just a few minutes.</p>
            </div>
            <div className="step">
              <div className="step-number"><Search size={32} /></div>
              <h3>Choose Loan</h3>
              <p>Browse available loan products and select one that fits your needs.</p>
            </div>
            <div className="step">
              <div className="step-number"><FileEdit size={32} /></div>
              <h3>Apply Online</h3>
              <p>Fill out the application form and upload required documents.</p>
            </div>
            <div className="step">
              <div className="step-number"><CheckCircle2 size={32} /></div>
              <h3>Get Approved</h3>
              <p>Receive quick approval and access your funds.</p>
            </div>
            <div className="step">
              <div className="step-number"><CreditCard size={32} /></div>
              <h3>Repay Easily</h3>
              <p>Follow your repayment schedule and make payments on time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="card cta-card">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers who trust Loan Management System for their financial needs.</p>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Access Your Dashboard
              </Link>
            ) : (
              <Link to="/register" className="btn btn-white">
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
