import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ScrollReveal from './ScrollReveal';
import { useContactForm } from '@/hooks/useContactForm';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { formData, isSubmitting, handleChange, handleSubmit } = useContactForm({
    onSuccess,
  });

  return (
    <ScrollReveal>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="w-full text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
<<<<<<< HEAD
  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
    Phone Number (optional)
  </label>

  <Input
    id="phone"
    name="phone"
    type="tel"
    value={formData.phone}
    onChange={handleChange}
    placeholder="(123) 456-7890"
    className="w-full text-gray-900 placeholder-gray-500"
  />

  <p className="text-xs text-gray-500 mt-1">
    Phone number is optional. SMS messages will only be sent if you opt in below.
  </p>
</div>

=======
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(123) 456-7890"
              className="w-full text-gray-900 placeholder-gray-500"
            />
          </div>
>>>>>>> 367861f (Local changes)
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Your company name"
              className="w-full text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        <div className="relative">
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service of Interest
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
<<<<<<< HEAD
            className="w-full border border-gray-300 rounded-md bg-white text-gray-900 appearance-none h-11 pl-3 pr-12 text-sm"
=======
            className="w-full border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 appearance-none h-11 pl-3 pr-12 text-sm"
>>>>>>> 367861f (Local changes)
          >
            <option value="general">General Inquiry</option>
            <option value="website-development">Smart Website Development</option>
            <option value="advanced-seo">Advanced SEO</option>
            <option value="ai-agents">AI-Powered Agents</option>
            <option value="automation">Intelligent Automation</option>
            <option value="integration">Seamless Integration</option>
          </select>

<<<<<<< HEAD
=======
          {/* Custom centered arrow */}
>>>>>>> 367861f (Local changes)
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 mt-3.5">
            <svg
              className="w-7 h-7 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
<<<<<<< HEAD
              aria-hidden="true"
=======
>>>>>>> 367861f (Local changes)
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
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project or inquiry"
            required
            className="w-full min-h-[150px] text-gray-900 placeholder-gray-500"
          />
        </div>

<<<<<<< HEAD
        <div className="md:col-span-2 flex items-start space-x-2">
          <input
  type="checkbox"
  id="contact-consent"
  name="consent"
  checked={formData.consent}
  onChange={handleChange}
  className="mt-1 h-4 w-4 shrink-0"
/>
<label htmlFor="contact-consent" className="text-xs text-gray-600 leading-snug">
  <span className="font-medium">(Optional)</span> By checking this box, you agree to receive SMS messages from RenoMeta. Message frequency varies (up to 5 messages per month). 
  Message and data rates may apply. 
  Reply STOP to opt out or HELP for help. 
  Consent is not a condition of purchase, receiving services, or completing any transaction.
            View our{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-800"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-800"
            >
              Terms of Service
            </a>
            .
          </label>
        </div>

=======
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
          <label htmlFor="contact-consent" className="text-xs text-gray-500 leading-snug">
            I consent to receive SMS notifications and service alerts from RenoMeta related to my appointments and service requests. 
            Message frequency varies. Message & data rates may apply. Text HELP to +1-888-792-1166 for assistance. 
            Reply STOP to unsubscribe at any time.
          </label>
        </div>
        
>>>>>>> 367861f (Local changes)
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
