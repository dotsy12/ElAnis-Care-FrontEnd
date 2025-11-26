import { useState, useEffect } from 'react';
import { User } from '../App';
import {
  Home, Users, UserCheck, FolderOpen, DollarSign, CreditCard, LogOut,
  Check, X, Edit, Trash2, Plus, Search
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

interface AdminDashboardProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

interface PendingProvider {
  id: string;
  userId: string;
  userEmail: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address?: string;
  dateOfBirth?: string;
  bio: string;
  nationalId?: string;
  experience: string;
  hourlyRate: number;
  idDocumentPath?: string;
  certificatePath?: string;
  selectedCategories?: string[];
  status: number; // 1=Pending, 2=Approved, 3=Rejected
  createdAt: string;
  reviewedAt: string | null;
  reviewedByName: string | null;
  rejectionReason: string | null;
}

interface ProvidersResponse {
  items: PendingProvider[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'provider';
  status: 'active' | 'suspended';
  joinedDate: string;
  avatar: string;
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

interface ServicePricing {
  id: string;
  categoryId: string;
  categoryName: string;
  shiftType: number; // 1=3Hours, 2=12Hours, 3=FullDay
  shiftTypeName: string;
  pricePerShift: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
}

interface CategoryWithPricing {
  categoryId: string;
  categoryName: string;
  categoryDescription: string;
  categoryIcon: string;
  categoryIsActive: boolean;
  pricing: ServicePricing[];
}

interface Booking {
  id: string;
  userName: string;
  providerName: string;
  date: string;
  shiftType: string;
  amount: number;
  status: string;
}

interface DashboardStats {
  totalUsers: number;
  totalServiceProviders: number;
  pendingApplications: number;
  totalServiceRequests: number;
  completedServiceRequests: number;
  totalReviews: number;
  totalEarnings: number;
  averageRating: number;
}

export function AdminDashboard({ user, navigate, onLogout }: AdminDashboardProps) {
  const API_BASE_URL = 'https://elanis.runasp.net/api';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalServiceProviders: 0,
    pendingApplications: 0,
    totalServiceRequests: 0,
    completedServiceRequests: 0,
    totalReviews: 0,
    totalEarnings: 0,
    averageRating: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [providersPage, setProvidersPage] = useState(1);
  const [providersTotalPages, setProvidersTotalPages] = useState(1);

  const [users, setUsers] = useState<RegisteredUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [searchUsers, setSearchUsers] = useState('');

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const [categoriesWithPricing, setCategoriesWithPricing] = useState<CategoryWithPricing[]>([]);
  const [isLoadingPricing, setIsLoadingPricing] = useState(true);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [editingPricing, setEditingPricing] = useState<ServicePricing | null>(null);
  const [pricingForm, setPricingForm] = useState({
    categoryId: '',
    shiftType: 1,
    pricePerShift: 0,
    description: '',
    isActive: true,
  });
  const [isSavingPricing, setIsSavingPricing] = useState(false);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  // Payments for admin
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isLoadingProviderDetails, setIsLoadingProviderDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', nameEn: '', description: '', icon: '', isActive: true });
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Fetch completed requests from /Admin/bookings/recent
  const fetchCompletedRequests = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      return;
    }

    try {
      setIsLoadingBookings(true);
      const response = await fetch(
        `${API_BASE_URL}/Admin/bookings/recent?limit=10`,
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
        const bookingsData = (result.data || []).map((req: any) => ({
          id: req.id,
          userName: req.userName || 'Unknown',
          providerName: req.providerName || 'Unknown',
          date: req.date ? new Date(req.date).toLocaleString() : 'N/A',
          shiftType: req.shift || req.shiftTypeName || 'Unknown',
          amount: req.amount || 0,
          status: req.status || 'Completed',
        }));
        setBookings(bookingsData);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching completed requests:', error);
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };
  const fetchProviderDetails = async (providerId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsLoadingProviderDetails(true);
    try {
      const response = await fetch(
        `https://elanis.runasp.net/api/Admin/service-provider-applications/${providerId}`,
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
        setSelectedProvider(result.data);
        setShowProviderDialog(true);
      } else {
        toast.error(result.message || 'Failed to fetch provider details');
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      toast.error('Failed to load provider details');
    } finally {
      setIsLoadingProviderDetails(false);
    }
  };

  const handleApproveProvider = async (providerId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `https://elanis.runasp.net/api/Admin/service-provider-applications/${providerId}/approve`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Provider approved successfully!');
        setPendingProviders(prev => prev.filter(p => p.id !== providerId));
        setShowProviderDialog(false);
        // Refresh stats
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to approve provider');
      }
    } catch (error) {
      console.error('Error approving provider:', error);
      toast.error('Failed to approve provider');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectProvider = async () => {
    if (!selectedProvider || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `https://elanis.runasp.net/api/Admin/service-provider-applications/${selectedProvider.id}/reject`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            rejectionReason: rejectionReason.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Provider application rejected');
        setPendingProviders(prev => prev.filter(p => p.id !== selectedProvider.id));
        setShowRejectDialog(false);
        setShowProviderDialog(false);
        setRejectionReason('');
        // Refresh stats
        window.location.reload();
      } else {
        toast.error(result.message || 'Failed to reject provider');
      }
    } catch (error) {
      console.error('Error rejecting provider:', error);
      toast.error('Failed to reject provider');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fetch all users from API
  const fetchUsers = async (page: number = 1, search?: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoadingUsers(false);
      return;
    }

    try {
      setIsLoadingUsers(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('pageSize', '10');
      if (search) params.append('search', search);

      const response = await fetch(
        `${API_BASE_URL}/Admin/users?${params.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.succeeded && result.data) {
        const usersData = (result.data.items || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || 'N/A',
          role: u.role,
          status: u.status,
          joinedDate: u.joined ? new Date(u.joined).toLocaleDateString() : 'N/A',
          avatar: u.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`,
        }));
        setUsers(usersData);
        setUsersTotalPages(result.data.totalPages || 1);
      } else {
        setUsers([]);
        toast.error(result.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('User suspended successfully');
        fetchUsers(usersPage, searchUsers);
      } else {
        toast.error(result.message || 'Failed to suspend user');
      }
    } catch (error) {
      console.error('Error suspending user:', error);
      toast.error('Failed to suspend user');
    }
  };

  const handleActivateUser = async (userId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Admin/users/${userId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success('User activated successfully');
        fetchUsers(usersPage, searchUsers);
      } else {
        toast.error(result.message || 'Failed to activate user');
      }
    } catch (error) {
      console.error('Error activating user:', error);
      toast.error('Failed to activate user');
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoadingCategories(false);
      return;
    }

    try {
      setIsLoadingCategories(true);
      const response = await fetch('https://elanis.runasp.net/api/Category', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setCategories(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsSavingCategory(true);

    try {
      const url = editingCategory
        ? `https://elanis.runasp.net/api/Category/${editingCategory.id}`
        : 'https://elanis.runasp.net/api/Category';

      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: categoryForm.name.trim(),
          nameEn: categoryForm.nameEn.trim(),
          description: categoryForm.description.trim(),
          icon: categoryForm.icon.trim(),
          isActive: categoryForm.isActive,
        }),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || (editingCategory ? 'Category updated successfully' : 'Category created successfully'));
        setShowCategoryDialog(false);
        setEditingCategory(null);
        setCategoryForm({ name: '', nameEn: '', description: '', icon: '', isActive: true });
        // Refresh categories list
        fetchCategories();
      } else {
        toast.error(result.message || 'Failed to save category');
      }
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/Category/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Category deleted successfully');
        // Refresh categories list
        fetchCategories();
      } else {
        toast.error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  // Fetch categories with pricing
  const fetchCategoriesWithPricing = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setIsLoadingPricing(false);
      return;
    }

    try {
      setIsLoadingPricing(true);
      const response = await fetch('https://elanis.runasp.net/api/ServicePricing/categories-with-pricing', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        setCategoriesWithPricing(result.data);
      } else {
        toast.error(result.message || 'Failed to fetch pricing');
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      toast.error('Failed to load pricing');
    } finally {
      setIsLoadingPricing(false);
    }
  };

  const handleSavePricing = async () => {
    if (!pricingForm.categoryId || pricingForm.pricePerShift <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    setIsSavingPricing(true);

    try {
      const url = editingPricing
        ? `https://elanis.runasp.net/api/ServicePricing/${editingPricing.id}`
        : 'https://elanis.runasp.net/api/ServicePricing';

      const method = editingPricing ? 'PUT' : 'POST';

      const body = editingPricing
        ? {
            pricePerShift: pricingForm.pricePerShift,
            description: pricingForm.description.trim(),
            isActive: pricingForm.isActive,
          }
        : {
            categoryId: pricingForm.categoryId,
            shiftType: pricingForm.shiftType,
            pricePerShift: pricingForm.pricePerShift,
            description: pricingForm.description.trim(),
            isActive: pricingForm.isActive,
          };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || (editingPricing ? 'Pricing updated successfully' : 'Pricing created successfully'));
        setShowPricingDialog(false);
        setEditingPricing(null);
        setPricingForm({
          categoryId: '',
          shiftType: 1,
          pricePerShift: 0,
          description: '',
          isActive: true,
        });
        fetchCategoriesWithPricing();
      } else {
        toast.error(result.message || 'Failed to save pricing');
      }
    } catch (error) {
      console.error('Error saving pricing:', error);
      toast.error('Failed to save pricing');
    } finally {
      setIsSavingPricing(false);
    }
  };

  const handleDeletePricing = async (pricingId: string) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }

    if (!confirm('Are you sure you want to delete this pricing?')) {
      return;
    }

    try {
      const response = await fetch(`https://elanis.runasp.net/api/ServicePricing/${pricingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded) {
        toast.success(result.message || 'Pricing deleted successfully');
        fetchCategoriesWithPricing();
      } else {
        toast.error(result.message || 'Failed to delete pricing');
      }
    } catch (error) {
      console.error('Error deleting pricing:', error);
      toast.error('Failed to delete pricing');
    }
  };

  const getShiftTypeName = (shiftType: number): string => {
    switch (shiftType) {
      case 1: return '3 Hours';
      case 2: return '12 Hours';
      case 3: return 'Full Day';
      default: return 'Unknown';
    }
  };

  // Fetch dashboard stats from API
  useEffect(() => {
    const fetchDashboardStats = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        toast.error('Authentication token not found');
        setIsLoadingStats(false);
        return;
      }

      try {
        const response = await fetch('https://elanis.runasp.net/api/Admin/dashboard-stats', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();

        if (response.ok && result.succeeded) {
          setDashboardStats(result.data);
        } else {
          toast.error(result.message || 'Failed to fetch dashboard stats');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch pending provider applications
  useEffect(() => {
    const fetchPendingProviders = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setIsLoadingProviders(false);
        return;
      }

      try {
        setIsLoadingProviders(true);
        const response = await fetch(
          `https://elanis.runasp.net/api/Admin/service-provider-applications?page=${providersPage}&pageSize=10`,
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
          const data: ProvidersResponse = result.data;
          // Filter only pending applications (status = 1)
          const pending = data.items.filter(item => item.status === 1);
          setPendingProviders(pending);
          setProvidersTotalPages(data.totalPages);
        } else {
          toast.error(result.message || 'Failed to fetch provider applications');
        }
      } catch (error) {
        console.error('Error fetching provider applications:', error);
        toast.error('Failed to load provider applications');
      } finally {
        setIsLoadingProviders(false);
      }
    };

    fetchPendingProviders();
  }, [providersPage]);

  // Fetch users when Users tab is opened or on mount
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers(usersPage, searchUsers);
    }
  }, [activeTab, usersPage]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch pricing on mount
  useEffect(() => {
    fetchCategoriesWithPricing();
  }, []);

  // Fetch completed requests on mount
  useEffect(() => {
    fetchCompletedRequests();
  }, []);

  // Fetch payments when admin opens payments tab (or on mount)
  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [activeTab]);

  const fetchPayments = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    try {
      setIsLoadingPayments(true);
      const response = await fetch(`${API_BASE_URL}/Admin/payments`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.succeeded && result.data) {
        // Map transactions from API response
        const paymentsData = (result.data.transactions || []).map((p: any) => ({
          id: p.id,
          transactionId: p.transactionId,
          userName: p.userName,
          providerName: p.providerName,
          date: p.date ? new Date(p.date).toLocaleString() : 'N/A',
          amount: p.amount || 0,
          status: p.status,
          paymentMethod: p.paymentMethod,
          requestId: p.requestId,
        }));
        setPayments(paymentsData);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const totalRevenue = (payments.length > 0 ? payments.reduce((sum, p) => sum + (p.amount || 0), 0) : bookings.reduce((sum, b) => sum + b.amount, 0));

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-gray-900">CarePro - Admin Panel</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <ImageWithFallback
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'}
                alt={user?.name || 'Admin'}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">Administrator</p>
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
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'dashboard' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'users' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'providers' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Providers</span>
                {pendingProviders.length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {pendingProviders.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'categories' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FolderOpen className="w-5 h-5" />
                <span>Categories</span>
              </button>
              <button
                onClick={() => setActiveTab('pricing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'pricing' ? 'bg-[#FFA726] text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span>Pricing</span>
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
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {isLoadingStats ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Users</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.totalUsers}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Providers</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.totalServiceProviders}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.pendingApplications}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Revenue</p>
                            <p className="text-2xl text-gray-900">${dashboardStats.totalEarnings.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Stats Row */}
                    <div className="grid md:grid-cols-4 gap-6">
                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <FolderOpen className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Requests</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.totalServiceRequests}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Completed</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.completedServiceRequests}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">⭐</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Reviews</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.totalReviews}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                            <span className="text-xl">📊</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Avg Rating</p>
                            <p className="text-2xl text-gray-900">{dashboardStats.averageRating.toFixed(1)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {!isLoadingStats && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="mb-4 text-gray-900">Recent Bookings</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Shift</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map(booking => (
                        <TableRow key={booking.id}>
                          <TableCell>{booking.userName}</TableCell>
                          <TableCell>{booking.providerName}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>{booking.shiftType}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell>
                            <Badge>{booking.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                )}

                {!isLoadingStats && !isLoadingProviders && pendingProviders.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="mb-4 text-gray-900">Pending Provider Approvals ({pendingProviders.length})</h3>
                    {isLoadingProviders ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA726]"></div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pendingProviders.map(provider => (
                          <div
                            key={provider.id}
                            className="flex items-center justify-between p-4 border-2 border-orange-200 bg-orange-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <ImageWithFallback
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.firstName}`}
                                alt={`${provider.firstName} ${provider.lastName}`}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <p className="text-gray-900 font-medium">{provider.firstName} {provider.lastName}</p>
                                <p className="text-sm text-gray-600">{provider.userEmail}</p>
                                <p className="text-xs text-gray-500">${provider.hourlyRate}/hr</p>
                              </div>
                            </div>
                            <button
                              onClick={() => fetchProviderDetails(provider.id)}
                              disabled={isLoadingProviderDetails}
                              className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50"
                            >
                              {isLoadingProviderDetails ? 'Loading...' : 'Review'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">User Management</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchUsers}
                      onChange={(e) => {
                        setSearchUsers(e.target.value);
                        setUsersPage(1);
                      }}
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    />
                  </div>
                </div>

                {isLoadingUsers ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : (
                  <>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map(user => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <ImageWithFallback
                                  src={user.avatar}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full"
                                />
                                <span>{user.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                              <Badge variant={user.role === 'provider' ? 'default' : 'secondary'}>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell>{user.joinedDate}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => handleSuspendUser(user.id)}
                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                    title="Suspend user"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateUser(user.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Activate user"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {users.length === 0 && !isLoadingUsers && (
                      <p className="text-center text-gray-500 py-8">No users found</p>
                    )}
                    {usersTotalPages > 1 && (
                      <div className="flex gap-2 justify-center mt-6">
                        <button
                          onClick={() => setUsersPage(p => Math.max(1, p - 1))}
                          disabled={usersPage === 1}
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <span className="px-4 py-2">Page {usersPage} of {usersTotalPages}</span>
                        <button
                          onClick={() => setUsersPage(p => Math.min(usersTotalPages, p + 1))}
                          disabled={usersPage === usersTotalPages}
                          className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'providers' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Provider Applications ({pendingProviders.length})</h3>
                {isLoadingProviders ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProviders.map(provider => (
                      <div key={provider.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-4">
                          <ImageWithFallback
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${provider.firstName}`}
                            alt={`${provider.firstName} ${provider.lastName}`}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-medium">{provider.firstName} {provider.lastName}</h4>
                            <p className="text-sm text-gray-600 mb-2">${provider.hourlyRate}/hr</p>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <p className="text-gray-600">📧 {provider.userEmail}</p>
                              <p className="text-gray-600">📞 {provider.phoneNumber}</p>
                              <p className="text-gray-600">📅 Created: {new Date(provider.createdAt).toLocaleDateString()}</p>
                              <p className="text-gray-600">⏱️ Experience: {provider.experience}</p>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{provider.bio}</p>
                            <button
                              onClick={() => fetchProviderDetails(provider.id)}
                              disabled={isLoadingProviderDetails}
                              className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isLoadingProviderDetails ? 'Loading...' : 'View Details'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pendingProviders.length === 0 && (
                      <p className="text-center text-gray-500 py-8">No pending applications</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Service Categories</h3>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', nameEn: '', description: '', icon: '', isActive: true });
                      setShowCategoryDialog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>

                {isLoadingCategories ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : categories.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No categories found. Create your first category!</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {categories.map(category => (
                      <div key={category.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-3xl">{category.icon}</div>
                            <div className="flex-1">
                              <h4 className="text-gray-900 font-medium">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.description}</p>
                              <Badge variant={category.isActive ? "default" : "destructive"} className="mt-1">
                                {category.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                nameEn: category.nameEn,
                                description: category.description,
                                icon: category.icon,
                                isActive: category.isActive,
                              });
                              setShowCategoryDialog(true);
                            }}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Service Pricing</h3>
                  <button
                    onClick={() => {
                      setEditingPricing(null);
                      setPricingForm({
                        categoryId: '',
                        shiftType: 1,
                        pricePerShift: 0,
                        description: '',
                        isActive: true,
                      });
                      setShowPricingDialog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Pricing
                  </button>
                </div>

                {isLoadingPricing ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : categoriesWithPricing.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No pricing found. Create your first pricing!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {categoriesWithPricing.map(categoryData => (
                      <div key={categoryData.categoryId} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                          <div className="text-3xl">{categoryData.categoryIcon}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{categoryData.categoryName}</h4>
                            <p className="text-sm text-gray-600">{categoryData.categoryDescription}</p>
                          </div>
                          <Badge variant={categoryData.categoryIsActive ? "default" : "destructive"}>
                            {categoryData.categoryIsActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        {categoryData.pricing.length === 0 ? (
                          <p className="text-gray-500 text-sm text-center py-4">No pricing configured</p>
                        ) : (
                          <div className="space-y-3">
                            {categoryData.pricing.map(price => (
                              <div key={price.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{getShiftTypeName(price.shiftType)}</h5>
                                  <p className="text-sm text-gray-600">{price.description}</p>
                                  <Badge variant={price.isActive ? "default" : "destructive"} className="mt-1">
                                    {price.isActive ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600">Price Per Shift</p>
                                    <p className="text-2xl font-bold text-[#FFA726]">${price.pricePerShift}</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditingPricing(price);
                                        setPricingForm({
                                          categoryId: price.categoryId,
                                          shiftType: price.shiftType,
                                          pricePerShift: price.pricePerShift,
                                          description: price.description,
                                          isActive: price.isActive,
                                        });
                                        setShowPricingDialog(true);
                                      }}
                                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeletePricing(price.id)}
                                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Payment Transactions</h3>
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                  <p className="text-sm mb-1 opacity-90">Total Revenue</p>
                  <p className="text-3xl">${totalRevenue}</p>
                </div>

                {isLoadingPayments ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FFA726]"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Request ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.length > 0 ? (
                        payments.map((payment: any) => (
                          <TableRow key={payment.id || payment.transactionId}>
                            <TableCell className="font-mono text-sm">{payment.transactionId || payment.id || '—'}</TableCell>
                            <TableCell>{payment.userName || '—'}</TableCell>
                            <TableCell>{payment.providerName || '—'}</TableCell>
                            <TableCell>{payment.date || '—'}</TableCell>
                            <TableCell>${payment.amount || 0}</TableCell>
                            <TableCell>
                              <Badge variant="default">{payment.status || 'Pending'}</Badge>
                            </TableCell>
                            <TableCell>{payment.paymentMethod || '—'}</TableCell>
                            <TableCell className="font-mono text-sm">{payment.requestId || '—'}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                            No payment transactions found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Details Dialog */}
      <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {isLoadingProviderDetails ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFA726]"></div>
            </div>
          ) : selectedProvider && (
            <>
              <DialogHeader>
                <DialogTitle>Provider Application Details</DialogTitle>
                <DialogDescription>Review provider credentials and documents</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <ImageWithFallback
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedProvider.firstName}`}
                    alt={`${selectedProvider.firstName} ${selectedProvider.lastName}`}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedProvider.firstName} {selectedProvider.lastName}
                    </h3>
                    <p className="text-lg text-[#FFA726] font-medium">${selectedProvider.hourlyRate}/hr</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-gray-600">📧 {selectedProvider.userEmail}</p>
                      <p className="text-gray-600">📞 {selectedProvider.phoneNumber}</p>
                      <p className="text-gray-600">📅 Applied: {new Date(selectedProvider.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Professional Bio</h4>
                  <p className="text-gray-600 text-sm bg-white p-4 rounded-lg border">{selectedProvider.bio}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
                  <p className="text-gray-600 text-sm bg-white p-4 rounded-lg border">{selectedProvider.experience}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                  <div className="space-y-2">
                    {selectedProvider.idDocumentPath && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-gray-700">📄 ID Document: {selectedProvider.idDocumentPath}</p>
                      </div>
                    )}
                    {selectedProvider.certificatePath && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-gray-700">🎓 Certificate: {selectedProvider.certificatePath}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApproveProvider(selectedProvider.id)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Check className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-5 h-5" />
                    {isProcessing ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>Provide a reason for rejecting this provider application</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Please provide a reason for rejecting this application. This will be sent to the applicant.
            </p>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g., Insufficient qualifications, incomplete documentation..."
              rows={4}
              className="focus:border-[#FFA726]"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
                disabled={isProcessing}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProvider}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update the service category details' : 'Create a new service category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">Category Name (Arabic) *</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  placeholder="e.g., رعاية المسنين"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Category Name (English)</label>
                <input
                  type="text"
                  value={categoryForm.nameEn}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, nameEn: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  placeholder="e.g., Elderly Care"
                />
              </div>
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Description *</label>
              <Textarea
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                className="focus:border-[#FFA726]"
                placeholder="Brief description of the service category..."
                rows={3}
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Icon (Emoji)</label>
              <input
                type="text"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                placeholder="e.g., 👴"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={categoryForm.isActive}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-[#FFA726] border-gray-300 rounded focus:ring-[#FFA726]"
              />
              <label htmlFor="isActive" className="text-gray-700 cursor-pointer">
                Active Category (visible to providers during registration)
              </label>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCategoryDialog(false);
                  setCategoryForm({ name: '', nameEn: '', description: '', icon: '', isActive: true });
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                disabled={isSavingCategory}
                className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingCategory ? 'Saving...' : (editingCategory ? 'Update' : 'Add')} Category
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPricing ? 'Edit Pricing' : 'Add Pricing'}</DialogTitle>
            <DialogDescription>
              {editingPricing ? 'Update the pricing details' : 'Create a new pricing for a category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!editingPricing && (
              <div>
                <label className="block mb-2 text-gray-700">Category *</label>
                <select
                  value={pricingForm.categoryId}
                  onChange={(e) => setPricingForm(prev => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.filter(c => c.isActive).map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!editingPricing && (
              <div>
                <label className="block mb-2 text-gray-700">Shift Type *</label>
                <select
                  value={pricingForm.shiftType}
                  onChange={(e) => setPricingForm(prev => ({ ...prev, shiftType: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  required
                >
                  <option value={1}>3 Hours</option>
                  <option value={2}>12 Hours</option>
                  <option value={3}>Full Day (24 Hours)</option>
                </select>
              </div>
            )}

            <div>
              <label className="block mb-2 text-gray-700">Price Per Shift ($) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={pricingForm.pricePerShift}
                onChange={(e) => setPricingForm(prev => ({ ...prev, pricePerShift: parseFloat(e.target.value) || 0 }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                placeholder="e.g., 20.00"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-700">Description</label>
              <Textarea
                value={pricingForm.description}
                onChange={(e) => setPricingForm(prev => ({ ...prev, description: e.target.value }))}
                className="focus:border-[#FFA726]"
                placeholder="Brief description of this pricing..."
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pricingIsActive"
                checked={pricingForm.isActive}
                onChange={(e) => setPricingForm(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-[#FFA726] border-gray-300 rounded focus:ring-[#FFA726]"
              />
              <label htmlFor="pricingIsActive" className="text-gray-700 cursor-pointer">
                Active Pricing (available for booking)
              </label>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowPricingDialog(false);
                  setPricingForm({
                    categoryId: '',
                    shiftType: 1,
                    pricePerShift: 0,
                    description: '',
                    isActive: true,
                  });
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePricing}
                disabled={isSavingPricing}
                className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSavingPricing ? 'Saving...' : (editingPricing ? 'Update' : 'Add')} Pricing
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
