import React, { useState } from 'react';
import { MapPin, Phone, ArrowRight, Search, ShieldCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface CoverageCTAProps {
  onCheckZip: (zip: string) => void;
  onCheckAvailabilityClick: () => void;
}

export const CoverageCTA: React.FC<CoverageCTAProps> = ({
  onCheckZip,
  onCheckAvailabilityClick,
}) => {
  const [zipInput, setZipInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipInput.replace(/\D/g, '').slice(0, 5);
    if (cleanZip.length !== 5) {
      setErrorMsg('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setErrorMsg('');
    onCheckZip(cleanZip);
  };

  return (
    <section id="address-cta" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-blue-500/10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-blue-400/10 pointer-events-none" />
      <div className="absolute -right-32 -bottom-32 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold tracking-wider uppercase mb-5 border border-blue-400/20">
          <MapPin className="w-3.5 h-3.5" />
          <span>Address Lookup Assistance</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Not Sure What's Available at Your Address?
        </h2>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Tell us where you live and we'll help identify the service options available in your area.
        </p>

        {/* Prominent ZIP Input Box */}
        <div className="max-w-xl mx-auto mb-8">
          <form onSubmit={handleZipSubmit} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={zipInput}
                onChange={(e) => {
                  setZipInput(e.target.value.replace(/\D/g, '').slice(0, 5));
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter ZIP Code"
                maxLength={5}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-base focus:bg-white/15 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 transition-all font-semibold"
              />
            </div>
            <button
              type="submit"
              id="check-my-area-btn"
              className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Check My Area</span>
            </button>
          </form>

          {errorMsg && (
            <p className="text-rose-400 text-xs font-medium mt-2 text-left sm:text-center">
              {errorMsg}
            </p>
          )}
        </div>

        {/* Secondary Action Link / Phone Call */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-white/10">
          <button
            onClick={onCheckAvailabilityClick}
            className="text-sm font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Or open comprehensive availability check</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="hidden sm:inline text-slate-500">•</span>

          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-300 transition-colors"
          >
            <Phone className="w-4 h-4 text-sky-400" />
            <span>Speak to a live specialist: {SITE_CONFIG.PHONE_NUMBER}</span>
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>No commitment required • Free address availability check</span>
        </div>
      </div>
    </section>
  );
};
