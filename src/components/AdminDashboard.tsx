import { useState } from 'react';
import { User } from '../App';
import {
  Home, Users, UserCheck, FolderOpen, DollarSign, CreditCard, LogOut,
  Check, X, Edit, Trash2, Plus, Search
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
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
  name: string;
  email: string;
  phone: string;
  experience: number;
  serviceType: string;
  bio: string;
  certificates: string[];
  cv: string;
  submittedDate: string;
  avatar: string;
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
  description: string;
  icon: string;
}

interface PricingRule {
  id: string;
  shiftType: '3h' | '12h' | 'fullday';
  baseRate: number;
  description: string;
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

export function AdminDashboard({ user, navigate, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([
    {
      id: 'p1',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+1 (555) 111-2222',
      experience: 5,
      serviceType: 'Elderly Care',
      bio: 'Dedicated caregiver with 5 years of experience in elderly care and companionship.',
      certificates: ['CPR Certification', 'First Aid Certificate'],
      cv: 'Mike_Wilson_CV.pdf',
      submittedDate: '2025-10-20',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    {
      id: 'p2',
      name: 'Anna Martinez',
      email: 'anna.m@email.com',
      phone: '+1 (555) 333-4444',
      experience: 3,
      serviceType: 'Child Care',
      bio: 'Certified nanny with early childhood education background.',
      certificates: ['Child Care Certificate', 'CPR Certification'],
      cv: 'Anna_Martinez_CV.pdf',
      submittedDate: '2025-10-22',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    },
  ]);

  const [users, setUsers] = useState<RegisteredUser[]>([
    {
      id: 'u1',
      name: 'John Doe',
      email: 'john@test.com',
      phone: '+1 (555) 123-4567',
      role: 'user',
      status: 'active',
      joinedDate: '2025-09-15',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    },
    {
      id: 'u2',
      name: 'Sarah Johnson',
      email: 'sarah@test.com',
      phone: '+1 (555) 987-6543',
      role: 'provider',
      status: 'active',
      joinedDate: '2025-08-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
  ]);

  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'c1',
      name: 'Elderly Care',
      description: 'Compassionate care for seniors',
      icon: '👴',
    },
    {
      id: 'c2',
      name: 'Child Care',
      description: 'Professional childcare services',
      icon: '👶',
    },
    {
      id: 'c3',
      name: 'Home Nursing',
      description: 'Professional nursing at home',
      icon: '🏥',
    },
  ]);

  const [pricing, setPricing] = useState<PricingRule[]>([
    {
      id: 'pr1',
      shiftType: '3h',
      baseRate: 20,
      description: 'Standard 3-hour shift',
    },
    {
      id: 'pr2',
      shiftType: '12h',
      baseRate: 22,
      description: 'Half-day 12-hour shift',
    },
    {
      id: 'pr3',
      shiftType: 'fullday',
      baseRate: 25,
      description: 'Full 24-hour day shift',
    },
  ]);

  const [bookings] = useState<Booking[]>([
    {
      id: 'b1',
      userName: 'John Doe',
      providerName: 'Sarah Johnson',
      date: '2025-10-25',
      shiftType: '12h',
      amount: 300,
      status: 'Completed',
    },
    {
      id: 'b2',
      userName: 'Mary Smith',
      providerName: 'Emily Davis',
      date: '2025-10-24',
      shiftType: '3h',
      amount: 66,
      status: 'Paid',
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', icon: '' });

  const handleApproveProvider = (providerId: string) => {
    setPendingProviders(prev => prev.filter(p => p.id !== providerId));
    toast.success('Provider approved successfully!');
    setShowProviderDialog(false);
  };

  const handleRejectProvider = () => {
    if (!selectedProvider || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    
    setPendingProviders(prev => prev.filter(p => p.id !== selectedProvider.id));
    toast.success('Provider application rejected');
    setShowRejectDialog(false);
    setShowProviderDialog(false);
    setRejectionReason('');
  };

  const handleSuspendUser = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
    toast.success('User status updated');
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('User deleted');
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim() || !categoryForm.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (editingCategory) {
      setCategories(prev =>
        prev.map(c => (c.id === editingCategory.id ? { ...c, ...categoryForm } : c))
      );
      toast.success('Category updated');
    } else {
      setCategories(prev => [
        ...prev,
        { id: `c${Date.now()}`, ...categoryForm },
      ]);
      toast.success('Category added');
    }

    setShowCategoryDialog(false);
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '', icon: '' });
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    toast.success('Category deleted');
  };

  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);

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
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Users</p>
                        <p className="text-2xl text-gray-900">{users.filter(u => u.role === 'user').length}</p>
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
                        <p className="text-2xl text-gray-900">{users.filter(u => u.role === 'provider').length}</p>
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
                        <p className="text-2xl text-gray-900">{pendingProviders.length}</p>
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
                        <p className="text-2xl text-gray-900">${totalRevenue}</p>
                      </div>
                    </div>
                  </div>
                </div>

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

                {pendingProviders.length > 0 && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="mb-4 text-gray-900">Pending Provider Approvals</h3>
                    <div className="space-y-3">
                      {pendingProviders.map(provider => (
                        <div
                          key={provider.id}
                          className="flex items-center justify-between p-4 border-2 border-orange-200 bg-orange-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={provider.avatar}
                              alt={provider.name}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className="text-gray-900">{provider.name}</p>
                              <p className="text-sm text-gray-600">{provider.serviceType}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowProviderDialog(true);
                            }}
                            className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                          >
                            Review
                          </button>
                        </div>
                      ))}
                    </div>
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
                      placeholder="Search users..."
                      className="pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    />
                  </div>
                </div>

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
                            <button
                              onClick={() => handleSuspendUser(user.id)}
                              className="p-1 text-orange-600 hover:bg-orange-100 rounded transition-colors"
                              title={user.status === 'active' ? 'Suspend' : 'Activate'}
                            >
                              {user.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {activeTab === 'providers' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Provider Applications</h3>
                <div className="space-y-4">
                  {pendingProviders.map(provider => (
                    <div key={provider.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={provider.avatar}
                          alt={provider.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-900">{provider.name}</h4>
                          <p className="text-sm text-gray-600 mb-2">{provider.serviceType}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                            <p className="text-gray-600">📧 {provider.email}</p>
                            <p className="text-gray-600">📞 {provider.phone}</p>
                            <p className="text-gray-600">📅 Submitted: {provider.submittedDate}</p>
                            <p className="text-gray-600">⏱️ Experience: {provider.experience} years</p>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProvider(provider);
                              setShowProviderDialog(true);
                            }}
                            className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingProviders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No pending applications</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900">Service Categories</h3>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryForm({ name: '', description: '', icon: '' });
                      setShowCategoryDialog(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Category
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {categories.map(category => (
                    <div key={category.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-3xl">{category.icon}</div>
                          <div>
                            <h4 className="text-gray-900">{category.name}</h4>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(category);
                              setCategoryForm({
                                name: category.name,
                                description: category.description,
                                icon: category.icon,
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
              </div>
            )}

            {activeTab === 'pricing' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Shift Pricing</h3>
                <div className="space-y-4">
                  {pricing.map(rule => (
                    <div key={rule.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-gray-900">
                            {rule.shiftType === '3h' ? '3 Hours' : rule.shiftType === '12h' ? '12 Hours' : 'Full Day'}
                          </h4>
                          <p className="text-sm text-gray-600">{rule.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Base Rate</p>
                            <p className="text-2xl text-gray-900">${rule.baseRate}/hr</p>
                          </div>
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Payment Transactions</h3>
                <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg">
                  <p className="text-sm mb-1 opacity-90">Total Revenue</p>
                  <p className="text-3xl">${totalRevenue}</p>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map(booking => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-mono text-sm">{booking.id}</TableCell>
                        <TableCell>{booking.userName}</TableCell>
                        <TableCell>{booking.providerName}</TableCell>
                        <TableCell>{booking.date}</TableCell>
                        <TableCell>${booking.amount}</TableCell>
                        <TableCell>
                          <Badge variant="default">{booking.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Details Dialog */}
      <Dialog open={showProviderDialog} onOpenChange={setShowProviderDialog}>
        <DialogContent className="max-w-2xl">
          {selectedProvider && (
            <>
              <DialogHeader>
                <DialogTitle>Provider Application Details</DialogTitle>
                <DialogDescription>Review provider credentials and documents</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={selectedProvider.avatar}
                    alt={selectedProvider.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900">{selectedProvider.name}</h3>
                    <p className="text-gray-600">{selectedProvider.serviceType}</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="text-gray-600">📧 {selectedProvider.email}</p>
                      <p className="text-gray-600">📞 {selectedProvider.phone}</p>
                      <p className="text-gray-600">⏱️ {selectedProvider.experience} years experience</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">Bio</h4>
                  <p className="text-gray-600">{selectedProvider.bio}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">Certificates</h4>
                  <div className="space-y-2">
                    {selectedProvider.certificates.map((cert, i) => (
                      <div key={i} className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-700">📄 {cert}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">CV/Resume</h4>
                  <div className="p-2 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">📎 {selectedProvider.cv}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleApproveProvider(selectedProvider.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Reject
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
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectProvider}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
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
            <div>
              <label className="block mb-2 text-gray-700">Category Name</label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                placeholder="e.g., Elderly Care"
              />
            </div>
            <div>
              <label className="block mb-2 text-gray-700">Description</label>
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
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowCategoryDialog(false);
                  setCategoryForm({ name: '', description: '', icon: '' });
                }}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategory}
                className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
              >
                {editingCategory ? 'Update' : 'Add'} Category
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
