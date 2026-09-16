import React from 'react';
import { Package, Shield, Clock, Zap } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      id: 1,
      title: 'One place, many providers',
      description: 'Stop visiting 10 sites—get options in minutes.',
      icon: <Package className="w-6 h-6 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 2,
      title: 'Real discounts',
      description: 'We surface eligible promos, bundles, and bill-lowering opportunities.',
      icon: <Shield className="w-6 h-6 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 3,
      title: '24/7 agents',
      description: (
        <span>
          Call anytime:{' '}
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            className="text-[#183b6b] font-bold hover:underline"
          >
            {SITE_CONFIG.PHONE_NUMBER}
          </a>
        </span>
      ),
      icon: <Clock className="w-6 h-6 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 4,
      title: 'Switching made simple',
      description: 'Upgrades, downgrades, cancellations—we guide you.',
      icon: <Zap className="w-6 h-6 text-blue-600 stroke-[2.2]" />,
    },
  ];

  return (
    <section id="why-us" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto">
        
        {/* Section Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center tracking-tight mb-12">
          Why Cable Internet Plans
        </h2>

        {/* 4 Items */}
        <div className="space-y-8">
          {reasons.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className="shrink-0 mt-0.5">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed">
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
