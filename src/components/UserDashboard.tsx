import { useState } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Users, FileText, CreditCard, Star, LogOut,
  Search, MapPin, Clock, Filter, ChevronRight, X, Calendar, DollarSign
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface UserDashboardProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

interface Caregiver {
  id: string;
  name: string;
  avatar: string;
  hourlyRate: number;
  rating: number;
  reviews: number;
  city: string;
  serviceType: string;
  experience: number;
  bio: string;
  specialties: string[];
  availability: string[];
}

interface Booking {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverAvatar: string;
  shiftType: '3h' | '12h' | 'fullday';
  date: string;
  time: string;
  status: 'pending' | 'accepted' | 'paid' | 'in-progress' | 'completed' | 'rejected';
  totalPrice: number;
  rating?: number;
  rejectionReason?: string;
}

const mockCaregivers: Caregiver[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    hourlyRate: 25,
    rating: 4.9,
    reviews: 127,
    city: 'New York',
    serviceType: 'Elderly Care',
    experience: 8,
    bio: 'Experienced elderly care specialist with a passion for helping seniors maintain their independence.',
    specialties: ['Dementia Care', 'Mobility Assistance', 'Medication Management'],
    availability: ['Morning', 'Afternoon'],
  },
  {
    id: '2',
    name: 'Emily Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    hourlyRate: 22,
    rating: 4.8,
    reviews: 89,
    city: 'New York',
    serviceType: 'Child Care',
    experience: 5,
    bio: 'Certified nanny with experience in early childhood education and development.',
    specialties: ['Newborn Care', 'Educational Activities', 'Meal Preparation'],
    availability: ['Morning', 'Evening'],
  },
  {
    id: '3',
    name: 'Michael Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    hourlyRate: 30,
    rating: 5.0,
    reviews: 156,
    city: 'Los Angeles',
    serviceType: 'Home Nursing',
    experience: 12,
    bio: 'Licensed RN providing professional home healthcare services with specialized training.',
    specialties: ['Wound Care', 'IV Therapy', 'Post-Op Care'],
    availability: ['Morning', 'Afternoon', 'Evening'],
  },
  {
    id: '4',
    name: 'Jennifer Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
    hourlyRate: 24,
    rating: 4.7,
    reviews: 73,
    city: 'Chicago',
    serviceType: 'Elderly Care',
    experience: 6,
    bio: 'Compassionate caregiver dedicated to providing quality care and companionship.',
    specialties: ['Companionship', 'Light Housekeeping', 'Transportation'],
    availability: ['Afternoon', 'Evening'],
  },
];

export function UserDashboard({ user, navigate, onLogout }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [searchCity, setSearchCity] = useState('');
  const [searchService, setSearchService] = useState('');
  const [selectedCaregiver, setSelectedCaregiver] = useState<Caregiver | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [bookingShift, setBookingShift] = useState<'3h' | '12h' | 'fullday'>('3h');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [myBookings, setMyBookings] = useState<Booking[]>([
    {
      id: 'b1',
      caregiverId: '1',
      caregiverName: 'Sarah Johnson',
      caregiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      shiftType: '12h',
      date: '2025-10-28',
      time: '09:00',
      status: 'completed',
      totalPrice: 300,
      rating: 5,
    },
    {
      id: 'b2',
      caregiverId: '2',
      caregiverName: 'Emily Davis',
      caregiverAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      shiftType: '3h',
      date: '2025-10-26',
      time: '14:00',
      status: 'accepted',
      totalPrice: 66,
    },
  ]);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedBookingForPayment, setSelectedBookingForPayment] = useState<Booking | null>(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [ratingValue, setRatingValue] = useState(5);

  const filteredCaregivers = mockCaregivers.filter(cg => {
    const cityMatch = !searchCity || cg.city.toLowerCase().includes(searchCity.toLowerCase());
    const serviceMatch = !searchService || cg.serviceType.toLowerCase().includes(searchService.toLowerCase());
    return cityMatch && serviceMatch;
  });

  const getShiftPrice = (hourlyRate: number, shift: '3h' | '12h' | 'fullday') => {
    if (shift === '3h') return hourlyRate * 3;
    if (shift === '12h') return hourlyRate * 12;
    return hourlyRate * 24;
  };

  const handleSendRequest = () => {
    if (!selectedCaregiver || !bookingDate || !bookingTime) {
      toast.error('Please fill in all booking details');
      return;
    }

    const newBooking: Booking = {
      id: `b${Date.now()}`,
      caregiverId: selectedCaregiver.id,
      caregiverName: selectedCaregiver.name,
      caregiverAvatar: selectedCaregiver.avatar,
      shiftType: bookingShift,
      date: bookingDate,
      time: bookingTime,
      status: 'pending',
      totalPrice: getShiftPrice(selectedCaregiver.hourlyRate, bookingShift),
    };

    setMyBookings(prev => [newBooking, ...prev]);
    toast.success('Request sent successfully!');
    setShowBookingDialog(false);
    setSelectedCaregiver(null);
    setActiveTab('requests');
  };

  const handlePayment = () => {
    if (!selectedBookingForPayment) return;

    setMyBookings(prev => prev.map(b =>
      b.id === selectedBookingForPayment.id ? { ...b, status: 'paid' } : b
    ));
    toast.success('Payment successful!');
    setShowPaymentDialog(false);
    setSelectedBookingForPayment(null);
  };

  const handleRating = () => {
    if (!selectedBookingForRating) return;

    setMyBookings(prev => prev.map(b =>
      b.id === selectedBookingForRating.id ? { ...b, rating: ratingValue } : b
    ));
    toast.success('Thank you for your rating!');
    setShowRatingDialog(false);
    setSelectedBookingForRating(null);
  };

  const getStatusBadge = (status: Booking['status']) => {
    const variants: Record<Booking['status'], { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      accepted: { variant: 'default', label: 'Accepted' },
      paid: { variant: 'default', label: 'Paid' },
      'in-progress': { variant: 'default', label: 'In Progress' },
      completed: { variant: 'default', label: 'Completed' },
      rejected: { variant: 'destructive', label: 'Rejected' },
    };
    return <Badge variant={variants[status].variant}>{variants[status].label}</Badge>;
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
                      <p className="text-gray-600 mb-1">Total Bookings</p>
                      <p className="text-3xl text-gray-900">{myBookings.length}</p>
                    </div>
                    <div className="bg-[#E3F2FD] p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Completed</p>
                      <p className="text-3xl text-gray-900">
                        {myBookings.filter(b => b.status === 'completed').length}
                      </p>
                    </div>
                    <div className="bg-[#E3F2FD] p-4 rounded-lg">
                      <p className="text-gray-600 mb-1">Pending</p>
                      <p className="text-3xl text-gray-900">
                        {myBookings.filter(b => b.status === 'pending').length}
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
                  {myBookings.slice(0, 3).map(booking => (
                    <div key={booking.id} className="flex items-center gap-4 p-3 border-b last:border-b-0">
                      <ImageWithFallback
                        src={booking.caregiverAvatar}
                        alt={booking.caregiverName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="text-gray-900">{booking.caregiverName}</p>
                        <p className="text-sm text-gray-500">{booking.date} at {booking.time}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  ))}
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
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by city..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Service type..."
                        value={searchService}
                        onChange={(e) => setSearchService(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors">
                      <Search className="w-5 h-5" />
                      Search
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredCaregivers.map(caregiver => (
                    <div key={caregiver.id} className="bg-white rounded-xl shadow-md p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <ImageWithFallback
                          src={caregiver.avatar}
                          alt={caregiver.name}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-900">{caregiver.name}</h4>
                          <p className="text-sm text-gray-600">{caregiver.serviceType}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{caregiver.rating}</span>
                            </div>
                            <span className="text-sm text-gray-500">({caregiver.reviews} reviews)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">${caregiver.hourlyRate}/hr</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {caregiver.city}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {caregiver.experience} years
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCaregiver(caregiver)}
                        className="w-full py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Requests</h3>
                <div className="space-y-4">
                  {myBookings.map(booking => (
                    <div key={booking.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={booking.caregiverAvatar}
                          alt={booking.caregiverName}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-900">{booking.caregiverName}</h4>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <p>Date: {booking.date}</p>
                            <p>Time: {booking.time}</p>
                            <p>Shift: {booking.shiftType}</p>
                            <p>Price: ${booking.totalPrice}</p>
                          </div>
                          {booking.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {booking.rejectionReason}
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            {booking.status === 'accepted' && (
                              <button
                                onClick={() => {
                                  setSelectedBookingForPayment(booking);
                                  setShowPaymentDialog(true);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              >
                                Pay Now
                              </button>
                            )}
                            {booking.status === 'completed' && !booking.rating && (
                              <button
                                onClick={() => {
                                  setSelectedBookingForRating(booking);
                                  setShowRatingDialog(true);
                                }}
                                className="px-4 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                              >
                                Rate Service
                              </button>
                            )}
                            {booking.rating && (
                              <div className="flex items-center gap-1 text-sm">
                                <span className="text-gray-600">Your rating:</span>
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
                  {myBookings.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No requests yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Payment History</h3>
                <div className="space-y-3">
                  {myBookings
                    .filter(b => b.status === 'paid' || b.status === 'completed')
                    .map(booking => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-gray-900">{booking.caregiverName}</p>
                            <p className="text-sm text-gray-500">{booking.date}</p>
                          </div>
                        </div>
                        <p className="text-gray-900">${booking.totalPrice}</p>
                      </div>
                    ))}
                  {myBookings.filter(b => b.status === 'paid' || b.status === 'completed').length === 0 && (
                    <p className="text-center text-gray-500 py-8">No payment history</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ratings' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Ratings</h3>
                <div className="space-y-4">
                  {myBookings
                    .filter(b => b.rating)
                    .map(booking => (
                      <div key={booking.id} className="border-2 border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-4 mb-3">
                          <ImageWithFallback
                            src={booking.caregiverAvatar}
                            alt={booking.caregiverName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="text-gray-900">{booking.caregiverName}</p>
                            <p className="text-sm text-gray-500">{booking.date}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  {myBookings.filter(b => b.rating).length === 0 && (
                    <p className="text-center text-gray-500 py-8">No ratings yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Caregiver Profile Dialog */}
      <Dialog open={!!selectedCaregiver && !showBookingDialog} onOpenChange={() => setSelectedCaregiver(null)}>
        <DialogContent className="max-w-2xl">
          {selectedCaregiver && (
            <>
              <DialogHeader>
                <DialogTitle>Caregiver Profile</DialogTitle>
                <DialogDescription>View detailed information about this caregiver</DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <ImageWithFallback
                    src={selectedCaregiver.avatar}
                    alt={selectedCaregiver.name}
                    className="w-20 h-20 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="text-gray-900">{selectedCaregiver.name}</h3>
                    <p className="text-gray-600">{selectedCaregiver.serviceType}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(selectedCaregiver.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span>{selectedCaregiver.rating} ({selectedCaregiver.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl text-gray-900">${selectedCaregiver.hourlyRate}</p>
                    <p className="text-sm text-gray-600">per hour</p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">About</h4>
                  <p className="text-gray-600">{selectedCaregiver.bio}</p>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">Experience</h4>
                  <p className="text-gray-600">{selectedCaregiver.experience} years</p>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCaregiver.specialties.map(specialty => (
                      <Badge key={specialty} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-gray-900">Availability</h4>
                  <div className="flex gap-2">
                    {selectedCaregiver.availability.map(time => (
                      <Badge key={time}>{time}</Badge>
                    ))}
                  </div>
                </div>

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>Select your preferred shift type, date, and time</DialogDescription>
          </DialogHeader>
          {selectedCaregiver && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <ImageWithFallback
                  src={selectedCaregiver.avatar}
                  alt={selectedCaregiver.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-gray-900">{selectedCaregiver.name}</p>
                  <p className="text-sm text-gray-600">{selectedCaregiver.serviceType}</p>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Select Shift Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['3h', '12h', 'fullday'] as const).map(shift => (
                    <button
                      key={shift}
                      onClick={() => setBookingShift(shift)}
                      className={`p-3 border-2 rounded-lg transition-all ${
                        bookingShift === shift
                          ? 'border-[#FFA726] bg-[#FFA726] text-white'
                          : 'border-gray-200 hover:border-[#FFA726]'
                      }`}
                    >
                      <p className="text-sm">
                        {shift === '3h' ? '3 Hours' : shift === '12h' ? '12 Hours' : 'Full Day'}
                      </p>
                      <p className="text-xs">${getShiftPrice(selectedCaregiver.hourlyRate, shift)}</p>
                    </button>
                  ))}
                </div>
              </div>

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

              <div className="bg-[#E3F2FD] p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-700">Shift Type:</span>
                  <span className="text-gray-900">
                    {bookingShift === '3h' ? '3 Hours' : bookingShift === '12h' ? '12 Hours' : 'Full Day'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Price:</span>
                  <span className="text-xl text-gray-900">
                    ${getShiftPrice(selectedCaregiver.hourlyRate, bookingShift)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleSendRequest}
                className="w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
              >
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
            <DialogDescription>Enter your payment details to complete the booking</DialogDescription>
          </DialogHeader>
          {selectedBookingForPayment && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 mb-2">Amount to pay</p>
                <p className="text-3xl text-gray-900">${selectedBookingForPayment.totalPrice}</p>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Pay ${selectedBookingForPayment.totalPrice}
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
          {selectedBookingForRating && (
            <div className="space-y-6">
              <div className="text-center">
                <ImageWithFallback
                  src={selectedBookingForRating.caregiverAvatar}
                  alt={selectedBookingForRating.caregiverName}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <p className="text-gray-900">{selectedBookingForRating.caregiverName}</p>
                <p className="text-sm text-gray-600">{selectedBookingForRating.date}</p>
              </div>

              <div className="text-center">
                <p className="mb-3 text-gray-700">How was your experience?</p>
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setRatingValue(i + 1)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          i < ratingValue ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">Comments (Optional)</label>
                <textarea
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                  rows={4}
                  placeholder="Share your experience..."
                />
              </div>

              <button
                onClick={handleRating}
                className="w-full py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
              >
                Submit Rating
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
