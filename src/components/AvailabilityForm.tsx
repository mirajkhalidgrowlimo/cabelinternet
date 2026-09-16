import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { CheckCircle, AlertCircle, Loader2, Send, MapPin, Phone, Mail, User, ShieldCheck, Home } from 'lucide-react';
import { LeadFormData, FormStatus } from '../types';
import { SITE_CONFIG } from '../config';

export interface AvailabilityFormRef {
  setZipAndFocus: (zip: string) => void;
  scrollToForm: () => void;
}

interface AvailabilityFormProps {
  initialZip?: string;
  initialService?: LeadFormData['serviceType'];
}

export const AvailabilityForm = forwardRef<AvailabilityFormRef, AvailabilityFormProps>(
  ({ initialZip = '', initialService = 'Internet' }, ref) => {
    const [formData, setFormData] = useState<LeadFormData>({
      firstName: '',
      lastName: '',
      streetAddress: '',
      phone: '',
      email: '',
      zipCode: initialZip,
      serviceType: initialService,
    });

    const [errors, setErrors] = useState<Partial<Record<keyof LeadFormData, string>>>({});
    const [status, setStatus] = useState<FormStatus>('idle');
    const [submittedData, setSubmittedData] = useState<LeadFormData | null>(null);

    useImperativeHandle(ref, () => ({
      setZipAndFocus: (zip: string) => {
        setFormData((prev) => ({ ...prev, zipCode: zip }));
        const zipInput = document.getElementById('form-zipCode');
        if (zipInput) {
          zipInput.focus();
        }
      },
      scrollToForm: () => {
        const formEl = document.getElementById('availability-checker');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      },
    }));

    // Phone format
    const formatPhoneNumber = (value: string) => {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 3) return numbers;
      if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      setFormData((prev) => ({ ...prev, phone: formatted }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: undefined }));
      }
    };

    const validate = (): boolean => {
      const newErrors: Partial<Record<keyof LeadFormData, string>> = {};

      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required.';
      }

      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required.';
      }

      const rawDigits = formData.phone.replace(/\D/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required.';
      } else if (rawDigits.length !== 10) {
        newErrors.phone = 'Please enter a valid 10-digit phone number.';
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Email address is required.';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }

      const zipRegex = /^\d{5}$/;
      if (!formData.zipCode.trim()) {
        newErrors.zipCode = 'ZIP code is required.';
      } else if (!zipRegex.test(formData.zipCode.trim())) {
        newErrors.zipCode = 'Please enter a 5-digit US ZIP code.';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) {
        return;
      }

      setStatus('loading');

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        try {
          const storedLeads = JSON.parse(localStorage.getItem('cable_plans_leads') || '[]');
          storedLeads.push({
            ...formData,
            submittedAt: new Date().toISOString(),
          });
          localStorage.setItem('cable_plans_leads', JSON.stringify(storedLeads));
        } catch {
          // fallback
        }

        setSubmittedData(formData);
        setStatus('success');
      } catch {
        setStatus('error');
      }
    };

    const handleReset = () => {
      setStatus('idle');
      setFormData({
        firstName: '',
        lastName: '',
        streetAddress: '',
        phone: '',
        email: '',
        zipCode: '',
        serviceType: 'Internet',
      });
      setErrors({});
    };

    return (
      <section
        id="availability-checker"
        className="relative z-10 -mt-6 md:-mt-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/90 overflow-hidden">
          
          {/* Form Header */}
          <div className="bg-slate-900 px-6 py-6 sm:px-10 sm:py-7 text-white text-center border-b border-slate-800">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Detailed Address Availability Check
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl mx-auto">
              Compare cable, fiber, DSL, and wireless options at your address in seconds.
            </p>
          </div>

          <div className="p-6 sm:p-8 md:p-10">
            {status === 'success' && submittedData ? (
              <div
                id="form-success-card"
                className="py-6 px-4 text-center max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300"
              >
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xs">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Request Received!
                </h3>
                <p className="text-slate-600 text-sm mb-6">
                  We're comparing active plans for ZIP{' '}
                  <span className="font-bold text-slate-900">{submittedData.zipCode}</span>. A representative will contact you with promotional rates.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left mb-6 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Service:</span>
                    <span className="font-bold">{submittedData.serviceType}</span>
                  </div>
                  {submittedData.streetAddress && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Address:</span>
                      <span className="font-bold">{submittedData.streetAddress}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-bold">{submittedData.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-bold">{submittedData.email}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call Live Agent: {SITE_CONFIG.PHONE_NUMBER}</span>
                  </a>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-sm hover:bg-slate-200"
                  >
                    Check Another Address
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>Unable to submit at this time. Please call our 24/7 phone line.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="form-firstName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        id="form-firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value });
                          if (errors.firstName) setErrors({ ...errors, firstName: undefined });
                        }}
                        placeholder="First name"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.firstName ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="form-lastName" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        id="form-lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData({ ...formData, lastName: e.target.value });
                          if (errors.lastName) setErrors({ ...errors, lastName: undefined });
                        }}
                        placeholder="Last name"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.lastName ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{errors.lastName}</p>
                    )}
                  </div>

                  {/* Street Address */}
                  <div className="sm:col-span-2">
                    <label htmlFor="form-streetAddress" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Street Address <span className="text-slate-400 font-normal">(optional, helps verify exact line drop)</span>
                    </label>
                    <div className="relative">
                      <Home className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        id="form-streetAddress"
                        name="streetAddress"
                        value={formData.streetAddress || ''}
                        onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                        placeholder="e.g. 123 Maple Street, Apt 4B"
                        className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="form-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="tel"
                        id="form-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="(555) 000-0000"
                        maxLength={14}
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.phone ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="form-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="email"
                        id="form-email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        placeholder="name@example.com"
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all ${
                          errors.email ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* ZIP Code */}
                  <div>
                    <label htmlFor="form-zipCode" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      ZIP Code <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                      <input
                        type="text"
                        id="form-zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 5);
                          setFormData({ ...formData, zipCode: val });
                          if (errors.zipCode) setErrors({ ...errors, zipCode: undefined });
                        }}
                        placeholder="75201"
                        maxLength={5}
                        className={`w-full pl-10 pr-3.5 py-3 rounded-xl border bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold ${
                          errors.zipCode ? 'border-rose-500 focus:border-rose-500' : 'border-slate-300 focus:border-blue-600'
                        }`}
                      />
                    </div>
                    {errors.zipCode && (
                      <p className="text-rose-600 text-xs mt-1 font-medium">{errors.zipCode}</p>
                    )}
                  </div>

                  {/* Service Type */}
                  <div>
                    <label htmlFor="form-serviceType" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Service Type <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="form-serviceType"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceType: e.target.value as LeadFormData['serviceType'],
                        })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-slate-300 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    >
                      <option value="Internet">High-Speed Internet</option>
                      <option value="Cable TV">Cable TV</option>
                      <option value="Internet + TV">Internet + TV Bundle</option>
                      <option value="Home Wi-Fi">Home Wi-Fi Mesh</option>
                      <option value="Business Internet">Business Broadband</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    id="submit-availability-button"
                    className="w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.99] disabled:opacity-75 text-white font-extrabold text-base shadow-lg shadow-blue-600/25 transition-all cursor-pointer"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Searching Providers...</span>
                      </>
                    ) : (
                      <>
                        <span>Check Availability</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* Consent & TCPA Disclaimer Text */}
                <p className="text-center text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
                  By clicking Check Availability, you agree Cable Internet Plans and its partners may contact you about internet offers at the number and email provided, including by autodialed calls/texts. Consent not required for purchase. Msg/data rates may apply. You can opt out anytime. Call us at{' '}
                  <a href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`} className="text-blue-600 font-bold hover:underline">
                    {SITE_CONFIG.PHONE_NUMBER}
                  </a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    );
  }
);

AvailabilityForm.displayName = 'AvailabilityForm';
