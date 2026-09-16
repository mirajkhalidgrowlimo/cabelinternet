import React, { useState } from 'react';
import { MapPin, Search, CheckCircle, Globe2, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface ServiceAreaProps {
  onCheckZip: (zip: string) => void;
}

export const ServiceArea: React.FC<ServiceAreaProps> = ({ onCheckZip }) => {
  const [zipCode, setZipCode] = useState('');
  const [activeState, setActiveState] = useState(SITE_CONFIG.SERVICE_AREAS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanZip = zipCode.replace(/\D/g, '').slice(0, 5);
    if (cleanZip.length === 5) {
      onCheckZip(cleanZip);
    }
  };

  return (
    <section id="coverage" className="py-20 md:py-28 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Regional Coverage Hubs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Check Service Availability in Your Area
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3.5 leading-relaxed">
            We continuously expand our coverage network across key metropolitan and suburban service clusters.
          </p>
        </div>

        {/* Central Search Form */}
        <div className="max-w-xl mx-auto mb-14">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="Enter Your 5-Digit ZIP Code"
                maxLength={5}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-base font-medium focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-xs transition-all"
              />
            </div>
            <button
              type="submit"
              className="px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-base shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Check Availability</span>
              <Search className="w-4 h-4" />
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-2.5">
            Availability and service options may vary by location.
          </p>
        </div>

        {/* Map / Coverage Hubs Interactive Visualization */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          {/* Subtle US Grid Vector Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: State Selectors */}
            <div className="lg:col-span-5">
              <h3 className="text-xl font-extrabold text-white mb-2">
                Popular Coverage States
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Click any region to inspect sample served metropolitan areas:
              </p>

              <div className="grid grid-cols-2 gap-2">
                {SITE_CONFIG.SERVICE_AREAS.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setActiveState(item)}
                    className={`flex items-center justify-between p-3 rounded-xl text-left text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      activeState.code === item.code
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    <span>{item.state}</span>
                    <span className="text-[11px] opacity-75 font-mono">{item.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Dynamic Region Details & Interactive Graphic */}
            <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div>
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                    Region Highlights
                  </span>
                  <h4 className="text-2xl font-black text-white">
                    {activeState.state} ({activeState.code})
                  </h4>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Active Broadband Access</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">
                  Key Serviced Metropolitan Areas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeState.cities.map((city) => (
                    <span
                      key={city}
                      className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                      <MapPin className="w-3 h-3 text-sky-400" />
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              {/* Instant Trigger for Selected State */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-300 text-center sm:text-left">
                  Live in or near {activeState.state}? Check your exact address.
                </p>
                <button
                  onClick={() => {
                    const el = document.getElementById('availability-checker');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  <span>Verify My Address</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
