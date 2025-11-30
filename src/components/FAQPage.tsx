import { useState } from 'react';
import { Heart, ArrowLeft, MessageCircle, Search, User, Shield, CreditCard, Clock, Star, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react';
import CountUp from 'react-countup';
import '../styles/FAQPage.css';

interface FAQPageProps {
  navigate: (page: string) => void;
}

export function FAQPage({ navigate }: FAQPageProps) {
  const [openCategory, setOpenCategory] = useState<string | null>('General');
  const [openQuestions, setOpenQuestions] = useState<Set<string>>(new Set(['0-0']));
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  const toggleQuestion = (questionId: string) => {
    const newOpenQuestions = new Set(openQuestions);
    if (newOpenQuestions.has(questionId)) {
      newOpenQuestions.delete(questionId);
    } else {
      newOpenQuestions.add(questionId);
    }
    setOpenQuestions(newOpenQuestions);
  };

  const faqs = [
    {
      category: 'General',
      icon: MessageCircle,
      questions: [
        {
          q: 'What is ElAnis Care?',
          a: 'ElAnis Care is a trusted platform connecting families with verified, experienced caregivers for elderly care, child care, and home nursing services. We ensure quality, safety, and reliability in all our care services.',
        },
        {
          q: 'How does ElAnis Care work?',
          a: 'Users can search for caregivers based on their needs, location, and availability. Once you find a suitable caregiver, you can send a booking request, and upon acceptance, proceed with payment. After the service is completed, you can rate your experience.',
        },
        {
          q: 'Is ElAnis Care available in my area?',
          a: 'We currently operate in over 50 cities across the United States. You can search for caregivers by entering your city to see available providers in your area.',
        },
      ],
    },
    {
      category: 'For Users',
      icon: User,
      questions: [
        {
          q: 'How do I book a caregiver?',
          a: 'After logging in, browse available caregivers, view their profiles, and click "Send Request" on your preferred caregiver. Select your desired shift type (3 hours, 12 hours, or full day), date, and time. The caregiver will review and respond to your request.',
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept major credit cards, debit cards, and secure online payment methods. Payments are processed securely after the caregiver accepts your booking request.',
        },
        {
          q: 'Can I cancel a booking?',
          a: 'Yes, you can cancel a booking before it starts. Please refer to our cancellation policy for details on refunds and notice requirements.',
        },
        {
          q: 'How are caregivers verified?',
          a: 'All caregivers undergo thorough background checks, certification verification, and experience validation before being approved on our platform.',
        },
      ],
    },
    {
      category: 'For Providers',
      icon: Shield,
      questions: [
        {
          q: 'How do I become a caregiver on ElAnis Care?',
          a: 'Click "Register as Provider" and complete the registration form with your professional details, experience, certifications, and CV. Our admin team will review your application and notify you of the approval status.',
        },
        {
          q: 'What documents do I need to provide?',
          a: 'You need to provide valid certifications (CPR, First Aid, nursing licenses, etc.), a current CV/resume, government-issued ID, and proof of experience in caregiving.',
        },
        {
          q: 'How do I get paid?',
          a: 'Payments are processed after service completion and transferred to your registered bank account. You can view your earnings and transaction history in your provider dashboard.',
        },
        {
          q: 'Can I set my own rates?',
          a: 'Rates are based on platform guidelines and your experience level. You can update your hourly rate in your profile settings, subject to admin approval.',
        },
        {
          q: 'What if I need to reject a request?',
          a: 'You can accept or reject service requests in your dashboard. If rejecting, please provide a reason so the client understands your decision.',
        },
      ],
    },
    {
      category: 'Safety & Privacy',
      icon: Shield,
      questions: [
        {
          q: 'How is my personal information protected?',
          a: 'We use industry-standard encryption and security measures to protect your personal data. Please review our Privacy Policy for detailed information.',
        },
        {
          q: 'What safety measures are in place?',
          a: 'All caregivers are background-checked and verified. We have a rating and review system, 24/7 support, and safety protocols to ensure secure service delivery.',
        },
        {
          q: 'What should I do in case of an emergency?',
          a: 'In case of emergency, call emergency services immediately (911). You can also contact our 24/7 support line for assistance.',
        },
      ],
    },
    {
      category: 'Pricing',
      icon: CreditCard,
      questions: [
        {
          q: 'What are the shift types and pricing?',
          a: 'We offer three shift types: 3-hour shifts, 12-hour shifts, and full-day (24-hour) shifts. Pricing varies based on the caregiver\'s experience and hourly rate. You can see the total cost before confirming your booking.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No, all fees are displayed upfront before you confirm your booking. The price you see is the price you pay.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Refunds are available based on our cancellation policy. Please contact support for specific refund requests.',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(section => ({
    ...section,
    questions: section.questions.filter(question =>
      question.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      question.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="faq-page">
      {/* Header */}
      <header className="faq-header">
        <div className="faq-header-container">
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
      <section className="faq-hero">
        <div className="hero-background">
          <div className="hero-bg-circle-1"></div>
          <div className="hero-bg-circle-2"></div>
        </div>
        <div className="faq-hero-container">
          <div className="faq-hero-content">
            <div className="trust-badge">
              <div className="pulse-dot"></div>
              <span>Find Answers Quickly</span>
            </div>
            <h1 className="faq-hero-title">Frequently Asked <span className="gradient-text">Questions</span></h1>
            <p className="faq-hero-description">
              Find answers to common questions about our platform, services, and policies.
            </p>

            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <div className="stat-number">
                  <CountUp end={18} duration={3} enableScrollSpy />+
                </div>
                <div className="stat-label">Common Questions</div>
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
                <div className="stat-label">Answered Instantly</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          {filteredFaqs.length === 0 ? (
            <div className="no-results">
              <MessageCircle className="no-results-icon" />
              <h3 className="no-results-title">No results found</h3>
              <p className="no-results-description">
                Try searching with different keywords or browse the categories below.
              </p>
            </div>
          ) : (
            <div className="faq-categories">
              {filteredFaqs.map((section, idx) => (
                <div key={idx} className="faq-category">
                  <button
                    onClick={() => toggleCategory(section.category)}
                    className="category-header"
                  >
                    <div className="category-title-container">
                      <div className="category-icon">
                        <section.icon className="icon" />
                      </div>
                      <h2 className="category-title">{section.category}</h2>
                    </div>
                    <div className="category-indicator">
                      {openCategory === section.category ? (
                        <ChevronUp className="indicator-icon" />
                      ) : (
                        <ChevronDown className="indicator-icon" />
                      )}
                    </div>
                  </button>

                  {openCategory === section.category && (
                    <div className="questions-container">
                      {section.questions.map((faq, qIdx) => {
                        const questionId = `${idx}-${qIdx}`;
                        const isOpen = openQuestions.has(questionId);

                        return (
                          <div key={qIdx} className="question-item">
                            <button
                              onClick={() => toggleQuestion(questionId)}
                              className="question-trigger"
                            >
                              <span className="question-text">{faq.q}</span>
                              <div className="question-indicator">
                                {isOpen ? (
                                  <ChevronUp className="indicator-icon" />
                                ) : (
                                  <ChevronDown className="indicator-icon" />
                                )}
                              </div>
                            </button>

                            {isOpen && (
                              <div className="question-answer">
                                <p className="answer-text">{faq.a}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="support-cta">
            <div className="cta-content">
              <div className="cta-icon">
                <MessageCircle className="icon" />
              </div>
              <div className="cta-text">
                <h3 className="cta-title">Still have questions?</h3>
                <p className="cta-description">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
              </div>
              <button
                onClick={() => navigate('contact')}
                className="cta-button"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="quick-help-section">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">
              <Clock className="badge-icon" />
              Quick Help
            </div>
            <h2 className="section-title">Need Immediate Assistance?</h2>
            <p className="section-description">Get help quickly with these resources</p>
          </div>

          <div className="help-grid">
            <div className="help-card">
              <div className="help-icon">
                <Phone className="icon" />
              </div>
              <h3 className="help-title">Call Support</h3>
              <p className="help-description">Speak directly with our support team</p>
              <div className="help-number">+1 (555) 123-4567</div>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <Mail className="icon" />
              </div>
              <h3 className="help-title">Email Us</h3>
              <p className="help-description">Send us your questions and concerns</p>
              <div className="help-email">support@elaniscare.com</div>
            </div>

            <div className="help-card">
              <div className="help-icon">
                <MessageCircle className="icon" />
              </div>
              <h3 className="help-title">Live Chat</h3>
              <p className="help-description">Chat with us in real-time</p>
              <div className="help-status">Available 24/7</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="faq-footer">
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