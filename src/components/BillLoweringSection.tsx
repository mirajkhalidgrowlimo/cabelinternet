import React from 'react';
import { Phone } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const BillLoweringSection: React.FC = () => {
  return (
    <section id="bill-lowering" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight mb-4">
          Bill-Lowering Help
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          Already have internet? We'll check promos, loyalty discounts, and bundle options to try to cut your monthly bill—often without switching providers.
        </p>

        {/* Call Link with Phone Icon */}
        <div>
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="bill-lowering-phone-link"
            className="inline-flex items-center gap-2 text-blue-600 font-bold text-base sm:text-lg hover:text-blue-700 hover:underline transition-colors"
          >
            <Phone className="w-4 h-4 text-blue-600 stroke-[2.5]" />
            <span>Call {SITE_CONFIG.PHONE_NUMBER}</span>
          </a>
        </div>

      </div>
    </section>
  );
};
