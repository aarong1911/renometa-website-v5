
import React from 'react';
import ServicePageTemplate from '@/components/layout/ServicePageTemplate';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const Pricing = () => {
  const pricingData = {
    title: 'Simple, Transparent Pricing',
    tagline: 'Pricing',
    description: "Choose the plan that's right for your remodeling business. All plans include our core platform features.",
    ctaText: 'Ready to Transform Your Business?',
    features: [
      {
        title: 'Simple Pricing',
        description: 'No hidden fees, just straightforward pricing tailored for remodeling businesses of all sizes.',
      },
      {
        title: 'Flexible Options',
        description: 'Choose between monthly or annual billing with discounts for longer commitments.',
      },
      {
        title: 'Scale With Your Business',
        description: 'Add capabilities as you grow with our optional add-on services.',
      }
    ]
  };

  const renderPricingContent = () => (
    <>
      {/* Pricing Table */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={cn(
                  "rounded-xl border p-8 shadow-sm transition-all hover:shadow-md",
                  tier.popular ? "border-[#d9ab57] ring-2 ring-[#d9ab57]/20" : "border-gray-200"
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-5 left-0 right-0">
                    <div className="mx-auto w-fit bg-[#d9ab57] text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="relative">
                  <h3 className="text-2xl font-bold text-[#3a4150]">{tier.name}</h3>
                  <p className="text-gray-500 mt-2">{tier.description}</p>

                  <div className="mt-8 mb-8">
                    <span className="text-5xl font-bold text-[#3a4150]">${tier.price}</span>
                    <span className="text-xl text-gray-500">/mo</span>
                  </div>

                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-[#d9ab57] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className="w-full mt-8 bg-[#3a4150] hover:bg-[#3a4150]/90 text-white px-4 py-2 rounded"
                    onClick={() => window.location.href = '/free-trial'}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-[#3a4150] mb-12 text-center">Optional Add-ons</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Add-on Service</TableHead>
                <TableHead className="text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addOns.map((addon) => (
                <TableRow key={addon.name}>
                  <TableCell className="font-medium">{addon.name}</TableCell>
                  <TableCell className="text-right">+${addon.price}/mo</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Billing Options */}
      <div className="py-16 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#3a4150] mb-8">Billing Options</h2>
          
          <div className="space-y-4 text-lg">
            <p>
              <span className="font-semibold">Monthly subscription</span> - Pay month-to-month with flexibility
            </p>
            <p>
              <span className="font-semibold">Annual subscription</span> - Save with our annual plan (2 months free)
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const tiers = [
    {
      name: "Starter",
      description: "Solo contractors / very small teams",
      price: 99,
      features: [
        "Hosted smart website",
        "Basic CRM (contact & lead capture)",
        "Email notifications"
      ]
    },
    {
      name: "Growth",
      description: "Growing businesses",
      price: 299,
      popular: true,
      features: [
        "Everything in Starter",
        "SMS & missed‑call textback",
        "Review generation",
        "Call tracking"
      ]
    },
    {
      name: "Enterprise",
      description: "Agencies & multi‑team remodelers",
      price: 699,
      features: [
        "Everything in Growth",
        "AI‑powered lead nurturing campaigns",
        "AI chat & voice agents",
        "Advanced analytics & dashboards"
      ]
    }
  ];

  const addOns = [
    { name: "Appointment‑booking agent", price: 149 },
    { name: "Funnel‑as‑a‑Service", price: 199 },
    { name: "Citation / local‑SEO updates", price: 99 }
  ];

  return (
    <ServicePageTemplate 
      {...pricingData}
      customContent={renderPricingContent()}
    />
  );
};

export default Pricing;
