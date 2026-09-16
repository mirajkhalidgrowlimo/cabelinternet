import React from 'react';
import { MapPin, Package, Settings } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: '1. Tell us your address',
      description: 'We find which providers and promos serve your exact location.',
      icon: <MapPin className="w-6 h-6 text-white" />,
    },
    {
      id: 2,
      title: '2. Pick a plan',
      description: 'Packages typically range $70–$100/mo depending on provider and speed.',
      icon: <Package className="w-6 h-6 text-white" />,
    },
    {
      id: 3,
      title: '3. We set it up',
      description: 'We handle activation, upgrades, and (with your approval) help cancel the old plan.',
      icon: <Settings className="w-6 h-6 text-white" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mb-12">
          How It Works
        </h2>

        {/* Steps */}
        <div className="space-y-12">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              {/* Circular Navy Icon */}
              <div className="w-14 h-14 rounded-full bg-[#183b6b] flex items-center justify-center mb-4 shadow-sm">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
