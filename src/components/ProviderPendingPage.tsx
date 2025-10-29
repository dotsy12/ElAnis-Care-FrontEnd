import { Clock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { User } from '../App';

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
          icon: <Clock className="w-16 h-16 text-[#FFA726]" />,
          color: 'orange',
        };
      case 2: // Under Review
        return {
          title: 'Application Under Review',
          titleAr: 'طلبك تحت المراجعة',
          description: 'Our team is currently reviewing your application. This usually takes 1-3 business days.',
          descriptionAr: 'فريقنا يقوم حالياً بمراجعة طلبك. عادة ما يستغرق ذلك من 1 إلى 3 أيام عمل.',
          icon: <Clock className="w-16 h-16 text-blue-600 animate-pulse" />,
          color: 'blue',
        };
      default:
        return {
          title: 'Application Pending',
          titleAr: 'الطلب قيد الانتظار',
          description: 'Your application is being processed.',
          descriptionAr: 'جارٍ معالجة طلبك.',
          icon: <Clock className="w-16 h-16 text-gray-600" />,
          color: 'gray',
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="flex justify-center mb-6">
            {statusInfo.icon}
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {statusInfo.title}
          </h1>
          <h2 className="text-2xl text-gray-700 mb-6" dir="rtl">
            {statusInfo.titleAr}
          </h2>
          
          <p className="text-gray-600 mb-4">
            {statusInfo.description}
          </p>
          <p className="text-gray-600 mb-8" dir="rtl">
            {statusInfo.descriptionAr}
          </p>

          {user && (
            <div className="bg-[#E3F2FD] rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Application Details</h3>
              <div className="space-y-2 text-sm text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="text-gray-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-900">{user.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium text-${statusInfo.color}-600`}>
                    {providerStatus === 1 ? 'Pending' : 'Under Review'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left p-4 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">What happens next?</p>
                <p className="text-sm text-green-700">
                  Our admin team will review your documents and qualifications. You will receive an email notification once a decision is made.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-500 p-4 border-2 border-gray-200 rounded-lg">
              <p className="mb-2">
                <strong>Note:</strong> Make sure to check your email regularly for updates.
              </p>
              <p dir="rtl">
                <strong>ملاحظة:</strong> تأكد من فحص بريدك الإلكتروني بانتظام للحصول على التحديثات.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
