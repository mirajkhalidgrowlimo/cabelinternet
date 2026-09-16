import React from 'react';
import { Wifi, Globe, BarChart2 } from 'lucide-react';

interface TechOptionsSectionProps {
  onCheckAvailabilityClick?: () => void;
}

export const TechOptionsSection: React.FC<TechOptionsSectionProps> = ({
  onCheckAvailabilityClick,
}) => {
  const options = [
    {
      id: 1,
      title: 'Cable Internet',
      description: 'High-speed cable service where available in your area.',
      icon: <Wifi className="w-8 h-8 text-blue-600 mx-auto" />,
    },
    {
      id: 2,
      title: 'Fiber Internet',
      description: 'Symmetrical speeds over fiber-optic lines where offered.',
      icon: <Globe className="w-8 h-8 text-blue-600 mx-auto" />,
    },
    {
      id: 3,
      title: 'DSL & Fixed Wireless',
      description: 'Reliable coverage options for suburban and rural addresses.',
      icon: <BarChart2 className="w-8 h-8 text-blue-600 mx-auto" />,
    },
    {
      id: 4,
      title: 'Satellite Internet',
      description: 'Nationwide availability, useful for hard-to-reach locations.',
      icon: <Globe className="w-8 h-8 text-blue-600 mx-auto" />,
    },
  ];

  return (
    <section id="options" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mb-4">
          Internet Service Options We Compare
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-10">
          We help you evaluate available internet technologies in your area so you can choose a plan that fits your speed needs and budget.
        </p>

        {/* 4 Cards */}
        <div className="space-y-4 sm:space-y-5">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={onCheckAvailabilityClick}
              className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-slate-300 transition-all cursor-pointer text-center"
            >
              <div className="mb-3">
                {opt.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {opt.title}
              </h3>
              <p className="text-sm text-slate-600">
                {opt.description}
              </p>
            </div>
          ))}
        </div>

        {/* Disclosure */}
        <p className="mt-8 text-xs leading-relaxed text-slate-500 max-w-lg mx-auto">
          <strong>Disclosure:</strong> Cable Internet Plans is an independent comparison and referral service and is not affiliated with, endorsed by, or sponsored by any internet service provider. Availability, pricing, and speeds vary by address and are determined by the provider at the time of service activation.
        </p>

      </div>
    </section>
  );
};
