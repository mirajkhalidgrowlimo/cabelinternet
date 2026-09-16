import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [type, onClose]);

  if (!type) return null;

  const getTitle = () => {
    if (type === 'privacy') return 'Privacy Policy';
    if (type === 'terms') return 'Terms & Conditions';
    return 'Disclaimer & Disclosure';
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            {type === 'privacy' ? (
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            ) : (
              <FileText className="w-5 h-5 text-blue-600" />
            )}
            <h3 id="modal-title" className="text-lg font-extrabold text-slate-900">
              {getTitle()}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-600 text-sm leading-relaxed">
          {type === 'privacy' && (
            <>
              <p>
                <strong>Effective Date:</strong> January 1, 2026
              </p>
              <p>
                Cable Internet Plans operates as an independent referral platform. We respect your privacy and are committed to protecting any personal identifying data you provide through our address availability checker.
              </p>
              <h4 className="font-bold text-slate-800">Information We Collect</h4>
              <p>
                When you request a service check, we collect contact information (full name, phone number, email) and address details (ZIP code and street address) to match you with compatible telecom providers.
              </p>
              <h4 className="font-bold text-slate-800">How We Use Information</h4>
              <p>
                We use this information to determine line eligibility, compare provider rates, and connect you with certified carrier specialists. We do not sell your personal information to unapproved third parties.
              </p>
              <h4 className="font-bold text-slate-800">Contact & Opt-Out</h4>
              <p>
                You may opt out of future communications at any time by calling our support line at {SITE_CONFIG.PHONE_NUMBER} or sending an email to {SITE_CONFIG.EMAIL}.
              </p>
            </>
          )}

          {type === 'terms' && (
            <>
              <p>
                <strong>Effective Date:</strong> January 1, 2026
              </p>
              <p>
                By using Cable Internet Plans and submitting an inquiry through our platform, you agree to these Terms and Conditions.
              </p>
              <h4 className="font-bold text-slate-800">Independent Referral Service</h4>
              <p>
                Cable Internet Plans is an independent broker and comparison directory. We do not own, operate, or maintain telecommunication lines. All network services, speeds, billing, and installation procedures are managed directly by the participating service provider.
              </p>
              <h4 className="font-bold text-slate-800">Availability & Pricing</h4>
              <p>
                Advertised plans, promotional rates (e.g. $70–$100/mo), equipment charges, and download/upload speeds are subject to carrier confirmation at your exact physical service address.
              </p>
              <h4 className="font-bold text-slate-800">TCPA Telephone Consent</h4>
              <p>
                By submitting your phone number, you authorize Cable Internet Plans and its authorized network partners to deliver calls and SMS notifications regarding broadband offers, including through automated dialing systems.
              </p>
            </>
          )}

          {type === 'disclaimer' && (
            <>
              <h4 className="font-bold text-slate-800">Referral & Affiliate Disclosure</h4>
              <p>
                Cable Internet Plans is an independent comparison and referral service and is not affiliated with, endorsed by, or sponsored by any internet service provider.
              </p>
              <p>
                Pricing, speeds, promotions, and availability vary by address and are determined by the provider at the time of service activation. We may receive a referral fee when customers sign up through our service.
              </p>
              <p>
                All registered marks, logos, and provider names mentioned on this site are property of their respective holders and are used solely for descriptive identification purposes.
              </p>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

