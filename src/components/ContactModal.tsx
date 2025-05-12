
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop - reduced animation duration for smoother fading */}
        <Dialog.Overlay
          className="
            fixed inset-0 bg-black/50
            opacity-0 transition-opacity duration-300
            data-[state=open]:opacity-50
            z-50
          "
        />

        {/* Centered content wrapper - reduced animation duration */}
        <Dialog.Content
          className="
            fixed inset-0 flex items-center justify-center p-4
            overflow-auto
            opacity-0 scale-95 transition-all duration-300
            data-[state=open]:opacity-100 data-[state=open]:scale-100
            z-[9999]
          "
        >
          {/* Modal box */}
          <div
            className="
              relative bg-[#1d2939] rounded-lg p-6 text-white shadow-lg
              w-full max-w-lg sm:max-w-xl
              max-h-[90vh] overflow-y-auto
            "
          >
            {/* Accessibility */}
            <Dialog.Title className="text-2xl font-bold mb-4">
              Get in Touch
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Fill out the form below to send us a message.
            </Dialog.Description>

            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
              aria-label="Close contact form"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Form */}
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
