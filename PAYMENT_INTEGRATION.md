# Stripe Payment Integration - ElAnis Care

## Overview
This document describes the Stripe payment integration implemented in the ElAnis Care platform.

## Flow Overview

### 1. User Flow
1. User creates a service request
2. Provider accepts the request
3. Request status changes to "Accepted" - showing a "Pay Now" button
4. User clicks "Pay Now" → Payment dialog opens
5. User clicks "Proceed to Payment" → API call to create Stripe checkout session
6. User is redirected to Stripe's secure payment page
7. User completes payment on Stripe
8. User is redirected back to success/cancel page based on outcome

### 2. Backend API Endpoints

#### Create Checkout Session
```
POST /api/Payments/create-checkout
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "serviceRequestId": "guid"
}

Response:
{
  "succeeded": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "transactionId": "stripe_session_id",
    "amount": 100.00,
    ...
  }
}
```

#### Webhook Handler
```
POST /api/Payments/webhook
Content-Type: application/json
Stripe-Signature: {signature}

Body: Stripe webhook event
```

#### Get Payment Status
```
GET /api/Payments/request/{requestId}
Authorization: Bearer {token}
```

## Frontend Implementation

### Components Modified

#### 1. UserDashboard.tsx
- Added `paymentLoading` state
- Updated `handlePayment` function to call Stripe API
- Modified Payment Dialog to show:
  - Payment amount
  - Service details
  - Stripe security notice
  - Loading state during checkout session creation

**Key Changes:**
```typescript
const handlePayment = async () => {
  // Calls /api/Payments/create-checkout
  // Redirects to checkoutUrl from response
  window.location.href = result.data.checkoutUrl;
};
```

#### 2. PaymentSuccess.tsx (New)
- Displays success message after payment
- Shows session ID
- Provides navigation back to dashboard
- Supports both prop-based and URL-based navigation

#### 3. PaymentCancel.tsx (New)
- Displays cancellation message
- Informs user no charges were made
- Provides retry option
- Supports both prop-based and URL-based navigation

#### 4. App.tsx
- Added routes for payment-success and payment-cancel pages
- Added URL parameter detection in useEffect:
  ```typescript
  // Detects /payment/success?session_id=xxx
  // Detects /payment/cancel?request_id=xxx
  ```

### Configuration Files Modified

#### vite.config.ts
- Added `historyApiFallback: true` for SPA routing support
- Ensures all routes redirect to index.html in development

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
# react-router-dom and TypeScript types already installed
```

### 2. Environment Variables
The backend should have these configured:
```
StripeSettings:SecretKey=sk_test_...
StripeSettings:PublishableKey=pk_test_...
StripeSettings:WebhookSecret=whsec_...
```

### 3. Backend Configuration
Update URLs in `PaymentService.cs` if needed:
```csharp
SuccessUrl = "https://localhost:3000/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
CancelUrl = "https://localhost:3000/payment/cancel?request_id={request.ServiceRequestId}"
```

**Note:** For production, update these URLs to your production domain:
```csharp
SuccessUrl = "https://your-domain.com/payment/success?session_id={{CHECKOUT_SESSION_ID}}"
CancelUrl = "https://your-domain.com/payment/cancel?request_id={request.ServiceRequestId}"
```

### 4. Run the Application
```bash
npm run dev
# Server starts on http://localhost:3000
```

## Testing Payment Flow

### Test Cards (Stripe Test Mode)
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **3D Secure:** 4000 0025 0000 3155

Use any future date for expiry and any 3 digits for CVV.

### Testing Steps
1. Login as a user
2. Create a service request
3. Wait for provider to accept (or manually update in DB)
4. Click "Pay Now" on the accepted request
5. Review payment details in dialog
6. Click "Proceed to Payment"
7. Complete payment on Stripe page
8. Verify redirect to success page
9. Check payment status in "Payments" tab

## Webhook Configuration

### Local Testing with Stripe CLI
```bash
# Install Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to https://localhost:7299/api/Payments/webhook

# Copy the webhook secret to appsettings.json
```

### Production Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/Payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy webhook secret to production config

## Security Considerations

1. **Always use HTTPS in production**
2. **Never expose Stripe secret keys in frontend**
3. **Validate webhook signatures** (handled by backend)
4. **Use Bearer tokens** for API authentication
5. **Implement CORS properly** on backend

## Troubleshooting

### Issue: 401 Unauthorized
- **Cause:** Missing or invalid access token
- **Solution:** Ensure user is logged in and token is in localStorage

### Issue: Payment dialog shows but API fails
- **Cause:** Backend Stripe configuration missing
- **Solution:** Check backend appsettings.json for Stripe keys

### Issue: Redirect doesn't work after payment
- **Cause:** vite.config missing historyApiFallback
- **Solution:** Already added, restart dev server

### Issue: Webhook not receiving events
- **Cause:** Webhook secret mismatch or endpoint unreachable
- **Solution:** Use Stripe CLI for local testing, verify endpoint in production

## File Structure
```
src/
├── components/
│   ├── UserDashboard.tsx          # Updated with payment logic
│   ├── PaymentSuccess.tsx         # New - success page
│   ├── PaymentCancel.tsx          # New - cancel page
│   └── ui/
│       ├── dialog.tsx             # Used for payment dialog
│       └── ...
├── App.tsx                         # Updated with payment routes
└── ...

vite.config.ts                      # Updated with historyApiFallback

PAYMENT_INTEGRATION.md              # This file
```

## API Response Examples

### Create Checkout Success
```json
{
  "statusCode": 200,
  "succeeded": true,
  "message": "Stripe checkout session created successfully",
  "errors": null,
  "data": {
    "id": "00000000-0000-0000-0000-000000000000",
    "serviceRequestId": "123e4567-e89b-12d3-a456-426614174000",
    "amount": 66.00,
    "paymentMethod": 1,
    "paymentStatus": 1,
    "transactionId": "cs_test_a1b2c3...",
    "checkoutUrl": "https://checkout.stripe.com/c/pay/cs_test_...",
    "createdAt": "2025-11-02T17:00:00Z",
    "paidAt": null
  }
}
```

### Error Response
```json
{
  "statusCode": 400,
  "succeeded": false,
  "message": "Request must be accepted before payment",
  "errors": ["Invalid request status"],
  "data": null
}
```

## Payment Statuses
- **0:** Pending
- **1:** Completed
- **2:** Failed
- **3:** Refunded

## Support
For issues or questions:
- Check Stripe Dashboard logs
- Review backend logs for API errors
- Use browser DevTools to inspect network requests
