import { useState } from 'react';
import { Heart, ArrowLeft, User, Briefcase, Mail, Phone, MapPin, Lock, Calendar, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface RegistrationPageProps {
  navigate: (page: string) => void;
}

export function RegistrationPage({ navigate }: RegistrationPageProps) {
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [accountType, setAccountType] = useState<'user' | 'provider' | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    dob: '',
    idNumber: '',
    experience: '',
    bio: '',
  });

  const [certificates, setCertificates] = useState<File[]>([]);
  const [cv, setCv] = useState<File | null>(null);

  const handleTypeSelect = (type: 'user' | 'provider') => {
    setAccountType(type);
    setStep('form');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (type: 'certificates' | 'cv', files: FileList | null) => {
    if (!files) return;
    
    if (type === 'certificates') {
      setCertificates(prev => [...prev, ...Array.from(files)]);
      toast.success(`${files.length} certificate(s) added`);
    } else {
      setCv(files[0]);
      toast.success('CV uploaded');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (accountType === 'provider') {
      toast.success('Registration successful! Your profile is pending admin approval.');
    } else {
      toast.success('Registration successful! You can now login.');
    }

    setTimeout(() => {
      navigate('login');
    }, 2000);
  };

  if (step === 'type') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
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

            <h2 className="text-center mb-2 text-gray-900">Create Your Account</h2>
            <p className="text-center text-gray-600 mb-12">Choose your account type to get started</p>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => handleTypeSelect('user')}
                className="p-8 border-3 border-gray-200 rounded-xl hover:border-[#FFA726] hover:bg-[#E3F2FD] transition-all group"
              >
                <div className="w-20 h-20 bg-[#E3F2FD] group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-[#FFA726]" />
                </div>
                <h3 className="mb-3 text-gray-900">I am a User</h3>
                <p className="text-gray-600">
                  Looking for trusted caregivers for my family members or home care services.
                </p>
              </button>

              <button
                onClick={() => handleTypeSelect('provider')}
                className="p-8 border-3 border-gray-200 rounded-xl hover:border-[#FFA726] hover:bg-[#E3F2FD] transition-all group"
              >
                <div className="w-20 h-20 bg-[#E3F2FD] group-hover:bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-10 h-10 text-[#FFA726]" />
                </div>
                <h3 className="mb-3 text-gray-900">I am a Care Provider</h3>
                <p className="text-gray-600">
                  Professional caregiver, nurse, or nanny offering quality care services.
                </p>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('login')}
                  className="text-[#FFA726] hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E3F2FD] to-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => setStep('type')}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="mb-2 text-gray-900">
            {accountType === 'user' ? 'User Registration' : 'Provider Registration'}
          </h2>
          <p className="text-gray-600 mb-8">
            {accountType === 'user' 
              ? 'Fill in your details to create your account'
              : 'Complete your professional profile to get started'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Common Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Address *</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="123 Main St, City"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Provider-specific Fields */}
            {accountType === 'provider' && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block mb-2 text-gray-700">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => handleInputChange('dob', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700">ID Number *</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange('idNumber', e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                        placeholder="ID123456789"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Years of Experience *</label>
                  <input
                    type="number"
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="5"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Professional Bio *</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    rows={4}
                    placeholder="Tell us about your experience, skills, and why you're passionate about caregiving..."
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Upload Certificates</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FFA726] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-[#FFA726] hover:underline">Click to upload</span>
                      <span className="text-gray-600"> or drag and drop</span>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('certificates', e.target.files)}
                        className="hidden"
                      />
                    </label>
                    {certificates.length > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        {certificates.length} file(s) selected
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">Upload CV/Resume</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#FFA726] transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-[#FFA726] hover:underline">Click to upload</span>
                      <span className="text-gray-600"> your CV</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('cv', e.target.files)}
                        className="hidden"
                      />
                    </label>
                    {cv && (
                      <p className="text-sm text-gray-600 mt-2">{cv.name}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Password Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-gray-700">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
            >
              {accountType === 'provider' ? 'Submit for Approval' : 'Create Account'}
            </button>
          </form>

          {accountType === 'provider' && (
            <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                <strong>Note:</strong> Your profile will be reviewed by our admin team. You'll be notified once approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
