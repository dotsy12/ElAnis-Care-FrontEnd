import { useState } from 'react';
import { Heart, ArrowLeft, Mail, Phone, MapPin, Send, Clock, MessageCircle, User, Award } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CountUp from 'react-countup';
import { toast } from 'sonner';
import '../styles/ContactPage.css';

interface ContactPageProps {
  navigate: (page: string) => void;
}

export function ContactPage({ navigate }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Thank you! We will get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="contact-page">
      {/* Header */}
      <header className="contact-header">
        <div className="contact-header-container">
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
      <section className="contact-hero">
        <div className="hero-background">
          <div className="hero-bg-circle-1"></div>
          <div className="hero-bg-circle-2"></div>
        </div>
        <div className="contact-hero-container">
          <div className="contact-hero-content">
            <div className="trust-badge">
              <div className="pulse-dot"></div>
              <span>24/7 Customer Support</span>
            </div>
            <h1 className="contact-hero-title">Get In <span className="gradient-text">Touch</span></h1>
            <p className="contact-hero-description">
              Have questions? We're here to help. Reach out to us and we'll respond as soon as possible.
            </p>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-number">
                  <CountUp end={15} duration={3} enableScrollSpy />+
                </div>
                <div className="stat-label">Min Response Time</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">
                  <CountUp end={24} duration={3} enableScrollSpy />/7
                </div>
                <div className="stat-label">Support Available</div>
              </div>
              <div className="hero-stat">
                <div className="stat-number">
                  <CountUp end={98} duration={3} enableScrollSpy />%
                </div>
                <div className="stat-label">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Info */}
            <div className="contact-info">
              <div className="section-header">
                <div className="section-badge">
                  <MessageCircle className="badge-icon" />
                  Contact Information
                </div>
                <h2 className="section-title">We're Here to Help</h2>
                <p className="section-description">
                  Feel free to reach out through any of these channels. Our team is available 24/7 to assist you.
                </p>
              </div>

              <div className="contact-methods">
                <div className="contact-method">
                  <div className="method-icon">
                    <Mail className="icon" />
                  </div>
                  <div className="method-content">
                    <h3 className="method-title">Email</h3>
                    <p className="method-detail">support@elaniscare.com</p>
                    <p className="method-detail">info@elaniscare.com</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <Phone className="icon" />
                  </div>
                  <div className="method-content">
                    <h3 className="method-title">Phone</h3>
                    <p className="method-detail">+1 (555) 123-4567</p>
                    <p className="method-detail">+1 (555) 987-6543</p>
                  </div>
                </div>

                <div className="contact-method">
                  <div className="method-icon">
                    <MapPin className="icon" />
                  </div>
                  <div className="method-content">
                    <h3 className="method-title">Address</h3>
                    <p className="method-detail">123 Care Street</p>
                    <p className="method-detail">New York, NY 10001</p>
                    <p className="method-detail">United States</p>
                  </div>
                </div>
              </div>

              <div className="business-hours">
                <div className="hours-header">
                  <Clock className="hours-icon" />
                  <h3 className="hours-title">Business Hours</h3>
                </div>
                <div className="hours-list">
                  <div className="hour-item">
                    <span className="day">Monday - Friday</span>
                    <span className="time">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Saturday</span>
                    <span className="time">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="hour-item">
                    <span className="day">Sunday</span>
                    <span className="time">10:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="support-features">
                <div className="support-feature">
                  <Award className="feature-icon" />
                  <div>
                    <div className="feature-title">Award Winning Support</div>
                    <div className="feature-subtitle">Best Customer Service 2024</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-container">
              <div className="form-header">
                <div className="form-badge">
                  <Send className="badge-icon" />
                  Send us a Message
                </div>
                <h2 className="form-title">Let's Start a Conversation</h2>
                <p className="form-description">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <div className="input-container">
                    <User className="input-icon" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="form-input"
                      placeholder="Your Full Name"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <Mail className="input-icon" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="form-input"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <MessageCircle className="input-icon" />
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="form-input"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="textarea-container">
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      className="form-textarea"
                      rows={6}
                      placeholder="Tell us more about your inquiry, questions, or how we can assist you..."
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="button-icon" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <MessageCircle className="badge-icon" />
              Quick Help
            </div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">Quick answers to common questions</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h3 className="faq-question">How quickly will I get a response?</h3>
              <p className="faq-answer">We typically respond to all inquiries within 15 minutes during business hours and within 2 hours outside business hours.</p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">Do you offer emergency care services?</h3>
              <p className="faq-answer">Yes, we provide 24/7 emergency care services. Call our emergency line for immediate assistance.</p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">How do I verify a caregiver's credentials?</h3>
              <p className="faq-answer">All our caregivers undergo thorough background checks and credential verification. You can request verification documents through your dashboard.</p>
            </div>

            <div className="faq-item">
              <h3 className="faq-question">What areas do you serve?</h3>
              <p className="faq-answer">We currently serve over 50 cities across the United States with plans to expand to more locations soon.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="contact-footer">
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