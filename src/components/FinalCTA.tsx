import React from 'react';
import { Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface FinalCTAProps {
  onCheckAvailabilityClick: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onCheckAvailabilityClick }) => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 text-white relative overflow-hidden">
      {/* Background Ambience & Grid */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold tracking-wider uppercase mb-5 border border-blue-400/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get Connected in Days, Not Weeks</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-5 leading-[1.15]">
          Ready to Find the Right Internet Plan?
        </h2>

        <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Check availability today and explore connectivity options for your home or business.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={onCheckAvailabilityClick}
            id="final-check-availability-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-extrabold text-base shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
          >
            <span>Check Availability</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="final-call-now-btn"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-base border border-white/20 transition-all"
          >
            <Phone className="w-5 h-5 text-sky-400" />
            <span>Call Now: {SITE_CONFIG.PHONE_NUMBER}</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Free consultation</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Multi-provider comparison</span>
          </div>
          <span className="text-slate-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero obligation</span>
          </div>
        </div>

      </div>
    </section>
  );
};
