import { useState } from 'react';
import { Heart, Mail, Lock, ArrowLeft, Phone } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner';
import '../styles/LoginPage.css';

interface LoginPageProps {
  navigate: (page: string) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ navigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!email || !password || !phoneNumber) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://elanis.runasp.net/api/Account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phoneNumber,
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        const apiData = result.data;
        
        // Save tokens and user data to localStorage
        localStorage.setItem('accessToken', apiData.accessToken);
        localStorage.setItem('refreshToken', apiData.refreshToken);
        localStorage.setItem('userId', apiData.id);
        localStorage.setItem('userEmail', apiData.email);
        localStorage.setItem('userPhone', apiData.phoneNumber);
        localStorage.setItem('userRole', apiData.role);
        localStorage.setItem('isEmailConfirmed', apiData.isEmailConfirmed.toString());
        
        // Determine provider approval status
        let providerStatus = 1; // Default: Pending
        if (apiData.role.toLowerCase() === 'provider' || apiData.role.toLowerCase() === 'serviceprovider') {
          // Status: 1=Pending, 2=UnderReview, 3=Approved, 4=Rejected, 5=RequiresMoreInfo
          providerStatus = apiData.providerStatus || 1;
          localStorage.setItem('providerStatus', providerStatus.toString());
        }
        
        // Create user object
        const user: User = {
          id: apiData.id,
          name: email.split('@')[0], // Will be updated from profile later
          email: apiData.email,
          phone: apiData.phoneNumber,
          role: apiData.role.toLowerCase() === 'serviceprovider' ? 'provider' : apiData.role.toLowerCase(),
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${apiData.email.split('@')[0]}`,
          approved: providerStatus === 3, // Only approved if status = 3
          providerStatus,
        };
        
        // Save full user object
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        toast.success(result.message || `Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        const errorMessage = result.message || 'Login failed. Please check your credentials.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button
          onClick={() => navigate('landing')}
          className="login-back-btn"
        >
          <ArrowLeft className="login-back-icon" />
          Back to Home
        </button>

        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">
              <Heart className="login-heart-icon" />
            </div>
          </div>

          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Login to your ElAnis Care account</p>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-input-group">
              <label className="login-label">Email Address</label>
              <div className="login-input-container">
                <Mail className="login-input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="login-input"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Password</label>
              <div className="login-input-container">
                <Lock className="login-input-icon" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="login-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="login-input-group">
              <label className="login-label">Phone Number</label>
              <div className="login-input-container">
                <Phone className="login-input-icon" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="login-input"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`login-submit-btn ${isLoading ? 'login-submit-btn-loading' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="login-footer">
            <p className="login-footer-text">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('register')}
                className="login-footer-link"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}