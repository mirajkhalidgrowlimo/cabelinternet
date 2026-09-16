import React, { useRef } from 'react';
import { Phone, Mail } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface FooterProps {
  onOpenPolicy: (type: 'privacy' | 'terms' | 'disclaimer') => void;
  onNavScroll: (href: string) => void;
  onOpenAdmin?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPolicy, onNavScroll, onOpenAdmin, onNavigate }) => {
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const handleLinkClick = (path: string, fallbackAnchor?: string) => {
    if (onNavigate) {
      onNavigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (fallbackAnchor) {
      onNavScroll(fallbackAnchor);
    }
  };

  // Hidden gesture: tapping the copyright text 3 times within 800ms allows the owner to access admin on mobile
  const handleSecretCopyrightTap = () => {
    clickCountRef.current += 1;
    if (clickTimeoutRef.current) {
      window.clearTimeout(clickTimeoutRef.current);
    }
    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (onOpenAdmin) {
        onOpenAdmin();
      }
    } else {
      clickTimeoutRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 800);
    }
  };

  return (
    <footer className="bg-[#132c52] text-white pt-14 pb-12 px-4 sm:px-6">
      <div className="max-w-xl sm:max-w-2xl mx-auto space-y-8">
        
        {/* Company Info */}
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Cable Internet Plans
          </h2>
          <p className="text-sm text-slate-200 leading-relaxed max-w-md">
            An independent comparison and referral service for home internet plans in the U.S.
          </p>

          <div className="pt-2 space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-300" />
              <span>
                24/7 Support:{' '}
                <a
                  href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                  className="font-bold text-white hover:underline"
                >
                  {SITE_CONFIG.PHONE_NUMBER}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-300" />
              <a
                href={`mailto:${SITE_CONFIG.EMAIL}`}
                className="text-slate-200 hover:text-white hover:underline"
              >
                {SITE_CONFIG.EMAIL}
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 pt-2">
          <h3 className="text-base font-bold text-white">
            Quick Links
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-200">
            <li>
              <button
                onClick={() => handleLinkClick('/', '#home')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/providers', '#options')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Internet Providers & Options
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/bill-help', '#bill-lowering')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Bill Lowering Help
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/contact')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Contact Us
              </button>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="space-y-2 pt-2">
          <h3 className="text-base font-bold text-white">
            Legal
          </h3>
          <ul className="space-y-1.5 text-sm text-slate-200">
            <li>
              <button
                onClick={() => handleLinkClick('/privacy')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Privacy Policy
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/terms')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Terms & Conditions
              </button>
            </li>
            <li>
              <button
                onClick={() => handleLinkClick('/disclaimer')}
                className="hover:text-white hover:underline cursor-pointer text-left"
              >
                Disclaimer & Disclosures
              </button>
            </li>
          </ul>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-4 border-t border-blue-900/60 text-xs leading-relaxed text-slate-300 space-y-2">
          <p>
            <strong>Disclaimer:</strong> Cable Internet Plans is an independent referral service and is not affiliated with, endorsed by, or sponsored by any internet service provider. Pricing, speeds, promotions, and availability vary by address and are determined by the provider at the time of service activation. We may receive a referral fee when customers sign up through our service.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            <span
              onClick={handleSecretCopyrightTap}
              className="select-none cursor-default"
            >
              © {new Date().getFullYear()} Cable Internet Plans. All rights reserved.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
