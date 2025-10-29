import { XCircle, ArrowLeft, Mail } from 'lucide-react';
import { User } from '../App';

interface ProviderRejectedPageProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

export function ProviderRejectedPage({ user, navigate, onLogout }: ProviderRejectedPageProps) {
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
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Application Not Approved
          </h1>
          <h2 className="text-2xl text-gray-700 mb-6" dir="rtl">
            طلبك لم تتم الموافقة عليه
          </h2>
          
          <p className="text-gray-600 mb-4">
            Unfortunately, your application to become a service provider has not been approved at this time.
          </p>
          <p className="text-gray-600 mb-8" dir="rtl">
            للأسف، لم تتم الموافقة على طلبك لتصبح مقدم خدمة في الوقت الحالي.
          </p>

          {user && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-red-900 mb-4">Application Details</h3>
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
                  <span className="font-medium text-red-600">Rejected</span>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-3 text-left p-4 bg-blue-50 rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-900">Check Your Email</p>
                <p className="text-sm text-blue-700">
                  We have sent you an email with the reason for rejection and steps you can take to improve your application.
                </p>
                <p className="text-sm text-blue-700 mt-2" dir="rtl">
                  لقد أرسلنا إليك بريدًا إلكترونيًا يوضح سبب الرفض والخطوات التي يمكنك اتخاذها لتحسين طلبك.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 p-4 border-2 border-gray-200 rounded-lg text-left">
              <p className="font-medium text-gray-900 mb-2">What you can do:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Review the feedback provided in the email</li>
                <li>Update your qualifications and documents</li>
                <li>Contact our support team if you have questions</li>
                <li>Reapply after addressing the concerns</li>
              </ul>
            </div>

            <div className="pt-6">
              <button
                onClick={() => navigate('landing')}
                className="px-6 py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
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
