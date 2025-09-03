import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSuccess: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  message: string;
  consent: boolean; // ✅ added
}

export default function ContactForm({ onSuccess, isSubmitting, setIsSubmitting }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: '',
    consent: false, // ✅ default unchecked
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.consent) {
      toast({
        title: "Consent required",
        description: "You must agree to SMS notifications before submitting.",
        variant: "destructive",
      });
      return;
    }

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
            service: formData.service || null,
            message: formData.message,
            consent: formData.consent, // ✅ store consent in DB
          },
        ]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll be in touch with you shortly.",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
        consent: false,
      });
      onSuccess();
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

      {/* ✅ Consent Checkbox */}
      <div className="md:col-span-2 flex items-start space-x-2">
        <input
          type="checkbox"
          id="contact-consent"
          name="consent"
          required
          checked={formData.consent}
          onChange={handleChange}
          className="mt-1"
        />
        <label htmlFor="contact-consent" className="text-xs text-gray-300 leading-snug">
          I Consent to Receive SMS Notifications, Alerts & Occasional Marketing
          Communication from RenoMeta. Message frequency varies. Message & data
          rates may apply. Text HELP to +1(954) 871-8466 for assistance. You can
          reply STOP to unsubscribe at any time.
        </label>
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
  );
}
