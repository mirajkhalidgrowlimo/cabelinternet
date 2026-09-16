import React, { useState, useRef } from 'react';
import { Phone, Check, Users, MapPin, Loader2, Wifi, Copy, CheckCheck, Headphones, Signal } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { LeadService, lookupZipInfo } from '../services/leadService';
import { Lead } from '../types';

export const Hero: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);
  const [formError, setFormError] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length !== 5) {
      setFormError('Please enter a valid 5-digit US ZIP code.');
      return;
    }

    setIsSubmitting(true);
    setScanStep(1);

    setTimeout(() => {
      setScanStep(2);
    }, 500);

    setTimeout(() => {
      setScanStep(3);
    }, 1000);

    setTimeout(() => {
      const zipInfo = lookupZipInfo(cleanZip);

      const newLead = LeadService.addLead({
        fullName: `Visitor (${cleanZip})`,
        phone: SITE_CONFIG.PHONE_NUMBER,
        email: 'zipcheck@cableinternetplans.online',
        zipCode: cleanZip,
        city: zipInfo.city,
        state: zipInfo.state,
        detectedProviders: zipInfo.providers,
        selectedPlan: 'ZIP Availability Check',
        notes: `ZIP Availability check for ${zipInfo.city}, ${zipInfo.state} ${cleanZip}. Speed up to ${zipInfo.maxSpeed}.`,
        source: 'Website ZIP Availability Checker',
      });

      setIsSubmitting(false);
      setScanStep(0);
      setSubmittedLead(newLead);
    }, 1500);
  };

  const copyReferenceCode = () => {
    if (submittedLead?.referenceCode) {
      navigator.clipboard.writeText(submittedLead.referenceCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleCheckAnother = () => {
    setSubmittedLead(null);
    setZipCode('');
    setFormError('');
  };

  const detectedInfo = submittedLead ? lookupZipInfo(submittedLead.zipCode) : null;

  return (
    <section id="home" className="pt-10 pb-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
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

        {/* Top CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={scrollToForm}
            id="hero-check-availability-button"
            className="inline-block px-8 py-3.5 bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-base rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
          >
            Check Availability
          </button>
        </div>

        {/* Call 24/7 link */}
        <div className="mt-4">
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="hero-phone-link"
            className="text-sm sm:text-base font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Call 24/7: {SITE_CONFIG.PHONE_NUMBER}
          </a>
        </div>

        {/* Trust Badges Row */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 font-medium">
          <div className="inline-flex items-center gap-1.5">
            <Check className="w-4 h-4 text-slate-700 stroke-[2.5]" />
            <span>Instant ZIP check</span>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-700 stroke-[2.2]" />
            <span>5 Live Agents Online</span>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-700 stroke-[2.2]" />
            <span>Offers vary by ZIP</span>
          </div>
        </div>

        {/* Form / Availability Checker Card */}
        <div
          ref={formCardRef}
          id="availability-form"
          className="mt-8 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-7 shadow-xs text-left transition-all"
        >
          {submittedLead ? (
            /* Results Screen: 5 Agents Available + Hotline Connect */
            <div className="space-y-6">
              
              {/* Agent Availability Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-2">
                <div className="inline-flex items-center justify-center gap-2 px-3.5 py-1 bg-emerald-600 text-white text-xs font-black uppercase rounded-full tracking-wider mb-1 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>5 Agents Available Right Now</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  Providers Found for {submittedLead.zipCode}!
                </h3>

                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  High-speed networks confirmed in{' '}
                  <strong className="text-slate-900 font-bold">
                    {submittedLead.city}, {submittedLead.state}
                  </strong>{' '}
                  with speeds up to{' '}
                  <strong className="text-emerald-700 font-bold">
                    {detectedInfo?.maxSpeed || '1,000 Mbps'}
                  </strong>
                  .
                </p>
              </div>

              {/* Reference ID Badge */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs">
                <div>
                  <span className="text-slate-500 font-medium block text-[11px] uppercase tracking-wider">
                    Your Promo Reference Code
                  </span>
                  <span className="font-mono font-black text-sm text-[#183b6b]">
                    {submittedLead.referenceCode}
                  </span>
                </div>
                <button
                  onClick={copyReferenceCode}
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

              {/* Available Carriers in this area */}
              {detectedInfo && detectedInfo.providers.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Available Providers in {submittedLead.zipCode}:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {detectedInfo.providers.map((carrier, idx) => (
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

              {/* Hotline Call Box - 5 Agents Available */}
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
                  id="results-call-now-button"
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

              {/* Reset to check another ZIP */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleCheckAnother}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Check another ZIP code
                </button>
              </div>

            </div>
          ) : (
            /* Simple ZIP Code Only Check Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}

              <div>
                <label htmlFor="hero-zip" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter Your ZIP Code
                </label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-3.5 pointer-events-none" />
                  <input
                    ref={zipInputRef}
                    id="hero-zip"
                    type="text"
                    inputMode="numeric"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 75001"
                    required
                    disabled={isSubmitting}
                    className="w-full pl-11 pr-4 py-3.5 border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-[#183b6b] transition-all"
                  />
                </div>
              </div>

              {/* Submit / Verification Scanning Progress */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="form-submit-button"
                  className="w-full py-4 bg-[#183b6b] hover:bg-[#122f55] active:scale-[0.99] text-white font-extrabold text-base rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>
                        {scanStep === 1 && 'Searching local telecom nodes...'}
                        {scanStep === 2 && 'Connecting available agents...'}
                        {scanStep === 3 && 'Unlocking local promos...'}
                        {scanStep === 0 && 'Checking Availability...'}
                      </span>
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
};
