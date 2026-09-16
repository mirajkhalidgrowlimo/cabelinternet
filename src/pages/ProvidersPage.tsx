import React from 'react';
import { Phone, CheckCircle2, Shield, Zap, Radio, Globe, ArrowRight, Clock, HelpCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface ProvidersPageProps {
  onCheckAvailabilityClick: () => void;
  onNavigate: (path: string) => void;
}

export const ProvidersPage: React.FC<ProvidersPageProps> = ({ onCheckAvailabilityClick, onNavigate }) => {
  const technologies = [
    {
      name: 'Cable Internet',
      icon: Zap,
      badge: 'Most Widely Available',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      summary: 'Widely available in cities and suburbs. Typically offers fast download speeds and is well suited for streaming, remote work, and multiple connected devices.',
      speeds: 'Up to 1,000 Mbps (1 Gbps)',
      latency: '15 - 30 ms (Low)',
      bestFor: 'Streaming 4K, smart homes, multi-person families, general household usage',
      availability: 'Available in ~89% of urban/suburban US households',
      pros: [
        'High download bandwidth widely available',
        'Coaxial infrastructure already present in most homes',
        'Easy self-installation in many locations',
        'Affordable introductory bundle plans',
      ],
      considerations: [
        'Upload speeds are typically slower than download speeds (asymmetric)',
        'Speeds can experience slight peak-hour fluctuations in dense neighborhoods',
      ],
    },
    {
      name: 'Fiber Internet',
      icon: Radio,
      badge: 'Fastest & Most Reliable',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      summary: 'Uses 100% fiber-optic lines to deliver symmetrical upload and download speeds. Ideal for high-definition video conferencing, heavy cloud uploads, low-ping gaming, and creator workflows.',
      speeds: '300 Mbps to 5,000 Mbps (5 Gbps)',
      latency: '5 - 15 ms (Ultra-Low)',
      bestFor: 'Competitive gaming, large cloud backups, WFH professionals, 4K/8K multi-streamers',
      availability: 'Rapidly expanding — currently available in ~43% of US areas',
      pros: [
        'Equal (symmetrical) download and upload speeds',
        'Virtually zero peak-hour congestion or packet loss',
        'Most future-proof technology with lowest latency',
        'Consistent reliability regardless of weather',
      ],
      considerations: [
        'Requires physical fiber lines on your specific street',
        'May require technician installation to place an optical terminal',
      ],
    },
    {
      name: 'DSL & Fixed Wireless',
      icon: Globe,
      badge: 'Broad Suburban & Rural Coverage',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      summary: 'Delivers reliable internet connection to suburban, small-town, and rural locations where cable or fiber infrastructure has not yet reached.',
      speeds: '25 Mbps to 100+ Mbps',
      latency: '25 - 60 ms (Moderate)',
      bestFor: 'Everyday browsing, email, streaming on 1-3 devices, essential home connectivity',
      availability: 'Suburban, semi-rural, and outskirts nationwide',
      pros: [
        'Extensive geographical footprint nationwide',
        'Uses existing telephone lines or cellular base towers',
        'Consistent dedicated line without neighborhood sharing',
        'Cost-effective options with simple setups',
      ],
      considerations: [
        'Speeds vary based on line distance to the provider hub (DSLAM/tower)',
        'Lower maximum speeds compared to modern fiber and gigabit cable',
      ],
    },
    {
      name: 'Satellite Internet',
      icon: Globe,
      badge: '100% Nationwide Reach',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      summary: 'Provides nationwide coverage, even in remote, mountain, island, and rural addresses where no physical ground lines exist.',
      speeds: '25 Mbps to 220 Mbps',
      latency: '40 - 100+ ms (Varies by orbit)',
      bestFor: 'Remote properties, rural homesteads, cabins, areas with zero wired options',
      availability: '100% across the contiguous United States (clear line-of-sight)',
      pros: [
        'Available virtually anywhere with an unobstructed view of the sky',
        'Completely independent from local wireline infrastructure outages',
        'New low-earth orbit (LEO) constellations offering significantly lower latency',
        'Reliable lifeline for off-grid and remote properties',
      ],
      considerations: [
        'Requires exterior dish installation with clear sky sightlines',
        'Severe storm weather can occasionally affect signal performance',
      ],
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#183b6b] to-[#122f55] text-white py-14 sm:py-18 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm border border-white/15">
            <Shield className="w-3.5 h-3.5 text-blue-300" />
            <span>Independent Comparison & Referral Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Internet Service Options & Technologies
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We help you compare the internet technologies available at your specific address so you can choose a plan that fits your speed needs and budget.
          </p>
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onCheckAvailabilityClick}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <span>Check Address Availability</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call Specialist: {SITE_CONFIG.PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
        {/* Intro Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold text-[#183b6b]">
            How We Compare Internet Options For Your Home
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Every neighborhood has different providers and connection types. Rather than spending hours calling multiple companies, Cable Internet Plans checks your exact address against our partner network of cable, fiber, fixed wireless, and satellite providers to present your real-time options side-by-side.
          </p>
        </div>

        {/* Technology Cards */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <span>The 4 Primary Internet Technologies</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {technologies.map((tech) => {
              const Icon = tech.icon;
              return (
                <div
                  key={tech.name}
                  className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#183b6b] flex items-center justify-center shrink-0">
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{tech.name}</h3>
                          <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mt-1 ${tech.badgeColor}`}>
                            {tech.badge}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed">
                      {tech.summary}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Speed Range:</span>
                        <span className="text-slate-800 font-bold">{tech.speeds}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Typical Latency:</span>
                        <span className="text-slate-800 font-semibold">{tech.latency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 font-medium">Best For:</span>
                        <span className="text-slate-800 font-medium text-right max-w-[60%]">{tech.bestFor}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Key Advantages:</p>
                      <ul className="space-y-1.5">
                        {tech.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">{tech.availability}</span>
                    <button
                      onClick={onCheckAvailabilityClick}
                      className="text-xs font-bold text-[#183b6b] hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Check ZIP</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Side-by-Side Quick Comparison Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5 overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Side-by-Side Technology Comparison Matrix
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-700 font-bold">
                  <th className="py-3 px-4">Feature</th>
                  <th className="py-3 px-4">Cable</th>
                  <th className="py-3 px-4">Fiber</th>
                  <th className="py-3 px-4">DSL/Wireless</th>
                  <th className="py-3 px-4">Satellite</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Top Speed</td>
                  <td className="py-3 px-4">1,000 Mbps</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">Up to 5,000 Mbps</td>
                  <td className="py-3 px-4">100 Mbps</td>
                  <td className="py-3 px-4">220 Mbps</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Upload Speeds</td>
                  <td className="py-3 px-4">10 - 50 Mbps</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">Symmetrical (Match DL)</td>
                  <td className="py-3 px-4">5 - 20 Mbps</td>
                  <td className="py-3 px-4">10 - 25 Mbps</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Latency (Lag)</td>
                  <td className="py-3 px-4">Low (15-30ms)</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">Lowest (5-15ms)</td>
                  <td className="py-3 px-4">Moderate (30-60ms)</td>
                  <td className="py-3 px-4">Higher (40-100ms)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Weather Impact</td>
                  <td className="py-3 px-4">Minimal</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">None (Underground)</td>
                  <td className="py-3 px-4">Minimal to Low</td>
                  <td className="py-3 px-4">Moderate during severe storms</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-slate-800">Nationwide Coverage</td>
                  <td className="py-3 px-4">High (~89%)</td>
                  <td className="py-3 px-4">Expanding (~43%)</td>
                  <td className="py-3 px-4">Extensive</td>
                  <td className="py-3 px-4 font-bold text-emerald-600">100% Nationwide</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Not Sure Which Option Is Right Banner */}
        <div className="bg-[#183b6b] text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold">Not sure which option is best for your home?</h3>
            <p className="text-slate-200 text-sm max-w-xl">
              Our independent broadband specialists analyze your household devices, daily usage, and local provider deals to recommend the exact right plan.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={onCheckAvailabilityClick}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center"
            >
              Check Availability Now
            </button>
            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Call: {SITE_CONFIG.PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
