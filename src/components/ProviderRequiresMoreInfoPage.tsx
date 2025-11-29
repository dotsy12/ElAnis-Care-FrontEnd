import { AlertCircle, ArrowLeft, Upload, Mail } from 'lucide-react';
import { User } from '../App';
import '../styles/ProviderRequiresMoreInfoPage.css';

interface ProviderRequiresMoreInfoPageProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

export function ProviderRequiresMoreInfoPage({ user, navigate, onLogout }: ProviderRequiresMoreInfoPageProps) {
  return (
    <div className="provider-more-info-page">
      {/* Header */}
      <header className="provider-more-info-header">
        <div className="provider-more-info-header-inner">
          <button
            onClick={() => navigate('landing')}
            className="provider-more-info-back-btn"
          >
            <ArrowLeft className="provider-more-info-back-icon" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={onLogout}
            className="provider-more-info-logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="provider-more-info-content">
        <div className="provider-more-info-card">
          <div className="provider-more-info-icon-container">
            <div className="provider-more-info-icon-circle">
              <AlertCircle className="provider-more-info-alert-icon" />
            </div>
          </div>
          
          <h1 className="provider-more-info-title">
            Additional Information Required
          </h1>
          <h2 className="provider-more-info-title-ar" dir="rtl">
            معلومات إضافية مطلوبة
          </h2>
          
          <p className="provider-more-info-description">
            We need some additional information to complete your application review. Please check your email for details.
          </p>
          <p className="provider-more-info-description-ar" dir="rtl">
            نحتاج إلى بعض المعلومات الإضافية لإكمال مراجعة طلبك. يرجى التحقق من بريدك الإلكتروني للحصول على التفاصيل.
          </p>

          {user && (
            <div className="provider-more-info-details">
              <h3 className="provider-more-info-details-title">Application Details</h3>
              <div className="provider-more-info-details-list">
                <div className="provider-more-info-details-item">
                  <span className="provider-more-info-details-label">Name:</span>
                  <span className="provider-more-info-details-value">{user.name}</span>
                </div>
                <div className="provider-more-info-details-item">
                  <span className="provider-more-info-details-label">Email:</span>
                  <span className="provider-more-info-details-value">{user.email}</span>
                </div>
                <div className="provider-more-info-details-item">
                  <span className="provider-more-info-details-label">Phone:</span>
                  <span className="provider-more-info-details-value">{user.phone}</span>
                </div>
                <div className="provider-more-info-details-item">
                  <span className="provider-more-info-details-label">Status:</span>
                  <span className="provider-more-info-status">Requires More Info</span>
                </div>
              </div>
            </div>
          )}

          <div className="provider-more-info-container">
            <div className="provider-more-info-email">
              <Mail className="provider-more-info-email-icon" />
              <div className="provider-more-info-email-content">
                <p className="provider-more-info-email-title">Check Your Email</p>
                <p className="provider-more-info-email-text">
                  We have sent you a detailed email explaining what additional information or documents we need from you.
                </p>
                <p className="provider-more-info-email-text-ar" dir="rtl">
                  لقد أرسلنا إليك بريدًا إلكترونيًا مفصلاً يشرح المعلومات أو المستندات الإضافية التي نحتاجها منك.
                </p>
              </div>
            </div>

            <div className="provider-more-info-steps">
              <Upload className="provider-more-info-steps-icon" />
              <div className="provider-more-info-steps-content">
                <p className="provider-more-info-steps-title">Next Steps</p>
                <p className="provider-more-info-steps-text">
                  Follow the instructions in the email to submit the required information. Once received, we will resume reviewing your application.
                </p>
              </div>
            </div>

            <div className="provider-more-info-common-requests">
              <p className="provider-more-info-common-title">Common requests include:</p>
              <ul className="provider-more-info-common-list">
                <li className="provider-more-info-common-item">Additional certifications or licenses</li>
                <li className="provider-more-info-common-item">Clearer copies of identification documents</li>
                <li className="provider-more-info-common-item">More detailed work experience information</li>
                <li className="provider-more-info-common-item">References from previous clients or employers</li>
                <li className="provider-more-info-common-item">Updated contact information</li>
              </ul>
            </div>

            <div className="provider-more-info-actions">
              <button
                onClick={() => window.location.href = `mailto:${user?.email}`}
                className="provider-more-info-contact-btn"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('landing')}
                className="provider-more-info-home-btn"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}