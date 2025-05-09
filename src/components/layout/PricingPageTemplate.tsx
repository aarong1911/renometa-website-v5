import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
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

// Feature highlights above pricing
const featureHighlights = [
  {
    title: "Simple Pricing",
    description: "No hidden fees—just straightforward, transparent pricing."
  },
  {
    title: "Flexible Billing",
    description: "Choose monthly or annual subscriptions, with savings for longer commitments."
  },
  {
    title: "Scalable Add‑Ons",
    description: "Enhance your plan with optional services as your business grows."
  }
];

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

export default function Pricing() {
  return (
    <MainLayout>
      {/* Page Header with extra padding */}
      <section className="pt-32 pb-16 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-bold text-[#3a4150]">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-600">
          Choose the plan that's right for your remodeling business. All plans include our core platform features.
        </p>
      </section>

      {/* Feature Highlights */}
      <section className="py-12 px-4 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {featureHighlights.map((feat) => (
            <div key={feat.title} className="text-center">
              <h3 className="text-xl font-semibold text-[#3a4150] mb-2">
                {feat.title}
              </h3>
              <p className="text-gray-600">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mt-16 py-12 px-4 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-xl border p-8 shadow-sm transition-all hover:shadow-md",
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
              <p className="text-gray-500 mt-2">
                {tier.description}
              </p>

              <div className="mt-6 mb-6">
                <span className="text-5xl font-bold text-[#3a4150]">
                  ${tier.price}
                </span>
                <span className="text-xl text-gray-500">/mo</span>
              </div>

              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-[#d9ab57] mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className="mt-8 w-full bg-[#3a4150] hover:bg-[#3a4150]/90 text-white py-3 rounded"
                onClick={() => window.location.href = '/free-trial'}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Optional Add-ons */}
      <section className="py-12 px-4 md:px-12 lg:px-24 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#3a4150] mb-6">
            Optional Add-ons
          </h2>
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
      </section>

      {/* Billing Options */}
      <section className="py-12 px-4 md:px-12 lg:px-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#3a4150] mb-4">
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
    </MainLayout>
  );
}
