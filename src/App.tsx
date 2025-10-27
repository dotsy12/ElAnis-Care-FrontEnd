import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { RegistrationPage } from './components/RegistrationPage';
import { UserDashboard } from './components/UserDashboard';
import { ProviderDashboard } from './components/ProviderDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { FAQPage } from './components/FAQPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsPage } from './components/TermsPage';
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
}

function App() {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const navigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      navigate('admin-dashboard');
    } else if (user.role === 'provider') {
      if (user.approved) {
        navigate('provider-dashboard');
      } else {
        navigate('pending-approval');
      }
    } else {
      navigate('user-dashboard');
    }
  };

  const handleLogout = () => {
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
      case 'user-dashboard':
        return <UserDashboard user={currentUser} navigate={navigate} onLogout={handleLogout} />;
      case 'provider-dashboard':
        return <ProviderDashboard user={currentUser} navigate={navigate} onLogout={handleLogout} />;
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
