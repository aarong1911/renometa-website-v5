
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const AboutContentSection = () => {
  return (
    <section className="section bg-white">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl text-gray-600 mb-8">
                RenoMeta isn't your average marketing agency — we're the digital backbone for remodeling, HVAC, and home service companies ready to scale.
              </p>
              
              <p className="text-gray-700 mb-6">
                We combine smart websites, advanced SEO, AI-powered agents, and intelligent automation into one seamless system designed to attract, convert, and retain customers — all while you focus on doing what you do best.
              </p>
              
              <h3 className="text-2xl font-bold text-blue-dark mt-10 mb-4">
                We started with a simple idea:
              </h3>
              <p className="text-xl font-medium text-blue-dark mb-4">
                Stop the chaos. Start the systems.
              </p>
              <p className="text-gray-700 mb-8">
                Most service businesses run on referrals, sticky notes, and missed calls. We fix that — fast. From the first click to the final invoice, we turn your customer journey into a conversion machine.
              </p>
              
              <h3 className="text-2xl font-bold text-blue-dark mt-10 mb-4">
                What We Deliver:
              </h3>
              <ul className="list-disc pl-6 space-y-2 mb-8">
                <li>High-performance websites that impress and convert</li>
                <li>Lead generation systems that work while you sleep</li>
                <li>AI agents that handle inquiries, bookings, and follow-ups</li>
                <li>CRM and automation that eliminate the busywork</li>
                <li>SEO and local domination strategies to keep your calendar full</li>
              </ul>
              
              <p className="text-xl font-medium text-blue-dark mt-10 mb-4">
                We don't just build websites. We build growth engines.
              </p>
              <p className="text-gray-700 mb-6">
                Whether you're a solo contractor or a growing team, RenoMeta gives you the tools, tech, and strategy to compete with the big players — without big-agency headaches.
              </p>
              
              <p className="text-xl font-bold text-blue-dark mt-10 italic">
                This is your empire. We're just here to help build it faster.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default AboutContentSection;
