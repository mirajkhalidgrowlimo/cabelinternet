import React, { useState, useRef } from 'react';
import { Phone, Check, MapPin, X } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const Hero: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const formCardRef = useRef<HTMLDivElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  const scrollToForm = () => {
    if (formCardRef.current) {
      formCardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        zipInputRef.current?.focus();
      }, 300);
    }
  };

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length !== 5) {
      setFormError('Please enter a valid 5-digit US ZIP code.');
      return;
    }

    setIsModalOpen(true);
  };

  return (
    <section id="home" className="pt-10 pb-16 px-4 sm:px-6 bg-white relative">
      <div className="max-w-xl sm:max-w-3xl mx-auto text-center">
        
        {/* Main Display Headline */}
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0f172a] leading-[1.15]">
          Faster internet. Lower bills. Easy switch.
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto">
          We compare plans from top U.S. providers and unlock promos starting from $70 to $100/mo
        </p>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">
          (price varies by location/provider)
        </p>

        {/* Call 24/7 link */}
        <div className="mt-4">
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="hero-phone-link"
            className="text-sm sm:text-base font-bold text-[#38b6ff] hover:underline transition-colors"
          >
            Call 24/7: {SITE_CONFIG.PHONE_NUMBER}
          </a>
        </div>

        {/* Check Availability Inline Form Section (Matching User Image 1) */}
        <div
          ref={formCardRef}
          id="availability-form"
          className="mt-12 text-center max-w-2xl mx-auto space-y-3 pt-6 border-t border-slate-100"
        >
          {/* Circle Map Pin Icon */}
          <div className="w-12 h-12 rounded-full bg-[#f0f9ff] border border-[#e0f2fe] flex items-center justify-center mx-auto text-[#38b6ff] shadow-xs">
            <MapPin className="w-6 h-6 stroke-[2]" />
          </div>

          {/* Subtitle Label */}
          <span className="text-xs font-bold tracking-widest text-[#38b6ff] uppercase block">
            CHECK AVAILABILITY
          </span>

          {/* Main Title */}
          <h2 className="text-2xl sm:text-4xl font-black text-[#1c1240] tracking-tight">
            Enter ZIP Code to Check Availability
          </h2>

          {/* Inline ZIP Form */}
          <form onSubmit={handleZipSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                ref={zipInputRef}
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value.replace(/\D/g, ''));
                  if (formError) setFormError('');
                }}
                placeholder="Enter ZIP code"
                required
                className="w-full sm:w-64 px-4 py-3 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#38b6ff] focus:border-[#38b6ff] bg-white shadow-xs font-medium"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-[#38b6ff] hover:bg-[#20a3ed] active:scale-95 text-white font-bold text-sm rounded-lg transition-all shadow-sm cursor-pointer shrink-0"
              >
                Check Now
              </button>
            </div>
            {formError && (
              <p className="text-red-500 text-xs font-medium mt-2">
                {formError}
              </p>
            )}
          </form>
        </div>

      </div>

      {/* Modal Popup (Matching User Image 2) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            
            {/* Close Button X */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors text-xl font-bold cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Circle Checkmark Icon */}
            <div className="w-20 h-20 rounded-full bg-[#f0f9ff] flex items-center justify-center mx-auto text-[#38b6ff]">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            {/* Main Congratulations Heading */}
            <div className="space-y-1">
              <h3 className="text-3xl sm:text-4xl font-black text-[#1c1240] tracking-tight">
                Congratulations!
              </h3>
              <p className="text-lg sm:text-xl font-bold text-[#1c1240]">
                5 agents are available
              </p>
            </div>

            {/* Big Red Connect Hotline Button */}
            <div className="pt-2">
              <a
                href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                id="modal-connect-hotline-button"
                className="inline-flex items-center justify-center gap-3 w-full py-4 bg-[#ea3838] hover:bg-[#d42c2c] text-white font-extrabold text-lg sm:text-xl rounded-full shadow-lg shadow-red-500/25 active:scale-95 transition-all"
              >
                <Phone className="w-6 h-6 fill-current stroke-none" />
                <span>Connect Hotline</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
