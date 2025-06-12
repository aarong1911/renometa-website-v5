
import React from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ScheduleAppointmentModal from '../ui/ScheduleAppointmentModal';

interface CTAHeroSectionProps {
  onScrollToSection: (id: string) => void;
}

const CTAHeroSection = ({ onScrollToSection }: CTAHeroSectionProps) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = React.useState(false);
  
  return (
    <section id="cta" className="section bg-gradient-to-br from-blue-dark to-blue-light text-white">
      <div className="container-custom text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
            Ready to Transform Your Digital Presence?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule a free 30-minute strategy call to discover how we can help your remodeling business thrive online.
          </p>
          <div className="flex flex-col items-center justify-center">
            <Button
  onClick={() => setModalOpen(true)}
  className="group bg-[#d9ab57] text-[#1d2939] hover:bg-[#c89b4d] transition-colors rounded-md px-6 py-3 text-base font-semibold flex items-center justify-center shadow-md"
>
  <span>Schedule Appointment</span>
  <span className="ml-2 transform transition-transform duration-200 group-hover:translate-x-1">
    ➜
  </span>
</Button>


   <ScheduleAppointmentModal open={modalOpen} onOpenChange={setModalOpen} />
            
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTAHeroSection;
