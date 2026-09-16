import React from 'react';
import { FileText, Shield, AlertTriangle } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-[#183b6b] text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-blue-300" />
            <span>Last Updated: January 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms & Conditions</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Please review these terms carefully before utilizing Cable Internet Plans' independent comparison and referral services.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">1. Service Description</h2>
          <p>
            Cable Internet Plans operates as a free, independent online comparison and referral platform designed to assist consumers in evaluating home internet service providers in their local area. We are not an internet service provider ourselves, but rather a referral intermediary that connects prospective customers with authorized third-party internet service providers.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">2. Provider Relationships & Advertising Disclosure</h2>
          <p>
            Cable Internet Plans works with a diverse network of independent internet service providers delivering cable, fiber-optic, DSL, fixed wireless, and satellite broadband across the United States. We are not owned, operated, or controlled by any specific telecommunications provider.
          </p>
          <p>
            All third-party provider names, registered trademarks, brand names, and logos displayed on this website are the property of their respective trademark holders. Mention of these entities does not imply direct endorsement, affiliation, or sponsorship.
          </p>
          <p>
            We may receive advertising compensation or referral fees from participating providers when a customer signs up for service through our referral phone lines or comparison forms. This compensation does not increase the customer's retail pricing and helps keep our directory completely free for consumers.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">3. Pricing, Speeds & Service Availability</h2>
          <p>
            All broadband plans, advertised speeds, introductory pricing, contractual requirements, equipment leasing fees, and promotional terms are determined exclusively by the respective service provider at the time of final order placement and service activation.
          </p>
          <p>
            Quoted speeds represent maximum theoretical wireline download/upload thresholds and are not guaranteed continuous speeds. Availability is subject to final physical line qualification and engineering confirmation at your specific service street address.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">4. User Responsibilities & Consent</h2>
          <p>
            By submitting an inquiry form or telephone request, you certify that you are at least 18 years old and authorized to request service information for the submitted address. You consent to receive informational telephone calls and text communications from our specialists and partner providers regarding broadband availability.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">5. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Cable Internet Plans shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from provider service interruptions, billing disputes, installation delays, or technical performance issues arising between you and the selected third-party service provider.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">6. Governing Law & Inquiries</h2>
          <p>
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the United States. For questions regarding these terms, contact us at{' '}
            <a href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`} className="text-[#183b6b] font-bold hover:underline">
              {SITE_CONFIG.PHONE_NUMBER}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};
