import React from 'react';
import { Zap, ShieldCheck, Sliders, Headphones } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const TrustBar: React.FC = () => {
  const icons = [
    <Zap key="zap" className="w-6 h-6 text-blue-600" />,
    <ShieldCheck key="shield" className="w-6 h-6 text-blue-600" />,
    <Sliders key="sliders" className="w-6 h-6 text-blue-600" />,
    <Headphones key="headphones" className="w-6 h-6 text-blue-600" />,
  ];

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Why Customers Choose Us
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SITE_CONFIG.TRUST_ITEMS.map((item, idx) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50/80 transition-colors border border-transparent hover:border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100/80 flex items-center justify-center shrink-0 shadow-xs">
                {icons[idx]}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
