import { Heart, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
  navigate: (page: string) => void;
}

export function PrivacyPolicyPage({ navigate }: PrivacyPolicyPageProps) {
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
          <h1 className="mb-6 text-gray-900">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Last updated: October 25, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div>
            <h2 className="mb-4 text-gray-900">Introduction</h2>
            <p className="text-gray-600 mb-4">
              At CarePro, we take your privacy seriously. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our platform.
            </p>
            <p className="text-gray-600">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
              please do not access the platform.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Information We Collect</h2>
            <h3 className="mb-3 text-gray-900">Personal Information</h3>
            <p className="text-gray-600 mb-4">
              We collect personal information that you provide to us when registering for an account, including:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
              <li>Name, email address, and phone number</li>
              <li>Address and location information</li>
              <li>Payment information (processed securely through our payment processor)</li>
              <li>For providers: Professional credentials, certifications, work experience, and identification documents</li>
            </ul>

            <h3 className="mb-3 text-gray-900">Usage Information</h3>
            <p className="text-gray-600 mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Browser and device information</li>
              <li>IP address and location data</li>
              <li>Pages visited and actions taken on the platform</li>
              <li>Booking and service history</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process bookings and payments</li>
              <li>Verify caregiver credentials and conduct background checks</li>
              <li>Send notifications about bookings, payments, and account activity</li>
              <li>Respond to your comments, questions, and provide customer support</li>
              <li>Protect against fraud and unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>With caregivers when you book services (name, address, contact information)</li>
              <li>With service providers who help us operate our platform (payment processors, hosting services)</li>
              <li>When required by law or to protect our rights</li>
              <li>With your consent or at your direction</li>
            </ul>
            <p className="text-gray-600 mt-4">
              We do not sell your personal information to third parties.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Data Security</h2>
            <p className="text-gray-600 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Encryption of sensitive data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication</li>
              <li>Secure payment processing through certified providers</li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Your Rights</h2>
            <p className="text-gray-600 mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Export your data in a portable format</li>
            </ul>
            <p className="text-gray-600 mt-4">
              To exercise these rights, please contact us at privacy@carepro.com
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Cookies and Tracking</h2>
            <p className="text-gray-600">
              We use cookies and similar tracking technologies to track activity on our platform and hold certain
              information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Children's Privacy</h2>
            <p className="text-gray-600">
              Our platform is not intended for children under 18 years of age. We do not knowingly collect personal
              information from children under 18. If you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
              new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-gray-900">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have questions about this Privacy Policy, please contact us:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li>Email: privacy@carepro.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Care Street, New York, NY 10001</li>
            </ul>
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
