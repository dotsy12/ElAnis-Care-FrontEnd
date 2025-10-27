import { Heart, ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';

interface FAQPageProps {
  navigate: (page: string) => void;
}

export function FAQPage({ navigate }: FAQPageProps) {
  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'What is CarePro?',
          a: 'CarePro is a trusted platform connecting families with verified, experienced caregivers for elderly care, child care, and home nursing services. We ensure quality, safety, and reliability in all our care services.',
        },
        {
          q: 'How does CarePro work?',
          a: 'Users can search for caregivers based on their needs, location, and availability. Once you find a suitable caregiver, you can send a booking request, and upon acceptance, proceed with payment. After the service is completed, you can rate your experience.',
        },
        {
          q: 'Is CarePro available in my area?',
          a: 'We currently operate in over 50 cities across the United States. You can search for caregivers by entering your city to see available providers in your area.',
        },
      ],
    },
    {
      category: 'For Users',
      questions: [
        {
          q: 'How do I book a caregiver?',
          a: 'After logging in, browse available caregivers, view their profiles, and click "Send Request" on your preferred caregiver. Select your desired shift type (3 hours, 12 hours, or full day), date, and time. The caregiver will review and respond to your request.',
        },
        {
          q: 'What payment methods are accepted?',
          a: 'We accept major credit cards, debit cards, and secure online payment methods. Payments are processed securely after the caregiver accepts your booking request.',
        },
        {
          q: 'Can I cancel a booking?',
          a: 'Yes, you can cancel a booking before it starts. Please refer to our cancellation policy for details on refunds and notice requirements.',
        },
        {
          q: 'How are caregivers verified?',
          a: 'All caregivers undergo thorough background checks, certification verification, and experience validation before being approved on our platform.',
        },
      ],
    },
    {
      category: 'For Providers',
      questions: [
        {
          q: 'How do I become a caregiver on CarePro?',
          a: 'Click "Register as Provider" and complete the registration form with your professional details, experience, certifications, and CV. Our admin team will review your application and notify you of the approval status.',
        },
        {
          q: 'What documents do I need to provide?',
          a: 'You need to provide valid certifications (CPR, First Aid, nursing licenses, etc.), a current CV/resume, government-issued ID, and proof of experience in caregiving.',
        },
        {
          q: 'How do I get paid?',
          a: 'Payments are processed after service completion and transferred to your registered bank account. You can view your earnings and transaction history in your provider dashboard.',
        },
        {
          q: 'Can I set my own rates?',
          a: 'Rates are based on platform guidelines and your experience level. You can update your hourly rate in your profile settings, subject to admin approval.',
        },
        {
          q: 'What if I need to reject a request?',
          a: 'You can accept or reject service requests in your dashboard. If rejecting, please provide a reason so the client understands your decision.',
        },
      ],
    },
    {
      category: 'Safety & Privacy',
      questions: [
        {
          q: 'How is my personal information protected?',
          a: 'We use industry-standard encryption and security measures to protect your personal data. Please review our Privacy Policy for detailed information.',
        },
        {
          q: 'What safety measures are in place?',
          a: 'All caregivers are background-checked and verified. We have a rating and review system, 24/7 support, and safety protocols to ensure secure service delivery.',
        },
        {
          q: 'What should I do in case of an emergency?',
          a: 'In case of emergency, call emergency services immediately (911). You can also contact our 24/7 support line for assistance.',
        },
      ],
    },
    {
      category: 'Pricing',
      questions: [
        {
          q: 'What are the shift types and pricing?',
          a: 'We offer three shift types: 3-hour shifts, 12-hour shifts, and full-day (24-hour) shifts. Pricing varies based on the caregiver\'s experience and hourly rate. You can see the total cost before confirming your booking.',
        },
        {
          q: 'Are there any hidden fees?',
          a: 'No, all fees are displayed upfront before you confirm your booking. The price you see is the price you pay.',
        },
        {
          q: 'Do you offer refunds?',
          a: 'Refunds are available based on our cancellation policy. Please contact support for specific refund requests.',
        },
      ],
    },
  ];

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
          <h1 className="mb-6 text-gray-900">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our platform, services, and policies.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((section, idx) => (
            <div key={idx} className="mb-12">
              <h2 className="mb-6 text-gray-900">{section.category}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {section.questions.map((faq, qIdx) => (
                  <AccordionItem
                    key={qIdx}
                    value={`${idx}-${qIdx}`}
                    className="bg-white border-2 border-gray-200 rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="text-gray-900">{faq.q}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}

          <div className="mt-12 p-8 bg-[#E3F2FD] rounded-xl text-center">
            <h3 className="mb-3 text-gray-900">Still have questions?</h3>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Our support team is here to help.
            </p>
            <button
              onClick={() => navigate('contact')}
              className="px-8 py-3 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
            >
              Contact Support
            </button>
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
