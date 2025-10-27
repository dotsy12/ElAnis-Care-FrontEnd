import { useState } from 'react';
import { User } from '../App';
import {
  Home, UserCircle, Calendar as CalendarIcon, MapPin, FileText, DollarSign,
  LogOut, Check, X, Clock, Star, Bell
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';

interface ProviderDashboardProps {
  user: User | null;
  navigate: (page: string) => void;
  onLogout: () => void;
}

interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userAddress: string;
  shiftType: '3h' | '12h' | 'fullday';
  date: string;
  time: string;
  price: number;
  status: 'pending' | 'accepted' | 'rejected';
  rejectionReason?: string;
}

interface CompletedJob {
  id: string;
  userName: string;
  date: string;
  shiftType: string;
  earnings: number;
  rating: number;
}

export function ProviderDashboard({ user, navigate, onLogout }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date()]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>(['Morning']);
  const [workAreas, setWorkAreas] = useState<string[]>(['New York', 'Brooklyn']);
  const [newArea, setNewArea] = useState('');
  
  const [requests, setRequests] = useState<ServiceRequest[]>([
    {
      id: 'r1',
      userId: 'u1',
      userName: 'John Doe',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      userAddress: '123 Main St, New York',
      shiftType: '12h',
      date: '2025-10-28',
      time: '09:00',
      price: 300,
      status: 'pending',
    },
    {
      id: 'r2',
      userId: 'u2',
      userName: 'Jane Smith',
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      userAddress: '456 Oak Ave, Brooklyn',
      shiftType: '3h',
      date: '2025-10-27',
      time: '14:00',
      price: 75,
      status: 'pending',
    },
  ]);

  const [completedJobs] = useState<CompletedJob[]>([
    {
      id: 'j1',
      userName: 'Mary Johnson',
      date: '2025-10-20',
      shiftType: '12h',
      earnings: 300,
      rating: 5,
    },
    {
      id: 'j2',
      userName: 'Robert Wilson',
      date: '2025-10-18',
      shiftType: 'Full Day',
      earnings: 600,
      rating: 5,
    },
    {
      id: 'j3',
      userName: 'Lisa Brown',
      date: '2025-10-15',
      shiftType: '3h',
      earnings: 75,
      rating: 4,
    },
  ]);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRequestForReject, setSelectedRequestForReject] = useState<ServiceRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const timeSlots = ['Morning', 'Afternoon', 'Evening', 'Night'];

  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.earnings, 0);
  const averageRating = completedJobs.length > 0
    ? (completedJobs.reduce((sum, job) => sum + job.rating, 0) / completedJobs.length).toFixed(1)
    : '0';

  const handleAcceptRequest = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'accepted' } : req
      )
    );
    toast.success('Request accepted!');
  };

  const handleRejectRequest = () => {
    if (!selectedRequestForReject || !rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }

    setRequests(prev =>
      prev.map(req =>
        req.id === selectedRequestForReject.id
          ? { ...req, status: 'rejected', rejectionReason }
          : req
      )
    );
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

  const addWorkArea = () => {
    if (newArea.trim() && !workAreas.includes(newArea.trim())) {
      setWorkAreas(prev => [...prev, newArea.trim()]);
      setNewArea('');
      toast.success('Work area added');
    }
  };

  const removeWorkArea = (area: string) => {
    setWorkAreas(prev => prev.filter(a => a !== area));
    toast.success('Work area removed');
  };

  return (
    <div className="min-h-screen bg-[#E3F2FD]">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h2 className="text-gray-900">CarePro - Provider</h2>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Bell className="w-6 h-6" />
              {requests.filter(r => r.status === 'pending').length > 0 && (
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
                {requests.filter(r => r.status === 'pending').length > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {requests.filter(r => r.status === 'pending').length}
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
                        <p className="text-2xl text-gray-900">{completedJobs.length}</p>
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
                    {requests
                      .filter(r => r.status === 'pending')
                      .slice(0, 3)
                      .map(request => (
                        <div key={request.id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <ImageWithFallback
                              src={request.userAvatar}
                              alt={request.userName}
                              className="w-12 h-12 rounded-full"
                            />
                            <div>
                              <p className="text-gray-900">{request.userName}</p>
                              <p className="text-sm text-gray-500">
                                {request.date} at {request.time} - {request.shiftType}
                              </p>
                            </div>
                          </div>
                          <p className="text-gray-900">${request.price}</p>
                        </div>
                      ))}
                    {requests.filter(r => r.status === 'pending').length === 0 && (
                      <p className="text-center text-gray-500 py-4">No pending requests</p>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Recent Jobs</h3>
                  <div className="space-y-3">
                    {completedJobs.slice(0, 3).map(job => (
                      <div key={job.id} className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg">
                        <div>
                          <p className="text-gray-900">{job.userName}</p>
                          <p className="text-sm text-gray-500">{job.date} - {job.shiftType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-900">${job.earnings}</p>
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{job.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">My Profile</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <ImageWithFallback
                      src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Provider'}
                      alt={user?.name || 'Provider'}
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h4 className="text-gray-900">{user?.name}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                      <Badge className="mt-2">Approved Provider</Badge>
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

                  <div>
                    <label className="block text-gray-700 mb-2">Professional Bio</label>
                    <Textarea
                      defaultValue="Experienced caregiver with 8+ years of experience in elderly care, specializing in dementia care and mobility assistance. Passionate about helping seniors maintain their independence and quality of life."
                      rows={5}
                      className="focus:border-[#FFA726]"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Hourly Rate ($)</label>
                    <input
                      type="number"
                      defaultValue="25"
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                    />
                  </div>

                  <div>
                    <h4 className="mb-3 text-gray-900">Uploaded Documents</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Nursing Certificate.pdf</span>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">CV_Resume.pdf</span>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors">
                    Save Changes
                  </button>
                </div>
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
                        onSelect={(dates) => setSelectedDates(dates as Date[])}
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
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                      placeholder="Enter city or area..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#FFA726] focus:outline-none"
                      onKeyPress={(e) => e.key === 'Enter' && addWorkArea()}
                    />
                    <button
                      onClick={addWorkArea}
                      className="px-6 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                    >
                      Add
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-gray-900">Your Work Areas:</h4>
                    {workAreas.map(area => (
                      <div
                        key={area}
                        className="flex items-center justify-between p-3 bg-[#E3F2FD] rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-[#FFA726]" />
                          <span className="text-gray-900">{area}</span>
                        </div>
                        <button
                          onClick={() => removeWorkArea(area)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="mb-6 text-gray-900">Service Requests</h3>
                <div className="space-y-4">
                  {requests.map(request => (
                    <div key={request.id} className="border-2 border-gray-200 rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <ImageWithFallback
                          src={request.userAvatar}
                          alt={request.userName}
                          className="w-16 h-16 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-900">{request.userName}</h4>
                            <Badge
                              variant={
                                request.status === 'accepted'
                                  ? 'default'
                                  : request.status === 'rejected'
                                  ? 'destructive'
                                  : 'secondary'
                              }
                            >
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            <p>📍 {request.userAddress}</p>
                            <p>📅 {request.date}</p>
                            <p>🕐 {request.time}</p>
                            <p>⏱️ {request.shiftType}</p>
                          </div>
                          <p className="text-lg text-gray-900 mb-3">
                            Payment: <span>${request.price}</span>
                          </p>
                          {request.status === 'rejected' && request.rejectionReason && (
                            <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                              <p className="text-sm text-red-800">
                                <strong>Rejection Reason:</strong> {request.rejectionReason}
                              </p>
                            </div>
                          )}
                          {request.status === 'pending' && (
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
                  {requests.length === 0 && (
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
                      <p className="text-4xl">{completedJobs.length}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="mb-4 text-gray-900">Completed Jobs</h3>
                  <div className="space-y-3">
                    {completedJobs.map(job => (
                      <div
                        key={job.id}
                        className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg hover:border-[#FFA726] transition-colors"
                      >
                        <div>
                          <p className="text-gray-900">{job.userName}</p>
                          <p className="text-sm text-gray-600">
                            {job.date} - {job.shiftType}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl text-gray-900">${job.earnings}</p>
                          <div className="flex items-center gap-1 justify-end mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < job.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
