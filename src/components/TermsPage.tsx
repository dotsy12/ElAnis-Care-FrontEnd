import { Heart, ArrowLeft } from 'lucide-react';
import '../styles/TermsPage.css';

interface TermsPageProps {
  navigate: (page: string) => void;
}

export function TermsPage({ navigate }: TermsPageProps) {
  return (
    <div className="terms-page">
      {/* Header */}
      <header className="terms-header">
        <div className="header-container">
          <button
            onClick={() => navigate('landing')}
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="terms-hero">
        <div className="hero-container">
          <h1 className="hero-title">Terms & Conditions</h1>
          <p className="hero-subtitle">
            Last updated: October 25, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="terms-content">
        <div className="content-container">
          <div className="content-section">
            <h2 className="section-title">Agreement to Terms</h2>
            <p className="section-text">
              By accessing and using CarePro, you agree to be bound by these Terms and Conditions and our Privacy Policy.
              If you do not agree to these terms, please do not use our platform.
            </p>
            <p className="section-text">
              We reserve the right to modify these terms at any time. We will notify users of any material changes.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Platform Description</h2>
            <p className="section-text">
              CarePro is a platform that connects users seeking care services with qualified care providers. We facilitate
              the connection between users and providers but are not directly responsible for the services provided.
            </p>
            <p className="section-text">
              CarePro acts as an intermediary and marketplace. The actual care services are provided by independent
              caregivers who register on our platform.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">User Responsibilities</h2>
            <h3 className="subsection-title">For Service Users</h3>
            <ul className="section-list">
              <li>Provide accurate information during registration and booking</li>
              <li>Treat caregivers with respect and professionalism</li>
              <li>Make timely payments for services rendered</li>
              <li>Cancel bookings according to our cancellation policy</li>
              <li>Provide honest ratings and reviews</li>
              <li>Ensure a safe environment for caregivers</li>
            </ul>

            <h3 className="subsection-title">For Care Providers</h3>
            <ul className="section-list">
              <li>Provide accurate credentials, certifications, and professional information</li>
              <li>Maintain valid certifications and licenses required for your services</li>
              <li>Deliver professional, quality care services</li>
              <li>Respond to booking requests in a timely manner</li>
              <li>Update availability accurately</li>
              <li>Follow all applicable laws and regulations</li>
              <li>Maintain client confidentiality</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Booking and Payment</h2>
            <h3 className="subsection-title">Booking Process</h3>
            <p className="section-text">
              Users can search for and book caregivers through our platform. Bookings are subject to caregiver acceptance.
              Payment is required upon caregiver acceptance before service delivery.
            </p>

            <h3 className="subsection-title">Payment Terms</h3>
            <ul className="section-list">
              <li>All payments must be made through the platform</li>
              <li>Prices are displayed before booking confirmation</li>
              <li>Platform fees and service charges apply</li>
              <li>Payments are non-refundable except as specified in our cancellation policy</li>
            </ul>

            <h3 className="subsection-title">Cancellation Policy</h3>
            <p className="section-text">
              Cancellations made:
            </p>
            <ul className="section-list">
              <li>More than 24 hours before service: Full refund</li>
              <li>12-24 hours before service: 50% refund</li>
              <li>Less than 12 hours before service: No refund</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Verification and Background Checks</h2>
            <p className="section-text">
              CarePro conducts background checks and verification of caregiver credentials. However, we cannot guarantee
              the accuracy of all information provided by caregivers or ensure specific outcomes of care services.
            </p>
            <p className="section-text">
              Users are encouraged to review caregiver profiles, ratings, and reviews before booking.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Ratings and Reviews</h2>
            <p className="section-text">
              Users may rate and review caregivers after service completion. Reviews must be:
            </p>
            <ul className="section-list">
              <li>Honest and based on actual experience</li>
              <li>Respectful and professional</li>
              <li>Free from discriminatory or offensive content</li>
              <li>Not defamatory or misleading</li>
            </ul>
            <p className="section-text">
              CarePro reserves the right to remove reviews that violate these guidelines.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Prohibited Activities</h2>
            <p className="section-text">
              Users are prohibited from:
            </p>
            <ul className="section-list">
              <li>Using the platform for any illegal purpose</li>
              <li>Providing false or misleading information</li>
              <li>Attempting to circumvent platform fees by arranging payment outside the platform</li>
              <li>Harassing, threatening, or discriminating against other users</li>
              <li>Attempting to gain unauthorized access to the platform</li>
              <li>Uploading malicious code or viruses</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Limitation of Liability</h2>
            <p className="section-text">
              CarePro provides a platform to connect users with caregivers but does not employ caregivers or directly
              provide care services. To the fullest extent permitted by law:
            </p>
            <ul className="section-list">
              <li>We are not liable for the quality of care services provided</li>
              <li>We are not responsible for disputes between users and caregivers</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount paid for the specific service</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Dispute Resolution</h2>
            <p className="section-text">
              In case of disputes:
            </p>
            <ul className="section-list">
              <li>Contact our support team first for mediation</li>
              <li>Disputes will be governed by the laws of the State of New York</li>
              <li>Users agree to binding arbitration for dispute resolution</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Account Termination</h2>
            <p className="section-text">
              We reserve the right to suspend or terminate accounts that:
            </p>
            <ul className="section-list">
              <li>Violate these Terms and Conditions</li>
              <li>Engage in fraudulent activity</li>
              <li>Receive multiple complaints or negative reports</li>
              <li>Remain inactive for extended periods</li>
            </ul>
          </div>

          <div className="content-section">
            <h2 className="section-title">Intellectual Property</h2>
            <p className="section-text">
              All content on the CarePro platform, including text, graphics, logos, and software, is the property of
              CarePro and is protected by copyright and trademark laws. Users may not reproduce, distribute, or create
              derivative works without our express permission.
            </p>
          </div>

          <div className="content-section">
            <h2 className="section-title">Contact Information</h2>
            <p className="section-text">
              For questions about these Terms and Conditions:
            </p>
            <ul className="contact-list">
              <li>Email: legal@carepro.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Care Street, New York, NY 10001</li>
            </ul>
          </div>

          <div className="acknowledgement-section">
            <p className="acknowledgement-text">
              By using CarePro, you acknowledge that you have read, understood, and agree to be bound by these
              Terms and Conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="terms-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <Heart className="footer-icon" />
            <span className="footer-logo">CarePro</span>
          </div>
          <p className="footer-copyright">&copy; 2025 CarePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}