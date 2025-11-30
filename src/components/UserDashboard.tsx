import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Users, FileText, CreditCard, Star, LogOut,
  Search, MapPin, Clock, Filter, ChevronRight, X, Calendar, DollarSign, Loader2,
  Phone, Mail, Map, Award, Clock3, CheckCircle, AlertCircle, CalendarDays, Edit, Camera
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import ReviewForm from './reviews/ReviewForm';
import SubmittedReview from './reviews/SubmittedReview';
import { fetchReviewByRequest, fetchUserReviews, Review } from '../api/reviews';
import { Badge } from './ui/badge';
import '../styles/UserDashboard.css';

interface UserDashboardProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

interface Location {
  governorate: string;
  city: string;
  district?: string;
}

interface Category {
  id: string;
  name: string;
  nameEn?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  createdAt?: string;
}

interface Availability {
  date: string;
  isAvailable: boolean;
  availableShift: number;
  shiftName: string;
}

interface ShiftPrice {
  categoryId: string;
  categoryName: string;
  shiftType: number;
  shiftTypeName: string;
  pricePerShift: number;
  pricingId: string;
}

interface Provider {
  id: string;
  fullName: string;
  avatarUrl: string;
  categories: Category[];
  location?: Location;
  isAvailable: boolean;
  averageRating: number;
  hourlyRate: number;
  bio?: string;
  workingAreas?: Location[];
  availability?: Availability[];
  shiftPrices?: ShiftPrice[];
  totalReviews?: number;
}

interface ProviderListResponse {
  items: Provider[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface Request {
  id: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  categoryId: string;
  categoryName: string;
  status: number;
  statusName: string;
  totalPrice: number;
  preferredDate: string;
  shiftType: number;
  shiftTypeName: string;
  address: string;
  description?: string;
  createdAt: string;
  acceptedAt?: string;
  canPay: boolean;
  rating?: number;
  rejectionReason?: string;
}

const API_BASE_URL = 'https://elanis.runasp.net/api';

export function UserDashboard({ user, navigate, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchCity, setSearchCity] = useState('');
  const [searchGovernorate, setSearchGovernorate] = useState('');
  const [searchService, setSearchService] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [selectedProviderDetails, setSelectedProviderDetails] = useState<Provider | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingShift, setBookingShift] = useState<number>(1);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [bookingGovernorate, setBookingGovernorate] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedRequestForPayment, setSelectedRequestForPayment] = useState<Request | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRequestForRating, setSelectedRequestForRating] = useState<Request | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [fetchedReview, setFetchedReview] = useState<any | null>(null);
  const [loadingFetchedReview, setLoadingFetchedReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myRatings, setMyRatings] = useState<Review[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user?.avatar);

  // Profile form state
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    setCurrentAvatar(user?.avatar);
    setProfileName(user?.name || '');
    setProfilePhone(user?.phone || '');
    setProfileAddress(user?.address || '');
  }, [user]);

  useEffect(() => {
    fetchCategories();
    fetchUserRequests();
  }, []);

  useEffect(() => {
    if (activeTab === 'caregivers') {
      fetchProviders();
    } else if (activeTab === 'requests') {
      fetchUserRequests();
    }
  }, [activeTab, currentPage]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!selectedRequestForRating) return setFetchedReview(null);
      if (Number(selectedRequestForRating.status) !== 6) {
        setFetchedReview(null);
        return;
      }

      setLoadingFetchedReview(true);
      try {
        const res = await fetchReviewByRequest(selectedRequestForRating.id);
        if (!mounted) return;
        if (res?.succeeded && res.data) {
          setFetchedReview(res.data);
        } else {
          setFetchedReview(null);
        }
      } catch (err) {
        console.error('Failed to fetch review by request', err);
        setFetchedReview(null);
      } finally {
        if (mounted) setLoadingFetchedReview(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [selectedRequestForRating]);

  useEffect(() => {
    let mounted = true;
    if (activeTab !== 'ratings') return;

    const loadRatings = async () => {
      setLoadingRatings(true);
      try {
        const res = await fetchUserReviews();
        if (!mounted) return;
        if (res?.succeeded && res.data) {
          setMyRatings(res.data || []);
        } else {
          setMyRatings([]);
          if (res?.message) toast.error(res.message);
        }
      } catch (err) {
        console.error('Failed to fetch user reviews', err);
        toast.error('Failed to load ratings');
        setMyRatings([]);
      } finally {
        if (mounted) setLoadingRatings(false);
      }
    };

    loadRatings();
    return () => { mounted = false; };
  }, [activeTab]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Category/active`);
      const result = await response.json();

      if (result.succeeded && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUserRequests = async () => {
    setLoadingRequests(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please login to view your requests');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/Requests/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.succeeded && result.data) {
        setMyRequests(result.data || []);
      } else {
        toast.error(result.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to load your requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchGovernorate) params.append('Governorate', searchGovernorate);
      if (searchCity) params.append('City', searchCity);
      if (searchService) params.append('Search', searchService);
      if (selectedCategoryFilter) params.append('CategoryId', selectedCategoryFilter);
      params.append('Page', currentPage.toString());
      params.append('PageSize', '10');

      const response = await fetch(`${API_BASE_URL}/Provider?${params.toString()}`);
      const result = await response.json();

      if (result.succeeded && result.data) {
        setProviders(result.data.items || []);
        setTotalPages(result.data.totalPages || 1);
      } else {
        toast.error(result.message || 'Failed to fetch providers');
      }
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast.error('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderDetails = async (providerId: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/Provider/${providerId}`);
      const result = await response.json();

      if (result.succeeded && result.data) {
        setSelectedProviderDetails(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch provider details');
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      toast.error('Failed to load provider details');
    } finally {
      setLoading(false);
    }
  };

  const getShiftPrice = (shiftType: number) => {
    if (!selectedProviderDetails?.shiftPrices || !selectedCategoryId) return 0;
    const shiftPrice = selectedProviderDetails.shiftPrices.find(
      sp => sp.shiftType === shiftType && sp.categoryId === selectedCategoryId
    );
    return shiftPrice?.pricePerShift || 0;
  };

  const getShiftTypeName = (shiftType: number) => {
    switch (shiftType) {
      case 1: return '3 Hours';
      case 2: return '12 Hours';
      case 3: return 'Full Day';
      default: return 'Unknown';
    }
  };

  const handleSendRequest = async () => {
    if (!selectedProvider || !bookingDate || !bookingTime || !bookingAddress || !bookingGovernorate || !selectedCategoryId) {
      toast.error('Please fill in all booking details');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please login to continue');
      return;
    }

    setLoading(true);
    try {
      const requestData = {
        providerId: selectedProvider.id,
        categoryId: selectedCategoryId,
        shiftType: bookingShift,
        preferredDate: new Date(`${bookingDate}T${bookingTime}`).toISOString(),
        address: bookingAddress,
        governorate: bookingGovernorate,
        description: bookingDescription,
      };

      const response = await fetch(`${API_BASE_URL}/Requests`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.succeeded && result.data) {
        toast.success('Request sent successfully!');
        setShowBookingDialog(false);
        setSelectedProvider(null);
        setSelectedProviderDetails(null);
        setBookingAddress('');
        setBookingGovernorate('');
        setBookingDescription('');
        setActiveTab('requests');
        fetchUserRequests();
      } else {
        toast.error(result.message || 'Failed to send request');
      }
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error('Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedRequestForPayment) return;

    setPaymentLoading(true);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        toast.error('Please login to continue');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/Payments/create-checkout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceRequestId: selectedRequestForPayment.id,
        }),
      });

      const result = await response.json();

      if (result.succeeded && result.data?.checkoutUrl) {
        window.location.href = result.data.checkoutUrl;
      } else {
        toast.error(result.message || 'Failed to create payment session');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleRating = () => {
    if (!selectedRequestForRating) return;
    toast.success('Thank you for your rating!');
    setShowRatingDialog(false);
    setSelectedRequestForRating(null);
  };

  const statusStyles = {
    1: { backgroundColor: '#f3f4f6', color: '#374151', icon: <Clock3 className="status-icon" /> },
    2: { backgroundColor: '#dbeafe', color: '#1e40af', icon: <Clock className="status-icon" /> },
    3: { backgroundColor: '#fef3c7', color: '#92400e', icon: <AlertCircle className="status-icon" /> },
    4: { backgroundColor: '#dcfce7', color: '#166534', icon: <CheckCircle className="status-icon" /> },
    5: { backgroundColor: '#ecfdf5', color: '#047857', icon: <Award className="status-icon" /> },
    6: { backgroundColor: '#faf5ff', color: '#7c3aed', icon: <CheckCircle className="status-icon" /> },
    7: { backgroundColor: '#fef2f2', color: '#dc2626', icon: <AlertCircle className="status-icon" /> },
    8: { backgroundColor: '#fef2f2', color: '#dc2626', icon: <AlertCircle className="status-icon" /> },
  };

  const getStatusBadge = (status: number, statusName: string) => {
    const style = statusStyles[status] || {
      backgroundColor: '#f3f4f6',
      color: '#374151',
      icon: <AlertCircle className="status-icon" />
    };

    return (
      <div className="status-badge" style={{ backgroundColor: style.backgroundColor, color: style.color }}>
        {style.icon}
        <span>{statusName}</span>
      </div>
    );
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProviders();
  };

  const getStatusCounts = () => {
    return {
      total: myRequests.length,
      pending: myRequests.filter(r => r.status === 1).length,
      accepted: myRequests.filter(r => r.status === 2).length,
      completed: myRequests.filter(r => r.status === 6).length,
      cancelled: myRequests.filter(r => r.status === 7 || r.status === 8).length,
    };
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (e.g., max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please login to update profile picture');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${API_BASE_URL}/User/profile-picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('Profile picture updated successfully');

        // Update local state to show new image immediately
        const newAvatarUrl = URL.createObjectURL(file);
        setCurrentAvatar(newAvatarUrl);

        // Update localStorage to persist changes on reload
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // If the backend returns the new URL, use it. Otherwise, we can't really persist the blob URL.
          // However, typically the backend SHOULD return the new URL.
          // Let's assume result.data contains the URL if it's a string, or we might need to fetch the profile again.
          // For now, if result.data is the URL:
          if (result.data && typeof result.data === 'string') {
            parsedUser.avatar = result.data;
            localStorage.setItem('currentUser', JSON.stringify(parsedUser));
            setCurrentAvatar(result.data); // Use the real URL
          } else {
            // If backend doesn't return URL, we should probably fetch the profile to get it.
            // But for now, let's try to fetch the profile to be sure.
            // Or just warn the user if we can't persist.
            // Actually, let's try to fetch the updated profile.
            fetchUserProfile();
          }
        }
      } else {
        toast.error(result.message || 'Failed to update profile picture');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  const fetchUserProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      const response = await fetch(`${API_BASE_URL}/User/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.succeeded && result.data) {
        const updatedUser = result.data;
        // Update localStorage
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          const mergedUser = { ...parsedUser, ...updatedUser };
          // Ensure avatar is mapped correctly if the API returns 'profilePicture' instead of 'avatar'
          if (updatedUser.profilePicture) mergedUser.avatar = updatedUser.profilePicture;

          localStorage.setItem('currentUser', JSON.stringify(mergedUser));

          // Update local state
          if (updatedUser.profilePicture) setCurrentAvatar(updatedUser.profilePicture);
          if (updatedUser.name) setProfileName(updatedUser.name);
          if (updatedUser.phoneNumber) setProfilePhone(updatedUser.phoneNumber);
          if (updatedUser.address) setProfileAddress(updatedUser.address);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleSaveChanges = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Please login to save changes');
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/User/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: profileName.split(' ')[0], // Simple split, backend might expect separate fields
          lastName: profileName.split(' ').slice(1).join(' ') || '',
          phoneNumber: profilePhone,
          address: profileAddress,
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('Profile updated successfully');
        // Update localStorage
        fetchUserProfile(); // Fetch fresh data to ensure consistency
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="user-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-brand">
            <div className="brand-logo">
              <span className="logo-text">ElAnis Care</span>
            </div>
          </div>
          <div className="header-user">
            <div className="user-info">
              <ImageWithFallback
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt={user?.name || 'User'}
                className="user-avatar"
              />
              <div className="user-details">
                <p className="user-name">Welcome, {user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="logout-button"
              title="Logout"
            >
              <LogOut className="logout-icon" />
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-layout">
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-menu">
              <button
                onClick={() => setActiveTab('home')}
                className={`menu-item ${activeTab === 'home' ? 'menu-item-active' : ''}`}
              >
                <Home className="menu-icon" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`menu-item ${activeTab === 'profile' ? 'menu-item-active' : ''}`}
              >
                <UserCircle className="menu-icon" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('caregivers')}
                className={`menu-item ${activeTab === 'caregivers' ? 'menu-item-active' : ''}`}
              >
                <Users className="menu-icon" />
                <span>Caregivers</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`menu-item ${activeTab === 'requests' ? 'menu-item-active' : ''}`}
              >
                <FileText className="menu-icon" />
                <span>My Requests</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`menu-item ${activeTab === 'payments' ? 'menu-item-active' : ''}`}
              >
                <CreditCard className="menu-icon" />
                <span>Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`menu-item ${activeTab === 'ratings' ? 'menu-item-active' : ''}`}
              >
                <Star className="menu-icon" />
                <span>Ratings</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="dashboard-content">
            {activeTab === 'home' && (
              <div className="dashboard-overview">
                <div className="welcome-card">
                  <div className="welcome-content">
                    <h3 className="welcome-title">Welcome back, {user?.name}!</h3>
                    <p className="welcome-subtitle">Here's what's happening with your care requests today.</p>
                  </div>
                  <div className="welcome-stats">
                    <div className="stat-item">
                      <div className="stat-icon total">
                        <FileText className="icon" />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{getStatusCounts().total}</span>
                        <span className="stat-label">Total Requests</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon pending">
                        <Clock3 className="icon" />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{getStatusCounts().pending}</span>
                        <span className="stat-label">Pending</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon completed">
                        <CheckCircle className="icon" />
                      </div>
                      <div className="stat-info">
                        <span className="stat-value">{getStatusCounts().completed}</span>
                        <span className="stat-label">Completed</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="quick-actions-card">
                  <h3 className="card-title">Quick Actions</h3>
                  <div className="actions-grid">
                    <button
                      onClick={() => setActiveTab('caregivers')}
                      className="action-card primary"
                    >
                      <Users className="action-icon" />
                      <span className="action-title">Find a Caregiver</span>
                      <span className="action-description">Browse and book qualified caregivers</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="action-card secondary"
                    >
                      <FileText className="action-icon" />
                      <span className="action-title">View My Requests</span>
                      <span className="action-description">Check status of your bookings</span>
                    </button>
                  </div>
                </div>

                <div className="recent-activity-card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="view-all-button"
                    >
                      View All
                    </button>
                  </div>
                  <div className="activity-list">
                    {myRequests.slice(0, 5).map(request => (
                      <div key={request.id} className="activity-item">
                        <ImageWithFallback
                          src={request.providerAvatar}
                          alt={request.providerName}
                          className="activity-avatar"
                        />
                        <div className="activity-content">
                          <p className="activity-title">Request with {request.providerName}</p>
                          <p className="activity-date">{new Date(request.preferredDate).toLocaleDateString()}</p>
                        </div>
                        {getStatusBadge(request.status, request.statusName)}
                      </div>
                    ))}
                    {myRequests.length === 0 && (
                      <div className="empty-state">
                        <FileText className="empty-icon" />
                        <p className="empty-text">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="profile-card">
                <h3 className="card-title">My Profile</h3>
                <div className="profile-content">
                  <div className="profile-header">
                    <div className="profile-avatar-container" style={{ position: 'relative', display: 'inline-block' }}>
                      <ImageWithFallback
                        src={currentAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                        alt={user?.name || 'User'}
                        className="profile-avatar"
                      />
                      <label
                        htmlFor="profile-upload"
                        className="profile-upload-button"
                        style={{
                          position: 'absolute',
                          bottom: '0',
                          right: '0',
                          backgroundColor: '#f97316', // Orange-500
                          color: 'white',
                          borderRadius: '50%',
                          padding: '8px',
                          cursor: 'pointer',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s'
                        }}
                        title="Change Profile Picture"
                      >
                        {isUploading ? (
                          <Loader2 className="w-4 h-4 animate-spin" size={16} />
                        ) : (
                          <Edit className="w-4 h-4" size={16} />
                        )}
                        <input
                          id="profile-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                    <div className="profile-info">
                      <h4 className="profile-name">{user?.name}</h4>
                      <p className="profile-email">{user?.email}</p>
                      <div className="profile-badge">Verified User</div>
                    </div>
                  </div>

                  <div className="profile-form">
                    <div className="form-grid">
                      <div className="form-field">
                        <label className="field-label">
                          <UserCircle className="field-icon" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-label">
                          <Mail className="field-icon" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          className="form-input"
                          disabled
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-label">
                          <Phone className="field-icon" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-field">
                        <label className="field-label">
                          <Map className="field-icon" />
                          Address
                        </label>
                        <input
                          type="text"
                          value={profileAddress}
                          onChange={(e) => setProfileAddress(e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                    <button
                      className="save-button"
                      onClick={handleSaveChanges}
                      disabled={isSavingProfile}
                    >
                      {isSavingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'caregivers' && (
              <div className="caregivers-section">
                <div className="search-card">
                  <h3 className="card-title">Find Caregivers</h3>
                  <div className="search-grid">
                    <div className="search-field">
                      <MapPin className="search-icon" />
                      <input
                        type="text"
                        placeholder="Governorate..."
                        value={searchGovernorate}
                        onChange={(e) => setSearchGovernorate(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <div className="search-field">
                      <MapPin className="search-icon" />
                      <input
                        type="text"
                        placeholder="City..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="search-input"
                      />
                    </div>
                    <div className="search-field">
                      <Filter className="search-icon" />
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="search-select"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="search-actions">
                    <div className="search-field full-width">
                      <Search className="search-icon" />
                      <input
                        type="text"
                        placeholder="Search by name, specialty..."
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="search-input"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="search-button"
                    >
                      {loading ? <Loader2 className="button-loader" /> : <Search className="button-icon" />}
                      Search
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading-container">
                    <Loader2 className="loading-spinner" />
                    <p className="loading-text">Finding the best caregivers...</p>
                  </div>
                ) : (
                  <>
                    <div className="providers-grid">
                      {providers.map(provider => (
                        <div key={provider.id} className="provider-card">
                          <div className="provider-header">
                            <ImageWithFallback
                              src={provider.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + provider.fullName}
                              alt={provider.fullName}
                              className="provider-avatar"
                            />
                            <div className="provider-info">
                              <h4 className="provider-name">{provider.fullName}</h4>
                              <p className="provider-categories">{provider.categories.map(c => c.name).join(', ')}</p>
                              <div className="provider-rating">
                                <div className="rating-stars">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`star-icon ${i < Math.floor(provider.averageRating) ? 'star-filled' : 'star-empty'
                                        }`}
                                    />
                                  ))}
                                </div>
                                <span className="rating-text">
                                  {provider.averageRating.toFixed(1)} ({provider.totalReviews || 0} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="provider-meta">
                              <div className="provider-rate">${provider.hourlyRate}/hr</div>
                              {provider.isAvailable && (
                                <div className="availability-badge">Available</div>
                              )}
                            </div>
                          </div>
                          <div className="provider-location">
                            <MapPin className="location-icon" />
                            {provider.location && (
                              <span>{provider.location.city}, {provider.location.governorate}</span>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              setSelectedProvider(provider);
                              await fetchProviderDetails(provider.id);
                            }}
                            className="view-profile-button"
                          >
                            View Profile
                          </button>
                        </div>
                      ))}
                    </div>
                    {providers.length === 0 && !loading && (
                      <div className="empty-results">
                        <Users className="empty-icon" />
                        <p className="empty-title">No providers found</p>
                        <p className="empty-description">Try adjusting your search filters or search in a different area.</p>
                      </div>
                    )}
                    {totalPages > 1 && (
                      <div className="pagination">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1 || loading}
                          className="pagination-button prev"
                        >
                          Previous
                        </button>
                        <span className="pagination-info">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages || loading}
                          className="pagination-button next"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="requests-card">
                <div className="card-header">
                  <h3 className="card-title">My Requests</h3>
                  <button
                    onClick={fetchUserRequests}
                    disabled={loadingRequests}
                    className="refresh-button"
                  >
                    {loadingRequests ? <Loader2 className="button-loader" /> : null}
                    Refresh
                  </button>
                </div>
                {loadingRequests ? (
                  <div className="loading-container">
                    <Loader2 className="loading-spinner" />
                    <p className="loading-text">Loading your requests...</p>
                  </div>
                ) : (
                  <div className="requests-list">
                    {myRequests.map(request => (
                      <div key={request.id} className="request-card">
                        <div className="request-header">
                          <div className="request-provider">
                            <ImageWithFallback
                              src={request.providerAvatar}
                              alt={request.providerName}
                              className="provider-avatar"
                            />
                            <div className="provider-details">
                              <h4 className="provider-name">{request.providerName}</h4>
                              <p className="service-category">{request.categoryName}</p>
                            </div>
                          </div>
                          {getStatusBadge(request.status, request.statusName)}
                        </div>
                        <div className="request-details">
                          <div className="detail-grid">
                            <div className="detail-item">
                              <CalendarDays className="detail-icon" />
                              <span>{new Date(request.preferredDate).toLocaleDateString()}</span>
                            </div>
                            <div className="detail-item">
                              <Clock className="detail-icon" />
                              <span>{new Date(request.preferredDate).toLocaleTimeString()}</span>
                            </div>
                            <div className="detail-item">
                              <Clock3 className="detail-icon" />
                              <span>{request.shiftTypeName}</span>
                            </div>
                            <div className="detail-item">
                              <DollarSign className="detail-icon" />
                              <span>${request.totalPrice}</span>
                            </div>
                          </div>
                          {request.description && (
                            <div className="request-description">
                              <p className="description-text">{request.description}</p>
                            </div>
                          )}
                          {request.rejectionReason && (
                            <div className="rejection-notice">
                              <AlertCircle className="rejection-icon" />
                              <p className="rejection-text">{request.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                        <div className="request-actions">
                          {request.canPay && (
                            <button
                              onClick={() => {
                                setSelectedRequestForPayment(request);
                                setShowPaymentDialog(true);
                              }}
                              className="action-button primary"
                            >
                              Pay Now
                            </button>
                          )}
                          {request.status === 6 && (
                            <button
                              onClick={() => {
                                setSelectedRequestForRating(request);
                                setShowRatingDialog(true);
                              }}
                              className="action-button secondary"
                            >
                              Rate Service
                            </button>
                          )}
                          {request.rating && (
                            <div className="user-rating">
                              <span className="rating-label">Your rating:</span>
                              <div className="rating-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`star-icon ${i < request.rating! ? 'star-filled' : 'star-empty'}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {myRequests.length === 0 && (
                      <div className="empty-state">
                        <FileText className="empty-icon" />
                        <p className="empty-title">No requests yet</p>
                        <p className="empty-description">Start by finding a caregiver and sending your first request.</p>
                        <button
                          onClick={() => setActiveTab('caregivers')}
                          className="empty-action"
                        >
                          Find Caregivers
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="payments-card">
                <h3 className="card-title">Payment History</h3>
                <div className="payments-list">
                  {myRequests
                    .filter(r => r.status === 3 || r.status === 4 || r.status === 5 || r.status === 6)
                    .map(request => (
                      <div key={request.id} className="payment-item">
                        <div className="payment-icon">
                          <CreditCard className="icon" />
                        </div>
                        <div className="payment-details">
                          <p className="payment-service">{request.categoryName}</p>
                          <p className="payment-provider">{request.providerName}</p>
                          <p className="payment-date">{new Date(request.preferredDate).toLocaleDateString()}</p>
                        </div>
                        <div className="payment-amount">${request.totalPrice}</div>
                      </div>
                    ))}
                  {myRequests.filter(r => r.status === 3 || r.status === 4 || r.status === 5 || r.status === 6).length === 0 && (
                    <div className="empty-state">
                      <CreditCard className="empty-icon" />
                      <p className="empty-title">No payment history</p>
                      <p className="empty-description">Your completed payments will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="ratings-card">
                <h3 className="card-title">My Ratings</h3>
                <div className="ratings-content">
                  {loadingRatings ? (
                    <div className="loading-container">
                      <Loader2 className="loading-spinner" />
                      <p className="loading-text">Loading your ratings...</p>
                    </div>
                  ) : (
                    <div className="ratings-list">
                      {myRatings.length > 0 ? (
                        myRatings.map((rev) => (
                          <div key={rev.id} className="rating-item">
                            <div className="rating-header">
                              <ImageWithFallback
                                src={rev.clientAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(rev.clientName)}
                                alt={rev.clientName}
                                className="rating-avatar"
                              />
                              <div className="rating-info">
                                <p className="rating-name">{rev.providerName || rev.clientName}</p>
                                <p className="rating-date">{new Date(rev.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="rating-stars">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`star-icon ${i < rev.rating ? 'star-filled' : 'star-empty'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            {rev.comment && (
                              <div className="rating-comment">
                                <p className="comment-text">{rev.comment}</p>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="empty-state">
                          <Star className="empty-icon" />
                          <p className="empty-title">No ratings yet</p>
                          <p className="empty-description">Your ratings for completed services will appear here.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Profile Modal */}
      {selectedProvider && !showBookingDialog && (
        <div className="modal-overlay">
          <div className="modal-content provider-dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Provider Profile</h2>
              <p className="dialog-description">View detailed information about this provider</p>
              <button
                onClick={() => {
                  setSelectedProvider(null);
                  setSelectedProviderDetails(null);
                }}
                className="close-button"
              >
                <X className="close-icon" />
              </button>
            </div>

            {selectedProviderDetails && (
              <div className="provider-dialog-content">
                <div className="provider-summary">
                  <ImageWithFallback
                    src={selectedProviderDetails.avatarUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + selectedProviderDetails.fullName}
                    alt={selectedProviderDetails.fullName}
                    className="provider-dialog-avatar"
                  />
                  <div className="provider-dialog-info">
                    <h3 className="provider-dialog-name">{selectedProviderDetails.fullName}</h3>
                    <p className="provider-dialog-categories">
                      {selectedProviderDetails.categories.map((c) => c.name).join(", ")}
                    </p>
                    <div className="provider-dialog-rating">
                      <div className="rating-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`star-icon ${i < Math.floor(selectedProviderDetails.averageRating) ? 'star-filled' : 'star-empty'
                              }`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">
                        {selectedProviderDetails.averageRating.toFixed(1)} ({selectedProviderDetails.totalReviews || 0} reviews)
                      </span>
                    </div>
                  </div>
                  <div className="provider-dialog-meta">
                    <div className="provider-rate">${selectedProviderDetails.hourlyRate}/hr</div>
                    {selectedProviderDetails.isAvailable && (
                      <div className="availability-badge">Available</div>
                    )}
                  </div>
                </div>

                {selectedProviderDetails.bio && (
                  <div className="provider-section">
                    <h4 className="section-title">About</h4>
                    <p className="section-content">{selectedProviderDetails.bio}</p>
                  </div>
                )}

                {selectedProviderDetails?.workingAreas?.length > 0 && (
                  <div className="provider-section">
                    <h4 className="section-title">Working Areas</h4>
                    <div className="areas-grid">
                      {selectedProviderDetails?.workingAreas?.map((area, idx) => (
                        <div key={idx} className="area-tag">
                          <MapPin className="area-icon" />
                          {area.city}, {area.governorate}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProviderDetails?.shiftPrices?.length > 0 && (
                  <div className="provider-section">
                    <h4 className="section-title">Service Pricing</h4>
                    <div className="pricing-grid">
                      {selectedProviderDetails?.shiftPrices?.map((sp, idx) => (
                        <div key={idx} className="pricing-item">
                          <div className="pricing-info">
                            <span className="pricing-category">{sp?.categoryName}</span>
                            <span className="pricing-shift">{sp?.shiftTypeName}</span>
                          </div>
                          <span className="pricing-amount">${sp?.pricePerShift}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProviderDetails?.availability?.length > 0 && (
                  <div className="provider-section">
                    <h4 className="section-title">Availability</h4>
                    <div className="availability-list">
                      {selectedProviderDetails?.availability?.slice(0, 5).map((avail, idx) => (
                        <div key={idx} className="availability-item">
                          <Calendar className="availability-icon" />
                          <span className="availability-date">
                            {new Date(avail.date).toLocaleDateString()}
                          </span>
                          <div className={`availability-status ${avail.isAvailable ? 'available' : 'unavailable'}`}>
                            {avail.shiftName}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setShowBookingDialog(true)}
                  className="book-service-button"
                >
                  Book Service
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingDialog && (
        <div className="modal-overlay">
          <div className="modal-content booking-dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Book Service</h2>
              <p className="dialog-description">Select your preferred shift type, date, and time</p>
              <button
                onClick={() => setShowBookingDialog(false)}
                className="close-button"
              >
                <X className="close-icon" />
              </button>
            </div>

            {selectedProviderDetails && selectedProvider && (
              <div className="booking-content">
                <div className="booking-provider">
                  <ImageWithFallback
                    src={selectedProviderDetails.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedProviderDetails.fullName}
                    alt={selectedProviderDetails.fullName}
                    className="booking-avatar"
                  />
                  <div className="booking-provider-info">
                    <p className="booking-provider-name">{selectedProviderDetails.fullName}</p>
                    <p className="booking-provider-categories">{selectedProviderDetails.categories.map(c => c.name).join(', ')}</p>
                  </div>
                </div>

                <div className="booking-form">
                  <div className="form-field">
                    <label className="field-label">Select Category</label>
                    <select
                      value={selectedCategoryId}
                      onChange={(e) => setSelectedCategoryId(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Choose a category...</option>
                      {selectedProviderDetails.categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  {selectedCategoryId && selectedProviderDetails.shiftPrices && (
                    <div className="form-field">
                      <label className="field-label">Select Shift Type</label>
                      <div className="shift-grid">
                        {selectedProviderDetails.shiftPrices
                          .filter(sp => sp.categoryId === selectedCategoryId)
                          .map(sp => (
                            <button
                              key={sp.pricingId}
                              onClick={() => setBookingShift(sp.shiftType)}
                              className={`shift-option ${bookingShift === sp.shiftType ? 'shift-option-active' : ''}`}
                            >
                              <span className="shift-name">{sp.shiftTypeName}</span>
                              <span className="shift-price">${sp.pricePerShift}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-field">
                      <label className="field-label">Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="form-input"
                      />
                    </div>
                    <div className="form-field">
                      <label className="field-label">Time</label>
                      <input
                        type="time"
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Address</label>
                    <input
                      type="text"
                      value={bookingAddress}
                      onChange={(e) => setBookingAddress(e.target.value)}
                      placeholder="Enter your address"
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Governorate</label>
                    <input
                      type="text"
                      value={bookingGovernorate}
                      onChange={(e) => setBookingGovernorate(e.target.value)}
                      placeholder="Enter governorate"
                      className="form-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Description (Optional)</label>
                    <textarea
                      value={bookingDescription}
                      onChange={(e) => setBookingDescription(e.target.value)}
                      placeholder="Add any special instructions or requirements"
                      rows={3}
                      className="form-textarea"
                    />
                  </div>

                  {selectedCategoryId && (
                    <div className="booking-summary">
                      <div className="summary-item">
                        <span className="summary-label">Shift Type:</span>
                        <span className="summary-value">{getShiftTypeName(bookingShift)}</span>
                      </div>
                      <div className="summary-item total">
                        <span className="summary-label">Total Price:</span>
                        <span className="summary-value">${getShiftPrice(bookingShift)}</span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSendRequest}
                    disabled={loading || !selectedCategoryId}
                    className="confirm-booking-button"
                  >
                    {loading && <Loader2 className="button-loader" />}
                    Confirm Request
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentDialog && (
        <div className="modal-overlay">
          <div className="modal-content payment-dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Payment</h2>
              <p className="dialog-description">You will be redirected to Stripe to complete your payment</p>
              <button
                onClick={() => setShowPaymentDialog(false)}
                className="close-button"
              >
                <X className="close-icon" />
              </button>
            </div>

            {selectedRequestForPayment && (
              <div className="payment-content">
                <div className="payment-amount-card">
                  <p className="amount-label">Amount to pay</p>
                  <p className="amount-value">${selectedRequestForPayment.totalPrice}</p>
                </div>

                <div className="payment-security">
                  <p className="security-text">
                    🔒 Secure payment powered by Stripe. You'll be redirected to complete your payment securely.
                  </p>
                </div>

                <div className="payment-details">
                  <div className="detail-item">
                    <span className="detail-label">Service:</span>
                    <span className="detail-value">{selectedRequestForPayment.categoryName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Provider:</span>
                    <span className="detail-value">{selectedRequestForPayment.providerName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">{new Date(selectedRequestForPayment.preferredDate).toLocaleDateString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Shift:</span>
                    <span className="detail-value">{selectedRequestForPayment.shiftTypeName}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={paymentLoading}
                  className="proceed-payment-button"
                >
                  {paymentLoading ? (
                    <>
                      <Loader2 className="button-loader" />
                      Processing...
                    </>
                  ) : (
                    `Proceed to Payment - $${selectedRequestForPayment.totalPrice}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Rating Modal */}
      {showRatingDialog && (
        <div className="modal-overlay">
          <div className="modal-content rating-dialog">
            <div className="dialog-header">
              <h2 className="dialog-title">Rate Your Experience</h2>
              <p className="dialog-description">Share your feedback about the service</p>
              <button
                onClick={() => setShowRatingDialog(false)}
                className="close-button"
              >
                <X className="close-icon" />
              </button>
            </div>

            {selectedRequestForRating && (
              <div className="rating-content">
                <div className="rating-header">
                  <ImageWithFallback
                    src={selectedRequestForRating.providerAvatar}
                    alt={selectedRequestForRating.providerName}
                    className="rating-provider-avatar"
                  />
                  <p className="rating-provider-name">{selectedRequestForRating.providerName}</p>
                  <p className="rating-service-date">{new Date(selectedRequestForRating.preferredDate).toLocaleDateString()}</p>
                </div>

                {loadingFetchedReview ? (
                  <div className="loading-review">
                    <Loader2 className="loading-spinner" />
                    <p>Loading review...</p>
                  </div>
                ) : Number(selectedRequestForRating.status) === 6 ? (
                  fetchedReview ? (
                    <SubmittedReview review={fetchedReview} />
                  ) : (
                    <ReviewForm
                      serviceRequestId={selectedRequestForRating.id}
                      onSuccess={(r) => setFetchedReview(r)}
                      onClose={() => setShowRatingDialog(false)}
                    />
                  )
                ) : (
                  <div className="rating-notice">
                    <Clock3 className="notice-icon" />
                    <p className="notice-text">You can leave a review only after the service is completed.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}