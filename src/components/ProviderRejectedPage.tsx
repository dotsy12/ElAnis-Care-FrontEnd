import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import { User } from '../App';
import '../styles/ProviderRejectedPage.css';

interface ProviderRejectedPageProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

export function ProviderRejectedPage({ user, navigate, onLogout }: ProviderRejectedPageProps) {
  return (
    <div className="provider-rejected-page">
      {/* Header */}
      <header className="provider-rejected-header">
        <div className="provider-rejected-header-inner">
          <button
            onClick={() => navigate('landing')}
            className="provider-rejected-back-btn"
          >
            <ArrowLeft className="provider-rejected-back-icon" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={onLogout}
            className="provider-rejected-logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="provider-rejected-content">
        <div className="provider-rejected-card">
          <div className="provider-rejected-icon-container">
            <div className="provider-rejected-icon-circle">
              <XCircle className="provider-rejected-x-icon" />
            </div>
          </div>
          
          <h1 className="provider-rejected-title">
            Application Not Approved
          </h1>
          <h2 className="provider-rejected-title-ar" dir="rtl">
            طلبك لم تتم الموافقة عليه
          </h2>
          
          <p className="provider-rejected-description">
            Unfortunately, your application to become a service provider has not been approved at this time.
          </p>
          <p className="provider-rejected-description-ar" dir="rtl">
            للأسف، لم تتم الموافقة على طلبك لتصبح مقدم خدمة في الوقت الحالي.
          </p>

          {user && (
            <div className="provider-rejected-details">
              <h3 className="provider-rejected-details-title">Application Details</h3>
              <div className="provider-rejected-details-list">
                <div className="provider-rejected-details-item">
                  <span className="provider-rejected-details-label">Name:</span>
                  <span className="provider-rejected-details-value">{user.name}</span>
                </div>
                <div className="provider-rejected-details-item">
                  <span className="provider-rejected-details-label">Email:</span>
                  <span className="provider-rejected-details-value">{user.email}</span>
                </div>
                <div className="provider-rejected-details-item">
                  <span className="provider-rejected-details-label">Phone:</span>
                  <span className="provider-rejected-details-value">{user.phone}</span>
                </div>
                <div className="provider-rejected-details-item">
                  <span className="provider-rejected-details-label">Status:</span>
                  <span className="provider-rejected-status">Rejected</span>
                </div>
              </div>
            </div>
          )}

          <div className="provider-rejected-info-container">
            <div className="provider-rejected-email-info">
              <Mail className="provider-rejected-email-icon" />
              <div className="provider-rejected-email-content">
                <p className="provider-rejected-email-title">Check Your Email</p>
                <p className="provider-rejected-email-text">
                  We have sent you an email with the reason for rejection and steps you can take to improve your application.
                </p>
                <p className="provider-rejected-email-text-ar" dir="rtl">
                  لقد أرسلنا إليك بريدًا إلكترونيًا يوضح سبب الرفض والخطوات التي يمكنك اتخاذها لتحسين طلبك.
                </p>
              </div>
            </div>

            <div className="provider-rejected-actions">
              <p className="provider-rejected-actions-title">What you can do:</p>
              <ul className="provider-rejected-actions-list">
                <li className="provider-rejected-action-item">Review the feedback provided in the email</li>
                <li className="provider-rejected-action-item">Update your qualifications and documents</li>
                <li className="provider-rejected-action-item">Contact our support team if you have questions</li>
                <li className="provider-rejected-action-item">Reapply after addressing the concerns</li>
              </ul>
            </div>

            <div className="provider-rejected-cta">
              <button
                onClick={() => navigate('landing')}
                className="provider-rejected-home-btn"
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