import { useEffect } from 'react';
import { XCircle, Home, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/PaymentCancel.css';

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
    <div className="payment-cancel-page">
      <div className="payment-cancel-card">
        <div className="payment-cancel-content">
          <div className="payment-cancel-icon">
            <XCircle className="payment-cancel-x-icon" />
          </div>
          
          <h1 className="payment-cancel-title">Payment Cancelled</h1>
          
          <p className="payment-cancel-message">
            Your payment was not completed. Don't worry, no charges were made to your account.
          </p>

          <div className="payment-cancel-warning">
            <p className="payment-cancel-warning-text">
              Your booking request is still active. You can try paying again from your requests page.
            </p>
          </div>

          <div className="payment-cancel-actions">
            <button
              onClick={() => {
                if (navigate) {
                  navigate('user-dashboard');
                } else {
                  window.location.href = '/';
                }
              }}
              className="payment-cancel-retry-btn"
            >
              <RotateCcw className="payment-cancel-retry-icon" />
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
              className="payment-cancel-home-btn"
            >
              <Home className="payment-cancel-home-icon" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}