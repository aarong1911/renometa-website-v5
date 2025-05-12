
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogOverlay
} from '@/components/ui/dialog';

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
}

export default function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Submit the form data to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || null,
            company: formData.company || null,
            service_interest: formData.service || null,
            message: formData.message
          },
        ]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll be in touch with you shortly.",
      });

      // Reset form and close modal after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: ''
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Something went wrong",
        description: "Your message couldn't be sent. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/50" />
      <DialogContent className="bg-[#1d2939] text-white sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-bold mb-4">Get in Touch</DialogTitle>
        <DialogDescription className="sr-only">
          Fill out the form below to send us a message.
        </DialogDescription>
        
        <Button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
          variant="ghost"
          size="icon"
          aria-label="Close contact form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </Button>
        
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label htmlFor="contact-name" className="block text-sm mb-1">
              Full Name *
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className="w-full p-3 rounded border border-gray-300 text-gray-900"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm mb-1">
              Email Address *
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full p-3 rounded border border-gray-300 text-gray-900"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contact-phone" className="block text-sm mb-1">
              Phone Number
            </label>
            <input
              id="contact-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(123) 456-7890"
              className="w-full p-3 rounded border border-gray-300 text-gray-900"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="contact-company" className="block text-sm mb-1">
              Company
            </label>
            <input
              id="contact-company"
              name="company"
              type="text"
              autoComplete="organization"
              placeholder="Your company name"
              className="w-full p-3 rounded border border-gray-300 text-gray-900"
              value={formData.company}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="contact-service" className="block text-sm mb-1">
              Service of Interest
            </label>
            <input
              id="contact-service"
              name="service"
              type="text"
              autoComplete="off"
              placeholder="What service are you interested in?"
              className="w-full p-3 rounded border border-gray-300 text-gray-900"
              value={formData.service}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="contact-message" className="block text-sm mb-1">
              Message *
            </label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell us about your project or inquiry"
              className="w-full p-3 rounded border border-gray-300 text-gray-900 h-32 resize-none"
              required
              value={formData.message}
              onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="submit"
              className="bg-white text-blue-dark hover:bg-blue-light hover:text-white transition-colors duration-300 py-3 px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
