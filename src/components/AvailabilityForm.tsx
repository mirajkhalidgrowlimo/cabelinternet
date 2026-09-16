import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Loader2, MapPin, Phone, Wifi, Copy, CheckCheck, Headphones, Signal, Users } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { lookupZipInfo } from '../services/leadService';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [copiedRef, setCopiedRef] = useState(false);
    const [refCode, setRefCode] = useState('');

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

      setIsSubmitting(true);

      setTimeout(() => {
        const code = `CIP-${Math.floor(10000 + Math.random() * 90000)}`;
        setRefCode(code);
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1200);
    };

    const handleReset = () => {
      setIsSuccess(false);
      setZipCode('');
      setErrorMsg('');
    };

    const zipInfo = isSuccess ? lookupZipInfo(zipCode) : null;

    return (
      <section
        id="availability-checker"
        className="relative z-10 -mt-6 md:-mt-10 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-slate-900 px-6 py-6 sm:px-10 sm:py-7 text-white text-center border-b border-slate-800">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ZIP Code Availability Check
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl mx-auto">
              Check top high-speed internet providers and local promos in seconds.
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            {isSuccess ? (
              <div id="form-success-card" className="space-y-6 text-left">
                {/* Agent Availability Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
                  <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 bg-emerald-600 text-white text-xs font-black uppercase rounded-full tracking-wider mb-1 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>5 Agents Available Right Now</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    Providers Found for {zipCode}!
                  </h3>

                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    High-speed networks confirmed in{' '}
                    <strong className="text-slate-900 font-bold">
                      {zipInfo?.city}, {zipInfo?.state}
                    </strong>{' '}
                    with speeds up to{' '}
                    <strong className="text-emerald-700 font-bold">
                      {zipInfo?.maxSpeed || '1,000 Mbps'}
                    </strong>
                    .
                  </p>
                </div>

                {/* Reference Code */}
                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs">
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider">
                      Your Promo Reference Code
                    </span>
                    <span className="font-mono font-black text-sm text-[#183b6b]">
                      {refCode}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(refCode);
                      setCopiedRef(true);
                      setTimeout(() => setCopiedRef(false), 2500);
                    }}
                    type="button"
                    className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedRef ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-[11px]">Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Available Carriers */}
                {zipInfo && zipInfo.providers.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Available Providers in {zipCode}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {zipInfo.providers.map((carrier, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-blue-50/70 border border-blue-200 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <Wifi className="w-3.5 h-3.5 text-blue-600" />
                          {carrier}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hotline Call Box */}
                <div className="bg-[#10243e] text-white rounded-xl p-5 text-center space-y-4 shadow-lg border border-blue-900">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Headphones className="w-4 h-4" />
                    <span>Connect to Hotline • 5 Agents Standing By</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-snug">
                    Call our concierge hotline now to compare live promotions, lock in discounts, and set up your connection.
                  </p>

                  <a
                    href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                    className="inline-flex items-center justify-center gap-3 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-lg sm:text-xl rounded-xl transition-all shadow-md active:scale-[0.98]"
                  >
                    <Phone className="w-6 h-6 animate-bounce" />
                    <span>Call Hotline: {SITE_CONFIG.PHONE_NUMBER}</span>
                  </a>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-slate-300 pt-1">
                    <span className="flex items-center gap-1">
                      <Signal className="w-3 h-3 text-emerald-400" />
                      Instant Connection
                    </span>
                    <span>•</span>
                    <span>Toll-Free 24/7</span>
                  </div>
                </div>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                  >
                    Check another ZIP code
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label htmlFor="form-zipCode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Enter Your ZIP Code
                  </label>
                  <div className="relative">
                    <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                    <input
                      type="text"
                      id="form-zipCode"
                      name="zipCode"
                      inputMode="numeric"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="e.g. 75001"
                      maxLength={5}
                      required
                      disabled={isSubmitting}
                      className="w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-[#183b6b] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-availability-button"
                    className="w-full py-4 bg-[#183b6b] hover:bg-[#122f55] active:scale-[0.99] text-white font-extrabold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-90"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Searching Providers...</span>
                      </div>
                    ) : (
                      <span>Check Availability</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    5 Agents Available
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    Toll-Free 24/7 Hotline
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }
);

AvailabilityForm.displayName = 'AvailabilityForm';

