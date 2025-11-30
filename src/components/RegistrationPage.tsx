import { useState, useEffect } from 'react';
import { Heart, ArrowLeft, User, Briefcase, Mail, Phone, MapPin, Lock, Calendar, FileText, Upload, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/RegistrationPage.css';

interface RegistrationPageProps {
  navigate: (page: string, data?: any) => void;
}

interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export function RegistrationPage({ navigate }: RegistrationPageProps) {
  const [step, setStep] = useState<'type' | 'form'>('type');
  const [accountType, setAccountType] = useState<'user' | 'provider' | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    dob: '',
    nationalId: '',
    experience: '',
    hourlyRate: '',
    bio: '',
    selectedCategory: '',
  });

  const [idDocument, setIdDocument] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [certificates, setCertificates] = useState<File[]>([]);
  const [cv, setCv] = useState<File | null>(null);

  const handleTypeSelect = (type: 'user' | 'provider') => {
    setAccountType(type);
    setStep('form');
    // Fetch categories when provider is selected
    if (type === 'provider') {
      fetchCategories();
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const response = await fetch('https://elanis.runasp.net/api/Category/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setCategories(result.data);
      } else {
        toast.error(result.message || 'Failed to load categories');
        // Set empty array to show error message
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (accountType === 'provider') {
      if (!idDocument || certificates.length === 0 || !cv) {
        toast.error('Please upload all required documents (ID, Certificate, and CV)');
        return;
      }
      if (!formData.selectedCategory) {
        toast.error('Please select a service category');
        return;
      }
    }

    setIsLoading(true);

    try {
      const apiUrl = accountType === 'user'
        ? 'https://elanis.runasp.net/api/Account/register-user'
        : 'https://elanis.runasp.net/api/Account/register-service-provider';

      const formDataToSend = new FormData();
      formDataToSend.append('Email', formData.email);
      formDataToSend.append('PhoneNumber', formData.phone);
      formDataToSend.append('Password', formData.password);
      formDataToSend.append('ConfirmPassword', formData.confirmPassword);
      formDataToSend.append('FirstName', formData.firstName);
      formDataToSend.append('LastName', formData.lastName);
      formDataToSend.append('Address', formData.address);
      formDataToSend.append('DateOfBirth', formData.dob);

      if (accountType === 'provider') {
        formDataToSend.append('Bio', formData.bio);
        formDataToSend.append('NationalId', formData.nationalId);
        formDataToSend.append('Experience', formData.experience);
        formDataToSend.append('HourlyRate', formData.hourlyRate);
        
        if (idDocument) formDataToSend.append('IdDocument', idDocument);
        if (certificates[0]) formDataToSend.append('Certificate', certificates[0]);
        if (cv) formDataToSend.append('CV', cv);
        
        // Send single category ID
        formDataToSend.append('SelectedCategoryIds', formData.selectedCategory);
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Registration successful!');
        
        // Get userId from response
        const userId = accountType === 'user' ? result.data.id : result.data.userId;
        
        // Navigate to OTP verification page
        navigate('verify-otp', {
          userId,
          userRole: accountType,
        });
      } else {
        const errorMessage = result.message || 'Registration failed. Please try again.';
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'type') {
    return (
      <div className="registration-container">
        <div className="registration-wrapper">
          <button
            onClick={() => navigate('landing')}
            className="back-button"
          >
            <ArrowLeft className="back-icon" />
            Back to Home
          </button>

          <div className="registration-card">
            <div className="logo-container">
              <div className="logo-circle">
                <Heart className="logo-icon" />
              </div>
            </div>

            <h2 className="registration-title">Create Your Account</h2>
            <p className="registration-subtitle">Choose your account type to get started</p>

            <div className="account-type-grid">
              <button
                onClick={() => handleTypeSelect('user')}
                className="account-type-card account-type-user"
              >
                <div className="account-type-icon-container">
                  <User className="account-type-icon" />
                </div>
                <h3 className="account-type-title">I am a User</h3>
                <p className="account-type-description">
                  Looking for trusted caregivers for my family members or home care services.
                </p>
              </button>

              <button
                onClick={() => handleTypeSelect('provider')}
                className="account-type-card account-type-provider"
              >
                <div className="account-type-icon-container">
                  <Briefcase className="account-type-icon" />
                </div>
                <h3 className="account-type-title">I am a Care Provider</h3>
                <p className="account-type-description">
                  Professional caregiver, nurse, or nanny offering quality care services.
                </p>
              </button>
            </div>

            <div className="login-redirect">
              <p className="login-text">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('login')}
                  className="login-link"
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
    <div className="registration-form-container">
      <div className="registration-form-wrapper">
        <button
          onClick={() => setStep('type')}
          className="back-button"
        >
          <ArrowLeft className="back-icon" />
          Back
        </button>

        <div className="registration-form-card">
          <h2 className="form-title">
            {accountType === 'user' ? 'User Registration' : 'Provider Registration'}
          </h2>
          <p className="form-subtitle">
            {accountType === 'user' 
              ? 'Fill in your details to create your account'
              : 'Complete your professional profile to get started'
            }
          </p>

          <form onSubmit={handleSubmit} className="registration-form">
            {/* Common Fields */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">First Name *</label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="form-input"
                    placeholder="John"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Last Name *</label>
                <div className="input-container">
                  <User className="input-icon" />
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="form-input"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Email Address *</label>
                <div className="input-container">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Phone Number *</label>
                <div className="input-container">
                  <Phone className="input-icon" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Address *</label>
                <div className="input-container">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="form-input"
                    placeholder="123 Main St, City"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Date of Birth *</label>
                <div className="input-container">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Provider-specific Fields */}
            {accountType === 'provider' && (
              <>
                <div className="form-row">
                  <div className="form-field">
                    <label className="field-label">National ID *</label>
                    <div className="input-container">
                      <FileText className="input-icon" />
                      <input
                        type="text"
                        value={formData.nationalId}
                        onChange={(e) => handleInputChange('nationalId', e.target.value)}
                        className="form-input"
                        placeholder="National ID Number"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Hourly Rate ($/hr) *</label>
                    <div className="input-container">
                      <DollarSign className="input-icon" />
                      <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                        className="form-input"
                        placeholder="25"
                        min="1"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="form-field-full">
                  <label className="field-label">Experience Details *</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    className="form-textarea"
                    rows={3}
                    placeholder="Describe your experience in detail (minimum 20 characters)..."
                    minLength={20}
                    required
                  />
                  <p className="character-count">
                    {formData.experience.length}/20 characters minimum
                  </p>
                </div>

                <div className="form-field-full">
                  <label className="field-label">Service Category *</label>
                  {isLoadingCategories ? (
                    <div className="loading-container">
                      <div className="loading-spinner"></div>
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="error-container">
                      <p className="error-message">Failed to load categories. Please refresh the page.</p>
                    </div>
                  ) : (
                    <div className="categories-container">
                      {categories.map((category) => (
                        <label key={category.id} className="category-item">
                          <input
                            type="radio"
                            name="category"
                            value={category.id}
                            checked={formData.selectedCategory === category.id}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                selectedCategory: e.target.value
                              }));
                            }}
                            className="category-radio"
                            required
                          />
                          <div className="category-content">
                            {/* <span className="category-icon">{category.icon || '📋'}</span> */}
                            <div className="category-info">
                              <span className="category-name">{category.name}</span>
                              {category.description && (
                                <p className="category-description">{category.description}</p>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                  {!isLoadingCategories && !formData.selectedCategory && (
                    <p className="field-error">Please select a service category</p>
                  )}
                </div>

                <div className="form-field-full">
                  <label className="field-label">Professional Bio *</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className="form-textarea"
                    rows={4}
                    placeholder="Tell us about your experience, skills, and why you're passionate about caregiving..."
                    required
                  />
                </div>

                <div className="form-field-full">
                  <label className="field-label">Upload ID Document *</label>
                  <div className="file-upload-container">
                    <Upload className="upload-icon" />
                    <label className="file-upload-label">
                      <span className="upload-link">Click to upload</span>
                      <span className="upload-text"> ID document</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setIdDocument(e.target.files[0]);
                            toast.success('ID document uploaded');
                          }
                        }}
                        className="file-input"
                        required
                      />
                    </label>
                    {idDocument && (
                      <p className="file-name">{idDocument.name}</p>
                    )}
                  </div>
                </div>

                <div className="form-field-full">
                  <label className="field-label">Upload Certificate *</label>
                  <div className="file-upload-container">
                    <Upload className="upload-icon" />
                    <label className="file-upload-label">
                      <span className="upload-link">Click to upload</span>
                      <span className="upload-text"> certificate</span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('certificates', e.target.files)}
                        className="file-input"
                        required
                      />
                    </label>
                    {certificates.length > 0 && (
                      <p className="file-name">{certificates[0].name}</p>
                    )}
                  </div>
                </div>

                <div className="form-field-full">
                  <label className="field-label">Upload CV/Resume *</label>
                  <div className="file-upload-container">
                    <Upload className="upload-icon" />
                    <label className="file-upload-label">
                      <span className="upload-link">Click to upload</span>
                      <span className="upload-text"> your CV</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload('cv', e.target.files)}
                        className="file-input"
                        required
                      />
                    </label>
                    {cv && (
                      <p className="file-name">{cv.name}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Password Fields */}
            <div className="form-row">
              <div className="form-field">
                <label className="field-label">Password *</label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="form-input"
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Confirm Password *</label>
                <div className="input-container">
                  <Lock className="input-icon" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="form-input"
                    placeholder="Confirm password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`submit-button ${isLoading ? 'submit-button-loading' : ''}`}
            >
              {isLoading
                ? 'Registering...'
                : accountType === 'provider'
                ? 'Submit for Approval'
                : 'Create Account'}
            </button>
          </form>

          {accountType === 'provider' && (
            <div className="approval-notice">
              <p className="approval-text">
                <strong>Note:</strong> Your profile will be reviewed by our admin team. You'll be notified once approved.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}