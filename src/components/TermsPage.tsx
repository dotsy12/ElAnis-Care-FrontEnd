import { Heart, ArrowLeft } from 'lucide-react';

interface TermsPageProps {
  navigate: (page: string) => void;
}

export function TermsPage({ navigate }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('landing')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#FFA726] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#E3F2FD] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="mb-6 text-gray-900">Terms & Conditions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last updated: October 25, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="mb-4 text-gray-900">Agreement to Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using CarePro, you agree to be bound by these Terms and Conditions and our Privacy Policy.
              If you do not agree to these terms, please do not use our platform.
            </p>
            <p className="text-gray-600">
              We reserve the right to modify these terms at any time. We will notify users of any material changes.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Platform Description</h2>
            <p className="text-gray-600 mb-4">
              CarePro is a platform that connects users seeking care services with qualified care providers. We facilitate
              the connection between users and providers but are not directly responsible for the services provided.
            </p>
            <p className="text-gray-600">
              CarePro acts as an intermediary and marketplace. The actual care services are provided by independent
              caregivers who register on our platform.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">User Responsibilities</h2>
            <h3 className="mb-3 text-gray-900">For Service Users</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Provide accurate information during registration and booking</li>
              <li>Treat caregivers with respect and professionalism</li>
              <li>Make timely payments for services rendered</li>
              <li>Cancel bookings according to our cancellation policy</li>
              <li>Provide honest ratings and reviews</li>
              <li>Ensure a safe environment for caregivers</li>
            </ul>

            <h3 className="mb-3 text-gray-900">For Care Providers</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide accurate credentials, certifications, and professional information</li>
              <li>Maintain valid certifications and licenses required for your services</li>
              <li>Deliver professional, quality care services</li>
              <li>Respond to booking requests in a timely manner</li>
              <li>Update availability accurately</li>
              <li>Follow all applicable laws and regulations</li>
              <li>Maintain client confidentiality</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Booking and Payment</h2>
            <h3 className="mb-3 text-gray-900">Booking Process</h3>
            <p className="text-gray-600 mb-4">
              Users can search for and book caregivers through our platform. Bookings are subject to caregiver acceptance.
              Payment is required upon caregiver acceptance before service delivery.
            </p>

            <h3 className="mb-3 text-gray-900">Payment Terms</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>All payments must be made through the platform</li>
              <li>Prices are displayed before booking confirmation</li>
              <li>Platform fees and service charges apply</li>
              <li>Payments are non-refundable except as specified in our cancellation policy</li>
            </ul>

            <h3 className="mb-3 text-gray-900">Cancellation Policy</h3>
            <p className="text-gray-600 mb-2">
              Cancellations made:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>More than 24 hours before service: Full refund</li>
              <li>12-24 hours before service: 50% refund</li>
              <li>Less than 12 hours before service: No refund</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Verification and Background Checks</h2>
            <p className="text-gray-600 mb-4">
              CarePro conducts background checks and verification of caregiver credentials. However, we cannot guarantee
              the accuracy of all information provided by caregivers or ensure specific outcomes of care services.
            </p>
            <p className="text-gray-600">
              Users are encouraged to review caregiver profiles, ratings, and reviews before booking.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Ratings and Reviews</h2>
            <p className="text-gray-600 mb-4">
              Users may rate and review caregivers after service completion. Reviews must be:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Honest and based on actual experience</li>
              <li>Respectful and professional</li>
              <li>Free from discriminatory or offensive content</li>
              <li>Not defamatory or misleading</li>
            </ul>
            <p className="text-gray-600 mt-4">
              CarePro reserves the right to remove reviews that violate these guidelines.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Prohibited Activities</h2>
            <p className="text-gray-600 mb-4">
              Users are prohibited from:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Using the platform for any illegal purpose</li>
              <li>Providing false or misleading information</li>
              <li>Attempting to circumvent platform fees by arranging payment outside the platform</li>
              <li>Harassing, threatening, or discriminating against other users</li>
              <li>Attempting to gain unauthorized access to the platform</li>
              <li>Uploading malicious code or viruses</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Limitation of Liability</h2>
            <p className="text-gray-600 mb-4">
              CarePro provides a platform to connect users with caregivers but does not employ caregivers or directly
              provide care services. To the fullest extent permitted by law:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>We are not liable for the quality of care services provided</li>
              <li>We are not responsible for disputes between users and caregivers</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the amount paid for the specific service</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Dispute Resolution</h2>
            <p className="text-gray-600 mb-4">
              In case of disputes:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Contact our support team first for mediation</li>
              <li>Disputes will be governed by the laws of the State of New York</li>
              <li>Users agree to binding arbitration for dispute resolution</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Account Termination</h2>
            <p className="text-gray-600 mb-4">
              We reserve the right to suspend or terminate accounts that:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Violate these Terms and Conditions</li>
              <li>Engage in fraudulent activity</li>
              <li>Receive multiple complaints or negative reports</li>
              <li>Remain inactive for extended periods</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Intellectual Property</h2>
            <p className="text-gray-600">
              All content on the CarePro platform, including text, graphics, logos, and software, is the property of
              CarePro and is protected by copyright and trademark laws. Users may not reproduce, distribute, or create
              derivative works without our express permission.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Contact Information</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms and Conditions:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>Email: legal@carepro.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Care Street, New York, NY 10001</li>
            </ul>
          </div>

          <div className="pt-8 border-t-2 border-gray-200">
            <p className="text-gray-600 text-sm">
              By using CarePro, you acknowledge that you have read, understood, and agree to be bound by these
              Terms and Conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-[#FFA726]" />
            <span className="text-xl">CarePro</span>
          </div>
          <p className="text-gray-400">&copy; 2025 CarePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
