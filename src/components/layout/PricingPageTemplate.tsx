import React, { useState } from 'react';
import ServiceHeroSection from '@/components/sections/ServiceHeroSection';

import MainLayout from '@/components/layout/MainLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, MonitorSmartphone, Search, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import ServiceCard from '@/components/ui/ServiceCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

const featureHighlights = [
  {
    title: "Simple Pricing",
    description: "No hidden fees—just straightforward, transparent pricing.",
    icon: <MonitorSmartphone size={24} />
  },
  {
    title: "Flexible Billing",
    description: "Choose monthly or annual subscriptions, with savings for longer commitments.",
    icon: <Search size={24} />
  },
  {
    title: "Scalable Add‑Ons",
    description: "Enhance your plan with optional services as your business grows.",
    icon: <Lightbulb size={24} />
  }
];

const tiers = [
  {
    name: "Starter",
    description: "Build Your Foundation",
    price: 99,
    features: [
      "Smart Business Website with Built‑In SEO",
      "Lead Capture & CRM Essentials",
      "Hosted Calendar & Appointment Booking",
      "Universal Inbox with Missed‑Call Text‑Back",
      "Email & SMS Notifications",
    ]
  },
  {
    name: "Growth",
    description: "Accelerate Your Business",
    price: 299,
    popular: true,
    note: "(Includes all Starter features)",
    features: [
      "Integrated Team Scheduling & Job Management",
      "Automated Follow‑Up Campaigns",
      "Reputation Management System",
      "Quote‑to‑Invoice Workflow",
      "Custom Forms & Funnels for Lead Generation",
    ]
  },
  {
    name: "Enterprise",
    description: "Dominate Your Market",
    price: 699,
    features: [
      "AI Appointment Assistant & Lead Qualifier",
      "Multi‑Channel Marketing Engine",
      "Real‑Time Business Dashboards",
      "Automated Customer Lifecycle Journeys",
      "Client Portal with Payments, Documents & Messaging",
    ]
  }
];

const addOns = [
  { name: "Appointment‑booking agent", price: 149 },
  { name: "Funnel‑as‑a‑Service", price: 199 },
  { name: "Citation / local‑SEO updates", price: 99 }
];

export default function PricingPageTemplate() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <MainLayout>
      <ServiceHeroSection
  title="Simple, Transparent Pricing"
  description="Choose the plan that's right for your remodeling business. All plans include our core platform features."
  tagline="Pricing"
  heroImage=""
/>

      {/* Feature Highlights */}
      <section className="pt-2 pb-12 px-4 md:px-12 lg:px-24 bg-gray-50 mb-24">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-dark mb-6 mt-6">
              Pricing Plan Designed for Your Success
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureHighlights.map((feat, idx) => (
              <ServiceCard
                key={feat.title}
                title={feat.title}
                description={feat.description}
                icon={feat.icon}
                link="#"
                showLearnMore={false}
                delay={idx * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Billing Options */}
      <section className="py-12 px-4 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-dark mb-4">
            Billing Options
          </h2>
          <p className="text-lg">
            <strong>Monthly subscription</strong> – Pay month-to-month with flexibility
          </p>
          <p className="text-lg mt-2">
            <strong>Annual subscription</strong> – Save with our annual plan (2 months free)
          </p>
        </div>
      </section>

      {/* Billing Cycle Toggle */}
      <section className="pt-24 pb-10 text-center">
  <div
    className={cn(
      "relative inline-flex items-center justify-between rounded-full p-1 transition-colors duration-300 mx-auto w-[280px]",
      isAnnual ? "bg-[#d9ab57]" : "bg-gray-200"
    )}
  >
    {/* Sliding pill */}
    <div
      className={cn(
        "absolute top-1 left-1 bottom-1 w-[calc(50%-0.25rem)] bg-white rounded-full shadow transition-transform duration-300",
        isAnnual ? "translate-x-full" : "translate-x-0"
      )}
    />

    {/* Buttons */}
    <button
      onClick={() => setIsAnnual(false)}
      className="relative z-10 w-1/2 text-sm font-medium py-2"
    >
      Monthly
    </button>
    <button
      onClick={() => setIsAnnual(true)}
      className="relative z-10 w-1/2 text-sm font-medium py-2"
    >
      Annually
    </button>
  </div>

  <p
    className={cn(
      "mt-2 text-sm text-gray-600 h-5 transition-opacity duration-300",
      isAnnual ? "opacity-100" : "opacity-0"
    )}
  >
    Billed annually — save 2 months!
  </p>
</section>




      {/* Pricing Cards */}
      <section className="mt-4 py-12 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => {
            const displayPrice = isAnnual ? tier.price * 10 : tier.price;
            const suffix = isAnnual ? "/yr" : "/mo";

            return (
              <ScrollReveal key={tier.name} delay={idx * 100}>
                <div
                  className={cn(
                    "flex flex-col h-full relative rounded-xl border p-8 shadow-sm transition-all hover:shadow-md",
                    tier.popular
                      ? "border-[#d9ab57] ring-2 ring-[#d9ab57]/20"
                      : "border-gray-200"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="inline-block bg-[#d9ab57] text-white px-3 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <h3 className="text-2xl font-bold text-[#3a4150]">
                    {tier.name}
                  </h3>
                  <p className="text-gray-500 mt-2">{tier.description}</p>
                  {tier.note ? (
                    <p className="text-sm text-gray-400 mt-1">{tier.note}</p>
                  ) : (
                    <p className="text-sm mt-1 invisible">&nbsp;</p>
                  )}

                  <div className="mt-6 mb-6">
                    <span className="text-5xl font-bold text-[#3a4150]">
                      ${displayPrice}
                    </span>
                    <span className="text-xl text-gray-500">{suffix}</span>
                  </div>

                  <ul className="space-y-3 flex-grow">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center"
                      >
                        <Check className="h-5 w-5 text-[#d9ab57] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="mt-8 w-full bg-[#3a4150] hover:bg-[#3a4150]/90 text-white py-3 rounded flex items-center justify-center"
                    onClick={() => (window.location.href = '/free-trial')}
                  >
                    Start Free Trial&nbsp;→
                  </button>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Optional Add-ons */}
      <section className="py-12 px-4 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#3a4150] mb-6">
            Optional Add‑ons
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[70%]">Add‑on Service</TableHead>
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
      </section>

      
    </MainLayout>
  );
}
