import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Calendar as CalendarIcon, MapPin, FileText, DollarSign,
  LogOut, Check, X, Clock, Star, Bell, Loader2, Pencil
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import SubmittedReview from './reviews/SubmittedReview';
import { fetchReviewByRequest } from '../api/reviews';
import '../styles/ProviderDashboard.css';

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
  shiftType: number;
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

interface ProviderAvailability {
  id: string;
  date: string;
  isAvailable: boolean;
  availableShift: number;
  notes: string;
}

export function ProviderDashboard({ user, navigate, onLogout }: ProviderDashboardProps) {
  const STATUS = {
    Pending: 1,
    Accepted: 2,
    PaymentPending: 3,
    Paid: 4,
    InProgress: 5,
    Completed: 6,
    Cancelled: 7,
    Rejected: 8,
  } as const;

  const [activeTab, setActiveTab] = useState('home');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<number[]>([1]);
  const [workAreas, setWorkAreas] = useState<WorkingArea[]>([]);
  const [isLoadingAreas, setIsLoadingAreas] = useState(false);
  const [availabilities, setAvailabilities] = useState<ProviderAvailability[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [isSavingAvailability, setIsSavingAvailability] = useState(false);
  const [availabilityNotes, setAvailabilityNotes] = useState('');
  const [newArea, setNewArea] = useState({
    governorate: '',
    city: '',
    district: ''
  });

  const [dashboardData, setDashboardData] = useState<ProviderDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [providerRequests, setProviderRequests] = useState<ServiceRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestReviews, setRequestReviews] = useState<Record<string, any | null>>({});

  const [profileData, setProfileData] = useState<ProviderProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: '',
    experience: '',
    profilePicture: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequestForReject, setSelectedRequestForReject] = useState<ServiceRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [loadingStartJobId, setLoadingStartJobId] = useState<string | null>(null);
  const [loadingCompleteJobId, setLoadingCompleteJobId] = useState<string | null>(null);

  const timeSlots = [
    { id: 1, name: '3 Hours', description: 'Short shift' },
    { id: 2, name: '12 Hours', description: 'Half day' },
    { id: 3, name: '24 Hours', description: 'Full day' }
  ];

  const fetchDashboardData = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      toast.error('Authentication required');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://elanis.runasp.net/api/Provider/dashboard', {
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
        try {
          if (result.data && result.data.profileId) {
            localStorage.setItem('providerId', String(result.data.profileId));
          }
        } catch (e) {
          console.debug('Could not persist providerId:', e);
        }
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalEarnings = dashboardData?.statistics.totalEarnings || 0;
  const averageRating = dashboardData?.statistics.averageRating.toFixed(1) || '0';
  const completedJobs = dashboardData?.statistics.completedJobs || 0;
  const pendingRequests = dashboardData?.statistics.pendingRequests || 0;
  const upcomingJobs = dashboardData?.upcomingJobs || [];
  const recentRequests = dashboardData?.recentRequests || [];

  const fetchProviderProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsLoadingProfile(true);

      // Fetch provider profile
      const response = await fetch('https://elanis.runasp.net/api/Provider/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('📥 Provider Profile Fetch Response:', result);

      if (response.ok && result.succeeded) {
        // Also fetch user profile to get profilePicture
        const userResponse = await fetch('https://elanis.runasp.net/api/User/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const userResult = await userResponse.json();
        console.log('📥 User Profile Fetch Response:', userResult);
        console.log('📸 Profile Picture URL:', userResult.data?.profilePicture);

        // Merge the profilePicture from user profile into provider profile
        const mergedData = {
          ...result.data,
          profilePicture: userResult.data?.profilePicture || null
        };

        setProfileData(mergedData);
        setProfileForm({
          bio: result.data.bio || '',
          experience: result.data.experience || '',
          profilePicture: null,
        });
        setIsAvailable(result.data.isAvailable);

        // Clean up preview URL after getting fresh data
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }

        console.log('✅ Profile data set, profilePicture:', mergedData.profilePicture);
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

  const handleSaveProfile = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsSavingProfile(true);

      const hasNewImage = profileForm.profilePicture !== null;

      // Upload profile picture separately if provided
      if (hasNewImage && profileForm.profilePicture) {
        console.log('📤 Uploading profile picture:', profileForm.profilePicture.name);

        const imageFormData = new FormData();
        imageFormData.append('ProfilePicture', profileForm.profilePicture);

        const imageResponse = await fetch('https://elanis.runasp.net/api/User/profile-picture', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: imageFormData,
        });

        const imageResult = await imageResponse.json();
        console.log('📥 Profile Picture Upload Response:', imageResult);

        if (!imageResponse.ok || !imageResult.succeeded) {
          toast.error(imageResult.message || 'Failed to upload profile picture');
          setIsSavingProfile(false);
          return;
        }

        toast.success('Profile picture uploaded successfully!');
      }

      // Update bio and experience
      console.log('📤 Updating bio and experience...');
      const formData = new FormData();
      formData.append('Bio', profileForm.bio);
      formData.append('Experience', profileForm.experience);

      const response = await fetch('https://elanis.runasp.net/api/Provider/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();
      console.log('📥 Save Profile Response:', result);

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Profile updated successfully');

        // Clean up preview URL after successful upload
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }

        console.log('🔄 Refetching profile to get updated data...');
        // Refetch profile to get the updated data
        await fetchProviderProfile();

        // Also refresh dashboard
        fetchDashboardData();

        // Reset the file input
        setProfileForm(prev => ({
          ...prev,
          profilePicture: null
        }));
      } else {
        console.error('❌ Save failed:', result.message);
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleToggleAvailability = async (newStatus: boolean) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch('https://elanis.runasp.net/api/Provider/profile/availability', {
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
        fetchDashboardData();
      } else {
        toast.error(result.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Failed to update availability');
    }
  };

  const fetchWorkingAreas = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsLoadingAreas(true);
      const response = await fetch('https://elanis.runasp.net/api/Provider/working-areas', {
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
      const response = await fetch('https://elanis.runasp.net/api/Provider/working-areas', {
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
        fetchWorkingAreas();
      } else {
        toast.error(result.message || 'Failed to add working area');
      }
    } catch (error) {
      console.error('Error adding working area:', error);
      toast.error('Failed to add working area');
    }
  };

  const deleteWorkingArea = async (areaId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/Provider/working-areas/${areaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Working area deleted successfully');
        fetchWorkingAreas();
      } else {
        toast.error(result.message || 'Failed to delete working area');
      }
    } catch (error) {
      console.error('Error deleting working area:', error);
      toast.error('Failed to delete working area');
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/Requests/${requestId}/response`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 2,
          reason: null
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Request accepted successfully!');
        fetchProviderRequests();
        fetchDashboardData();
      } else {
        toast.error(result.message || 'Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequestForReject || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/Requests/${selectedRequestForReject.id}/response`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 3,
          reason: rejectionReason
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Request rejected');
        setShowRejectDialog(false);
        setSelectedRequestForReject(null);
        setRejectionReason('');
        fetchProviderRequests();
        fetchDashboardData();
      } else {
        toast.error(result.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const handleStartJob = async (requestId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setLoadingStartJobId(requestId);
      const response = await fetch(`https://elanis.runasp.net/api/Requests/${requestId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Service started successfully');
        fetchProviderRequests();
        fetchDashboardData();
      } else {
        toast.error(result.message || 'Failed to start service');
        console.error('Start job error:', result);
      }
    } catch (error) {
      console.error('Error starting job:', error);
      toast.error('Failed to start job');
    } finally {
      setLoadingStartJobId(null);
    }
  };

  const handleCompleteJob = async (requestId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setLoadingCompleteJobId(requestId);
      const response = await fetch(`https://elanis.runasp.net/api/Requests/${requestId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Service completed successfully');
        fetchProviderRequests();
        fetchDashboardData();
      } else {
        toast.error(result.message || 'Failed to complete service');
        console.error('Complete job error:', result);
      }
    } catch (error) {
      console.error('Error completing job:', error);
      toast.error('Failed to complete job');
    } finally {
      setLoadingCompleteJobId(null);
    }
  };

  const toggleTimeSlot = (slotId: number) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slotId) ? prev.filter(s => s !== slotId) : [...prev, slotId]
    );
  };

  const fetchAvailability = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      setIsLoadingAvailability(true);
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const response = await fetch(
        `https://elanis.runasp.net/api/Provider/availability?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.succeeded) {
        const calendarData = result.data;
        if (calendarData && calendarData.availability) {
          setAvailabilities(calendarData.availability);
        } else if (Array.isArray(result.data)) {
          setAvailabilities(result.data);
        } else {
          setAvailabilities([]);
        }
      } else {
        console.error(result.message || 'Failed to load availability');
        if (!response.ok) {
          toast.error(result.message || 'Failed to load availability');
        }
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setIsLoadingAvailability(false);
    }
  };

  const handleSaveAvailability = async () => {
    if (selectedDates.length === 0) {
      toast.error('Please select at least one date');
      return;
    }

    if (selectedTimeSlots.length === 0) {
      toast.error('Please select at least one time slot');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsSavingAvailability(true);

    try {
      let successCount = 0;
      let failCount = 0;
      const errors: string[] = [];

      for (const date of selectedDates) {
        for (const shift of selectedTimeSlots) {
          try {
            const response = await fetch('https://elanis.runasp.net/api/Provider/availability', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                date: date.toISOString(),
                isAvailable: true,
                availableShift: shift,
                notes: availabilityNotes || ''
              }),
            });

            const result = await response.json();

            if (response.ok && result.succeeded) {
              successCount++;
            } else {
              failCount++;
              const shiftName = timeSlots.find(s => s.id === shift)?.name || 'Unknown';
              const dateStr = date.toLocaleDateString();
              errors.push(`${dateStr} - ${shiftName}: ${result.message || 'Failed'}`);
            }
          } catch (err) {
            failCount++;
            const shiftName = timeSlots.find(s => s.id === shift)?.name || 'Unknown';
            const dateStr = date.toLocaleDateString();
            errors.push(`${dateStr} - ${shiftName}: Network error`);
          }
        }
      }

      if (successCount > 0 && failCount === 0) {
        toast.success(`✅ ${successCount} availability ${successCount === 1 ? 'entry' : 'entries'} saved successfully!`);
        setSelectedDates([]);
        setSelectedTimeSlots([1]);
        setAvailabilityNotes('');
        fetchAvailability();
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`⚠️ ${successCount} saved, ${failCount} failed. Check console for details.`);
        console.error('Failed entries:', errors);
        fetchAvailability();
      } else {
        toast.error(`❌ All entries failed to save. ${errors[0] || 'Unknown error'}`);
        console.error('All errors:', errors);
      }
    } catch (error) {
      console.error('Error saving availability:', error);
      toast.error('Failed to save availability');
    } finally {
      setIsSavingAvailability(false);
    }
  };

  const handleDeleteAvailability = async (id: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/Provider/availability/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('Availability deleted');
        fetchAvailability();
      } else {
        toast.error(result.message || 'Failed to delete availability');
      }
    } catch (error) {
      console.error('Error deleting availability:', error);
      toast.error('Failed to delete availability');
    }
  };

  useEffect(() => {
    if (activeTab === 'availability') {
      fetchAvailability();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'profile') {
      fetchProviderProfile();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'areas') {
      fetchWorkingAreas();
    } else if (activeTab === 'requests') {
      fetchProviderRequests();
    }
  }, [activeTab, dashboardData?.profileId]);

  const fetchProviderRequests = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    const storedProviderId = localStorage.getItem('providerId');
    const providerIdToUse = dashboardData?.profileId || storedProviderId;

    if (!providerIdToUse) {
      console.log('Waiting for dashboard data or stored providerId to load...');
      return;
    }

    try {
      setIsLoadingRequests(true);
      console.log('Fetching requests for provider:', providerIdToUse);

      const response = await fetch(`https://elanis.runasp.net/api/Requests/provider/${providerIdToUse}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok && result.succeeded) {
        const transformedRequests = (result.data || []).map((req: any) => {
          const numericStatus = typeof req.status === 'number' ? req.status : parseInt(req.status, 10) || 0;
          return {
            id: req.id,
            clientName: req.clientName || req.userName || req.providerName || 'Client',
            categoryName: req.categoryName,
            preferredDate: req.preferredDate,
            shiftType: req.shiftType,
            shiftTypeName: req.shiftTypeName,
            status: numericStatus,
            statusText: req.statusText || req.statusName || String(req.status),
            statusName: req.statusName || req.statusText || String(req.status),
            price: req.totalPrice || req.price || 0,
            address: req.address,
            governorate: req.governorate || '',
            canStart: req.canStart,
            canComplete: req.canComplete,
          };
        });
        console.log('Transformed requests:', transformedRequests);
        setProviderRequests(transformedRequests);
      } else {
        console.error('API Error:', result.message, result.errors);
        toast.error(result.message || 'Failed to load requests');
      }
    } catch (error) {
      console.error('Error fetching provider requests:', error);
      toast.error('Error retrieving provider requests');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const loadReviewForRequest = async (requestId: string) => {
    try {
      const res = await fetchReviewByRequest(requestId);
      if (res?.succeeded && res.data) {
        setRequestReviews(prev => ({ ...prev, [requestId]: res.data }));
      } else {
        setRequestReviews(prev => ({ ...prev, [requestId]: null }));
      }
    } catch (err) {
      console.error('Failed to fetch review for request', err);
      setRequestReviews(prev => ({ ...prev, [requestId]: null }));
    }
  };

  const canStartRequest = (r: ServiceRequest) => {
    if ((r as any).canStart === true) return true;
    const numeric = Number((r as any).status) || 0;
    if (numeric === STATUS.Paid) return true;
    const statusText = ((r as any).statusText || (r as any).statusName || String(r.status || '')).toString().toLowerCase();
    const paidKeywords = ['paid', 'paymentpaid', 'payment', 'مدفوع', 'مدفوعة', 'تم الدفع', 'مدفوعاً', 'مدفوعه'];
    return paidKeywords.some(k => statusText.includes(k));
  };

  const canCompleteRequest = (r: ServiceRequest) => {
    if ((r as any).canComplete === true) return true;
    const statusText = ((r as any).statusText || (r as any).statusName || String(r.status || '')).toString().toLowerCase();
    return Number((r as any).status) === 5 || statusText.includes('inprogress') || statusText.includes('in process') || statusText.includes('in-progress');
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

  return (
    <div className="provider-dashboard">
      {/* Header Section */}
      <header className="provider-header">
        <div className="provider-header-inner">
          <h2 className="provider-header-title">CarePro - Provider</h2>
          <div className="provider-header-actions">
            <button className="provider-notification-btn">
              <Bell className="provider-notification-icon" />
              {pendingRequests > 0 && (
                <span className="provider-notification-dot"></span>
              )}
            </button>
            <div className="provider-user-info">
              <ImageWithFallback
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Provider'}
                alt={user?.name || 'Provider'}
                className="provider-user-avatar"
              />
              <div className="provider-user-details">
                <p className="provider-user-name">{user?.name}</p>
                <p className="provider-user-role">Provider</p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="provider-logout-btn"
              title="Logout"
            >
              <LogOut className="provider-logout-icon" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="provider-main-container">
        <div className="provider-layout-grid">
          {/* Sidebar Navigation */}
          <div className="provider-sidebar-container">
            <div className="provider-sidebar">
              <button
                onClick={() => setActiveTab('home')}
                className={`provider-sidebar-btn ${activeTab === 'home' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <Home className="provider-sidebar-icon" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`provider-sidebar-btn ${activeTab === 'profile' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <UserCircle className="provider-sidebar-icon" />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('availability')}
                className={`provider-sidebar-btn ${activeTab === 'availability' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <CalendarIcon className="provider-sidebar-icon" />
                <span>Availability</span>
              </button>
              <button
                onClick={() => setActiveTab('areas')}
                className={`provider-sidebar-btn ${activeTab === 'areas' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <MapPin className="provider-sidebar-icon" />
                <span>Work Areas</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`provider-sidebar-btn ${activeTab === 'requests' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <FileText className="provider-sidebar-icon" />
                <span>Requests</span>
                {pendingRequests > 0 && (
                  <Badge variant="destructive" className="provider-sidebar-badge">
                    {pendingRequests}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('earnings')}
                className={`provider-sidebar-btn ${activeTab === 'earnings' ? 'provider-sidebar-btn-active' : ''}`}
              >
                <DollarSign className="provider-sidebar-icon" />
                <span>Earnings</span>
              </button>
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="provider-content-container">
            {/* Dashboard Home Tab */}
            {activeTab === 'home' && (
              <div className="provider-dashboard-content">
                {/* Statistics Cards Grid */}
                <div className="provider-stats-grid">
                  <div className="provider-stat-card">
                    <div className="provider-stat-icon provider-stat-icon-green">
                      <DollarSign className="provider-stat-svg" />
                    </div>
                    <div className="provider-stat-content">
                      <p className="provider-stat-label">Total Earnings</p>
                      <p className="provider-stat-value">${totalEarnings}</p>
                    </div>
                  </div>

                  <div className="provider-stat-card">
                    <div className="provider-stat-icon provider-stat-icon-blue">
                      <FileText className="provider-stat-svg" />
                    </div>
                    <div className="provider-stat-content">
                      <p className="provider-stat-label">Completed Jobs</p>
                      <p className="provider-stat-value">{completedJobs}</p>
                    </div>
                  </div>

                  <div className="provider-stat-card">
                    <div className="provider-stat-icon provider-stat-icon-yellow">
                      <Star className="provider-stat-svg" />
                    </div>
                    <div className="provider-stat-content">
                      <p className="provider-stat-label">Average Rating</p>
                      <p className="provider-stat-value">{averageRating}</p>
                    </div>
                  </div>
                </div>

                {/* Pending Requests Section */}
                <div className="provider-section-card">
                  <h3 className="provider-section-title">Pending Requests</h3>
                  <div className="provider-requests-list">
                    {recentRequests
                      .filter(r => r.status === 1)
                      .slice(0, 3)
                      .map(request => (
                        <div key={request.id} className="provider-request-item">
                          <div className="provider-request-user">
                            <div className="provider-request-avatar">
                              {request.clientName.charAt(0)}
                            </div>
                            <div className="provider-request-details">
                              <p className="provider-request-name">{request.clientName}</p>
                              <p className="provider-request-meta">
                                {new Date(request.preferredDate).toLocaleDateString()} - {request.shiftTypeName}
                              </p>
                            </div>
                          </div>
                          <p className="provider-request-price">${request.price}</p>
                        </div>
                      ))}
                    {recentRequests.filter(r => r.status === 1).length === 0 && (
                      <p className="provider-empty-state">No pending requests</p>
                    )}
                  </div>
                </div>

                {/* Upcoming Jobs Section */}
                <div className="provider-section-card">
                  <h3 className="provider-section-title">Upcoming Jobs</h3>
                  <div className="provider-jobs-list">
                    {upcomingJobs.slice(0, 3).map(job => (
                      <div key={job.id} className="provider-job-item">
                        <div className="provider-job-info">
                          <p className="provider-job-client">{job.clientName}</p>
                          <p className="provider-job-meta">{new Date(job.preferredDate).toLocaleDateString()} - {job.shiftTypeName}</p>
                        </div>
                        <div className="provider-job-details">
                          <p className="provider-job-price">${job.price}</p>
                          <Badge variant="secondary" className="provider-job-badge">{job.statusText}</Badge>
                        </div>
                      </div>
                    ))}
                    {upcomingJobs.length === 0 && (
                      <p className="provider-empty-state">No upcoming jobs</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="provider-section-card">
                <h3 className="provider-section-title">My Profile</h3>
                {isLoadingProfile ? (
                  <div className="provider-loading">
                    <div className="provider-spinner"></div>
                  </div>
                ) : profileData ? (
                  <div className="provider-profile-content">
                    {/* Profile Header with Avatar and Availability */}
                    <div className="provider-profile-header">
                      {/* Profile Picture with Edit Button */}
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <ImageWithFallback
                          src={previewUrl || profileData.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.email}`}
                          alt={`${profileData.firstName} ${profileData.lastName}`}
                          className="provider-profile-avatar"
                        />
                        {/* Edit Button Overlay */}
                        <button
                          onClick={() => {
                            // Trigger the hidden file input
                            document.getElementById('profile-picture-input')?.click();
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '5px',
                            right: '5px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: '#ff6b35',
                            border: '2px solid white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.backgroundColor = '#ff5722';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.backgroundColor = '#ff6b35';
                          }}
                          title="Change profile picture"
                          type="button"
                        >
                          <Pencil size={18} color="white" />
                        </button>
                        {/* Hidden File Input */}
                        <input
                          id="profile-picture-input"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setProfileForm({ ...profileForm, profilePicture: file });
                              // Create preview URL
                              const url = URL.createObjectURL(file);
                              setPreviewUrl(url);
                              toast.success('Image selected. Click "Save Changes" to upload.');
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                      </div>
                      <div className="provider-profile-info">
                        <h4 className="provider-profile-name">{profileData.firstName} {profileData.lastName}</h4>
                        <p className="provider-profile-email">{profileData.email}</p>
                        <Badge className="provider-profile-badge">Approved Provider</Badge>
                        {profileForm.profilePicture && (
                          <p style={{ fontSize: '0.75rem', color: '#ff6b35', marginTop: '5px', fontWeight: '500' }}>
                            📷 New picture selected - Save to upload
                          </p>
                        )}
                      </div>
                      <div className="provider-availability-toggle">
                        <span className="provider-availability-text">
                          {isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                        <button
                          onClick={() => handleToggleAvailability(!isAvailable)}
                          className={`provider-toggle ${isAvailable ? 'provider-toggle-active' : ''}`}
                        >
                          <span className="provider-toggle-slider"></span>
                        </button>
                      </div>
                    </div>

                    {/* Profile Form Grid */}
                    <div className="provider-form-grid">
                      <div className="provider-form-group">
                        <label className="provider-form-label">Phone Number</label>
                        <input
                          type="tel"
                          value={profileData.phoneNumber}
                          readOnly
                          className="provider-form-input provider-form-input-readonly"
                        />
                      </div>
                      <div className="provider-form-group">
                        <label className="provider-form-label">National ID</label>
                        <input
                          type="text"
                          value={profileData.nationalId}
                          readOnly
                          className="provider-form-input provider-form-input-readonly"
                        />
                      </div>
                    </div>

                    {/* Bio and Experience Sections */}
                    <div className="provider-form-group">
                      <label className="provider-form-label">Professional Bio</label>
                      <Textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={5}
                        className="provider-textarea"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    <div className="provider-form-group">
                      <label className="provider-form-label">Experience</label>
                      <Textarea
                        value={profileForm.experience}
                        onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                        rows={5}
                        className="provider-textarea"
                        placeholder="Describe your experience..."
                      />
                    </div>

                    {/* Service Categories */}
                    <div className="provider-categories-section">
                      <h4 className="provider-subtitle">Service Categories</h4>
                      <div className="provider-categories-list">
                        {profileData.categories.map(cat => (
                          <Badge key={cat.id} variant="secondary" className="provider-category-badge">
                            {cat.icon} {cat.name}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Working Areas */}
                    <div className="provider-areas-section">
                      <h4 className="provider-subtitle">Working Areas</h4>
                      <div className="provider-areas-list">
                        {profileData.workingAreas.map(area => (
                          <div key={area.id} className="provider-area-item">
                            <span className="provider-area-text">
                              {area.governorate}, {area.city} - {area.district}
                            </span>
                            <span style={{ color: area.isActive ? 'green' : 'red' }}>
                              {area.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        ))}
                        {profileData.workingAreas.length === 0 && (
                          <p className="provider-empty-text">No working areas configured</p>
                        )}
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSavingProfile}
                      className="provider-save-btn"
                    >
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                ) : (
                  <p className="provider-error-state">Failed to load profile</p>
                )}
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="provider-section-card">
                <h3 className="provider-section-title">Manage Availability</h3>
                {isLoadingAvailability ? (
                  <div className="provider-loading">
                    <div className="provider-spinner"></div>
                  </div>
                ) : (
                  <div className="provider-availability-content">
                    {/* Calendar Section */}
                    <div className="provider-calendar-section">
                      <h4 className="provider-subtitle">Select Available Days</h4>
                      <div className="provider-calendar-container">
                        <Calendar
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(dates: Date[] | undefined) => setSelectedDates(dates as Date[])}
                          className="provider-calendar"
                        />
                      </div>
                      <p className="provider-selection-count">
                        {selectedDates.length} day(s) selected
                      </p>
                    </div>

                    {/* Time Slots Section */}
                    <div className="provider-shifts-section">
                      <h4 className="provider-subtitle">Available Shift Duration</h4>
                      <div className="provider-shifts-grid">
                        {timeSlots.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => toggleTimeSlot(slot.id)}
                            className={`provider-shift-btn ${selectedTimeSlots.includes(slot.id) ? 'provider-shift-btn-active' : ''}`}
                          >
                            <Clock className="provider-shift-icon" />
                            <p className="provider-shift-name">{slot.name}</p>
                            <p className="provider-shift-description">{slot.description}</p>
                          </button>
                        ))}
                      </div>
                      <p className="provider-shift-hint">
                        Select shift duration(s) you're available for
                      </p>
                    </div>

                    {/* Notes Section */}
                    <div className="provider-notes-section">
                      <h4 className="provider-subtitle">Notes (Optional)</h4>
                      <Textarea
                        value={availabilityNotes}
                        onChange={(e) => setAvailabilityNotes(e.target.value)}
                        placeholder="Add any notes about your availability..."
                        rows={3}
                        className="provider-textarea"
                      />
                    </div>

                    {/* Save Availability Button */}
                    <button
                      onClick={handleSaveAvailability}
                      disabled={isSavingAvailability || selectedDates.length === 0 || selectedTimeSlots.length === 0}
                      className="provider-save-availability-btn"
                    >
                      {isSavingAvailability ? (
                        <>
                          <div className="provider-btn-spinner"></div>
                          Saving...
                        </>
                      ) : (
                        'Save Availability'
                      )}
                    </button>

                    {/* Existing Availability List */}
                    {availabilities.length > 0 && (
                      <div className="provider-availability-list">
                        <h4 className="provider-subtitle">Your Availability Schedule</h4>
                        <div className="provider-availability-items">
                          {availabilities.map(availability => (
                            <div
                              key={availability.id}
                              className="provider-availability-item"
                            >
                              <div className="provider-availability-info">
                                <CalendarIcon className="provider-availability-calendar-icon" />
                                <div className="provider-availability-details">
                                  <p className="provider-availability-date">
                                    {new Date(availability.date).toLocaleDateString('en-US', {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </p>
                                  <p className="provider-availability-shift">
                                    {timeSlots.find(s => s.id === availability.availableShift)?.name || 'Unknown'}
                                    {availability.notes && ` - ${availability.notes}`}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteAvailability(availability.id)}
                                className="provider-delete-btn"
                                title="Delete"
                              >
                                <X className="provider-delete-icon" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Work Areas Tab */}
            {activeTab === 'areas' && (
              <div className="provider-section-card">
                <h3 className="provider-section-title">Work Areas</h3>
                {isLoadingAreas ? (
                  <div className="provider-loading">
                    <div className="provider-spinner"></div>
                  </div>
                ) : (
                  <div className="provider-areas-content">
                    {/* Add New Area Form */}
                    <div className="provider-add-area">
                      <h4 className="provider-subtitle">Add New Working Area</h4>
                      <div className="provider-area-form-grid">
                        <input
                          type="text"
                          value={newArea.governorate}
                          onChange={(e) => setNewArea({ ...newArea, governorate: e.target.value })}
                          placeholder="Governorate (e.g., Cairo)"
                          className="provider-area-input"
                        />
                        <input
                          type="text"
                          value={newArea.city}
                          onChange={(e) => setNewArea({ ...newArea, city: e.target.value })}
                          placeholder="City (e.g., Nasr City)"
                          className="provider-area-input"
                        />
                        <input
                          type="text"
                          value={newArea.district}
                          onChange={(e) => setNewArea({ ...newArea, district: e.target.value })}
                          placeholder="District (e.g., District 1)"
                          className="provider-area-input"
                        />
                      </div>
                      <button
                        onClick={addWorkingArea}
                        className="provider-add-area-btn"
                      >
                        Save
                      </button>
                    </div>

                    {/* Existing Areas List */}
                    <div className="provider-areas-list-section">
                      <h4 className="provider-subtitle">Your Work Areas:</h4>
                      {workAreas.length > 0 ? (
                        workAreas.map(area => (
                          <div
                            key={area.id}
                            className="provider-work-area-item"
                          >
                            <div className="provider-work-area-info">
                              <MapPin className="provider-area-icon" />
                              <div className="provider-work-area-details">
                                <p className="provider-work-area-location">
                                  {area.governorate}, {area.city}
                                </p>
                                <p className="provider-work-area-district">{area.district}</p>
                              </div>
                            </div>
                            <div className="provider-work-area-actions">
                              <div>
                                <span>{area.isActive ? 'Active' : 'Inactive'}</span>
                              </div>
                              <button
                                onClick={() => deleteWorkingArea(area.id)}
                                className="provider-delete-btn"
                                title="Delete area"
                              >
                                <X className="provider-delete-icon" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="provider-empty-state">
                          No working areas added yet. Add your first working area above.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="provider-section-card">
                <h3 className="provider-section-title">Service Requests</h3>
                {isLoadingRequests ? (
                  <div className="provider-loading">
                    <div className="provider-spinner"></div>
                  </div>
                ) : (
                  <div className="provider-requests-content">
                    {providerRequests.map(request => (
                      <div key={request.id} className="provider-request-card">
                        <div className="provider-request-header">
                          <div className="provider-request-avatar-large">
                            {request.clientName.charAt(0)}
                          </div>
                          <div className="provider-request-main">
                            <div className="provider-request-title">
                              <h4 className="provider-request-client">{request.clientName}</h4>
                              {/* <Badge style={(statusStyles as any)[request.status]}>
                                {request.statusText}
                              </Badge> */}
                              <span style={request.status === 6 ? { color: 'white', background: 'green', padding: '2px 5px', borderRadius: '5px' } : { color: 'white', background: 'blue', padding: '2px 5px', borderRadius: '5px' }}>
                                {request.statusText}
                              </span>
                            </div>
                            <div className="provider-request-meta-grid">
                              <p>📍 {request.address}</p>
                              <p>📅 {new Date(request.preferredDate).toLocaleDateString()}</p>
                              <p>🏷️ {request.categoryName}</p>
                              <p>⏱️ {request.shiftTypeName}</p>
                            </div>
                            <p className="provider-request-price-large">
                              Payment: <span>${request.price}</span>
                            </p>

                            {/* Review Section for Completed Jobs */}
                            {Number(request.status) === 6 && (
                              <div className="provider-review-section">
                                {requestReviews[request.id] ? (
                                  <SubmittedReview review={requestReviews[request.id]} />
                                ) : (
                                  <button
                                    onClick={() => loadReviewForRequest(request.id)}
                                    className="provider-review-btn"
                                  >
                                    {requestReviews[request.id] === null ? 'No review yet' : 'Load to review...'}
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Action Buttons Based on Request Status */}
                            {request.status === 1 && (
                              <div className="provider-request-actions">
                                <button
                                  onClick={() => handleAcceptRequest(request.id)}
                                  className="provider-accept-btn"
                                >
                                  <Check className="provider-action-icon" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedRequestForReject(request);
                                    setShowRejectDialog(true);
                                  }}
                                  className="provider-reject-btn"
                                >
                                  <X className="provider-action-icon" />
                                  Reject
                                </button>
                              </div>
                            )}

                            {(Number(request.status) === STATUS.PaymentPending) && (
                              <div className="provider-request-actions">
                                <button
                                  className="provider-waiting-btn"
                                  disabled
                                  title="Please wait until payment is confirmed"
                                >
                                  <Clock className="provider-action-icon" />
                                  Waiting for Payment
                                </button>
                              </div>
                            )}

                            {canStartRequest(request) && Number(request.status) !== STATUS.PaymentPending && (
                              <div className="provider-request-actions">
                                <button
                                  onClick={() => handleStartJob(request.id)}
                                  disabled={loadingStartJobId === request.id}
                                  className="provider-start-btn"
                                >
                                  {loadingStartJobId === request.id ? (
                                    <Loader2 className="provider-action-icon provider-action-icon-spin" />
                                  ) : (
                                    <Check className="provider-action-icon" />
                                  )}
                                  {loadingStartJobId === request.id ? 'Starting...' : 'Start Job'}
                                </button>
                              </div>
                            )}

                            {canCompleteRequest(request) && (
                              <div className="provider-request-actions">
                                <button
                                  onClick={() => handleCompleteJob(request.id)}
                                  disabled={loadingCompleteJobId === request.id}
                                  className="provider-complete-btn"
                                >
                                  {loadingCompleteJobId === request.id ? (
                                    <Loader2 className="provider-action-icon provider-action-icon-spin" />
                                  ) : (
                                    <Check className="provider-action-icon" />
                                  )}
                                  {loadingCompleteJobId === request.id ? 'Completing...' : 'Complete Job'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {providerRequests.length === 0 && (
                      <p className="provider-empty-state">No requests yet</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="provider-earnings-content">
                <div className="provider-section-card">
                  <h3 className="provider-section-title">Earnings Overview</h3>
                  <div className="provider-earnings-grid">
                    <div className="provider-earnings-card provider-earnings-total">
                      <p className="provider-earnings-label">Total Earnings</p>
                      <p className="provider-earnings-value">${totalEarnings}</p>
                    </div>
                    <div className="provider-earnings-card provider-earnings-jobs">
                      <p className="provider-earnings-label">Completed Jobs</p>
                      <p className="provider-earnings-value">{completedJobs}</p>
                    </div>
                  </div>

                  <div className="provider-earnings-details">
                    <div className="provider-earnings-card provider-earnings-current">
                      <p className="provider-earnings-label">Current Month</p>
                      <p className="provider-earnings-value">${dashboardData?.statistics.currentMonthEarnings || 0}</p>
                    </div>
                    <div className="provider-earnings-card provider-earnings-worked">
                      <p className="provider-earnings-label">Worked Days</p>
                      <p className="provider-earnings-value">{dashboardData?.statistics.workedDays || 0}</p>
                    </div>
                  </div>
                </div>

                <div className="provider-section-card">
                  <h3 className="provider-section-title">Transaction History</h3>
                  {upcomingJobs.length > 0 ? (
                    <div className="provider-transactions-list">
                      {upcomingJobs.map(job => (
                        <div
                          key={job.id}
                          className="provider-transaction-item"
                        >
                          <div className="provider-transaction-info">
                            <p className="provider-transaction-client">{job.clientName}</p>
                            <p className="provider-transaction-meta">
                              {new Date(job.preferredDate).toLocaleDateString()} - {job.shiftTypeName}
                            </p>
                          </div>
                          <div className="provider-transaction-details">
                            <p className="provider-transaction-price">${job.price}</p>
                            <Badge variant="secondary" className="provider-transaction-badge">{job.statusText}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="provider-empty-state">No transactions yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Reject Modal - Replaced Dialog with div */}
      {showRejectDialog && (
        <div className="provider-modal-overlay">
          <div className="provider-modal">
            <div className="provider-modal-header">
              <h3 className="provider-modal-title">Reject Request</h3>
              <p className="provider-modal-description">Provide a reason for rejecting this service request</p>
              <button
                onClick={() => setShowRejectDialog(false)}
                className="provider-modal-close-btn"
              >
                <X className="provider-modal-close-icon" />
              </button>
            </div>
            <div className="provider-modal-content">
              <p className="provider-reject-description">
                Please provide a reason for rejecting this request. This will be shown to the client.
              </p>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Schedule conflict, outside work area, etc..."
                rows={4}
                className="provider-reject-textarea"
              />
              <div className="provider-reject-actions">
                <button
                  onClick={() => {
                    setShowRejectDialog(false);
                    setRejectionReason('');
                  }}
                  className="provider-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectRequest}
                  className="provider-confirm-reject-btn"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}