import React from 'react';
import { SITE_CONFIG } from '../config';

interface PlansProps {
  onCheckAvailabilityClick: () => void;
}

export const Plans: React.FC<PlansProps> = ({ onCheckAvailabilityClick }) => {
  const packages = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'from $70',
      period: '/mo',
      description: 'Great for email, browsing, light streaming.*',
    },
    {
      id: 'everyday',
      name: 'Everyday',
      price: 'from $50',
      period: '/mo',
      description: 'HD streaming, multiple devices.*',
    },
    {
      id: 'gigabit',
      name: 'Fast/Gigabit',
      price: 'from $70–$100',
      period: '/mo',
      description: '4K streaming, gaming, home offices.*',
    },
  ];

  return (
    <section id="packages" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mb-10">
          Popular Packages
        </h2>

        {/* 3 Cards */}
        <div className="space-y-4 sm:space-y-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={onCheckAvailabilityClick}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all cursor-pointer text-center"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {pkg.name}
              </h3>

              <div className="mb-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#183b6b]">
                  {pkg.price}
                </span>
                <span className="text-base sm:text-lg font-medium text-slate-500">
                  {pkg.period}
                </span>
              </div>

              <p className="text-sm text-slate-600">
                {pkg.description}
              </p>
            </div>
          ))}
        </div>

        {/* Asterisk Disclaimer */}
        <p className="mt-8 text-xs leading-relaxed text-slate-500 max-w-lg mx-auto">
          * Pricing, speeds, equipment fees, and availability vary by address and provider. Autopay/paperless billing may be required. Taxes/fees extra.
        </p>

        {/* CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={onCheckAvailabilityClick}
            id="plans-check-availability"
            className="inline-block px-8 py-3.5 bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-base rounded-xl transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Check Availability
          </button>
        </div>

        {/* Prefer to talk link */}
        <div className="mt-4">
          <span className="text-sm text-slate-600">
            Prefer to talk?{' '}
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
            >
              {SITE_CONFIG.PHONE_NUMBER}
            </a>
          </span>
        </div>

      </div>
    </section>
  );
};
