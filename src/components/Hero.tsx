
import { CustomerServiceAgent } from '@/components/CustomerServiceAgent';

export function Hero() {
  return (
    <section className="px-4 py-24 md:py-32 lg:py-40">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          <span className="gradient-text">AI-Powered</span> Customer Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
          Train an AI agent that understands your website and helps your customers get answers instantly, 24/7.
        </p>
        <CustomerServiceAgent />
      </div>
    </section>
  );
}
