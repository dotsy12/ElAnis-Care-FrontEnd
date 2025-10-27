import { ImageWithFallback } from './figma/ImageWithFallback';
import { Heart, Shield, Star, Clock, Users, Award } from 'lucide-react';

interface LandingPageProps {
  navigate: (page: string) => void;
}

export function LandingPage({ navigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-[#FFA726]" />
            <span className="text-2xl">CarePro</span>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <button onClick={() => navigate('about')} className="text-gray-700 hover:text-[#FFA726] transition-colors">
              About
            </button>
            <button onClick={() => navigate('faq')} className="text-gray-700 hover:text-[#FFA726] transition-colors">
              FAQ
            </button>
            <button onClick={() => navigate('contact')} className="text-gray-700 hover:text-[#FFA726] transition-colors">
              Contact
            </button>
            <button
              onClick={() => navigate('login')}
              className="px-5 py-2 border-2 border-[#FFA726] text-[#FFA726] rounded-lg hover:bg-[#FFA726] hover:text-white transition-all"
            >
              Login
            </button>
            <button
              onClick={() => navigate('register')}
              className="px-5 py-2 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
            >
              Register
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#E3F2FD] to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6 text-gray-900">
                Your trusted platform for elderly, child, and home care services
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Connect with verified, experienced caregivers in your area. Book services easily and securely.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('register')}
                  className="px-8 py-4 bg-[#FFA726] text-white rounded-lg hover:bg-[#FB8C00] transition-colors"
                >
                  Register as User
                </button>
                <button
                  onClick={() => navigate('register')}
                  className="px-8 py-4 border-2 border-[#FFA726] text-[#FFA726] rounded-lg hover:bg-[#FFA726] hover:text-white transition-all"
                >
                  Register as Provider
                </button>
              </div>
            </div>
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1676281050264-178eff38874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMG51cnNlfGVufDF8fHx8MTc2MTQwNzMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Caregiver with elderly person"
                className="rounded-2xl shadow-2xl w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-gray-900">Why Choose CarePro?</h2>
            <p className="text-xl text-gray-600">The most trusted care platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#E3F2FD] p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-3 text-gray-900">Find Trusted Caregivers</h3>
              <p className="text-gray-600">
                All our caregivers are verified with background checks, certifications, and experience validation.
              </p>
            </div>
            <div className="bg-[#E3F2FD] p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-3 text-gray-900">Book Easily and Securely</h3>
              <p className="text-gray-600">
                Simple booking process with flexible scheduling. Secure payments and instant confirmations.
              </p>
            </div>
            <div className="bg-[#E3F2FD] p-8 rounded-xl text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-[#FFA726]" />
              </div>
              <h3 className="mb-3 text-gray-900">Rate Your Experience</h3>
              <p className="text-gray-600">
                Share feedback and help others make informed decisions. Quality assurance through reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#E3F2FD]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-gray-900">Our Services</h2>
            <p className="text-xl text-gray-600">Comprehensive care solutions for your family</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1676281050264-178eff38874a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwY2FyZSUyMG51cnNlfGVufDF8fHx8MTc2MTQwNzMzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Elderly care"
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <h3 className="mb-2 text-gray-900">Elderly Care</h3>
              <p className="text-gray-600">
                Compassionate care for seniors including companionship, medication management, and daily activities assistance.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1578349035260-9f3d4042f1f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsZCUyMGNhcmV8ZW58MXx8fHwxNzYxNDA3MzM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Child care"
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <h3 className="mb-2 text-gray-900">Child Care</h3>
              <p className="text-gray-600">
                Experienced nannies and babysitters to provide loving care, educational activities, and safe supervision.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1608979827489-2b855e79debe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwbnVyc2luZ3xlbnwxfHx8fDE3NjE0MDczMzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Home nursing"
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <h3 className="mb-2 text-gray-900">Home Nursing</h3>
              <p className="text-gray-600">
                Professional nursing services at home including wound care, medication administration, and health monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 text-[#FFA726] mx-auto mb-3" />
              <div className="text-4xl mb-2 text-gray-900">2,500+</div>
              <p className="text-gray-600">Verified Caregivers</p>
            </div>
            <div>
              <Heart className="w-12 h-12 text-[#FFA726] mx-auto mb-3" />
              <div className="text-4xl mb-2 text-gray-900">10,000+</div>
              <p className="text-gray-600">Happy Families</p>
            </div>
            <div>
              <Award className="w-12 h-12 text-[#FFA726] mx-auto mb-3" />
              <div className="text-4xl mb-2 text-gray-900">15+</div>
              <p className="text-gray-600">Years Experience</p>
            </div>
            <div>
              <Star className="w-12 h-12 text-[#FFA726] mx-auto mb-3" />
              <div className="text-4xl mb-2 text-gray-900">4.9/5</div>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-[#FFA726]" />
                <span className="text-xl">CarePro</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for quality care services.
              </p>
            </div>
            <div>
              <h4 className="mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('about')} className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('faq')} className="text-gray-400 hover:text-white transition-colors">
                    FAQ
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('contact')} className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigate('privacy')} className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('terms')} className="text-gray-400 hover:text-white transition-colors">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4">Contact Info</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@carepro.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Care Street, City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CarePro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
