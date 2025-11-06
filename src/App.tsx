import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { OTPVerificationPage } from './components/OTPVerificationPage';
import { UserDashboard } from './components/UserDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { ProviderPendingPage } from './components/ProviderPendingPage';
import { ProviderRejectedPage } from './components/ProviderRejectedPage';
import { ProviderRequiresMoreInfoPage } from './components/ProviderRequiresMoreInfoPage';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
import { PaymentSuccess } from './components/PaymentSuccess';
import { PaymentCancel } from './components/PaymentCancel';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'user' | 'provider' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatar?: string;
  approved?: boolean;
  providerStatus?: number; // 1=Pending, 2=UnderReview, 3=Approved, 4=Rejected, 5=RequiresMoreInfo
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [otpData, setOtpData] = useState<{ userId: string; userRole: 'user' | 'provider' } | null>(null);

  // Load user from localStorage on app start
  useEffect(() => {
    // Check for payment redirect URLs first
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    const requestId = urlParams.get('request_id');
    
    // Handle Stripe payment success redirect
    if (sessionId && window.location.pathname.includes('success')) {
      setCurrentPage('payment-success');
      return;
    }
    
    // Handle Stripe payment cancel redirect
    if (requestId && window.location.pathname.includes('cancel')) {
      setCurrentPage('payment-cancel');
      return;
    }
    
    const storedUser = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('accessToken');
    
    if (storedUser && accessToken) {
      try {
        const user: User = JSON.parse(storedUser);
        setCurrentUser(user);
        // Navigate to appropriate dashboard
        if (user.role === 'admin') {
          setCurrentPage('admin-dashboard');
        } else if (user.role === 'provider') {
          // Route based on provider status
          const status = user.providerStatus || 1;
          switch (status) {
            case 3: // Approved
              setCurrentPage('provider-dashboard');
              break;
            case 4: // Rejected
              setCurrentPage('provider-rejected');
              break;
            case 5: // Requires More Info
              setCurrentPage('provider-requires-info');
              break;
            case 1: // Pending
            case 2: // Under Review
            default:
              setCurrentPage('provider-pending');
              break;
          }
        } else {
          setCurrentPage('user-dashboard');
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.clear();
      }
    }
  }, []);

  const navigate = (page: string, data?: any) => {
    setCurrentPage(page);
    if (page === 'verify-otp' && data) {
      setOtpData(data);
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigate('admin-dashboard');
    } else if (user.role === 'provider') {
      // Route based on provider status
      const status = user.providerStatus || 1;
      switch (status) {
        case 3: // Approved
          navigate('provider-dashboard');
          break;
        case 4: // Rejected
          navigate('provider-rejected');
          break;
        case 5: // Requires More Info
          navigate('provider-requires-info');
          break;
        case 1: // Pending
        case 2: // Under Review
        default:
          navigate('provider-pending');
          break;
      }
    } else {
      navigate('user-dashboard');
    }
  };

  const handleOtpVerification = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      try {
        // Call logout API
        await fetch('https://elanis.runasp.net/api/Account/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Reset state
    setCurrentUser(null);
    navigate('landing');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage navigate={navigate} />;
      case 'login':
        return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case 'register':
        return <RegistrationPage navigate={navigate} />;
      case 'verify-otp':
        if (!otpData) {
          navigate('register');
          return <RegistrationPage navigate={navigate} />;
        }
        return (
          <OTPVerificationPage
            navigate={navigate}
            userId={otpData.userId}
            userRole={otpData.userRole}
            onVerificationSuccess={handleOtpVerification}
          />
        );
      case 'user-dashboard':
        return <UserDashboard user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'provider-dashboard':
        if (!currentUser || currentUser.role !== 'provider' || !currentUser.approved) {
          navigate('login');
          return null;
        }
        return <ProviderDashboard user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'provider-pending':
        if (!currentUser || currentUser.role !== 'provider') {
          navigate('login');
          return null;
        }
        return <ProviderPendingPage user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'provider-rejected':
        if (!currentUser || currentUser.role !== 'provider') {
          navigate('login');
          return null;
        }
        return <ProviderRejectedPage user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'provider-requires-info':
        if (!currentUser || currentUser.role !== 'provider') {
          navigate('login');
          return null;
        }
        return <ProviderRequiresMoreInfoPage user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'admin-dashboard':
        return <AdminDashboard user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'about':
        return <AboutPage navigate={navigate} />;
      case 'contact':
        return <ContactPage navigate={navigate} />;
      case 'faq':
        return <FAQPage navigate={navigate} />;
      case 'privacy':
        return <PrivacyPolicyPage navigate={navigate} />;
      case 'terms':
        return <TermsPage navigate={navigate} />;
      case 'payment-success':
        return <PaymentSuccess navigate={navigate} />;
      case 'payment-cancel':
        return <PaymentCancel navigate={navigate} />;
      case 'pending-approval':
        return (
          <div className="min-h-screen flex items-center justify-center bg-[#E3F2FD]">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#FFA726]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="mb-4">Pending Approval</h2>
              <p className="text-gray-600 mb-6">
                Your profile is being reviewed by our admin team. You will be notified once your account is approved.
              </p>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}

export default App;
