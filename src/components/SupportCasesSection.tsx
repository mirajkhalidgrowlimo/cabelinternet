import React from 'react';
import { Package, Zap, Shield, Settings } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface SupportCasesSectionProps {
  onCheckAvailabilityClick?: () => void;
}

export const SupportCasesSection: React.FC<SupportCasesSectionProps> = ({
  onCheckAvailabilityClick,
}) => {
  const cases = [
    {
      id: 1,
      title: 'New connection',
      icon: <Package className="w-7 h-7 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 2,
      title: 'Upgrade speed',
      icon: <Zap className="w-7 h-7 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 3,
      title: 'Lower your bill',
      icon: <Shield className="w-7 h-7 text-blue-600 stroke-[2.2]" />,
    },
    {
      id: 4,
      title: 'Cancel or switch',
      icon: <Settings className="w-7 h-7 text-blue-600 stroke-[2.2]" />,
    },
  ];

  return (
    <section id="support-cases" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mb-12">
          Support Use Cases
        </h2>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-y-10 gap-x-6 max-w-md mx-auto mb-10">
          {cases.map((item) => (
            <div
              key={item.id}
              onClick={onCheckAvailabilityClick}
              className="flex flex-col items-center justify-center cursor-pointer group"
            >
              <div className="mb-2 group-hover:scale-105 transition-transform">
                {item.icon}
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* 24/7 Phone Text */}
        <div className="text-sm sm:text-base text-slate-700 font-medium">
          24/7 phone:{' '}
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            className="font-bold text-[#183b6b] hover:underline"
          >
            {SITE_CONFIG.PHONE_NUMBER}
          </a>
        </div>

      </div>
    </section>
  );
};
