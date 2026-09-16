import React from 'react';
import { Users, MapPin, Clock, Star } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const Stats: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'stat-customers':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'stat-areas':
        return <MapPin className="w-5 h-5 text-blue-600" />;
      case 'stat-support':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'stat-rating':
        return <Star className="w-5 h-5 text-amber-500 fill-amber-500" />;
      default:
        return <Users className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <section className="py-14 md:py-18 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {SITE_CONFIG.STATS_DATA.map((stat) => (
            <div
              key={stat.id}
              className="p-6 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  {getIcon(stat.id)}
                </div>
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {stat.label}
                </h3>
                {stat.note && (
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    {stat.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Disclaimer */}
        <p className="text-center text-[11px] text-slate-400 mt-6 italic">
          *Figures represent customer assistance metrics and survey samples. Service availability and specific coverage vary by regional provider network.
        </p>
      </div>
    </section>
  );
};
