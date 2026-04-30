import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ScrollReveal from "@/components/ui/ScrollReveal";

const TermsOfService = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="hero-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-10 z-0" />
        <div className="container-custom text-center py-20 relative z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-dark">Terms of Service</h1>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              Review the terms and conditions for using our services.
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
                <p className="text-lg font-semibold text-blue-dark">Terms of Service for RenoMeta Inc</p>
                <p className="text-sm text-gray-500">Effective Date: 08/01/2024</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">1. Acceptance of Terms</h2>
                <p className="text-lg">
                  By accessing or using RenoMeta Inc ("RenoMeta," "we," "us," or "our") software, websites, and services
                  (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do
                  not agree, do not use the Services.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">2. Use of the Services</h2>
                <p className="text-lg">
                  You may use the Services for your internal business purposes in accordance with these Terms and all
                  applicable laws and regulations. You are responsible for all activity that occurs under your account.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">3. User Accounts and Security</h2>
                <p className="text-lg">
                  To access certain features, you may need to create an account. You are responsible for maintaining
                  the confidentiality of your login credentials and for all activities under your account. You agree to
                  notify us promptly of any unauthorized use.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">4. Acceptable Use</h2>
                <p className="text-lg">
                  You agree not to misuse the Services. You may not use the Services to:
                </p>
                <ul className="list-disc pl-6 text-lg space-y-1">
                  <li>Send spam, unsolicited messages, or messages without appropriate consent.</li>
                  <li>Send illegal, fraudulent, or deceptive content.</li>
                  <li>Transmit malware or attempt to gain unauthorized access to systems or data.</li>
                  <li>Harass, abuse, or harm any person or violate any third-party rights.</li>
                  <li>Violate carrier policies, messaging rules, or applicable communications laws.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">5. Intellectual Property</h2>
                <p className="text-lg">
                  The Services, including all content, features, and functionality, are owned by RenoMeta or its
                  licensors and are protected by applicable intellectual property laws. You may not reproduce,
                  distribute, modify, create derivative works of, publicly display, publicly perform, republish,
                  download, or transmit any part of the Services without our prior written consent, except as allowed
                  by these Terms.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">6. Data Privacy</h2>
                <p className="text-lg">
                  Our collection and use of information is described in our Privacy Policy. By using the Services, you
                  consent to the collection, use, and disclosure of information as described in that policy. Your use
                  of the Services does not constitute consent to receive SMS or MMS messages; SMS consent is collected
                  separately as described in our Privacy Policy.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">7. SMS/MMS Messaging Terms</h2>

                <h3 className="text-base font-semibold text-blue-dark mt-4">
                  7a. SMS Messages Sent Directly by RenoMeta
                </h3>
                <p className="text-lg">
                  RenoMeta may send SMS/MMS messages directly to individuals who provide express written consent
                  through an optional, unchecked checkbox on the contact form at{" "}
                  <a className="text-blue-dark underline" href="https://renometa.com" target="_blank" rel="noopener noreferrer">
                    https://renometa.com
                  </a>
                  . SMS consent is entirely voluntary and is not required to use the website, submit the contact form,
                  receive services, make a purchase, or complete any transaction.
                </p>
                <p className="text-lg">
                  Messages sent directly by RenoMeta are limited to transactional and customer care purposes, including
                  responses to inquiries, appointment confirmations, service updates, and customer support
                  communications. Message frequency does not exceed 5 messages per month. Recipients may opt out at
                  any time by replying <span className="font-semibold">STOP</span> and may request assistance by
                  replying <span className="font-semibold">HELP</span>. Message and data rates may apply.
                </p>

                <h3 className="text-base font-semibold text-blue-dark mt-4">
                  7b. SMS Messages Sent Through the RenoMeta Platform
                </h3>
                <p className="text-lg">
                  The Services may also enable businesses (our customers) to send or receive SMS/MMS messages to
                  communicate with their own customers for customer care and operational purposes (for example, missed
                  call responses, appointment confirmations, reminders, and follow-ups).
                </p>
                <p className="text-lg">
                  Businesses using the RenoMeta platform are responsible for obtaining and maintaining any required
                  consents from their own message recipients and for complying with all applicable laws and carrier
                  requirements. Businesses must not send messages that are unsolicited, promotional without consent,
                  or otherwise non-compliant.
                </p>
                <p className="text-lg">
                  Message frequency varies based on customer interaction. Recipients may opt out at any time by replying{" "}
                  <span className="font-semibold">STOP</span> and may request assistance by replying{" "}
                  <span className="font-semibold">HELP</span>. Message and data rates may apply.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">8. Limitation of Liability</h2>
                <p className="text-lg">
                  To the maximum extent permitted by law, RenoMeta will not be liable for any indirect, incidental,
                  consequential, special, or punitive damages arising out of or related to your use of the Services. In
                  no event will RenoMeta's total liability exceed the amounts paid by you to RenoMeta for the Services
                  in the twelve (12) months preceding the event giving rise to the claim.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">9. Termination</h2>
                <p className="text-lg">
                  We may suspend or terminate your access to the Services at any time if we believe you have violated
                  these Terms or if necessary to protect the Services, our users, or third parties.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">10. Changes to Terms or Services</h2>
                <p className="text-lg">
                  We may modify these Terms from time to time by posting updated Terms on our website. Your continued
                  use of the Services after changes become effective constitutes acceptance of the revised Terms. We may
                  also modify, suspend, or discontinue the Services (in whole or in part) at any time.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">11. Governing Law</h2>
                <p className="text-lg">
                  These Terms are governed by the laws of the State of Florida, United States, without regard to its
                  conflict of laws principles.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-blue-dark">12. Contact Us</h2>
                <p className="text-lg">
                  If you have questions or concerns regarding these Terms, please contact us at{" "}
                  <a className="text-blue-dark underline" href="mailto:Support@RenoMeta.com">
                    Support@RenoMeta.com
                  </a>
                  .
                </p>
              </div>

              <p className="text-lg">Thank you for using RenoMeta.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default TermsOfService;
