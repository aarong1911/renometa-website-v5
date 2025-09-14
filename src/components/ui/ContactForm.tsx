import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ScrollReveal from './ScrollReveal';
import { useContactForm } from '@/hooks/useContactForm';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { formData, isSubmitting, handleChange, setIsSubmitting } = useContactForm({
    onSuccess,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(import.meta.env.VITE_MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'contact_form',
        }),
      });

      if (!res.ok) throw new Error('Webhook request failed');

      toast({
        title: 'Message sent!',
        description: "We’ll be in touch with you shortly.",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Webhook error:', error);
      toast({
        title: 'Something went wrong',
        description: "Your message couldn't be sent. Please try again later.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollReveal>
      <form onSubmit={handleSubmit} className="space-y-5 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full bg-[#1d2939] text-white placeholder-gray-400 border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="w-full bg-[#1d2939] text-white placeholder-gray-400 border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className="w-full bg-[#1d2939] text-white placeholder-gray-400 border border-gray-600"
            />
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-white mb-1">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              className="w-full bg-[#1d2939] text-white placeholder-gray-400 border border-gray-600"
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="service" className="block text-sm font-medium text-white mb-1">
            Service of Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full border border-gray-600 rounded-md bg-[#1d2939] text-white appearance-none h-11 pl-3 pr-10 text-sm"
          >
            <option value="general">General Inquiry</option>
            <option value="website-development">Smart Website Development</option>
            <option value="advanced-seo">Advanced SEO</option>
            <option value="ai-agents">AI-Powered Agents</option>
            <option value="automation">Intelligent Automation</option>
            <option value="integration">Seamless Integration</option>
          </select>

          {/* Centered arrow */}
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-300"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or inquiry"
            required
            className="w-full min-h-[150px] bg-[#1d2939] text-white placeholder-gray-400 border border-gray-600"
          />
        </div>

        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id="consent"
            name="consent"
            required
            onChange={handleChange}
            className="mt-1"
          />
          <label htmlFor="consent" className="text-xs text-white leading-snug">
            I consent to receive SMS notifications and service alerts from RenoMeta related to my appointments and service requests. 
            Message frequency varies. Message &amp; data rates may apply. Text HELP to +1-888-792-1166 for assistance. 
            Reply STOP to unsubscribe at any time.
          </label>
        </div>

        <div>
          <Button 
            type="submit" 
            className="w-full md:w-auto bg-blue-dark hover:bg-blue-light"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
        </div>
      </form>
    </ScrollReveal>
  );
};

export default ContactForm;
