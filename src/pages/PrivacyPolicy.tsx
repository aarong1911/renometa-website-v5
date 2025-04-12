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
            <>
  <p className="text-lg">Privacy Policy for RenoMeta Inc</p>
  <p className="text-lg">Effective Date: 08/01/2024</p>
  <p className="text-lg">1. Introduction</p>
  <p className="text-lg">
    Welcome to RenoMeta Inc B2B Marketing and Sales Software. This Privacy Policy is designed to help you understand how we collect, use, disclose, and safeguard your information when you use our software and services.
  </p>
  <p className="text-lg">2. Information We Collect</p>
  <p className="text-lg">
    We collect information that you provide directly to us, such as your name, email address, company name, and any other information you choose to share when using our software. Additionally, we may collect information about your usage of our software, including log data and analytics.
  </p>
  <p className="text-lg">3. How We Use Your Information</p>
  <p className="text-lg">
    We use the information we collect for various purposes, including:
    <br />- Providing and maintaining our software and services.
    <br />- Sending you important notices, such as updates, security alerts, and support.
    <br />- Improving and customizing our software based on your feedback and usage patterns.
    <br />- Analyzing trends and user behavior to enhance our products and services.
  </p>
  <p className="text-lg">4. Information Sharing and Disclosure</p>
  <p className="text-lg">
    We do not sell, trade, or rent your personal information to third parties. However, we may share your information with trusted third-party service providers who assist us in delivering our software and services. We may also disclose your information in response to legal requests or to protect our rights, property, or safety.
  </p>
  <p className="text-lg">5. Security</p>
  <p className="text-lg">
    We prioritize the security of your information and employ industry-standard measures to protect against unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
  </p>
  <p className="text-lg">6. Your Choices</p>
  <p className="text-lg">
    You have the right to access, correct, update, or delete your personal information. You can do this by contacting us at Support@RenoMeta.com. We will respond to your request within a reasonable timeframe.
  </p>
  <p className="text-lg">7. Changes to This Privacy Policy</p>
  <p className="text-lg">
    We may update our Privacy Policy from time to time, and any changes will be effective upon posting the revised policy on our website. We encourage you to review this Privacy Policy periodically for any updates.
  </p>
  <p className="text-lg">8. Contact Us</p>
  <p className="text-lg">
    If you have any questions, concerns, or requests regarding this Privacy Policy or our practices, please contact us at Support@RenoMeta.com.
  </p>
  <p className="text-lg">
    By using our software and services, you agree to the terms outlined in this Privacy Policy.
  </p>
  <p className="text-lg">
    Thank you for choosing RenoMeta Inc B2B Marketing and Sales Software.
  </p>
</>

          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicy;
