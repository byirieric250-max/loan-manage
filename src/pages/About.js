import React from 'react';
import { 
  Target, 
  History, 
  Users, 
  ShieldCheck, 
  Globe, 
  Award 
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <ShieldCheck size={32} />,
      title: "Integrity",
      description: "We uphold the highest standards of integrity in all of our actions."
    },
    {
      icon: <Users size={32} />,
      title: "Customer Focus",
      description: "We provide outstanding products and unsurpassed service that deliver premium value to our customers."
    },
    {
      icon: <Award size={32} />,
      title: "Quality",
      description: "We provide outstanding products and unsurpassed service that, together, deliver premium value to our customers."
    },
    {
      icon: <Globe size={32} />,
      title: "Global Reach",
      description: "We work together, across boundaries, to meet the needs of our customers and to help our Company win."
    }
  ];

  const team = [
    {
      name: "John Doe",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop"
    },
    {
      name: "Jane Smith",
      role: "Chief Financial Officer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
    },
    {
      name: "Michael Chen",
      role: "Head of Lending",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Customer Success",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop"
    }
  ];

  return (
    <div className="about-page fade-in">
      <div className="page-header">
        <h1>About Us</h1>
        <p>Your trusted partner in financial growth and security since 2010.</p>
      </div>

      {/* Our Mission & Vision */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><Target size={32} /></div>
            <h2>Our Mission</h2>
          </div>
          <p>
            Our mission is to provide accessible, fair, and transparent financial solutions that empower individuals 
            and businesses to achieve their dreams. We strive to simplify the lending process through innovative 
            technology and personalized service.
          </p>
        </div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
            <div style={{ color: '#667eea' }}><History size={32} /></div>
            <h2>Our Vision</h2>
          </div>
          <p>
            To be the world's most customer-centric financial institution, enabling every person to have the 
            financial freedom and security they deserve. We envision a future where financial growth is 
            within reach for everyone.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <div className="card mb-4">
        <h2>Our Story</h2>
        <div className="grid grid-2" style={{ gap: '30px', alignItems: 'center' }}>
          <div>
            <p>
              Founded in 2010, Loan Management System started with a simple idea: that getting a loan shouldn't 
              be a complicated or intimidating process. Our founders, veterans in the banking industry, 
              saw the challenges face by everyday people and decided to build a platform that puts the 
              customer first.
            </p>
            <p style={{ marginTop: '15px' }}>
              Over the past decade, we have grown from a small startup to a leading financial institution, 
              serving over 50,000 customers across the country. Our commitment to innovation and customer 
              satisfaction remains at the core of everything we do.
            </p>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" 
              alt="Office" 
              style={{ width: '100%', borderRadius: '12px' }}
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <h2 className="section-title">Our Core Values</h2>
      <div className="grid grid-4 mb-4">
        {values.map((value, index) => (
          <div key={index} className="card text-center">
            <div style={{ color: '#667eea', marginBottom: '15px' }}>{value.icon}</div>
            <h3>{value.title}</h3>
            <p style={{ fontSize: '14px', color: '#7f8c8d' }}>{value.description}</p>
          </div>
        ))}
      </div>

      {/* Our Team */}
      <h2 className="section-title">Meet Our Leadership Team</h2>
      <div className="grid grid-4 mb-4">
        {team.map((member, index) => (
          <div key={index} className="card team-card text-center">
            <img 
              src={member.image} 
              alt={member.name} 
              style={{ width: '120px', height: '120px', borderRadius: '50%', marginBottom: '15px', objectFit: 'cover', border: '4px solid #f0f4f8' }}
            />
            <h3>{member.name}</h3>
            <p style={{ color: '#667eea', fontWeight: '600' }}>{member.role}</p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="card alert alert-info text-center">
        <h2>Have Questions?</h2>
        <p>Our dedicated support team is here to help you with any inquiries you may have.</p>
        <div style={{ marginTop: '20px' }}>
          <button className="btn btn-primary">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default About;
