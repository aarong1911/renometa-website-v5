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
                  Welcome to RenoMeta Inc ("RenoMeta," "we," "us," or "our"). This Privacy Policy explains how we collect,
                  use, disclose, and safeguard information when you use our software, websites, and services
                  (collectively, the "Services").
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

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">7. SMS/MMS Communications and Consent</h2>

                <h3 className="text-base font-semibold text-blue-dark mt-4">
                  7a. SMS Messages Sent Directly by RenoMeta
                </h3>
                <p className="text-lg">
                  RenoMeta may send SMS/MMS messages directly to individuals who provide express written consent
                  through the contact form on our website at{" "}
                  <a className="text-blue-dark underline" href="https://renometa.com" target="_blank" rel="noopener noreferrer">
                    https://renometa.com
                  </a>
                  . Consent is collected via a separate, optional, unchecked checkbox on the contact form. Providing a
                  phone number alone does not constitute consent to receive SMS messages. Users who do not check the
                  SMS opt-in checkbox will not receive any text messages from RenoMeta.
                </p>
                <p className="text-lg">
                  The opt-in checkbox states: "(Optional) By checking this box, you agree to receive SMS messages from
                  RenoMeta. Message frequency varies (up to 5 messages per month). Message and data rates may apply.
                  Reply STOP to opt out or HELP for help. Consent is not a condition of purchase, receiving services,
                  or completing any transaction. View our Privacy Policy and Terms of Service."
                </p>
                <p className="text-lg">
                  SMS consent is entirely voluntary. You are not required to consent to SMS messaging in order to
                  use our Services, submit a contact form, receive customer support, make a purchase, or complete
                  any transaction with RenoMeta. The contact form can be submitted without providing a phone number
                  and without opting in to SMS.
                </p>
                <p className="text-lg">
                  Messages sent directly by RenoMeta include responses to inquiries, account notifications,
                  appointment confirmations, service updates, and customer support communications. These messages
                  are not marketing or promotional in nature. Message frequency does not exceed 5 messages per month.
                </p>
                <p className="text-lg">
                  Recipients may opt out at any time by replying <span className="font-semibold">STOP</span> to any
                  message. For help, reply <span className="font-semibold">HELP</span> or contact us at{" "}
                  <a className="text-blue-dark underline" href="mailto:Support@RenoMeta.com">
                    Support@RenoMeta.com
                  </a>
                  . Message and data rates may apply.
                </p>

                <h3 className="text-base font-semibold text-blue-dark mt-4">
                  7b. SMS Messages Sent Through the RenoMeta Platform
                </h3>
                <p className="text-lg">
                  RenoMeta also provides a software platform that enables businesses (our customers) to communicate
                  with their own end users via SMS/MMS for customer care and operational purposes, such as missed call
                  responses, appointment confirmations, reminders, and follow-ups.
                </p>
                <p className="text-lg">
                  Businesses using the RenoMeta platform are solely responsible for obtaining and maintaining
                  appropriate consent from their own message recipients and for complying with all applicable laws,
                  regulations, and carrier requirements.
                </p>

                <h3 className="text-base font-semibold text-blue-dark mt-4">
                  7c. General SMS Policies
                </h3>
                <p className="text-lg">
                  RenoMeta does not sell, share, or distribute SMS consent data or opt-in information to any third
                  parties for their own marketing or promotional purposes.
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
                By using our Services, you acknowledge and agree to the data collection and usage practices
                described in this Privacy Policy. This acknowledgment does not constitute consent to receive
                SMS or MMS messages. SMS consent is collected separately and independently as described in
                Section 7a above.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default PrivacyPolicy;
