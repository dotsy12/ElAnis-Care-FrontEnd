import { useEffect } from 'react';
import { XCircle, Home, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentCancelProps {
  navigate?: (page: string) => void;
  requestId?: string;
}

export function PaymentCancel({ navigate, requestId: propRequestId }: PaymentCancelProps) {
  // Get request_id from URL params if not provided as prop
  const urlParams = new URLSearchParams(window.location.search);
  const requestId = propRequestId || urlParams.get('request_id') || '';

  useEffect(() => {
    toast.error('Payment was cancelled');
  }, []);

  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Cancelled</h1>
          
          <p className="text-gray-600 mb-6">
            Your payment was not completed. Don't worry, no charges were made to your account.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Your booking request is still active. You can try paying again from your requests page.
            </p>
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
              <RotateCcw className="w-5 h-5" />
              Try Again
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
