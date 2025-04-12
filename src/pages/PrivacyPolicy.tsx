import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ScrollReveal from "@/components/ui/ScrollReveal";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-10 z-0" />
        <div className="container-custom text-center py-20 relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-dark">
              Privacy Policy
            </h1>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Learn how we collect, use, and protect your information.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-white">
        <div className="container-custom max-w-3xl mx-auto text-gray-700 space-y-6">
          <ScrollReveal>
            <p className="text-lg">
              {/* Add your privacy policy content here */}
              This is where the privacy policy text will go.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicy;
