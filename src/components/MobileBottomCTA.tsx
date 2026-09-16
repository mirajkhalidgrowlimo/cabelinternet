import React from 'react';
import { Phone, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface MobileBottomCTAProps {
  onCheckAvailabilityClick: () => void;
}

export const MobileBottomCTA: React.FC<MobileBottomCTAProps> = ({
  onCheckAvailabilityClick,
}) => {
  return (
    <div
      id="mobile-bottom-bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <a
          href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
          id="mobile-call-sticky-btn"
          className="flex-1 min-h-[46px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 active:bg-slate-200 text-slate-900 font-extrabold text-xs border border-slate-200"
        >
          <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Call Now</span>
        </a>

        <button
          onClick={onCheckAvailabilityClick}
          id="mobile-availability-sticky-btn"
          className="flex-[1.4] min-h-[46px] flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/25 cursor-pointer"
        >
          <span>Check Availability</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </button>
      </div>
    </div>
  );
};
