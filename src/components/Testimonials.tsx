import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { SITE_CONFIG } from '../config';

export const Testimonials: React.FC = () => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const testimonials = SITE_CONFIG.TESTIMONIAL_DATA;

  const nextTestimonial = () => {
    setMobileIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setMobileIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-18">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-3">
            Real Customer Experiences
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3.5 leading-relaxed">
            See how home and business users streamlined their connectivity setups with our guidance.
          </p>
        </div>

        {/* Desktop View: 3-column Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Visual Rating */}
                <div className="flex items-center gap-1 mb-4" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Icon & Text */}
                <Quote className="w-8 h-8 text-blue-100 mb-2" />
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
                {item.planUsed && (
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                    {item.planUsed}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View: Carousel */}
        <div className="md:hidden">
          <div className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-md flex flex-col justify-between min-h-[260px] relative">
            <div>
              {/* Star Rating */}
              <div className="flex items-center gap-1 mb-4" aria-label="5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                "{testimonials[mobileIndex].quote}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 leading-tight">
                  {testimonials[mobileIndex].name}
                </h3>
                <p className="text-xs text-slate-500">{testimonials[mobileIndex].location}</p>
              </div>
              {testimonials[mobileIndex].planUsed && (
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {testimonials[mobileIndex].planUsed}
                </span>
              )}
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-4 px-2">
            <div className="flex gap-1.5">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    mobileIndex === idx ? 'bg-blue-600 w-6' : 'bg-slate-300'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prevTestimonial}
                aria-label="Previous Testimonial"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs active:bg-slate-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextTestimonial}
                aria-label="Next Testimonial"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs active:bg-slate-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer for Testimonials */}
        <p className="text-center text-[11px] text-slate-400 mt-8">
          *Customer feedback reflections based on concierge assistance surveys. Names and quotes are representative placeholders for service demonstration.
        </p>
      </div>
    </section>
  );
};
