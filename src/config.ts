import { PlanItem, ServiceItem, TestimonialItem, FaqItem, StatItem } from './types';

export const SITE_CONFIG = {
  COMPANY_NAME: 'Cable Internet Plans',
  COMPANY_TAGLINE: 'Compare Home Internet Options',
  LEGAL_ENTITY: 'Cable Internet Plans Concierge',
  PHONE_NUMBER: '(800) 624-0038',
  PHONE_NUMBER_RAW: '+18006240038',
  EMAIL: 'support@cableinternetplans.online',
  ADDRESS: '1200 Telecom Way, Suite 400, Dallas, TX 75201',
  OPERATING_HOURS: '24/7 Agent Availability & Toll-Free Phone Assistance',
  
  // Theme configuration
  PRIMARY_COLOR: '#0B192C',
  SECONDARY_COLOR: '#2563EB',
  ACCENT_COLOR: '#0284C7',

  // Disclosure
  TOP_DISCLOSURE:
    'Disclosure: Cable Internet Plans is an independent comparison and referral service and is not affiliated with, endorsed by, or sponsored by any internet service provider. Availability, pricing, and speeds vary by address and are determined by the provider at the time of service activation.',

  TCPA_CONSENT_TEXT:
    'By clicking Check Availability, you agree Cable Internet Plans and its partners may contact you about internet offers at the number and email provided, including by autodialed calls/texts. Consent not required for purchase. Msg/data rates may apply. You can opt out anytime. Call us at (800) 624-0038.',

  // Social links (only real/configured channels or empty if not supplied)
  SOCIAL_LINKS: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    x: 'https://x.com',
  },

  // Service Areas
  SERVICE_AREAS: [
    { state: 'Texas', code: 'TX', cities: ['Dallas', 'Houston', 'Austin', 'San Antonio'] },
    { state: 'Florida', code: 'FL', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'] },
    { state: 'California', code: 'CA', cities: ['Los Angeles', 'San Diego', 'San Jose', 'Sacramento'] },
    { state: 'Ohio', code: 'OH', cities: ['Columbus', 'Cleveland', 'Cincinnati'] },
    { state: 'Georgia', code: 'GA', cities: ['Atlanta', 'Augusta', 'Savannah'] },
    { state: 'Illinois', code: 'IL', cities: ['Chicago', 'Naperville', 'Peoria'] },
    { state: 'North Carolina', code: 'NC', cities: ['Charlotte', 'Raleigh', 'Greensboro'] },
    { state: 'Pennsylvania', code: 'PA', cities: ['Philadelphia', 'Pittsburgh', 'Allentown'] },
  ],

  // Plan Data matching Cable Internet Plans popular packages
  PLAN_DATA: [
    {
      id: 'plan-starter',
      name: 'Starter',
      speedTier: 'Up to 300 Mbps',
      tagline: 'Great for email, browsing, light streaming.*',
      startingPrice: 'from $70',
      priceUnit: '/mo',
      features: [
        'Reliable high-speed broadband connection',
        'Great for email, light streaming & web browsing',
        'Multiple connected devices (up to 5 devices)',
        'Standard Wi-Fi gateway equipment available',
        'Free customer phone support anytime',
      ],
      ctaLabel: 'Check Availability',
    },
    {
      id: 'plan-everyday',
      name: 'Everyday',
      speedTier: 'Up to 600 Mbps',
      tagline: 'HD streaming, multiple devices.*',
      startingPrice: 'from $50',
      priceUnit: '/mo',
      isPopular: true,
      features: [
        'Faster speeds for heavy streaming & remote work',
        'HD & 4K video streaming ready across rooms',
        'Supports 8–15 simultaneous smart devices',
        'Low-latency connection for video conferencing',
        'Enhanced dual-band Wi-Fi router equipment',
        'Priority customer care routing',
      ],
      ctaLabel: 'Check Availability',
    },
    {
      id: 'plan-gigabit',
      name: 'Fast / Gigabit',
      speedTier: 'Gigabit Speeds (Up to 1000+ Mbps)',
      tagline: '4K streaming, gaming, home offices.*',
      startingPrice: 'from $70–$100',
      priceUnit: '/mo',
      features: [
        'Ultra-high-speed gigabit performance',
        'Simultaneous 4K/8K streaming on all screens',
        'Lag-free gaming with prioritized routing',
        'Large file transfers & multiple work-from-home users',
        'Wi-Fi 6 mesh-ready gateway options',
        'VIP dedicated 24/7 support line',
      ],
      ctaLabel: 'Check Availability',
    },
  ] as PlanItem[],

  // Internet Technologies Options We Compare
  TECH_OPTIONS: [
    {
      id: 'tech-cable',
      title: 'Cable Internet',
      speedRange: '100 – 1,200 Mbps',
      description: 'High-speed cable service delivered over coaxial networks where available in your area. Great for widespread coverage and bundling with live TV.',
      coverage: 'Widely Available in Metros & Suburbs',
      bestFor: 'Streaming, Families, TV Bundling',
      iconName: 'cable',
      badge: 'Most Prevalent',
    },
    {
      id: 'tech-fiber',
      title: 'Fiber Internet',
      speedRange: '300 – 5,000 Mbps',
      description: 'Symmetrical upload and download speeds over ultra-pure fiber-optic glass lines where offered. Lowest latency and highest reliability.',
      coverage: 'Expanding in Urban & Suburban Zones',
      bestFor: 'Gaming, Remote Work, Heavy Uploads',
      iconName: 'sparkles',
      badge: 'Fastest Tech',
    },
    {
      id: 'tech-dsl-wireless',
      title: 'DSL & Fixed Wireless',
      speedRange: '25 – 150 Mbps',
      description: 'Reliable coverage options for suburban, exurban, and rural addresses where cable or fiber infrastructure may be limited.',
      coverage: 'Suburban & Rural Reaches',
      bestFor: 'Basic Browsing, Small Households',
      iconName: 'radio',
      badge: 'Wide Coverage',
    },
    {
      id: 'tech-satellite',
      title: 'Satellite Internet',
      speedRange: '25 – 220 Mbps',
      description: 'Nationwide availability from geostationary and low-Earth-orbit satellites. Indispensable for remote homes and rural properties.',
      coverage: '100% Nationwide Availability',
      bestFor: 'Rural & Hard-to-Reach Locations',
      iconName: 'globe',
      badge: 'Nationwide Access',
    },
  ],

  // Support Use Cases
  SUPPORT_USE_CASES: [
    {
      id: 'case-new',
      title: 'New Connection',
      description: 'Moving or setting up internet at a new address? We find active providers and promos.',
      iconName: 'plus-circle',
    },
    {
      id: 'case-upgrade',
      title: 'Upgrade Speed',
      description: 'Need faster bandwidth for remote work, 4K streaming, or new gaming consoles?',
      iconName: 'zap',
    },
    {
      id: 'case-lower',
      title: 'Lower Your Bill',
      description: 'Already have service? We check promos and loyalty plans to cut your monthly rate.',
      iconName: 'trending-down',
    },
    {
      id: 'case-switch',
      title: 'Cancel or Switch',
      description: 'Unhappy with your current provider? We help coordinate a hassle-free transition.',
      iconName: 'arrow-left-right',
    },
  ],

  // Trust Indicators
  TRUST_ITEMS: [
    {
      title: 'One Place, Many Providers',
      description: 'Stop visiting 10 websites—compare cable, fiber, and wireless options in minutes.',
    },
    {
      title: 'Real Discounts & Promos',
      description: 'We surface eligible promotional rates, bundled deals, and bill-lowering opportunities.',
    },
    {
      title: '24/7 Agent Availability',
      description: 'Live phone specialists ready around the clock to walk you through address options.',
    },
    {
      title: 'Switching Made Simple',
      description: 'From order placement to equipment activation and provider coordination, we guide you.',
    },
  ],

  // Statistics
  STATS_DATA: [
    {
      id: 'stat-customers',
      value: '25K+',
      label: 'Households Assisted',
      note: 'Found compatible internet and cable promotions',
    },
    {
      id: 'stat-areas',
      value: '50 States',
      label: 'Nationwide Reach',
      note: 'Metropolitan, suburban, and rural address coverage',
    },
    {
      id: 'stat-support',
      value: '24/7',
      label: 'Toll-Free Phone Support',
      note: 'Call anytime to speak with a connectivity agent',
    },
    {
      id: 'stat-rating',
      value: '4.9/5',
      label: 'Customer Satisfaction',
      note: 'Based on independent consumer assistance ratings',
    },
  ] as StatItem[],

  // Testimonials
  TESTIMONIAL_DATA: [
    {
      id: 't-1',
      name: 'Michael B.',
      location: 'Phoenix, AZ',
      quote: 'Saved over $45 a month on my home internet bill. They told me about a new fiber promo on my street that I had no idea was available!',
      rating: 5,
      planUsed: 'Everyday Plan ($50/mo)',
    },
    {
      id: 't-2',
      name: 'Sarah L.',
      location: 'Charlotte, NC',
      quote: 'Moving was stressful enough without spending hours calling different cable companies. Cable Internet Plans found the best package for our address in one 5-minute phone call.',
      rating: 5,
      planUsed: 'Fast / Gigabit ($70/mo)',
    },
    {
      id: 't-3',
      name: 'James & Priya K.',
      location: 'Columbus, OH',
      quote: 'Both of us work from home with heavy video calls all day. The agent guided us toward low-latency broadband with no data caps. Setup was seamless.',
      rating: 5,
      planUsed: 'Gigabit Work-From-Home',
    },
  ] as TestimonialItem[],

  // FAQ Data matching cableinternetplans.online authoritative FAQs
  FAQ_DATA: [
    {
      id: 'faq-1',
      question: 'What providers do you cover?',
      answer:
        'We help you compare cable, fiber, DSL, fixed wireless, and satellite internet options available at your address across all major national and regional networks. Cable Internet Plans is an independent referral service and is not affiliated with any single provider, allowing us to recommend the best match for your specific street.',
    },
    {
      id: 'faq-2',
      question: 'How does the service work?',
      answer:
        'Share your address or 5-digit ZIP code and our system instantly identifies the internet technologies, providers, and plan tiers physically wired to your location. Final pricing, terms, and availability are verified and locked in before you finalize any activation.',
    },
    {
      id: 'faq-3',
      question: 'How do you make money?',
      answer:
        'We may receive a referral fee from a provider if you choose to sign up or switch plans. This does NOT add any cost to your bill—in fact, our partnerships often grant access to exclusive promotional pricing not advertised on standard retail sites.',
    },
    {
      id: 'faq-4',
      question: 'Is this service free?',
      answer:
        'Yes! Our comparison concierge, address availability lookups, and bill-lowering consultations are 100% free with zero obligation to buy or switch.',
    },
    {
      id: 'faq-5',
      question: 'Are the prices guaranteed?',
      answer:
        'All pricing, speeds, and promotional offers displayed are provided by our partner networks and are verified at the time of your address lookup. Because promotional rates change based on location and season, our phone specialists confirm the exact rate before activation.',
    },
    {
      id: 'faq-6',
      question: 'Can you help lower my existing internet bill?',
      answer:
        'Yes! Through our Free Bill Review service, we review what you are currently paying and identify loyalty discounts, repackaged tiers, or competing provider promotions in your area that often allow you to lower your monthly payment without even switching.',
    },
    {
      id: 'faq-7',
      question: 'Can I bundle internet and TV services?',
      answer:
        'Yes. Many cable and broadband providers offer bundled packages pairing high-speed internet with live TV channels, sports passes, and cloud DVR. Bundles typically provide significant monthly savings compared to purchasing services separately.',
    },
    {
      id: 'faq-8',
      question: 'How quickly can I get connected?',
      answer:
        'Self-installation kits for homes with existing line drops can often be activated within 24 to 48 hours. If professional technician installation is needed, appointments are typically scheduled within 1 to 3 business days.',
    },
  ] as FaqItem[],
};
