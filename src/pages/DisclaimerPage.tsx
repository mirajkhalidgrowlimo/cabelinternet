import React from 'react';
import { AlertCircle, ShieldAlert, Phone, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-[#183b6b] text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-300/30">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important Consumer Legal Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Legal Disclaimer & Disclosure</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Clear, transparent information about our independent referral service, provider affiliations, speed claims, and promotional pricing.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Critical Notice Box */}
        <div className="bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-lg">
            <ShieldAlert className="w-6 h-6 text-amber-700" />
            <span>Service Relationship Clarification</span>
          </div>
          <p className="text-amber-950 text-sm sm:text-base leading-relaxed">
            <strong>Cable Internet Plans is NOT an internet service provider.</strong> We are an independent comparison and referral service that assists consumers in discovering and evaluating internet plans offered by our partner network of authorized providers. We do not directly operate telecommunication networks, lay cables, perform technician dispatches, or provide ongoing internet billing.
          </p>
          <p className="text-amber-900 text-xs sm:text-sm">
            Your final service contract, monthly billing relationship, equipment lease, and customer technical support will be established directly with the internet service provider you choose to activate.
          </p>
        </div>

        {/* Availability & Technology Constraints */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Availability & Technology Limitations</h2>
          <p>
            Internet broadband technologies exhibit varying real-world performance characteristics and geographical footprints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Cable Internet</h3>
              <p className="text-xs text-slate-600">
                Speeds can fluctuate during neighborhood peak-hour usage. Download bandwidth is generally substantially higher than upload bandwidth.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Fiber Internet</h3>
              <p className="text-xs text-slate-600">
                Delivers symmetrical download and upload speeds. Availability requires dedicated fiber-optic ground lines installed on your exact street address.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">DSL & Fixed Wireless</h3>
              <p className="text-xs text-slate-600">
                Speeds and connection consistency are dependent on physical copper distance to central office hardware or wireless line-of-sight to cellular towers.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Satellite Internet</h3>
              <p className="text-xs text-slate-600">
                Provides nationwide availability but requires clear sky line-of-sight. Susceptible to extreme weather interference and higher latency.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing and Promotional Terms */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Pricing & Promotional Terms</h2>
          <p>
            All listed plan rates, discounts, promotional offers, and bundles are subject to change without prior notice. Promotional rates typically apply for the first 12 to 24 months of service before standard non-promotional rates take effect. Additional charges may apply, including:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-600 text-xs sm:text-sm">
            <li>State, local, and federal telecommunication taxes and regulatory recovery fees</li>
            <li>Professional installation or self-installation activation kit fees</li>
            <li>Modem, Wi-Fi gateway, or mesh router monthly equipment rental fees</li>
            <li>Early termination fees if cancelling term agreements prior to completion</li>
          </ul>
        </div>

        {/* Third-Party Trademarks */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Third-Party Trademarks</h2>
          <p>
            All third-party brand names, company trademarks, service marks, and trade dress referenced throughout this website belong exclusively to their respective owners. Their display does not imply any official partnership, affiliation, endorsement, or sponsorship between Cable Internet Plans and those entities.
          </p>
        </div>

        {/* Quality Assurance & Call Recording */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">Quality Assurance & Call Recording Notice</h2>
          <p>
            Telephone calls initiated to or from our toll-free phone line ({SITE_CONFIG.PHONE_NUMBER}) may be monitored or recorded for quality assurance, employee training, and regulatory compliance purposes in accordance with applicable federal and state telecommunications statutes.
          </p>
        </div>
      </div>
    </div>
  );
};
