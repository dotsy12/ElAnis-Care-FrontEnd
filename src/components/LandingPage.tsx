import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Shield, Star, Clock, Users, Award, ChevronRight, CheckCircle, Play } from 'lucide-react';
import CountUp from 'react-countup';
import "../styles/LandingPage.css";

interface LandingPageProps {
  navigate: (page: string) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <div className="logo-icon">
              <Heart className="icon" />
            </div>
            <span className="logo-text">CarePro</span>
          </div>
          <nav className="nav">
            <button onClick={() => navigate('about')} className="nav-button">
              About
              <div className="nav-underline"></div>
            </button>
            <button onClick={() => navigate('faq')} className="nav-button">
              FAQ
              <div className="nav-underline"></div>
            </button>
            <button onClick={() => navigate('contact')} className="nav-button">
              Contact
              <div className="nav-underline"></div>
            </button>
            <div className="auth-buttons">
              <button
                onClick={() => navigate('login')}
                className="login-button"
              >
                Login
              </button>
              <button
                onClick={() => navigate('register')}
                className="register-button"
              >
                Register
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-bg-circle-1"></div>
          <div className="hero-bg-circle-2"></div>
        </div>
        
        <div className="hero-container">
          <div className="hero-content">
            <div className="trust-badge">
              <div className="pulse-dot"></div>
              <span>Trusted by 10,000+ families</span>
            </div>
            
            <h1 className="hero-title">
              Quality Care 
              <span className="gradient-text"> When You Need It</span>
            </h1>
            
            <p className="hero-description">
              Connect with verified, experienced caregivers for elderly care, child care, and home nursing services. Book securely and with confidence.
            </p>

            <div className="hero-buttons">
              <button
                onClick={() => navigate('register')}
                className="primary-button"
              >
                Get Started Today
                <ChevronRight className="button-icon" />
              </button>
              <button
                onClick={() => navigate('about')}
                className="secondary-button"
              >
                <Play className="button-icon" />
                How It Works
              </button>
            </div>

            <div className="hero-stats">
              <div className="avatar-group">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="avatar">
                    {i}
                  </div>
                ))}
              </div>
              <div className="stats-text">
                <div className="stats-title">2,500+ Verified Caregivers</div>
                <div className="rating">
                  <Star className="star-icon" />
                  <span>4.9/5 average rating</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="hero-image-container">
            <div className="hero-image-wrapper">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Doctor and patient in medical setting"
                className="hero-image"
              />
              <div className="image-overlay"></div>
            </div>
            
            {/* Floating Cards */}
            <div className="floating-card verified-card">
              <div className="card-content">
                <div className="card-icon green">
                  <CheckCircle className="icon" />
                </div>
                <div>
                  <div className="card-title">Verified</div>
                  <div className="card-subtitle">Background Checked</div>
                </div>
              </div>
            </div>
            
            <div className="floating-card experience-card">
              <div className="card-content">
                <div className="card-title-large">15+</div>
                <div className="card-subtitle">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Shield className="badge-icon" />
              Why Choose CarePro
            </div>
            <h2 className="section-title">The Most Trusted Care Platform</h2>
            <p className="section-description">We combine technology with human touch to deliver exceptional care experiences</p>
          </div>
          
          <div className="features-grid">
            {[
              {
                icon: Shield,
                title: "Verified Caregivers",
                description: "All caregivers are thoroughly verified with background checks and certification validation",
                color: "blue"
              },
              {
                icon: Clock,
                title: "Easy Booking",
                description: "Simple booking process with flexible scheduling and instant confirmations",
                color: "green"
              },
              {
                icon: Star,
                title: "Quality Rated",
                description: "Share feedback and help others make informed decisions with our rating system",
                color: "orange"
              }
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <feature.icon className="icon" />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Users className="badge-icon" />
              Our Services
            </div>
            <h2 className="section-title">Comprehensive Care Solutions</h2>
            <p className="section-description">Professional care services tailored to your family's needs</p>
          </div>
          
          <div className="services-grid">
            {[
              {
                image: "https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
                title: "Elderly Care",
                description: "Compassionate care for seniors including companionship and daily activities assistance",
                features: ["Medication Management", "Personal Care", "Companionship"]
              },
              {
                image: "https://images.unsplash.com/photo-1584516150909-c43483ee7932?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
                title: "Child Care",
                description: "Experienced nannies providing loving care and educational activities",
                features: ["Educational Activities", "Safe Supervision", "Nutrition Support"]
              },
              {
                image: "https://images.unsplash.com/photo-1584467735871-8db9ac8e5e3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=300&q=80",
                title: "Home Nursing",
                description: "Professional nursing services including wound care and health monitoring",
                features: ["Wound Care", "Medication Admin", "Health Monitoring"]
              }
            ].map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-image-container">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="service-image"
                  />
                  <div className="service-image-overlay"></div>
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <div className="service-features">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="service-feature">
                        <CheckCircle className="feature-check" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Professionals Section */}
      <section className="doctors-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Award className="badge-icon" />
              Our Medical Team
            </div>
            <h2 className="section-title">Qualified Healthcare Professionals</h2>
            <p className="section-description">Meet our team of certified doctors, nurses, and caregivers</p>
          </div>
          
          <div className="doctors-grid">
            {[
              {
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
                name: "Dr. Sarah Johnson",
                role: "Senior Geriatric Specialist",
                experience: "12+ years experience"
              },
              {
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
                name: "Dr. Michael Chen",
                role: "Pediatric Care Expert",
                experience: "8+ years experience"
              },
              {
                image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80",
                name: "Dr. Emily Rodriguez",
                role: "Home Nursing Director",
                experience: "15+ years experience"
              }
            ].map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className="doctor-image-container">
                  <ImageWithFallback
                    src={doctor.image}
                    alt={doctor.name}
                    className="doctor-image"
                  />
                  <div className="verified-badge">
                    <CheckCircle className="badge-icon" />
                  </div>
                </div>
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-role">{doctor.role}</p>
                <p className="doctor-experience">{doctor.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { icon: Users, end: 2500, suffix: "+", label: "Verified Caregivers" },
              { icon: Heart, end: 10000, suffix: "+", label: "Happy Families" },
              { icon: Award, end: 15, suffix: "+", label: "Years Experience" },
              { icon: Star, end: 4.9, suffix: "/5", label: "Average Rating", decimals: 1 }
            ].map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-icon">
                  <stat.icon className="icon" />
                </div>
                <div className="stat-number">
                  <CountUp 
                    end={stat.end} 
                    duration={3} 
                    decimals={stat.decimals || 0}
                    enableScrollSpy 
                  />
                  {stat.suffix}
                </div>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Find Your Perfect Caregiver?</h2>
          <p className="cta-description">Join thousands of families who trust CarePro for their care needs</p>
          <div className="cta-buttons">
            <button
              onClick={() => navigate('register')}
              className="cta-primary-button"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate('contact')}
              className="cta-secondary-button"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-column">
              <div className="footer-logo">
                <div className="logo-icon">
                  <Heart className="icon" />
                </div>
                <span className="logo-text">CarePro</span>
              </div>
              <p className="footer-description">
                Your trusted platform for quality elderly, child, and home care services.
              </p>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-links">
                {['about', 'faq', 'contact'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => navigate(item)}
                      className="footer-link"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Legal</h4>
              <ul className="footer-links">
                {['privacy', 'terms'].map((item) => (
                  <li key={item}>
                    <button 
                      onClick={() => navigate(item)}
                      className="footer-link"
                    >
                      {item === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="footer-column">
              <h4 className="footer-title">Contact Info</h4>
              <ul className="footer-contact">
                <li>support@carepro.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Care Street, City</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2025 CarePro. All rights reserved. Built with ❤️ for better care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}