import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { User } from '../App';
import '../styles/ProviderPendingPage.css';

interface ProviderPendingPageProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

export function ProviderPendingPage({ user, navigate, onLogout }: ProviderPendingPageProps) {
  const providerStatus = parseInt(localStorage.getItem('providerStatus') || '1');
  
  const getStatusInfo = () => {
    switch (providerStatus) {
      case 1: // Pending
        return {
          title: 'Application Under Review',
          titleAr: 'طلبك قيد المراجعة',
          description: 'Your application is waiting for admin review. We will notify you once it has been reviewed.',
          descriptionAr: 'طلبك في انتظار مراجعة المشرف. سنخطرك بمجرد مراجعته.',
          icon: <Clock className="pending-icon pending-icon-orange" />,
          color: 'orange',
        };
      case 2: // Under Review
        return {
          title: 'Application Under Review',
          titleAr: 'طلبك تحت المراجعة',
          description: 'Our team is currently reviewing your application. This usually takes 1-3 business days.',
          descriptionAr: 'فريقنا يقوم حالياً بمراجعة طلبك. عادة ما يستغرق ذلك من 1 إلى 3 أيام عمل.',
          icon: <Clock className="pending-icon pending-icon-blue pending-icon-pulse" />,
          color: 'blue',
        };
      default:
        return {
          title: 'Application Pending',
          titleAr: 'الطلب قيد الانتظار',
          description: 'Your application is being processed.',
          descriptionAr: 'جارٍ معالجة طلبك.',
          icon: <Clock className="pending-icon pending-icon-gray" />,
          color: 'gray',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="provider-pending-page">
      {/* Header */}
      <header className="provider-pending-header">
        <div className="provider-pending-header-inner">
          <button
            onClick={() => navigate('landing')}
            className="provider-pending-back-btn"
          >
            <ArrowLeft className="provider-pending-back-icon" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={onLogout}
            className="provider-pending-logout-btn"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="provider-pending-content">
        <div className="provider-pending-card">
          <div className="provider-pending-icon-container">
            {statusInfo.icon}
          </div>
          
          <h1 className="provider-pending-title">
            {statusInfo.title}
          </h1>
          <h2 className="provider-pending-title-ar" dir="rtl">
            {statusInfo.titleAr}
          </h2>
          
          <p className="provider-pending-description">
            {statusInfo.description}
          </p>
          <p className="provider-pending-description-ar" dir="rtl">
            {statusInfo.descriptionAr}
          </p>

          {user && (
            <div className="provider-pending-details">
              <h3 className="provider-pending-details-title">Application Details</h3>
              <div className="provider-pending-details-list">
                <div className="provider-pending-details-item">
                  <span className="provider-pending-details-label">Name:</span>
                  <span className="provider-pending-details-value">{user.name}</span>
                </div>
                <div className="provider-pending-details-item">
                  <span className="provider-pending-details-label">Email:</span>
                  <span className="provider-pending-details-value">{user.email}</span>
                </div>
                <div className="provider-pending-details-item">
                  <span className="provider-pending-details-label">Phone:</span>
                  <span className="provider-pending-details-value">{user.phone}</span>
                </div>
                <div className="provider-pending-details-item">
                  <span className="provider-pending-details-label">Status:</span>
                  <span className={`provider-pending-status provider-pending-status-${statusInfo.color}`}>
                    {providerStatus === 1 ? 'Pending' : 'Under Review'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="provider-pending-info-container">
            <div className="provider-pending-info-box">
              <CheckCircle2 className="provider-pending-info-icon" />
              <div className="provider-pending-info-content">
                <p className="provider-pending-info-title">What happens next?</p>
                <p className="provider-pending-info-text">
                  Our admin team will review your documents and qualifications. You will receive an email notification once a decision is made.
                </p>
              </div>
            </div>

            <div className="provider-pending-note">
              <p className="provider-pending-note-text">
                <strong>Note:</strong> Make sure to check your email regularly for updates.
              </p>
              <p className="provider-pending-note-text-ar" dir="rtl">
                <strong>ملاحظة:</strong> تأكد من فحص بريدك الإلكتروني بانتظام للحصول على التحديثات.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}