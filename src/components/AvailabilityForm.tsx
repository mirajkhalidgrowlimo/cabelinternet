import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MapPin, Phone, Check, X } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export interface AvailabilityFormRef {
  setZipAndFocus: (zip: string) => void;
  scrollToForm: () => void;
}

interface AvailabilityFormProps {
  initialZip?: string;
}

export const AvailabilityForm = forwardRef<AvailabilityFormRef, AvailabilityFormProps>(
  ({ initialZip = '' }, ref) => {
    const [zipCode, setZipCode] = useState(initialZip);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useImperativeHandle(ref, () => ({
      setZipAndFocus: (zip: string) => {
        setZipCode(zip);
        const zipInput = document.getElementById('form-zipCode');
        if (zipInput) {
          zipInput.focus();
        }
      },
      scrollToForm: () => {
        const formEl = document.getElementById('availability-checker');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setErrorMsg('');

      const cleanZip = zipCode.replace(/\D/g, '');
      if (cleanZip.length !== 5) {
        setErrorMsg('Please enter a valid 5-digit US ZIP code.');
        return;
      }

      setIsModalOpen(true);
    };

    return (
      <section
        id="availability-checker"
        className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center"
      >
        <div className="space-y-3">
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
          <form onSubmit={handleSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                id="form-zipCode"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value.replace(/\D/g, ''));
                  if (errorMsg) setErrorMsg('');
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
            {errorMsg && (
              <p className="text-red-500 text-xs font-medium mt-2">
                {errorMsg}
              </p>
            )}
          </form>
        </div>

        {/* Modal Popup (Matching User Image 2) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 text-center">
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
                  id="availability-modal-connect-hotline-button"
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
  }
);

AvailabilityForm.displayName = 'AvailabilityForm';


