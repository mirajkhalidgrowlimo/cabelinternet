export interface LeadActivity {
  id: string;
  timestamp: string;
  type: 'status_change' | 'call_logged' | 'note_added' | 'email_sent';
  message: string;
  author?: string;
}

export interface Lead {
  id: string;
  referenceCode: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  zipCode: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  detectedProviders?: string[];
  currentProvider?: string;
  currentBillAmount?: number;
  selectedPlan?: string;
  isPackageLocked?: boolean;
  lockedPackage?: string;
  lockedPrice?: string;
  lockedTerm?: string;
  packageLockedAt?: string;
  packageLockedBy?: string;
  packageNotes?: string;
  status: 'new' | 'contacted' | 'in-progress' | 'closed-won' | 'closed-lost';
  notes?: string;
  source?: string;
  activities?: LeadActivity[];
}

export interface LeadFormData {
  firstName: string;
  lastName: string;
  streetAddress?: string;
  phone: string;
  email: string;
  zipCode: string;
  serviceType: 'Internet' | 'Cable TV' | 'Internet + TV' | 'Home Wi-Fi' | 'Business Internet';
}

export type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PlanItem {
  id: string;
  name: string;
  speedTier?: string;
  tagline: string;
  startingPrice: string;
  priceUnit?: string;
  isPopular?: boolean;
  features: string[];
  ctaLabel: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: 'wifi' | 'tv' | 'router' | 'building';
  ctaText: string;
  badge?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  location: string;
  quote: string;
  rating: number;
  planUsed?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  note?: string;
}
