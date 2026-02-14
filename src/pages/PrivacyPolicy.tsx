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
            <h1 className="text-4xl md:text-5xl font-bold text-blue-dark">Privacy Policy</h1>
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
            <div className="space-y-6">
              <div className="space-y-1">
                <p className="text-lg font-semibold text-blue-dark">Privacy Policy for RenoMeta Inc</p>
                <p className="text-sm text-gray-500">Effective Date: 08/01/2024</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">1. Introduction</h2>
                <p className="text-lg">
                  Welcome to RenoMeta Inc (“RenoMeta,” “we,” “us,” or “our”). This Privacy Policy explains how we collect,
                  use, disclose, and safeguard information when you use our software, websites, and services
                  (collectively, the “Services”).
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">2. Information We Collect</h2>
                <p className="text-lg">
                  We collect information you provide directly to us, such as your name, email address, phone number,
                  company name, and other information you choose to share when using our Services.
                </p>
                <p className="text-lg">
                  We may also collect information automatically when you use the Services, such as device information,
                  log data, usage information, and analytics.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">3. How We Use Your Information</h2>
                <p className="text-lg">We use the information we collect to:</p>
                <ul className="list-disc pl-6 text-lg space-y-1">
                  <li>Provide, operate, and maintain our Services.</li>
                  <li>Send important notices, such as updates, security alerts, and support messages.</li>
                  <li>Improve and customize the Services based on feedback and usage patterns.</li>
                  <li>Analyze trends and user behavior to enhance our products and services.</li>
                  <li>Detect, prevent, and address fraud, abuse, security incidents, and technical issues.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">4. Information Sharing and Disclosure</h2>
                <p className="text-lg">
                  We do not sell, trade, or rent your personal information. We may share information with trusted
                  third-party service providers who help us deliver the Services (for example, hosting, analytics,
                  communications, and customer support).
                </p>
                <p className="text-lg">
                  We may also disclose information to comply with legal obligations, enforce our policies, or protect
                  the rights, property, and safety of RenoMeta, our users, or others.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">5. Security</h2>
                <p className="text-lg">
                  We use reasonable administrative, technical, and physical safeguards designed to protect information
                  against unauthorized access, disclosure, alteration, or destruction. However, no method of
                  transmission over the internet or electronic storage is completely secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">6. Your Choices</h2>
                <p className="text-lg">
                  You may request access, correction, updating, or deletion of your personal information by contacting
                  us at{" "}
                  <a className="text-blue-dark underline" href="mailto:Support@RenoMeta.com">
                    Support@RenoMeta.com
                  </a>
                  . We will respond within a reasonable timeframe, subject to applicable law.
                </p>
              </div>

              {/* ✅ SMS section for A2P/Carrier expectations */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">7. SMS Communications and Consent</h2>
                <p className="text-lg">
                  RenoMeta may enable businesses that use our Services to communicate with their customers via SMS/MMS
                  for customer care and operational purposes, such as missed call responses, appointment confirmations,
                  reminders, and follow-ups.
                </p>
                <p className="text-lg">
                  End users provide consent to receive messages by initiating contact with the business (for example,
                  by calling the business, submitting a website form, requesting an appointment, or otherwise providing
                  their phone number for customer support or service-related communication). Messages are sent only in
                  response to inbound inquiries or ongoing customer interactions.
                </p>
                <p className="text-lg">
                  Message frequency varies based on customer interaction. Recipients can opt out at any time by
                  replying <span className="font-semibold">STOP</span>. For help, reply{" "}
                  <span className="font-semibold">HELP</span>. Message and data rates may apply.
                </p>
                <p className="text-lg">
                  RenoMeta does not sell or share SMS consent data with third parties for their own marketing purposes.
                  Businesses using RenoMeta are responsible for collecting and maintaining appropriate consent where
                  required by law.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">8. Changes to This Privacy Policy</h2>
                <p className="text-lg">
                  We may update this Privacy Policy from time to time. Changes are effective when posted on our website.
                  We encourage you to review this policy periodically.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">9. Contact Us</h2>
                <p className="text-lg">
                  If you have questions, concerns, or requests regarding this Privacy Policy or our practices, contact
                  us at{" "}
                  <a className="text-blue-dark underline" href="mailto:Support@RenoMeta.com">
                    Support@RenoMeta.com
                  </a>
                  .
                </p>
              </div>

              <p className="text-lg">
                By using our Services, you agree to the terms outlined in this Privacy Policy.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicy;
