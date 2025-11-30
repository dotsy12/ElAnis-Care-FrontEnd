import { Heart, ArrowLeft } from 'lucide-react';
import '../styles/PrivacyPolicyPage.css';

interface PrivacyPolicyPageProps {
  navigate: (page: string) => void;
}

export function PrivacyPolicyPage({ navigate }: PrivacyPolicyPageProps) {
  return (
    <div className="privacy-policy-page">
      {/* Header */}
      <header className="privacy-policy-header">
        <div className="privacy-policy-header-inner">
          <button
            onClick={() => navigate('landing')}
            className="privacy-policy-back-btn"
          >
            <ArrowLeft className="privacy-policy-back-icon" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="privacy-policy-hero">
        <div className="privacy-policy-hero-content">
          <h1 className="privacy-policy-title">Privacy Policy</h1>
          <p className="privacy-policy-date">
            Last updated: October 25, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="privacy-policy-content">
        <div className="privacy-policy-container">
          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Introduction</h2>
            <p className="privacy-policy-text">
              At ElAnis Care, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform.
            </p>
            <p className="privacy-policy-text">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
              please do not access the platform.
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Information We Collect</h2>
            <h3 className="privacy-policy-subtitle">Personal Information</h3>
            <p className="privacy-policy-text">
              We collect personal information that you provide to us when registering for an account, including:
            </p>
            <ul className="privacy-policy-list">
              <li>Name, email address, and phone number</li>
              <li>Address and location information</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>For providers: Professional credentials, certifications, work experience, and identification documents</li>
            </ul>

            <h3 className="privacy-policy-subtitle">Usage Information</h3>
            <p className="privacy-policy-text">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="privacy-policy-list">
              <li>Browser and device information</li>
              <li>IP address and location data</li>
              <li>Pages visited and actions taken on the platform</li>
              <li>Booking and service history</li>
            </ul>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">How We Use Your Information</h2>
            <p className="privacy-policy-text">
              We use the information we collect to:
            </p>
            <ul className="privacy-policy-list">
              <li>Provide, maintain, and improve our services</li>
              <li>Process bookings and payments</li>
              <li>Verify caregiver credentials and conduct background checks</li>
              <li>Send notifications about bookings, payments, and account activity</li>
              <li>Respond to your comments, questions, and provide customer support</li>
              <li>Protect against fraud and unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Information Sharing</h2>
            <p className="privacy-policy-text">
              We may share your information in the following circumstances:
            </p>
            <ul className="privacy-policy-list">
              <li>With caregivers when you book services (name, address, contact information)</li>
              <li>With service providers who help us operate our platform (payment processors, hosting services)</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent or at your direction</li>
            </ul>
            <p className="privacy-policy-text">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Data Security</h2>
            <p className="privacy-policy-text">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="privacy-policy-list">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Your Rights</h2>
            <p className="privacy-policy-text">
              You have the right to:
            </p>
            <ul className="privacy-policy-list">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="privacy-policy-text">
              To exercise these rights, please contact us at privacy@elaniscare.com
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Cookies and Tracking</h2>
            <p className="privacy-policy-text">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Children's Privacy</h2>
            <p className="privacy-policy-text">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
              information from children under 18. If you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Changes to This Policy</h2>
            <p className="privacy-policy-text">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div className="privacy-policy-section">
            <h2 className="privacy-policy-section-title">Contact Us</h2>
            <p className="privacy-policy-text">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="privacy-policy-contact-list">
              <li>Email: privacy@elaniscare.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Care Street, New York, NY 10001</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="privacy-policy-footer">
        <div className="privacy-policy-footer-content">
          <div className="privacy-policy-footer-logo">
            <Heart className="privacy-policy-heart-icon" />
            <span className="privacy-policy-footer-brand">ElAnis Care</span>
          </div>
          <p className="privacy-policy-footer-copyright">&copy; 2025 ElAnis Care. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}