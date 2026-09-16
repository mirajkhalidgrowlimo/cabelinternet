import React, { useState } from 'react';
import { Phone, CheckCircle2, DollarSign, ArrowRight, Shield, Zap, Sparkles, Clock, AlertCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { LeadService } from '../services/leadService';

interface BillHelpPageProps {
  onCheckAvailabilityClick: () => void;
}

export const BillHelpPage: React.FC<BillHelpPageProps> = ({ onCheckAvailabilityClick }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    zipCode: '',
    currentProvider: '',
    currentBill: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) return;

    setIsSubmitting(true);
    try {
      LeadService.addLead({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        zipCode: formData.zipCode || '00000',
        currentProvider: formData.currentProvider || 'Other / Not specified',
        currentBillAmount: formData.currentBill ? parseFloat(formData.currentBill.replace(/[^0-9.]/g, '')) : undefined,
        notes: `[Bill Review Request] Provider: ${formData.currentProvider || 'N/A'}, Current Bill: $${formData.currentBill || 'N/A'}. Details: ${formData.notes || 'Requested free bill review & lowering audit.'}`,
        source: 'Bill Lowering Page',
        selectedPlan: 'Bill Reduction Review ($50-$120/mo avg savings)',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting bill help request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const savingsStrategies = [
    {
      title: 'Promotional Pricing Opportunities',
      desc: 'New-customer promotions and intro discounts expire without warning. We identify current promotional tiers in your area to reset your pricing.',
    },
    {
      title: 'Removing Unnecessary Rental Fees',
      desc: 'Modem and router rental fees cost $14 to $20/month ($168 - $240/yr). We show you how to eliminate equipment fees or receive free gateway upgrades.',
    },
    {
      title: 'Right-Sizing Your Speed Tier',
      desc: 'Over 65% of households pay for gigabit tiers when 300-500 Mbps delivers identical real-world streaming and Zoom quality while saving $30-$50 monthly.',
    },
    {
      title: 'Retention & Loyalty Discounts',
      desc: 'Existing customers are frequently eligible for unadvertised retention discounts. We provide the exact scripts and competitor quotes needed.',
    },
    {
      title: 'Streaming & Unbundled Alternatives',
      desc: 'Bundled legacy TV packages often inflate cable bills by $80-$140/mo with regional broadcast fees. We show you how standalone high-speed internet + streaming cuts costs.',
    },
  ];

  const preparationChecklist = [
    'Your most recent internet or cable statement (PDF or paper bill)',
    'Your complete service address and 5-digit ZIP code',
    'Current internet download speed and monthly total with taxes',
    'Contract status (contract end date or month-to-month service)',
    'Number of active remote workers or gamers in your household',
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#183b6b] to-[#122f55] text-white py-14 sm:py-18 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% Free, No-Obligation Internet Bill Review</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Review & Lower Your Internet Bill
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Cable Internet Plans provides a complimentary review of your current internet statement to find hidden fees, expiring promotions, and cheaper competitor alternatives.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call (800) 624-0038 for Free Bill Review</span>
            </a>
          </div>
          <p className="text-xs text-slate-300">
            Average call time: 10-15 minutes | No commitment required | Results vary by address
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Potential Savings</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Subscribers typically uncover $20 to $65+ in monthly savings by renegotiating terms or moving to new promotional plans.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#183b6b] flex items-center justify-center mx-auto mb-2">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">100% Free Review</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No charge to evaluate your bill. We compare rates across all providers in your ZIP code at zero cost to you.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-2 text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zero Pressure</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Choose to switch providers, negotiate with your current company, or do nothing. You remain in complete control.
            </p>
          </div>
        </div>

        {/* Interactive Form & How We Save Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: How We Save */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                5 Common Ways Households Overpay
              </h2>
              <div className="space-y-4">
                {savingsStrategies.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-[#183b6b] pl-4 py-1 space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist Box */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#183b6b]" />
                <span>What to Have Ready for Your Bill Review</span>
              </h3>
              <ul className="space-y-2.5">
                {preparationChecklist.map((check, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Request Form */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm sticky top-24">
            <div className="space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-900">Request a Free Bill Audit</h3>
              <p className="text-xs text-slate-500">
                Enter your details below and an internet cost specialist will review your options and follow up.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-emerald-900 text-base">Request Received!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you, {formData.fullName}. A broadband savings advisor will analyze provider rates for ZIP {formData.zipCode} and contact you shortly.
                </p>
                <div className="pt-2">
                  <a
                    href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline"
                  >
                    <span>Or call now: {SITE_CONFIG.PHONE_NUMBER}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-left">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jennifer Smith"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      5-Digit ZIP Code *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      required
                      placeholder="e.g., 75001"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Provider
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Spectrum, Xfinity"
                      value={formData.currentProvider}
                      onChange={(e) => setFormData({ ...formData, currentProvider: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Current Monthly Bill
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., $95/mo"
                      value={formData.currentBill}
                      onChange={(e) => setFormData({ ...formData, currentBill: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="jennifer@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 py-3 rounded-xl bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-xs shadow transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit for Free Bill Review'}
                </button>
                <p className="text-[10px] text-slate-400 text-center">
                  By clicking submit, you agree to receive a callback regarding your internet service options.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Call Box */}
        <div className="bg-[#183b6b] text-white rounded-2xl p-6 sm:p-8 shadow-md text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">Prefer to talk with an advisor right now?</h3>
          <p className="text-slate-200 text-sm max-w-xl mx-auto">
            Our team is available 24/7. Have your statement nearby and call us to get immediate side-by-side rates.
          </p>
          <div className="pt-2">
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call (800) 624-0038 - Free Review</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
