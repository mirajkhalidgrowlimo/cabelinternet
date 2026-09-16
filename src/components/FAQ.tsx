import React from 'react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: 'What providers do you cover?',
      a: 'We help you compare cable, fiber, DSL, fixed wireless, and satellite internet options available at your address. Cable Internet Plans is an independent referral service and is not affiliated with any specific provider.',
    },
    {
      q: 'How does the service work?',
      a: "Share your address and we'll show the internet technologies and plan tiers available at your location. Final pricing, terms, and availability are confirmed by the chosen provider before you sign up.",
    },
    {
      q: 'How do you make money?',
      a: 'We may receive a referral fee from a provider if you choose to sign up. This does not add cost to you and does not influence which options we show.',
    },
    {
      q: 'Is this service free?',
      a: 'Yes. There is no charge to compare offers. Any provider fees (installation, equipment, taxes) are disclosed by the provider before you order.',
    },
    {
      q: 'Are the prices guaranteed?',
      a: 'No. Pricing, promotions, and speeds change frequently and vary by address. Final terms are set by the provider at the time of service activation.',
    },
  ];

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-xl sm:max-w-2xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] text-center tracking-tight mb-12">
          FAQ
        </h2>

        {/* Questions & Answers List */}
        <div className="space-y-8">
          {faqs.map((faq, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {faq.q}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
