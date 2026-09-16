import React from 'react';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="bg-[#183b6b] text-white py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span>Last Updated: January 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Learn how Cable Internet Plans collects, uses, and safeguards your information when you compare home internet options and connect with providers.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p>
            Cable Internet Plans collects information necessary to compare internet service providers for your address and connect you with authorized provider specialists. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li><strong>Contact Information:</strong> Full name, telephone number, and email address.</li>
            <li><strong>Location Data:</strong> Street address, city, state, and 5-digit ZIP code to verify wireline or wireless network availability.</li>
            <li><strong>Service Preferences:</strong> Current internet provider, current monthly bill, preferred speed tiers, and contract status.</li>
            <li><strong>Technical Analytics:</strong> Browser type, device characteristics, referral source, and anonymized site interactions for performance optimization.</li>
            <li><strong>Communication Logs:</strong> Customer service call recordings and notes taken during phone consultations to maintain service quality.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">2. How We Share Your Information</h2>
          <p>
            We share the information you submit with independent internet service providers serving your address so they can provide quotes, check live facility availability, and coordinate installation of the service you select.
          </p>
          <p>
            We do not sell your personal identifying data to unrelated marketing brokers or list vendors. Data sharing is limited to certified telecom carriers, authorized regional contractors, and fulfillment partners strictly for providing internet quotes and scheduling service.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">3. Cookies & Tracking Technologies</h2>
          <p>
            We utilize standard session cookies and web beacons to enhance your navigation experience, remember your ZIP code inputs across pages, and analyze aggregate traffic trends. You can configure your browser to reject cookies, though certain site features may have reduced functionality.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">4. Your Privacy Choices & Rights</h2>
          <p>
            Depending on your state of residence (including California, Virginia, Colorado, and others), you may have specific statutory rights regarding your personal information:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>Right to access the specific pieces of personal information collected about you.</li>
            <li>Right to request deletion of your contact and inquiry records from our active database.</li>
            <li>Right to opt out of telephone contact or marketing follow-ups at any time.</li>
          </ul>
          <p className="pt-2">
            To exercise any of these rights, contact our Privacy Compliance team at{' '}
            <a href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`} className="text-[#183b6b] font-bold hover:underline">
              {SITE_CONFIG.PHONE_NUMBER}
            </a>{' '}
            or email us at{' '}
            <a href={`mailto:${SITE_CONFIG.EMAIL}`} className="text-[#183b6b] font-bold hover:underline">
              {SITE_CONFIG.EMAIL}
            </a>.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">5. Data Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards designed to protect personal data against unauthorized disclosure, alteration, or destruction. All web transmissions utilize modern Transport Layer Security (TLS/HTTPS) encryption.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          <h2 className="text-xl font-bold text-slate-900">6. Children's Privacy</h2>
          <p>
            Our comparison services are strictly directed to adult homeowners, renters, and authorized account holders aged 18 and older. We do not knowingly collect personal information from minors under the age of 18.
          </p>
        </div>
      </div>
    </div>
  );
};
