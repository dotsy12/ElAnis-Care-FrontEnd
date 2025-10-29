import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Calendar as CalendarIcon, MapPin, FileText, DollarSign,
  LogOut, Check, X, Clock, Star, Bell
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';

interface ProviderDashboardProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

interface DashboardStatistics {
  completedJobs: number;
  pendingRequests: number;
  upcomingJobs: number;
  totalEarnings: number;
  currentMonthEarnings: number;
  averageRating: number;
  totalReviews: number;
  workedDays: number;
}

interface ServiceRequest {
  id: string;
  clientName: string;
  categoryName: string;
  preferredDate: string;
  shiftType: number; // 1=3h, 2=12h, 3=fullday
  shiftTypeName: string;
  status: number;
  statusText: string;
  price: number;
  address: string;
  governorate: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface WorkingArea {
  id: string;
  governorate: string;
  city: string;
  district: string;
  isActive: boolean;
}

interface ProviderProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture: string | null;
  bio: string;
  experience: string;
  nationalId: string;
  isAvailable: boolean;
  status: number;
  completedJobs: number;
  totalEarnings: number;
  averageRating: number;
  totalReviews: number;
  categories: Category[];
  workingAreas: WorkingArea[];
}

interface ProviderDashboardData {
  profileId: string;
  fullName: string;
  email: string;
  profilePicture: string | null;
  isAvailable: boolean;
  status: number;
  statistics: DashboardStatistics;
  recentRequests: ServiceRequest[];
  upcomingJobs: ServiceRequest[];
  categories: Category[];
  workingAreas: string[];
}

export function ProviderDashboard({ user, navigate, onLogout }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['Morning']);
  const [workAreas, setWorkAreas] = useState<WorkingArea[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [newArea, setNewArea] = useState({
    governorate: '',
    city: '',
    district: ''
  });
  
  // Dashboard Data from API
  const [dashboardData, setDashboardData] = useState<ProviderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Profile Data
  const [profileData, setProfileData] = useState<ProviderProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    experience: '',
    profilePicture: null as File | null,
  });
  const [isAvailable, setIsAvailable] = useState(true);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequestForReject, setSelectedRequestForReject] = useState<ServiceRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      toast.error('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://elanis.runasp.net/api/Provider/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setDashboardData(result.data);
        setWorkAreas(result.data.workingAreas || []);
      } else {
        toast.error(result.message || 'Failed to load dashboard');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch dashboard on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalEarnings = dashboardData?.statistics.totalEarnings || 0;
  const averageRating = dashboardData?.statistics.averageRating.toFixed(1) || '0';
  const completedJobs = dashboardData?.statistics.completedJobs || 0;
  const pendingRequests = dashboardData?.statistics.pendingRequests || 0;
  const upcomingJobs = dashboardData?.upcomingJobs || [];
  const recentRequests = dashboardData?.recentRequests || [];

  // Fetch provider profile
  const fetchProviderProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsLoadingProfile(true);
      const response = await fetch('http://elanis.runasp.net/api/Provider/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setProfileData(result.data);
        setProfileForm({
          bio: result.data.bio || '',
          experience: result.data.experience || '',
          profilePicture: null,
        });
        setIsAvailable(result.data.isAvailable);
      } else {
        toast.error(result.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Update provider profile
  const handleSaveProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsSavingProfile(true);
      const formData = new FormData();
      formData.append('Bio', profileForm.bio);
      formData.append('Experience', profileForm.experience);
      if (profileForm.profilePicture) {
        formData.append('ProfilePicture', profileForm.profilePicture);
      }

      const response = await fetch('http://elanis.runasp.net/api/Provider/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Profile updated successfully');
        setProfileData(result.data);
        fetchDashboardData(); // Refresh dashboard
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

  // Update availability status
  const handleToggleAvailability = async (newStatus: boolean) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch('http://elanis.runasp.net/api/Provider/profile/availability', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: newStatus }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setIsAvailable(newStatus);
        toast.success(result.message || `Status updated to ${newStatus ? 'Available' : 'Unavailable'}`);
        fetchDashboardData(); // Refresh dashboard
      } else {
        toast.error(result.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  // Fetch working areas
  const fetchWorkingAreas = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsLoadingAreas(true);
      const response = await fetch('http://elanis.runasp.net/api/Provider/working-areas', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setWorkAreas(result.data || []);
      } else {
        toast.error(result.message || 'Failed to load working areas');
      }
    } catch (error) {
      console.error('Error fetching working areas:', error);
      toast.error('Failed to load working areas');
    } finally {
      setIsLoadingAreas(false);
    }
  };

  // Add working area
  const addWorkingArea = async () => {
    if (!newArea.governorate.trim() || !newArea.city.trim() || !newArea.district.trim()) {
      toast.error('Please fill all fields');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch('http://elanis.runasp.net/api/Provider/working-areas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newArea),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Working area added successfully');
        setNewArea({ governorate: '', city: '', district: '' });
        fetchWorkingAreas(); // Refresh list
      } else {
        toast.error(result.message || 'Failed to add working area');
      }
    } catch (error) {
      console.error('Error adding working area:', error);
      toast.error('Failed to add working area');
    }
  };

  // Delete working area
  const deleteWorkingArea = async (areaId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`http://elanis.runasp.net/api/Provider/working-areas/${areaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Working area deleted successfully');
        fetchWorkingAreas(); // Refresh list
      } else {
        toast.error(result.message || 'Failed to delete working area');
      }
    } catch (error) {
      console.error('Error deleting working area:', error);
      toast.error('Failed to delete working area');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    // TODO: Implement API call to accept request
    toast.success('Request accepted!');
  };

  const handleRejectRequest = async () => {
    if (!selectedRequestForReject || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    // TODO: Implement API call to reject request
    toast.success('Request rejected');
    setShowRejectDialog(false);
    setSelectedRequestForReject(null);
    setRejectionReason('');
  };

  const toggleTimeSlot = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
    );
  };

  // Fetch profile when Profile tab is opened
  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProviderProfile();
    }
  }, [activeTab]);

  // Fetch working areas when Areas tab is opened
  useEffect(() => {
    if (activeTab === 'areas') {
      fetchWorkingAreas();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-gray-900">CarePro - Provider</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              {pendingRequests > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FFA726] rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Provider'}
                alt={user?.name || 'Provider'}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">Provider</p>
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
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'profile' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCircle className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'availability' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CalendarIcon className="w-5 h-5" />
                <span>Availability</span>
              </button>
              <button
                onClick={() => setActiveTab('areas')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'areas' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span>Work Areas</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'requests' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span>Requests</span>
                {pendingRequests > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {pendingRequests}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'earnings' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Earnings</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Earnings</p>
                        <p className="text-2xl text-gray-900">${totalEarnings}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completed Jobs</p>
                        <p className="text-2xl text-gray-900">{completedJobs}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Rating</p>
                        <p className="text-2xl text-gray-900">{averageRating}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Pending Requests</h3>
                  <div className="space-y-3">
                    {recentRequests
                      .filter(r => r.status === 1) // 1 = Pending
                      .slice(0, 3)
                      .map(request => (
                        <div key={request.id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#FFA726] rounded-full flex items-center justify-center text-white font-bold">
                              {request.clientName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-gray-900">{request.clientName}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(request.preferredDate).toLocaleDateString()} - {request.shiftTypeName}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-900">${request.price}</p>
                        </div>
                      ))}
                    {recentRequests.filter(r => r.status === 1).length === 0 && (
                      <p className="text-center text-gray-500 py-4">No pending requests</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Upcoming Jobs</h3>
                  <div className="space-y-3">
                    {upcomingJobs.slice(0, 3).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                        <div>
                          <p className="text-gray-900">{job.clientName}</p>
                          <p className="text-sm text-gray-500">{new Date(job.preferredDate).toLocaleDateString()} - {job.shiftTypeName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">${job.price}</p>
                          <Badge variant="secondary" className="mt-1">{job.statusText}</Badge>
                        </div>
                      </div>
                    ))}
                    {upcomingJobs.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No upcoming jobs</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Profile</h3>
                {isLoadingProfile ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : profileData ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 mb-6">
                      <ImageWithFallback
                        src={profileData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`}
                        alt={`${profileData.firstName} ${profileData.lastName}`}
                        className="w-20 h-20 rounded-full"
                      />
                      <div className="flex-1">
                        <h4 className="text-gray-900">{profileData.firstName} {profileData.lastName}</h4>
                        <p className="text-gray-600">{profileData.email}</p>
                        <Badge className="mt-2">Approved Provider</Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(!isAvailable)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isAvailable ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isAvailable ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          readOnly
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">National ID</label>
                        <input
                          type="text"
                          value={profileData.nationalId}
                          readOnly
                          className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Professional Bio</label>
                      <Textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={5}
                        className="focus:border-[#FFA726]"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Experience</label>
                      <Textarea
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        rows={5}
                        className="focus:border-[#FFA726]"
                        placeholder="Describe your experience..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Profile Picture</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setProfileForm({ ...profileForm, profilePicture: e.target.files?.[0] || null })}
                        className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726]"
                      />
                    </div>

                    <div>
                      <h4 className="mb-3 text-gray-900">Service Categories</h4>
                      <div className="flex flex-wrap gap-2">
                        {profileData.categories.map(cat => (
                          <Badge key={cat.id} variant="secondary">
                            {cat.icon} {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-3 text-gray-900">Working Areas</h4>
                      <div className="space-y-2">
                        {profileData.workingAreas.map(area => (
                          <div key={area.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">
                              {area.governorate}, {area.city} - {area.district}
                            </span>
                            <Badge variant={area.isActive ? "default" : "secondary"}>
                              {area.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        ))}
                        {profileData.workingAreas.length === 0 && (
                          <p className="text-gray-500 text-sm">No working areas configured</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-12">Failed to load profile</p>
                )}
              </div>
            )}

            {activeTab === 'availability' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Manage Availability</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="mb-3 text-gray-900">Select Available Days</h4>
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <Calendar
                        mode="multiple"
                        selected={selectedDates}
                        onSelect={(dates: Date[] | undefined) => setSelectedDates(dates as Date[])}
                        className="rounded-md"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedDates.length} day(s) selected
                    </p>
                  </div>

                  <div>
                    <h4 className="mb-3 text-gray-900">Available Time Slots</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => toggleTimeSlot(slot)}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            selectedTimeSlots.includes(slot)
                              ? 'border-[#FFA726] bg-[#FFA726] text-white'
                              : 'border-gray-200 hover:border-[#FFA726]'
                          }`}
                        >
                          <Clock className="w-5 h-5 mx-auto mb-1" />
                          <p className="text-sm">{slot}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => toast.success('Availability updated!')}
                    className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                  >
                    Save Availability
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'areas' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Work Areas</h3>
                {isLoadingAreas ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-gray-900 font-medium">Add New Working Area</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={newArea.governorate}
                          onChange={(e) => setNewArea({ ...newArea, governorate: e.target.value })}
                          placeholder="Governorate (e.g., Cairo)"
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newArea.city}
                          onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                          placeholder="City (e.g., Nasr City)"
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                        />
                        <input
                          type="text"
                          value={newArea.district}
                          onChange={(e) => setNewArea({ ...newArea, district: e.target.value })}
                          placeholder="District (e.g., District 1)"
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={addWorkingArea}
                        className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                      >
                        Add Working Area
                      </button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-gray-900 font-medium">Your Work Areas:</h4>
                      {workAreas.length > 0 ? (
                        workAreas.map(area => (
                          <div
                            key={area.id}
                            className="flex items-center justify-between p-4 bg-[#E3F2FD] rounded-lg border-2 border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-[#FFA726]" />
                              <div>
                                <p className="text-gray-900 font-medium">
                                  {area.governorate}, {area.city}
                                </p>
                                <p className="text-sm text-gray-600">{area.district}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={area.isActive ? "default" : "secondary"}>
                                {area.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                              <button
                                onClick={() => deleteWorkingArea(area.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                title="Delete area"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">
                          No working areas added yet. Add your first working area above.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Service Requests</h3>
                <div className="space-y-4">
                  {recentRequests.map(request => (
                    <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-[#FFA726] rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {request.clientName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-900">{request.clientName}</h4>
                            <Badge
                              variant={
                                request.status === 2
                                  ? 'default'
                                  : request.status === 3
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {request.statusText}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <p>📍 {request.address}</p>
                            <p>📅 {new Date(request.preferredDate).toLocaleDateString()}</p>
                            <p>🏷️ {request.categoryName}</p>
                            <p>⏱️ {request.shiftTypeName}</p>
                          </div>
                          <p className="text-lg text-gray-900 mb-3">
                            Payment: <span>${request.price}</span>
                          </p>
                          {request.status === 1 && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRequestForReject(request);
                                  setShowRejectDialog(true);
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              >
                                <X className="w-4 h-4" />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {recentRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No requests yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-6 text-gray-900">Earnings Overview</h3>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl">
                      <p className="text-sm mb-2 opacity-90">Total Earnings</p>
                      <p className="text-4xl">${totalEarnings}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                      <p className="text-sm mb-2 opacity-90">Completed Jobs</p>
                      <p className="text-4xl">{completedJobs}</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Current Month</p>
                      <p className="text-2xl text-gray-900">${dashboardData?.statistics.currentMonthEarnings || 0}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Worked Days</p>
                      <p className="text-2xl text-gray-900">{dashboardData?.statistics.workedDays || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Transaction History</h3>
                  {upcomingJobs.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingJobs.map(job => (
                        <div
                          key={job.id}
                          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg"
                        >
                          <div>
                            <p className="text-gray-900">{job.clientName}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(job.preferredDate).toLocaleDateString()} - {job.shiftTypeName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl text-gray-900">${job.price}</p>
                            <Badge variant="secondary" className="mt-1">{job.statusText}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">No transactions yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this service request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting this request. This will be shown to the client.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Schedule conflict, outside work area, etc..."
              rows={4}
              className="focus:border-[#FFA726]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectRequest}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
