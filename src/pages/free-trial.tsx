import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { MessageSquare, BarChart2, Palette, Users } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ServiceCard from '@/components/ui/ServiceCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import Chatbot from '@/components/ui/Chatbot';
import SignupForm from '../components/ui/SignupForm';

const FreeTrial = () => {
  const features = [
    {
      title: 'AI Customer Service Agent',
      description:
        'Let AI handle customer inquiries 24/7, providing instant, accurate responses to common questions.',
      icon: <MessageSquare className="h-6 w-6" />,
      link: '#',
    },
    {
      title: 'Smart Landing Page',
      description:
        'Capture attention and convert visitors with a landing page tailored to your remodeling business.',
      icon: <BarChart2 className="h-6 w-6" />,
      link: '#',
    },
    {
      title: 'Custom Branding',
      description:
        'Personalize the chatbot appearance to match your brand identity seamlessly.',
      icon: <Palette className="h-6 w-6" />,
      link: '#',
    },
    {
      title: 'Real Visitor Interaction',
      description:
        'Engage with website visitors in real-time and convert them into customers.',
      icon: <Users className="h-6 w-6" />,
      link: '#',
    },
  ];

  const trustedCompanies = ['ABC Remodeling', 'HomeStyle Pro', 'Modern Living', 'Elite Renovations'];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] pt-32 pb-20 bg-gradient-to-br from-blue-dark to-blue-light overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <ScrollReveal>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Try RenoMeta Free for 14 Days
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Experience the Power of AI Customer Support for Your Remodeling Business
              </p>
            </ScrollReveal>

            {/* ✅ Replaced Continue with Google with SignupForm */}
            <ScrollReveal delay={400}>
              <div className="bg-white p-6 rounded-lg shadow-md text-left text-gray-800">
                <SignupForm />
              </div>
            </ScrollReveal>

            <p className="mt-6 text-sm text-white/80">
              No credit card required. Cancel anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-xl font-semibold text-center text-gold mb-2 uppercase tracking-wide">
              What’s Included in the Free Trial
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-dark">
              Everything You Need for Automated Customer Service
            </h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ServiceCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 100}
                showLearnMore={false}
                link={''}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-dark">
              Try the Agent Live
            </h2>
          </ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <Chatbot />
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-dark">
              Trusted by Leading Remodeling Companies
            </h2>
          </ScrollReveal>
          <div className="flex flex-wrap justify-center gap-8 items-center mb-16">
            {trustedCompanies.map((company) => (
              <div key={company} className="text-xl font-bold text-gray-400">
                {company}
              </div>
            ))}
          </div>
          <div className="max-w-3xl mx-auto">
            <TestimonialCard
              quote="RenoMeta's AI assistant has transformed how we handle customer inquiries. Our response time has improved dramatically, and our customers love the 24/7 availability."
              author="John Smith"
              position="CEO"
              company="Elite Renovations"
            />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FreeTrial;
