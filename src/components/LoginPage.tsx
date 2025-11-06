import { useState } from 'react';
import { Heart, Mail, Lock, ArrowLeft, Phone } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner';

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
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('landing')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#FFA726] rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-center mb-2 text-gray-900">Welcome Back</h2>
          <p className="text-center text-gray-600 mb-8">Login to your CarePro account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none transition-colors"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none transition-colors"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('register')}
                className="text-[#FFA726] hover:underline"
              >
                Register here
              </button>
            </p>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">API Endpoint:</p>
            <p className="text-sm text-gray-700 break-all">https://elanis.runasp.net/api/Account/login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
