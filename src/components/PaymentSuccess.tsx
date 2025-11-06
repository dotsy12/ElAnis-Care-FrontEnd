import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Home, FileText } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = 'https://elanis.runasp.net/api';

interface PaymentSuccessProps {
  navigate?: (page: string) => void;
  sessionId?: string;
}

export function PaymentSuccess({ navigate, sessionId: propSessionId }: PaymentSuccessProps) {
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  // Get session_id from URL params if not provided as prop
  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = propSessionId || urlParams.get('session_id') || '';

  useEffect(() => {
    // Stripe redirects back with session_id
    // The webhook should have already processed the payment
    // We just show a success message here
    
    if (!sessionId) {
      toast.error('Invalid payment session');
      if (navigate) {
        navigate('user-dashboard');
      } else {
        window.location.href = '/';
      }
      return;
    }

    // Optional: You could fetch payment details if needed
    // For now, just show success after a brief delay
    const timer = setTimeout(() => {
      setLoading(false);
      toast.success('Payment completed successfully!');
    }, 1500);

    return () => clearTimeout(timer);
  }, [sessionId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-[#FFA726] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
          <p className="text-gray-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Successful!</h1>
          
          <p className="text-gray-600 mb-6">
            Your payment has been processed successfully. The service provider will be notified and your booking is confirmed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Session ID</p>
            <p className="text-xs text-gray-900 font-mono break-all">{sessionId}</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => {
                if (navigate) {
                  navigate('user-dashboard');
                } else {
                  window.location.href = '/';
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
            >
              <FileText className="w-5 h-5" />
              View My Requests
            </button>
            
            <button
              onClick={() => {
                if (navigate) {
                  navigate('user-dashboard');
                } else {
                  window.location.href = '/';
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <Home className="w-5 h-5" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
