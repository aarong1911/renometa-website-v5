import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import CaseStudyCard from '@/components/ui/CaseStudyCard';
import CaseStudyModal from '@/components/ui/CaseStudyModal';

const CaseStudiesSection = () => {
  const [openModal, setOpenModal] = useState<string | null>(null);

  const eliteContent = (
    <>
      <p>Elite Remodeling Co. wanted to improve their kitchen remodeling lead quality and lower their ad costs. We built a custom lead funnel, deployed our AI chat agent, and reactivated cold leads with SMS automation.</p>
      <ul className="list-disc list-inside">
        <li>📈 +103% increase in qualified leads</li>
        <li>💸 -32% drop in cost per lead</li>
        <li>⏱️ Results within the first 30 days</li>
        <li>🧠 AI-powered conversations pre-qualified leads before handoff</li>
      </ul>
    </>
  );

  const superiorContent = (
    <>
      <p>Superior Windows & Doors needed a better way to convert web traffic into booked consultations. We rebuilt their site structure and added dynamic CTAs and AI chat agents for instant responses.</p>
      <ul className="list-disc list-inside">
        <li>🚀 +87% conversion rate</li>
        <li>📈 25+ leads/month sustained</li>
        <li>🧰 Integrated lead pipeline and appointment booking</li>
      </ul>
    </>
  );

  const precisionContent = (
    <>
      <p>Precision Plumbing wanted to offer 24/7 service without overextending staff. We implemented an AI agent that handles chat, SMS, and after-hours bookings across channels.</p>
      <ul className="list-disc list-inside">
        <li>📅 +115% after-hours bookings</li>
        <li>🤝 98% customer satisfaction</li>
        <li>🛠️ Cut call overflow by 60%</li>
      </ul>
    </>
  );

  return (
    <section id="case-studies" className="section bg-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <span className="text-gold font-medium block">Case Studies</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4 text-blue-dark">
            Success Stories
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
            See how we've helped remodeling and home service businesses transform their digital presence and achieve remarkable results.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          <CaseStudyCard
            title="Elite Remodeling Co."
            description="How we helped a kitchen remodeler double their qualified leads while cutting ad spend by 30%."
            image="https://images.unsplash.com/photo-1484154218962-a197022b5858"
            results={[
              { label: 'Increase in Leads', value: '+103%' },
              { label: 'Cost Per Lead', value: '-32%' }
            ]}
            onClick={() => setOpenModal('elite')}
            delay={0}
          />

          <CaseStudyCard
            title="Superior Windows & Doors"
            description="Transforming a window installation company's website into a lead generation machine."
            image="https://images.unsplash.com/photo-1503174971373-b1f69850bded"
            results={[
              { label: 'Conversion Rate', value: '+87%' },
              { label: 'Monthly Leads', value: '25+' }
            ]}
            onClick={() => setOpenModal('superior')}
            delay={100}
          />

          <CaseStudyCard
            title="Precision Plumbing"
            description="How AI agents helped a plumbing company provide 24/7 service without hiring additional staff."
            image="https://images.unsplash.com/photo-1581578731548-c64695cc6952"
            results={[
              { label: 'After-Hours Bookings', value: '+115%' },
              { label: 'Customer Satisfaction', value: '98%' }
            ]}
            onClick={() => setOpenModal('precision')}
            delay={200}
          />
        </div>
      </div>

      {/* All modals */}
      <CaseStudyModal
        open={openModal === 'elite'}
        onOpenChange={() => setOpenModal(null)}
        title="Elite Remodeling Co."
        content={eliteContent}
      />
      <CaseStudyModal
        open={openModal === 'superior'}
        onOpenChange={() => setOpenModal(null)}
        title="Superior Windows & Doors"
        content={superiorContent}
      />
      <CaseStudyModal
        open={openModal === 'precision'}
        onOpenChange={() => setOpenModal(null)}
        title="Precision Plumbing"
        content={precisionContent}
      />
    </section>
  );
};

export default CaseStudiesSection;
