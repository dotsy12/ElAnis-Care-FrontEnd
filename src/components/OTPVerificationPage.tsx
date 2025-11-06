import { useState } from 'react';
import { Heart, ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { User } from '../App';

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
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('register')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Registration
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#FFA726] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-center mb-2 text-gray-900">Verify Your Account</h2>
          <p className="text-center text-gray-600 mb-8">
            We've sent a 6-digit verification code to your email. Please enter it below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-2 justify-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none transition-colors"
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Didn't receive the code?{' '}
              <button
                onClick={() => toast.info('Resend feature coming soon')}
                className="text-[#FFA726] hover:underline"
              >
                Resend Code
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">API Endpoint:</p>
            <p className="text-sm text-gray-700 break-all">https://elanis.runasp.net/api/Account/verify-otp</p>
          </div>
        </div>
      </div>
    </div>
  );
}
