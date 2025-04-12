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
            <h1 className="text-4xl md:text-5xl font-bold text-blue-dark">
              Terms of Service
            </h1>
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
            <>
  <p className="text-lg">Terms and Conditions for RenoMeta Inc</p>
  <p className="text-lg">Effective Date: 08/01/2024</p>

  <p className="text-lg">1. Acceptance of Terms</p>
  <p className="text-lg">
    By accessing or using RenoMeta Inc B2B Marketing and Sales Software ("the Software"), you agree to comply with and be bound by these Terms and Conditions. If you do not agree with these terms, please do not use the Software.
  </p>

  <p className="text-lg">2. Use of the Software</p>
  <p className="text-lg">
    You may use the Software for your internal business purposes only. You are responsible for ensuring that your use of the Software complies with all applicable laws and regulations.
  </p>

  <p className="text-lg">3. User Accounts and Security</p>
  <p className="text-lg">
    To access certain features of the Software, you may need to create a user account. You are responsible for maintaining the confidentiality of your account information and are fully responsible for all activities that occur under your account.
  </p>

  <p className="text-lg">4. Intellectual Property</p>
  <p className="text-lg">
    The Software, including all content, features, and functionality, is the exclusive property of RenoMeta Inc. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, or transmit any content or material from the Software without our prior written consent.
  </p>

  <p className="text-lg">5. Data Privacy</p>
  <p className="text-lg">
    Our use of your information is governed by our Privacy Policy. By using the Software, you consent to the collection, use, and disclosure of your information as described in the Privacy Policy.
  </p>

  <p className="text-lg">6. Limitation of Liability</p>
  <p className="text-lg">
    RenoMeta Inc shall not be liable for any direct, indirect, incidental, consequential, or special damages arising out of or in any way connected with the use of the Software. In no event shall our total liability exceed the amount paid by you, if any, for accessing or using the Software.
  </p>

  <p className="text-lg">7. Termination</p>
  <p className="text-lg">
    We reserve the right to terminate or suspend your access to the Software at any time, with or without cause and with or without notice.
  </p>

  <p className="text-lg">8. Changes to Terms and Software</p>
  <p className="text-lg">
    We reserve the right to modify, suspend, or discontinue the Software or any part thereof at any time without notice. We may also revise these Terms and Conditions at any time by posting the updated terms on our website. Your continued use of the Software after any such changes constitutes acceptance of the revised terms.
  </p>

  <p className="text-lg">9. Governing Law</p>
  <p className="text-lg">
    These Terms and Conditions are governed by and construed in accordance with the laws of [Insert Jurisdiction], without regard to its conflict of law principles.
  </p>

  <p className="text-lg">10. Contact Us</p>
  <p className="text-lg">
    If you have any questions, concerns, or feedback regarding these Terms and Conditions, please contact us at Support@RenoMeta.com.
  </p>

  <p className="text-lg">
    Thank you for using RenoMeta Inc B2B Marketing and Sales Software.
  </p>
</>

          </ScrollReveal>
        </div>
      </section>
    </MainLayout>
  );
};

export default TermsOfService;
