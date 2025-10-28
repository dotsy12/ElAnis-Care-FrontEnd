import { useState } from 'react';
import { Heart, Mail, Lock, ArrowLeft, Phone } from 'lucide-react';
import { User } from '../App';
import { toast } from 'sonner@2.0.3';

interface LoginPageProps {
  navigate: (page: string) => void;
  onLogin: (user: User) => void;
}

export function LoginPage({ navigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock users for demo
  const mockUsers: Record<string, User> = {
    'admin@carepro.com': {
      id: '1',
      name: 'Admin User',
      email: 'admin@carepro.com',
      role: 'admin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
    },
    'user@test.com': {
      id: '2',
      name: 'John Doe',
      email: 'user@test.com',
      role: 'user',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    'provider@test.com': {
      id: '3',
      name: 'Sarah Johnson',
      email: 'provider@test.com',
      role: 'provider',
      phone: '+1 (555) 987-6543',
      address: '456 Oak Ave, City',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      approved: true,
    },
    'pending@test.com': {
      id: '4',
      name: 'Mike Wilson',
      email: 'pending@test.com',
      role: 'provider',
      phone: '+1 (555) 555-5555',
      address: '789 Pine Rd, City',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      approved: false,
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://elanis.runasp.net/api/Account/login', {
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

      const data = await response.json();

      if (response.ok) {
        // Assuming the API returns user data on successful login
        const user: User = {
          id: data.userId || '1',
          name: data.name || email.split('@')[0],
          email: email,
          phone: phoneNumber,
          role: data.role || 'user',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email.split('@')[0]}`,
        };
        
        toast.success(`Welcome back, ${user.name}!`);
        onLogin(user);
      } else {
        toast.error(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred. Please try again.');
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
            <p className="text-sm text-gray-700 break-all">http://elanis.runasp.net/api/Account/login</p>
          </div>
        </div>
      </div>
    </div>
  );
}
