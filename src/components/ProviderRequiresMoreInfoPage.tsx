import { AlertCircle, ArrowLeft, Upload, Mail } from 'lucide-react';
import { User } from '../App';

interface ProviderRequiresMoreInfoPageProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

export function ProviderRequiresMoreInfoPage({ user, navigate, onLogout }: ProviderRequiresMoreInfoPageProps) {
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
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Additional Information Required
          </h1>
          <h2 className="text-2xl text-gray-700 mb-6" dir="rtl">
            معلومات إضافية مطلوبة
          </h2>
          
          <p className="text-gray-600 mb-4">
            We need some additional information to complete your application review. Please check your email for details.
          </p>
          <p className="text-gray-600 mb-8" dir="rtl">
            نحتاج إلى بعض المعلومات الإضافية لإكمال مراجعة طلبك. يرجى التحقق من بريدك الإلكتروني للحصول على التفاصيل.
          </p>

          {user && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-yellow-900 mb-4">Application Details</h3>
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
                  <span className="font-medium text-yellow-600">Requires More Info</span>
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
                  We have sent you a detailed email explaining what additional information or documents we need from you.
                </p>
                <p className="text-sm text-blue-700 mt-2" dir="rtl">
                  لقد أرسلنا إليك بريدًا إلكترونيًا مفصلاً يشرح المعلومات أو المستندات الإضافية التي نحتاجها منك.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left p-4 bg-green-50 rounded-lg">
              <Upload className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Next Steps</p>
                <p className="text-sm text-green-700">
                  Follow the instructions in the email to submit the required information. Once received, we will resume reviewing your application.
                </p>
              </div>
            </div>

            <div className="text-sm text-gray-600 p-4 border-2 border-gray-200 rounded-lg text-left">
              <p className="font-medium text-gray-900 mb-3">Common requests include:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li>Additional certifications or licenses</li>
                <li>Clearer copies of identification documents</li>
                <li>More detailed work experience information</li>
                <li>References from previous clients or employers</li>
                <li>Updated contact information</li>
              </ul>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => window.location.href = `mailto:${user?.email}`}
                className="w-full px-6 py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={() => navigate('landing')}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
