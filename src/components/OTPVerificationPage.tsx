import { useState } from 'react';
import { Heart, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../App';
import '../styles/OTPVerificationPage.css';

interface OTPVerificationPageProps {
  navigate: (page: string) => void;
  userId: string;
  userRole: 'user' | 'provider';
  onVerificationSuccess: (user: User) => void;
}

export function OTPVerificationPage({ navigate, userId, userRole, onVerificationSuccess }: OTPVerificationPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('https://elanis.runasp.net/api/Account/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          otp: otpCode,
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('OTP verified successfully!');
        
        // Create user object based on role
        const user: User = {
          id: userId,
          name: 'User', // This will be updated from profile
          email: '', // This will be updated from profile
          role: userRole,
          approved: userRole === 'provider' ? false : true,
        };

        onVerificationSuccess(user);

        // Navigate based on role
        if (userRole === 'provider') {
          navigate('pending-approval');
        } else {
          navigate('user-dashboard');
        }
      } else {
        toast.error(result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-container">
        <button
          onClick={() => navigate('register')}
          className="otp-back-btn"
        >
          <ArrowLeft className="otp-back-icon" />
          Back to Registration
        </button>

        <div className="otp-card">
          <div className="otp-logo">
            <div className="otp-logo-icon">
              <Shield className="otp-shield-icon" />
            </div>
          </div>

          <h2 className="otp-title">Verify Your Account</h2>
          <p className="otp-subtitle">
            We've sent a 6-digit verification code to your email. Please enter it below.
          </p>

          <form onSubmit={handleSubmit} className="otp-form">
            <div className="otp-inputs-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`otp-submit-btn ${isLoading ? 'otp-submit-btn-loading' : ''}`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="otp-footer">
            <p className="otp-footer-text">
              Didn't receive the code?{' '}
              <button
                onClick={() => toast.info('Resend feature coming soon')}
                className="otp-footer-link"
              >
                Resend Code
              </button>
            </p>
          </div>

          <div className="otp-api-info">
            <p className="otp-api-label">API Endpoint:</p>
            <p className="otp-api-endpoint">https://elanis.runasp.net/api/Account/verify-otp</p>
          </div>
        </div>
      </div>
    </div>
  );
}