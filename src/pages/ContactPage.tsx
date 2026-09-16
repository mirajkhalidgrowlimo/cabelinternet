import React, { useState } from 'react';
import { Phone, Mail, Clock, MapPin, CheckCircle2, Shield, Send, MessageSquare } from 'lucide-react';
import { SITE_CONFIG } from '../config';
import { LeadService } from '../services/leadService';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setIsSubmitting(true);
    try {
      // Record lead in central lead service
      LeadService.addLead({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        zipCode: '00000',
        currentProvider: 'Contact Inquiry',
        notes: `[Contact Form Submission] Message: "${formData.message}"`,
        source: 'Contact Page',
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Error submitting contact form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#183b6b] to-[#122f55] text-white py-14 sm:py-18 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm border border-white/15">
            <MessageSquare className="w-3.5 h-3.5 text-blue-300" />
            <span>We're Here 24/7 To Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Contact Cable Internet Plans
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Have questions about internet availability, provider pricing, or bill lowering? Our team of broadband specialists is available around the clock.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Get In Touch Form */}
          <div className="md:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Get in Touch</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Fill out this quick form and one of our telecom specialists will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-emerald-900 text-base">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Thank you for reaching out. An internet specialist has received your inquiry and will follow up shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Question *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about the services you're looking for, or any questions about providers in your area..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#183b6b] text-slate-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-xs shadow transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Cards & Info */}
          <div className="md:col-span-5 space-y-4">
            {/* Phone Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#183b6b] flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Call Us 24/7</h3>
                <a
                  href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                  className="text-2xl font-black text-[#183b6b] hover:underline block my-1"
                >
                  {SITE_CONFIG.PHONE_NUMBER}
                </a>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Speak directly with an internet specialist anytime. We're here to help you compare real-time deals and schedule installation.
                </p>
              </div>
            </div>

            {/* Hours Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Business Hours</h3>
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-slate-800">Phone Support:</span>
                  <span className="text-emerald-700 font-bold">24/7, 365 Days</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-slate-800">Email Inquiries:</span>
                  <span>Mon - Fri, 8 AM - 8 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-800">Weekend Email:</span>
                  <span>Sat - Sun, 9 AM - 5 PM EST</span>
                </div>
              </div>
            </div>

            {/* Service Area Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Service Coverage Area</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cable Internet Plans serves consumers across all 50 U.S. states. Whether you live in a dense metropolitan area or rural community, our database matches your address with all active carriers.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-[#183b6b] text-white rounded-2xl p-6 sm:p-8 shadow-md text-center space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold">Prefer to talk to a human right now?</h3>
          <p className="text-slate-200 text-xs sm:text-sm max-w-lg mx-auto">
            Skip the web form. Call our toll-free phone line to immediately check availability and get free speed advice.
          </p>
          <div className="pt-2">
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {SITE_CONFIG.PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
