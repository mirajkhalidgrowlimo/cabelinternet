import React, { useState, useRef } from 'react';
import { Phone, Check, Users, MapPin, Loader2, CheckCircle2, Wifi, Zap, Shield, Copy, CheckCheck } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { LeadService, lookupZipInfo } from '../services/leadService';
import { Lead } from '../types';

export const Hero: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

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

  const formatPhone = (val: string) => {
    const nums = val.replace(/\D/g, '');
    if (nums.length <= 3) return nums;
    if (nums.length <= 6) return `(${nums.slice(0, 3)}) ${nums.slice(3)}`;
    return `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanZip = zipCode.replace(/\D/g, '');
    if (cleanZip.length !== 5) {
      setFormError('Please enter a valid 5-digit US ZIP code.');
      return;
    }

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setScanStep(1);

    // Multi-phase realistic lookup sequence
    setTimeout(() => {
      setScanStep(2);
    }, 600);

    setTimeout(() => {
      setScanStep(3);
    }, 1200);

    setTimeout(() => {
      const zipInfo = lookupZipInfo(cleanZip);

      const newLead = LeadService.addLead({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        zipCode: cleanZip,
        streetAddress: streetAddress.trim() || undefined,
        city: zipInfo.city,
        state: zipInfo.state,
        detectedProviders: zipInfo.providers,
        selectedPlan: 'Everyday (from $50/mo)',
        notes: `Customer requested availability check for ${streetAddress ? streetAddress + ', ' : ''}${zipInfo.city}, ${zipInfo.state} ${cleanZip}. Speed capability up to ${zipInfo.maxSpeed}.`,
        source: 'Website Availability Checker',
      });

      setIsSubmitting(false);
      setScanStep(0);
      setSubmittedLead(newLead);
    }, 1800);
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
    setStreetAddress('');
    setFullName('');
    setPhone('');
    setEmail('');
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
            <span>No long forms</span>
          </div>

          <div className="inline-flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-700 stroke-[2.2]" />
            <span>Real humans</span>
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
            /* Results Screen: Detailed Availability Verified */
            <div className="space-y-6">
              
              {/* Top Verified Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-2.5 shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  High-Speed Internet Verified!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Service lines confirmed in{' '}
                  <strong className="text-slate-900 font-bold">
                    {submittedLead.city}, {submittedLead.state} ({submittedLead.zipCode})
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
                    Networks Servicing Your Address:
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

              {/* Verified Promotional Options Available */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Eligible Promotional Packages:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center">
                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="text-xs font-bold text-slate-500 block">Starter</span>
                    <span className="text-lg font-extrabold text-[#183b6b] block">from $70<span className="text-xs font-medium text-slate-500">/mo</span></span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Up to 300 Mbps</span>
                  </div>

                  <div className="border-2 border-[#183b6b] rounded-xl p-3 bg-blue-50/30 relative">
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#183b6b] text-white text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider">
                      Popular
                    </span>
                    <span className="text-xs font-bold text-slate-700 block">Everyday</span>
                    <span className="text-lg font-extrabold text-[#183b6b] block">from $50<span className="text-xs font-medium text-slate-500">/mo</span></span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Up to 500 Mbps</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-3 bg-white">
                    <span className="text-xs font-bold text-slate-500 block">Fast / Gigabit</span>
                    <span className="text-lg font-extrabold text-[#183b6b] block">from $70–$100<span className="text-xs font-medium text-slate-500">/mo</span></span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">Up to 1,000+ Mbps</span>
                  </div>
                </div>
              </div>

              {/* Priority Call-In Card */}
              <div className="bg-[#10243e] text-white rounded-xl p-4 sm:p-5 text-center space-y-3">
                <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold block">
                  Step 2 of 2: Lock In Your Monthly Rate
                </span>
                <p className="text-sm text-slate-200 leading-snug">
                  Call our dispatch desk now with your Reference Code{' '}
                  <strong className="text-white underline font-mono">{submittedLead.referenceCode}</strong>{' '}
                  to reserve your installation window and lock in today's promotions.
                </p>

                <a
                  href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                  id="results-call-now-button"
                  className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl transition-all shadow-md active:scale-[0.98]"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call {SITE_CONFIG.PHONE_NUMBER}</span>
                </a>

                <span className="text-[11px] text-slate-300 block">
                  Free 2-minute call • 24/7 Live Representative Assistance
                </span>
              </div>

              {/* Reset to check another address */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={handleCheckAnother}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Check another address or modify information
                </button>
              </div>

            </div>
          ) : (
            /* Standard Address Check Form */
            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* ZIP Code */}
              <div>
                <label htmlFor="hero-zip" className="sr-only">
                  ZIP Code
                </label>
                <input
                  ref={zipInputRef}
                  id="hero-zip"
                  type="text"
                  inputMode="numeric"
                  maxLength={5}
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="ZIP Code *"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-transparent transition-all"
                />
              </div>

              {/* Street Address (optional) */}
              <div>
                <label htmlFor="hero-street" className="sr-only">
                  Street Address (optional)
                </label>
                <input
                  id="hero-street"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Street Address (optional)"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-transparent transition-all"
                />
              </div>

              {/* Full Name */}
              <div>
                <label htmlFor="hero-name" className="sr-only">
                  Full Name
                </label>
                <input
                  id="hero-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full Name *"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-transparent transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="hero-phone" className="sr-only">
                  Phone
                </label>
                <input
                  id="hero-phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Phone Number *"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-transparent transition-all"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="hero-email" className="sr-only">
                  Email
                </label>
                <input
                  id="hero-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address *"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:border-transparent transition-all"
                />
              </div>

              {/* Submit / Verification Scanning Progress */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  id="form-submit-button"
                  className="w-full py-3.5 bg-[#183b6b] hover:bg-[#122f55] active:scale-[0.99] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-sm flex flex-col items-center justify-center gap-1 cursor-pointer disabled:opacity-90"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>
                        {scanStep === 1 && 'Querying local telecom lines...'}
                        {scanStep === 2 && 'Scanning fiber & cable nodes...'}
                        {scanStep === 3 && 'Unlocking exclusive promo pricing...'}
                        {scanStep === 0 && 'Checking Availability...'}
                      </span>
                    </div>
                  ) : (
                    <span>Check Availability</span>
                  )}
                </button>
              </div>

              {/* TCPA Disclaimer text */}
              <p className="pt-2 text-[11px] leading-relaxed text-slate-500 text-center">
                By clicking Check Availability, you agree Cable Internet Plans and its partners may contact you about internet offers at the number and email provided, including by autodialed calls/texts. Consent not required for purchase. Msg/data rates may apply. You can opt out anytime. Call us at{' '}
                <a href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`} className="text-slate-700 underline font-medium">
                  {SITE_CONFIG.PHONE_NUMBER}
                </a>
                .
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
