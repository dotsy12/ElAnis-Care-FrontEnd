import { Heart, ArrowLeft, Users, Award, Shield, Target, Star, Clock, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CountUp from 'react-countup';
import '../styles/AboutPage.css';

interface AboutPageProps {
  navigate: (page: string) => void;
}

export function AboutPage({ navigate }: AboutPageProps) {
  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="about-header-container">
          <button
            onClick={() => navigate('landing')}
            className="back-button"
          >
            <ArrowLeft className="button-icon" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="about-hero">
        <div className="hero-background">
          <div className="hero-bg-circle-1"></div>
          <div className="hero-bg-circle-2"></div>
        </div>
        <div className="about-hero-container">
          <div className="about-hero-content">
            <div className="trust-badge">
              <div className="pulse-dot"></div>
              <span>Trusted by 10,000+ families</span>
            </div>
            <div className="about-hero-icon">
              <Heart className="icon" />
            </div>
            <h1 className="about-hero-title">About <span className="gradient-text">ElAnis Care</span></h1>
            <p className="about-hero-description">
              We're on a mission to connect families with trusted, qualified caregivers who provide compassionate,
              professional care services for elderly, children, and home healthcare needs.
            </p>
            
            <div className="hero-features">
              <div className="feature-item">
                <CheckCircle className="feature-check" />
                <span>Verified Caregivers</span>
              </div>
              <div className="feature-item">
                <CheckCircle className="feature-check" />
                <span>24/7 Support</span>
              </div>
              <div className="feature-item">
                <CheckCircle className="feature-check" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-mission">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <div className="section-badge">
                <Target className="badge-icon" />
                Our Mission
              </div>
              <h2 className="mission-title">Transforming Care Through Technology and Compassion</h2>
              <p className="mission-description">
                At ElAnis Care, we believe everyone deserves access to quality, compassionate care. Our platform
                bridges the gap between families seeking trusted caregivers and experienced professionals
                dedicated to making a difference.
              </p>
              <p className="mission-description">
                We're committed to maintaining the highest standards of safety, reliability, and excellence
                in all our care services, ensuring peace of mind for families and rewarding careers for caregivers.
              </p>

              <div className="mission-stats">
                <div className="mission-stat">
                  <div className="stat-number">
                    <CountUp end={15} duration={3} enableScrollSpy />+
                  </div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="mission-stat">
                  <div className="stat-number">
                    <CountUp end={50} duration={3} enableScrollSpy />+
                  </div>
                  <div className="stat-label">Cities Covered</div>
                </div>
              </div>
            </div>
            <div className="mission-image-container">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Healthcare team"
                className="mission-image"
              />
              <div className="image-floating-card">
                <div className="floating-card-content">
                  <Award className="card-icon" />
                  <div>
                    <div className="card-title">Award Winning</div>
                    <div className="card-subtitle">Best Care Platform 2024</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="values-section">
            <div className="section-header">
              <div className="section-badge">
                <Shield className="badge-icon" />
                Our Values
              </div>
              <h2 className="section-title">What Drives Us Every Day</h2>
              <p className="section-description">Our core values shape everything we do at ElAnis Care</p>
            </div>

            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon safety">
                  <Shield className="icon" />
                </div>
                <h3 className="value-title">Safety First</h3>
                <p className="value-description">
                  All caregivers undergo thorough background checks, certification verification, and continuous monitoring.
                </p>
                <ul className="value-features">
                  <li>Background Checks</li>
                  <li>Certification Validation</li>
                  <li>Ongoing Monitoring</li>
                </ul>
              </div>

              <div className="value-card">
                <div className="value-icon excellence">
                  <Award className="icon" />
                </div>
                <h3 className="value-title">Excellence</h3>
                <p className="value-description">
                  We maintain high standards through continuous training, quality assurance, and performance monitoring.
                </p>
                <ul className="value-features">
                  <li>Continuous Training</li>
                  <li>Quality Assurance</li>
                  <li>Performance Reviews</li>
                </ul>
              </div>

              <div className="value-card">
                <div className="value-icon community">
                  <Users className="icon" />
                </div>
                <h3 className="value-title">Community</h3>
                <p className="value-description">
                  Building a supportive network where caregivers and families connect, share, and grow together.
                </p>
                <ul className="value-features">
                  <li>Support Network</li>
                  <li>Knowledge Sharing</li>
                  <li>Community Events</li>
                </ul>
              </div>

              <div className="value-card">
                <div className="value-icon accessibility">
                  <Target className="icon" />
                </div>
                <h3 className="value-title">Accessibility</h3>
                <p className="value-description">
                  Making quality care accessible and affordable for all through flexible plans and transparent pricing.
                </p>
                <ul className="value-features">
                  <li>Flexible Plans</li>
                  <li>Transparent Pricing</li>
                  <li>Financial Assistance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Star className="badge-icon" />
              Our Impact
            </div>
            <h2 className="section-title">Making a Difference Every Day</h2>
            <p className="section-description">The numbers that tell our story of care and commitment</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <Users className="icon" />
              </div>
              <p className="stat-number">
                <CountUp end={2500} duration={3} enableScrollSpy />+
              </p>
              <p className="stat-label">Verified Caregivers</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Heart className="icon" />
              </div>
              <p className="stat-number">
                <CountUp end={10000} duration={3} enableScrollSpy />+
              </p>
              <p className="stat-label">Families Served</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Clock className="icon" />
              </div>
              <p className="stat-number">
                <CountUp end={50} duration={3} enableScrollSpy />+
              </p>
              <p className="stat-label">Cities Covered</p>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Award className="icon" />
              </div>
              <p className="stat-number">
                <CountUp end={15} duration={3} enableScrollSpy />+
              </p>
              <p className="stat-label">Years of Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Users className="badge-icon" />
              Our Team
            </div>
            <h2 className="section-title">Meet the People Behind ElAnis Care</h2>
            <p className="section-description">Passionate professionals dedicated to revolutionizing care</p>
          </div>

          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80"
                  alt="Dr. Sarah Johnson"
                  className="member-photo"
                />
              </div>
              <h3 className="member-name">Dr. Sarah Johnson</h3>
              <p className="member-role">Chief Medical Officer</p>
              <p className="member-bio">20+ years in geriatric care and healthcare innovation</p>
            </div>

            <div className="team-member">
              <div className="member-image">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80"
                  alt="Michael Chen"
                  className="member-photo"
                />
              </div>
              <h3 className="member-name">Michael Chen</h3>
              <p className="member-role">Head of Operations</p>
              <p className="member-bio">Former hospital administrator with 15+ years experience</p>
            </div>

            <div className="team-member">
              <div className="member-image">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&h=500&q=80"
                  alt="Emily Rodriguez"
                  className="member-photo"
                />
              </div>
              <h3 className="member-name">Emily Rodriguez</h3>
              <p className="member-role">Director of Care Services</p>
              <p className="member-bio">Registered nurse with expertise in home healthcare</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Experience the ElAnis Care Difference?</h2>
            <p className="cta-description">
              Join thousands of families who trust us for their care needs. Get started today and find your perfect caregiver match.
            </p>
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
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <Heart className="logo-icon" />
              <span className="logo-text">ElAnis Care</span>
            </div>
            <p className="footer-copyright">&copy; 2025 ElAnis Care. All rights reserved. Built with ❤️ for better care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}