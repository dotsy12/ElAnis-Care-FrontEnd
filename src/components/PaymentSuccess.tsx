import { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Home, FileText } from 'lucide-react';
import { toast } from 'sonner';
import '../styles/PaymentSuccess.css';

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
      <div className="payment-success-page">
        <div className="payment-success-loading">
          <Loader2 className="payment-success-spinner" />
          <h2 className="payment-success-loading-title">Processing Payment</h2>
          <p className="payment-success-loading-text">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="payment-success-card">
        <div className="payment-success-content">
          <div className="payment-success-icon">
            <CheckCircle className="payment-success-check-icon" />
          </div>
          
          <h1 className="payment-success-title">Payment Successful!</h1>
          
          <p className="payment-success-message">
            Your payment has been processed successfully. The service provider will be notified and your booking is confirmed.
          </p>

          <div className="payment-success-session">
            <p className="payment-success-session-label">Session ID</p>
            <p className="payment-success-session-id">{sessionId}</p>
          </div>

          <div className="payment-success-actions">
            <button
              onClick={() => {
                if (navigate) {
                  navigate('user-dashboard');
                } else {
                  window.location.href = '/';
                }
              }}
              className="payment-success-requests-btn"
            >
              <FileText className="payment-success-requests-icon" />
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
              className="payment-success-home-btn"
            >
              <Home className="payment-success-home-icon" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}