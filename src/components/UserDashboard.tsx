import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Users, FileText, CreditCard, Star, LogOut,
  Search, MapPin, Clock, Filter, ChevronRight, X, Calendar, DollarSign, Loader2
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import ReviewForm from './reviews/ReviewForm';
import SubmittedReview from './reviews/SubmittedReview';
import { fetchReviewByRequest, fetchUserReviews, Review } from '../api/reviews';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

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
  // Ratings (loaded from API)
  const [myRatings, setMyRatings] = useState<Review[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(false);

  useEffect(() => {
    fetchCategories();
    // Fetch user requests on initial load for dashboard stats
    fetchUserRequests();
  }, []);

  useEffect(() => {
    if (activeTab === 'caregivers') {
      fetchProviders();
    } else if (activeTab === 'requests') {
      fetchUserRequests();
    }
  }, [activeTab, currentPage]);

  // Load the existing review for a selected request if it's completed
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!selectedRequestForRating) return setFetchedReview(null);
      // Only fetch review when request is completed
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

  // Load user ratings when the Ratings tab is active
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
          // Only show an error if message exists
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
        // Refresh requests list
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
        // Redirect to Stripe Checkout
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

    // TODO: Implement actual rating API call
    toast.success('Thank you for your rating!');
    setShowRatingDialog(false);
    setSelectedRequestForRating(null);
  };

const statusStyles = {
  1: { backgroundColor: '#F3F4F6', color: '#111827' },
  2: { backgroundColor: '#3B82F6', color: '#FFFFFF' },
  3: { backgroundColor: '#EF4444', color: '#FFFFFF' },
  4: { backgroundColor: '#10B981', color: '#FFFFFF' },
  5: { backgroundColor: '#F59E0B', color: '#111827' },
  6: { backgroundColor: '#8B5CF6', color: '#FFFFFF' },
  7: { backgroundColor: '#F97316', color: '#FFFFFF' },
  8: { backgroundColor: '#EC4899', color: '#FFFFFF' },
};

const getStatusBadge = (status: number, statusName: string) => {
  const style = statusStyles[status] || {
    backgroundColor: '#E5E7EB',
    color: '#111827',
  };

  return (
    <Badge
      style={{
        ...style,
        padding: "4px 8px",
        borderRadius: "6px",
        fontSize: "12px",
        fontWeight: 600,
      }}
    >
      {statusName}
    </Badge>
  );
};
  const handleSearch = () => {
    setCurrentPage(1);
    fetchProviders();
  };


  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-gray-900">CarePro</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt={user?.name || 'User'}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-900">Welcome, {user?.name}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-4 space-y-2">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'home' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('caregivers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'caregivers' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Caregivers</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'requests' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>My Requests</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'payments' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('ratings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'ratings' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5" />
                <span>Ratings</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Dashboard Overview</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-[#E3F2FD] p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Total Requests</p>
                      <p className="text-3xl text-gray-900">{myRequests.length}</p>
                    </div>
                    <div className="bg-[#E3F2FD] p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Completed</p>
                      <p className="text-3xl text-gray-900">
                        {myRequests.filter(r => r.status === 5).length}
                      </p>
                    </div>
                    <div className="bg-[#E3F2FD] p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Pending</p>
                      <p className="text-3xl text-gray-900">
                        {myRequests.filter(r => r.status === 1).length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Quick Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setActiveTab('caregivers')}
                      className="p-4 border-2 border-[#FFA726] text-[#FFA726] rounded-lg hover:bg-[#FFA726] hover:text-white transition-all"
                    >
                      Find a Caregiver
                    </button>
                    <button
                      onClick={() => setActiveTab('requests')}
                      className="p-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#FFA726] hover:text-[#FFA726] transition-all"
                    >
                      View My Requests
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Recent Activity</h3>
                  {myRequests.slice(0, 3).map(request => (
                    <div key={request.id} className="flex items-center gap-4 p-3 border-b last:border-b-0">
                      <ImageWithFallback
                        src={request.providerAvatar}
                        alt={request.providerName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-gray-900">{request.providerName}</p>
                        <p className="text-sm text-gray-500">{new Date(request.preferredDate).toLocaleString()}</p>
                      </div>
                      {getStatusBadge(request.status, request.statusName)}
                    </div>
                  ))}
                  {myRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No recent activity</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Profile</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <ImageWithFallback
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                      alt={user?.name || 'User'}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h4 className="text-gray-900">{user?.name}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        defaultValue={user?.address}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'caregivers' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Find Caregivers</h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Governorate..."
                        value={searchGovernorate}
                        onChange={(e) => setSearchGovernorate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="City..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none appearance-none bg-white"
                      >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <button 
                      onClick={handleSearch}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                      Search
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFA726]" />
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6">
                      {providers.map(provider => (
                        <div key={provider.id} className="bg-white rounded-xl shadow-md p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <ImageWithFallback
                              src={provider.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + provider.fullName}
                              alt={provider.fullName}
                              className="w-16 h-16 rounded-full"
                            />
                            <div className="flex-1">
                              <h4 className="text-gray-900">{provider.fullName}</h4>
                              <p className="text-sm text-gray-600">{provider.categories.map(c => c.name).join(', ')}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm">{provider.averageRating.toFixed(1)}</span>
                                </div>
                                {provider.totalReviews !== undefined && (
                                  <span className="text-sm text-gray-500">({provider.totalReviews} reviews)</span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gray-900">${provider.hourlyRate}/hr</p>
                              {provider.isAvailable && (
                                <Badge variant="default" className="mt-1">Available</Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            {provider.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {provider.location.city}, {provider.location.governorate}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={async () => {
                              setSelectedProvider(provider);
                              await fetchProviderDetails(provider.id);
                            }}
                            className="w-full py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                          >
                            View Profile
                          </button>
                        </div>
                      ))}
                    </div>
                    {providers.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <p className="text-gray-500">No providers found. Try adjusting your search filters.</p>
                      </div>
                    )}
                    {totalPages > 1 && (
                      <div className="flex justify-center gap-2 mt-6">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1 || loading}
                          className="px-4 py-2 border-2 border-[#FFA726] text-[#FFA726] rounded-lg hover:bg-[#FFA726] hover:text-white disabled:opacity-50 transition-colors"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2 text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages || loading}
                          className="px-4 py-2 border-2 border-[#FFA726] text-[#FFA726] rounded-lg hover:bg-[#FFA726] hover:text-white disabled:opacity-50 transition-colors"
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
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">My Requests</h3>
                  <button
                    onClick={fetchUserRequests}
                    disabled={loadingRequests}
                    className="px-4 py-2 text-sm bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {loadingRequests ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    Refresh
                  </button>
                </div>
                {loadingRequests ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FFA726]" />
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {myRequests.map(request => (
                    <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={request.providerAvatar}
                          alt={request.providerName}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-900">{request.providerName}</h4>
                            {getStatusBadge(request.status, request.statusName)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <p>Date: {new Date(request.preferredDate).toLocaleDateString()}</p>
                            <p>Time: {new Date(request.preferredDate).toLocaleTimeString()}</p>
                            <p>Shift: {request.shiftTypeName}</p>
                            <p>Price: ${request.totalPrice}</p>
                            <p>Category: {request.categoryName}</p>
                            <p>Address: {request.address}</p>
                          </div>
                          {request.description && (
                            <div className="bg-gray-50 border border-gray-200 rounded p-2 mb-2">
                              <p className="text-sm text-gray-700">
                                <strong>Description:</strong> {request.description}
                              </p>
                            </div>
                          )}
                          {request.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {request.rejectionReason}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {request.canPay && (
                              <button
                                onClick={() => {
                                  setSelectedRequestForPayment(request);
                                  setShowPaymentDialog(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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
                                className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                              >
                                Rate Service
                              </button>
                            )}
                            {request.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">Your rating:</span>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < request.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                    {myRequests.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No requests yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Payment History</h3>
                <div className="space-y-3">
                  {myRequests
                    .filter(r => r.status === 3 || r.status === 4 || r.status === 5)
                    .map(request => (
                      <div key={request.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-900">{request.providerName}</p>
                            <p className="text-sm text-gray-500">{new Date(request.preferredDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <p className="text-gray-900">${request.totalPrice}</p>
                      </div>
                    ))}
                  {myRequests.filter(r => r.status === 3 || r.status === 4 || r.status === 5).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No payment history</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Ratings</h3>
                <div>
                  {loadingRatings ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-[#FFA726]" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myRatings.length > 0 ? (
                        myRatings.map((rev) => (
                          <div key={rev.id} className="border-2 border-gray-200 rounded-lg p-4">
                            <div className="flex items-center gap-4 mb-3">
                              <ImageWithFallback
                                src={rev.clientAvatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(rev.clientName)}
                                alt={rev.clientName}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className="flex-1">
                                <p className="text-gray-900">{rev.providerName || rev.clientName}</p>
                                <p className="text-sm text-gray-500">{new Date(rev.createdAt).toLocaleDateString()}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${i < rev.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            {rev.comment && <p className="text-gray-700">{rev.comment}</p>}
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">No ratings yet</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

 {/* Provider Profile Dialog */}
<Dialog
  open={!!selectedProvider && !showBookingDialog}
  onOpenChange={() => {
    setSelectedProvider(null);
    setSelectedProviderDetails(null);
  }}
>
  <DialogContent
    className="max-w-2xl max-h-[95vh] flex flex-col p-0" // ✅ شلنا overflow-hidden وضبطنا max-height
  >
    {selectedProviderDetails && (
      <>
        {/* الهيدر */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Provider Profile</DialogTitle>
          <DialogDescription>
            View detailed information about this provider
          </DialogDescription>
        </DialogHeader>

        {/* منطقة التمرير */}
        <div
          className="space-y-6 overflow-y-auto px-6 pb-6"
          style={{
            maxHeight: "calc(95vh - 140px)", // ✅ زي البوكينج بالضبط
            overflowY: "auto",
          }}
        >
          <div className="flex items-start gap-4">
            <ImageWithFallback
              src={
                selectedProviderDetails.avatarUrl ||
                "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                  selectedProviderDetails.fullName
              }
              alt={selectedProviderDetails.fullName}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-gray-900">
                {selectedProviderDetails.fullName}
              </h3>
              <p className="text-gray-600">
                {selectedProviderDetails.categories
                  .map((c) => c.name)
                  .join(", ")}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedProviderDetails.averageRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span>
                  {selectedProviderDetails.averageRating.toFixed(1)} (
                  {selectedProviderDetails.totalReviews || 0} reviews)
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl text-gray-900">
                ${selectedProviderDetails.hourlyRate}
              </p>
              <p className="text-sm text-gray-600">per hour</p>
              {selectedProviderDetails.isAvailable && (
                <Badge variant="default" className="mt-2">
                  Available
                </Badge>
              )}
            </div>
          </div>

          {/* باقي الأقسام */}
          {selectedProviderDetails.bio && (
            <div>
              <h4 className="mb-2 text-gray-900">About</h4>
              <p className="text-gray-600">{selectedProviderDetails.bio}</p>
            </div>
          )}

          {selectedProviderDetails.workingAreas?.length > 0 && (
            <div>
              <h4 className="mb-2 text-gray-900">Working Areas</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProviderDetails.workingAreas.map((area, idx) => (
                  <Badge key={idx} variant="secondary">
                    {area.city}, {area.governorate}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {selectedProviderDetails.shiftPrices?.length > 0 && (
            <div>
              <h4 className="mb-2 text-gray-900">Service Pricing</h4>
              <div className="space-y-2">
                {selectedProviderDetails.shiftPrices.map((sp, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm">
                      {sp.categoryName} - {sp.shiftTypeName}
                    </span>
                    <span className="text-gray-900">${sp.pricePerShift}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedProviderDetails.availability?.length > 0 && (
            <div>
              <h4 className="mb-2 text-gray-900">Availability</h4>
              <div className="space-y-2">
                {selectedProviderDetails.availability
                  .slice(0, 5)
                  .map((avail, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">
                        {new Date(avail.date).toLocaleDateString()}
                      </span>
                      <Badge
                        variant={
                          avail.isAvailable ? "default" : "secondary"
                        }
                      >
                        {avail.shiftName}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setShowBookingDialog(true)}
            className="w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
          >
            Send Request
          </button>
        </div>
      </>
    )}
  </DialogContent>
</Dialog>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>Select your preferred shift type, date, and time</DialogDescription>
          </DialogHeader>
          {selectedProviderDetails && selectedProvider && (
            <div 
              className="space-y-4 overflow-y-auto px-6 pb-6" 
              style={{
                maxHeight: 'calc(95vh - 140px)',
                overflowY: 'auto'
              }}
            >
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={selectedProviderDetails.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + selectedProviderDetails.fullName}
                  alt={selectedProviderDetails.fullName}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-gray-900">{selectedProviderDetails.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedProviderDetails.categories.map(c => c.name).join(', ')}</p>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Select Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                >
                  <option value="">Choose a category...</option>
                  {selectedProviderDetails.categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {selectedCategoryId && selectedProviderDetails.shiftPrices && (
                <div>
                  <label className="block mb-2 text-gray-700">Select Shift Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProviderDetails.shiftPrices
                      .filter(sp => sp.categoryId === selectedCategoryId)
                      .map(sp => (
                        <button
                          key={sp.pricingId}
                          onClick={() => setBookingShift(sp.shiftType)}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            bookingShift === sp.shiftType
                              ? 'border-[#FFA726] bg-[#FFA726] text-white'
                              : 'border-gray-200 hover:border-[#FFA726]'
                          }`}
                        >
                          <p className="text-sm">{sp.shiftTypeName}</p>
                          <p className="text-xs">${sp.pricePerShift}</p>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block mb-2 text-gray-700">Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Address</label>
                <input
                  type="text"
                  value={bookingAddress}
                  onChange={(e) => setBookingAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Governorate</label>
                <input
                  type="text"
                  value={bookingGovernorate}
                  onChange={(e) => setBookingGovernorate(e.target.value)}
                  placeholder="Enter governorate"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Description (Optional)</label>
                <textarea
                  value={bookingDescription}
                  onChange={(e) => setBookingDescription(e.target.value)}
                  placeholder="Add any special instructions or requirements"
                  rows={3}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              {selectedCategoryId && (
                <div className="bg-[#E3F2FD] p-4 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">Shift Type:</span>
                    <span className="text-gray-900">{getShiftTypeName(bookingShift)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Price:</span>
                    <span className="text-xl text-gray-900">${getShiftPrice(bookingShift)}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleSendRequest}
                disabled={loading || !selectedCategoryId}
                className="w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                Confirm Request
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment</DialogTitle>
            <DialogDescription>You will be redirected to Stripe to complete your payment</DialogDescription>
          </DialogHeader>
          {selectedRequestForPayment && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">Amount to pay</p>
                <p className="text-3xl text-gray-900">${selectedRequestForPayment.totalPrice}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  🔒 Secure payment powered by Stripe. You'll be redirected to complete your payment securely.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Service:</strong> {selectedRequestForPayment.categoryName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Provider:</strong> {selectedRequestForPayment.providerName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong> {new Date(selectedRequestForPayment.preferredDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Shift:</strong> {selectedRequestForPayment.shiftTypeName}
                </p>
              </div>

              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {paymentLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Proceed to Payment - ${selectedRequestForPayment.totalPrice}
                  </>
                )}
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Experience</DialogTitle>
            <DialogDescription>Share your feedback about the service</DialogDescription>
          </DialogHeader>
          {selectedRequestForRating && (
            <div className="space-y-6">
              <div className="text-center">
                <ImageWithFallback
                  src={selectedRequestForRating.providerAvatar}
                  alt={selectedRequestForRating.providerName}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <p className="text-gray-900">{selectedRequestForRating.providerName}</p>
                <p className="text-sm text-gray-600">{new Date(selectedRequestForRating.preferredDate).toLocaleDateString()}</p>
              </div>

              {loadingFetchedReview ? (
                <div className="py-6 text-center">Loading review...</div>
              ) : Number(selectedRequestForRating.status) === 6 ? (
                // Completed: either show existing review or the form to submit
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
                <div className="p-4 text-center text-gray-600">You can leave a review only after the service is completed.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
