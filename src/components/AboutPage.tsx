import { Heart, ArrowLeft, Users, Award, Shield, Target } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface AboutPageProps {
  navigate: (page: string) => void;
}

export function AboutPage({ navigate }: AboutPageProps) {
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
          <div className="w-20 h-20 bg-[#FFA726] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="mb-6 text-gray-900">About CarePro</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're on a mission to connect families with trusted, qualified caregivers who provide compassionate,
            professional care services for elderly, children, and home healthcare needs.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="mb-6 text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                At CarePro, we believe everyone deserves access to quality, compassionate care. Our platform
                bridges the gap between families seeking trusted caregivers and experienced professionals
                dedicated to making a difference.
              </p>
              <p className="text-lg text-gray-600">
                We're committed to maintaining the highest standards of safety, reliability, and excellence
                in all our care services.
              </p>
            </div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1761234852472-85aeea9c3eac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwY2FyZWdpdmVyfGVufDF8fHx8MTc2MTQwNzMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Healthcare team"
              className="rounded-xl shadow-lg w-full h-[400px] object-cover"
            />
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-2 text-gray-900">Safety First</h3>
              <p className="text-gray-600">
                All caregivers undergo thorough background checks and verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-2 text-gray-900">Excellence</h3>
              <p className="text-gray-600">
                We maintain high standards and continuous quality improvement.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-2 text-gray-900">Community</h3>
              <p className="text-gray-600">
                Building a supportive network of caregivers and families.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-2 text-gray-900">Accessibility</h3>
              <p className="text-gray-600">
                Making quality care accessible and affordable for all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#E3F2FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center mb-12 text-gray-900">Our Impact</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-xl text-center">
              <p className="text-5xl mb-2 text-[#FFA726]">2,500+</p>
              <p className="text-gray-600">Verified Caregivers</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <p className="text-5xl mb-2 text-[#FFA726]">10,000+</p>
              <p className="text-gray-600">Families Served</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <p className="text-5xl mb-2 text-[#FFA726]">50+</p>
              <p className="text-gray-600">Cities Covered</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center">
              <p className="text-5xl mb-2 text-[#FFA726]">15+</p>
              <p className="text-gray-600">Years of Service</p>
            </div>
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
