import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import ScrollReveal from "@/components/ui/ScrollReveal";

const DataDeletion = () => {
  return (
    <MainLayout>
      {/* Hero Section — matches PrivacyPolicy / TermsOfService pattern */}
      <section className="hero-section relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-dark to-blue-light opacity-10 z-0" />
        <div className="container-custom text-center py-20 relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 bg-gold/10 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              Meta / Facebook Integration
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-dark">
              Data Deletion Request
            </h1>
            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
              How to request deletion of your RenoMeta Connect account data and Meta integration data.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Content Section — matches PrivacyPolicy pattern */}
      <section className="section bg-white">
        <div className="container-custom max-w-3xl mx-auto text-gray-700 space-y-8">

          <ScrollReveal>
            {/* Main instruction card */}
            <div className="bg-blue-dark rounded-xl p-8 text-white space-y-4">
              <h2 className="text-xl font-semibold text-gold">How to Submit a Request</h2>
              <p className="text-gray-200 leading-relaxed">
                RenoMeta Connect users may request deletion of their account data and Meta
                integration data by emailing{" "}
                <a
                  href="mailto:support@renometa.com?subject=Data%20Deletion%20Request"
                  className="text-gold hover:text-gold-light underline underline-offset-2 transition-colors font-semibold"
                >
                  support@renometa.com
                </a>{" "}
                with the subject line{" "}
                <span className="font-semibold text-gold">"Data Deletion Request."</span>
              </p>
              <p className="text-gray-200 leading-relaxed">
                Please include the email address associated with your RenoMeta Connect account.
                We will verify the request and delete applicable data within{" "}
                <span className="text-gold font-semibold">30 days</span>, unless retention is
                required by law or for legitimate business or security purposes.
              </p>
              <a
                href="mailto:support@renometa.com?subject=Data%20Deletion%20Request"
                className="inline-flex items-center gap-2 mt-2 bg-gold hover:bg-gold-light transition-colors text-blue-dark font-semibold rounded-lg px-6 py-3 text-sm"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Send Deletion Request
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {/* What gets deleted */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-blue-dark">Data Covered by Deletion Requests</h2>
              <p className="text-gray-600">
                Upon a verified request, we will delete the following data associated with your account:
              </p>
              <ul className="space-y-3">
                {[
                  "Account profile and user data",
                  "Connected Meta / Facebook integration data",
                  "OAuth access tokens and refresh tokens",
                  "Facebook message records and conversation history",
                  "Related account and configuration information",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {/* Timeline & exceptions note */}
            <div className="border-l-4 border-gold bg-gray-50 rounded-r-xl px-6 py-5 space-y-2">
              <h3 className="font-semibold text-blue-dark">Processing Timeline</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Deletion will be completed within <strong>30 days</strong> of identity verification,
                except where retention is required by applicable law, regulation, or for legitimate
                business or security purposes.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            {/* Contact details */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-blue-dark">Contact</h2>
              <p className="text-gray-600 text-sm">
                For questions about this process, reach us at:
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <a
                  href="mailto:support@renometa.com"
                  className="flex items-center gap-2 text-sm text-blue-dark hover:text-gold transition-colors font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@renometa.com
                </a>
                <span className="flex items-center gap-2 text-sm text-blue-dark font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  (888) 792-1166
                </span>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </MainLayout>
  );
};

export default DataDeletion;
