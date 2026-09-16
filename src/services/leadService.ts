import { Lead } from '../types';

const STORAGE_KEY = 'cable_internet_plans_leads_v2';
const DELETED_STORAGE_KEY = 'cable_internet_plans_deleted_ids_v2';
const PASSCODE_STORAGE_KEY = 'cable_internet_plans_admin_passcode_v2';
const DEFAULT_PASSCODE = 'admin123';

let memoryLeads: Lead[] | null = null;
let initialSyncPromise: Promise<Lead[]> | null = null;

// Accurate US ZIP Code sample region mapper with graceful fallback
interface ZipInfo {
  city: string;
  state: string;
  providers: string[];
  maxSpeed: string;
}

export function lookupZipInfo(zip: string): ZipInfo {
  const clean = zip.trim().slice(0, 5);
  const firstDigit = clean.charAt(0);

  // Common high-profile ZIP checks
  const zipMap: Record<string, ZipInfo> = {
    '10001': { city: 'New York', state: 'NY', providers: ['Spectrum', 'Verizon Fios', 'Astound'], maxSpeed: '2,000 Mbps' },
    '90210': { city: 'Beverly Hills', state: 'CA', providers: ['Spectrum', 'AT&T Fiber', 'Frontier'], maxSpeed: '5,000 Mbps' },
    '75001': { city: 'Dallas', state: 'TX', providers: ['AT&T Fiber', 'Spectrum', 'Frontier'], maxSpeed: '5,000 Mbps' },
    '60601': { city: 'Chicago', state: 'IL', providers: ['Xfinity', 'AT&T Fiber', 'Astound'], maxSpeed: '1,200 Mbps' },
    '33101': { city: 'Miami', state: 'FL', providers: ['Xfinity', 'AT&T Fiber', 'Breezeline'], maxSpeed: '1,200 Mbps' },
    '98101': { city: 'Seattle', state: 'WA', providers: ['Xfinity', 'CenturyLink Fiber', 'Quantum'], maxSpeed: '1,000 Mbps' },
    '30301': { city: 'Atlanta', state: 'GA', providers: ['Xfinity', 'AT&T Fiber', 'Google Fiber'], maxSpeed: '2,000 Mbps' },
    '02108': { city: 'Boston', state: 'MA', providers: ['Xfinity', 'Verizon Fios', 'Astound'], maxSpeed: '1,200 Mbps' },
    '80201': { city: 'Denver', state: 'CO', providers: ['Xfinity', 'CenturyLink Fiber', 'Quantum'], maxSpeed: '1,000 Mbps' },
    '85001': { city: 'Phoenix', state: 'AZ', providers: ['Cox', 'CenturyLink', 'Quantum Fiber'], maxSpeed: '2,000 Mbps' },
  };

  if (zipMap[clean]) {
    return zipMap[clean];
  }

  // Broad US Regional mapping by first digit of ZIP
  switch (firstDigit) {
    case '0':
      return { city: 'New England Area', state: 'MA/NJ', providers: ['Xfinity', 'Verizon Fios', 'Optimum'], maxSpeed: '1,200 Mbps' };
    case '1':
      return { city: 'Metro Area', state: 'NY/PA', providers: ['Spectrum', 'Verizon Fios', 'Astound'], maxSpeed: '1,000 Mbps' };
    case '2':
      return { city: 'Mid-Atlantic', state: 'VA/NC', providers: ['Xfinity', 'Spectrum', 'Brightspeed'], maxSpeed: '1,000 Mbps' };
    case '3':
      return { city: 'Southeast Area', state: 'FL/GA', providers: ['AT&T Fiber', 'Xfinity', 'Spectrum'], maxSpeed: '1,200 Mbps' };
    case '4':
      return { city: 'Midwest Region', state: 'OH/IN', providers: ['Spectrum', 'AT&T Fiber', 'Frontier'], maxSpeed: '1,000 Mbps' };
    case '5':
      return { city: 'Upper Midwest', state: 'MN/WI', providers: ['Xfinity', 'Midco', 'Quantum Fiber'], maxSpeed: '1,000 Mbps' };
    case '6':
      return { city: 'Central Region', state: 'IL/MO', providers: ['AT&T Fiber', 'Xfinity', 'Spectrum'], maxSpeed: '1,000 Mbps' };
    case '7':
      return { city: 'South Central', state: 'TX/LA', providers: ['AT&T Fiber', 'Spectrum', 'Optimum'], maxSpeed: '2,000 Mbps' };
    case '8':
      return { city: 'Mountain West', state: 'CO/AZ', providers: ['Cox', 'CenturyLink', 'Xfinity'], maxSpeed: '1,000 Mbps' };
    case '9':
      return { city: 'West Coast', state: 'CA/WA', providers: ['Spectrum', 'Xfinity', 'AT&T Fiber'], maxSpeed: '2,000 Mbps' };
    default:
      return { city: 'Metro Area', state: 'USA', providers: ['Spectrum', 'Xfinity', 'AT&T'], maxSpeed: '1,000 Mbps' };
  }
}

// Initial realistic sample leads so the admin panel is immediately functional
const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    referenceCode: 'CIP-72419',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(), // 35 mins ago
    fullName: 'Robert Miller',
    phone: '(555) 234-8910',
    email: 'robert.m@example.com',
    zipCode: '75001',
    streetAddress: '4820 Addison Rd, Apt 3B',
    city: 'Dallas',
    state: 'TX',
    detectedProviders: ['AT&T Fiber', 'Spectrum', 'Frontier'],
    selectedPlan: 'Everyday (from $50/mo)',
    status: 'new',
    notes: 'Inquired about switching from high monthly cable bill. Looking for 300+ Mbps.',
    source: 'Website Availability Checker',
    activities: [
      {
        id: 'act-001',
        timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
        type: 'note_added',
        message: 'Lead created via Website Availability Checker with Reference Code CIP-72419.',
        author: 'System',
      },
    ],
  },
  {
    id: 'lead-002',
    referenceCode: 'CIP-61842',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
    fullName: 'Sarah Jenkins',
    phone: '(555) 872-1194',
    email: 'sjenkins.home@example.com',
    zipCode: '90210',
    streetAddress: '710 N Beverly Dr',
    city: 'Beverly Hills',
    state: 'CA',
    detectedProviders: ['Spectrum', 'AT&T Fiber'],
    selectedPlan: 'Fast/Gigabit (from $70-$100/mo)',
    status: 'contacted',
    notes: 'Called customer; wants gigabit fiber for remote video editing. Quoted $70/mo promo.',
    source: 'Website Availability Checker',
    activities: [
      {
        id: 'act-002-a',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: 'note_added',
        message: 'Lead submitted availability inquiry for 90210.',
        author: 'System',
      },
      {
        id: 'act-002-b',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        type: 'call_logged',
        message: 'Spoke with Sarah: current provider charges $145/mo. Offered 1 Gbps fiber at $70/mo promo rate.',
        author: 'Agent Dan',
      },
      {
        id: 'act-002-c',
        timestamp: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
        type: 'status_change',
        message: 'Status updated to Contacted.',
        author: 'Agent Dan',
      },
    ],
  },
  {
    id: 'lead-003',
    referenceCode: 'CIP-49120',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
    fullName: 'David Vance',
    phone: '(555) 419-7602',
    email: 'dvance99@example.com',
    zipCode: '33101',
    streetAddress: '125 Ocean Blvd',
    city: 'Miami',
    state: 'FL',
    detectedProviders: ['Xfinity', 'AT&T Fiber'],
    selectedPlan: 'Starter (from $70/mo)',
    status: 'closed-won',
    notes: 'Order placed with provider. Scheduled tech visit for this Friday 9am.',
    source: 'Website Availability Checker',
    activities: [
      {
        id: 'act-003-a',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
        type: 'note_added',
        message: 'Customer submitted address checker inquiry.',
        author: 'System',
      },
      {
        id: 'act-003-b',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        type: 'call_logged',
        message: 'Customer accepted Starter internet package with free self-install kit.',
        author: 'Agent Maria',
      },
      {
        id: 'act-003-c',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
        type: 'status_change',
        message: 'Status updated to Closed - Won. Order reference dispatched to carrier.',
        author: 'Agent Maria',
      },
    ],
  },
];

export const LeadService = {
  // Read deleted IDs stored locally
  getDeletedLeadIds(): Set<string> {
    try {
      const raw = localStorage.getItem(DELETED_STORAGE_KEY);
      if (!raw) return new Set();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return new Set(parsed);
      }
      return new Set();
    } catch {
      return new Set();
    }
  },

  saveDeletedLeadIds(set: Set<string>): void {
    try {
      localStorage.setItem(DELETED_STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch (e) {
      console.error('Failed to save deleted lead IDs to localStorage', e);
    }
  },

  // Synchronous read for instant render without flickering
  getLeads(): Lead[] {
    if (memoryLeads !== null) {
      return memoryLeads;
    }
    const deletedIds = this.getDeletedLeadIds();
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((l: Lead) => !deletedIds.has(l.id));
          memoryLeads = filtered;
          return filtered;
        }
      }
    } catch (e) {
      console.error('Failed to load leads from localStorage', e);
    }
    // If local cache is empty, filter initial sample leads by deleted tombstones
    const filteredInitial = INITIAL_LEADS.filter((l) => !deletedIds.has(l.id));
    memoryLeads = filteredInitial;
    return filteredInitial;
  },

  // Save to local cache & notify subscribers
  saveLeads(leads: Lead[]): void {
    try {
      const deletedIds = this.getDeletedLeadIds();
      const sanitized = leads.filter((l) => !deletedIds.has(l.id));
      memoryLeads = sanitized;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
      window.dispatchEvent(new CustomEvent('leads-updated', { detail: sanitized }));
    } catch (e) {
      console.error('Failed to save leads to localStorage', e);
    }
  },

  // Fetch leads from centralized server (Server Authoritative)
  async fetchRemoteLeads(): Promise<Lead[]> {
    if (initialSyncPromise) {
      return initialSyncPromise;
    }

    initialSyncPromise = (async () => {
      try {
        const res = await fetch('/api/leads');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.leads)) {
            const remoteLeads: Lead[] = json.leads;
            const deletedIds = this.getDeletedLeadIds();

            // Discard any leads that were marked deleted locally
            const sanitized = remoteLeads.filter((l) => !deletedIds.has(l.id));

            // Central server is authoritative. Save directly to local cache.
            this.saveLeads(sanitized);
            return sanitized;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch remote leads, using local cache:', err);
      } finally {
        setTimeout(() => {
          initialSyncPromise = null;
        }, 1000);
      }
      return this.getLeads();
    })();

    return initialSyncPromise;
  },

  addLead(leadData: Omit<Lead, 'id' | 'referenceCode' | 'createdAt' | 'status'>): Lead {
    const leads = this.getLeads();
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      referenceCode: `CIP-${randomCode}`,
      createdAt: now,
      status: 'new',
      activities: [
        {
          id: `act-${Date.now()}`,
          timestamp: now,
          type: 'note_added',
          message: `Lead created via ${leadData.source || 'Website'} (Ref: CIP-${randomCode}).`,
          author: 'System',
        },
      ],
    };

    const updated = [newLead, ...leads.filter((l) => l.id !== newLead.id)];
    this.saveLeads(updated);

    // Persist to centralized server asynchronously
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.lead) {
          // Re-sync with remote to ensure consistency across all devices
          this.fetchRemoteLeads();
        }
      })
      .catch((err) => {
        console.warn('Server lead creation failed, cached locally:', err);
      });

    return newLead;
  },

  updateLead(id: string, updates: Partial<Lead>, author: string = 'Staff'): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index === -1) return null;

    const current = leads[index];
    const newActivities = [...(current.activities || [])];

    // If status changed, auto-log activity
    if (updates.status && updates.status !== current.status) {
      const statusLabels: Record<string, string> = {
        'new': 'New Inquiry',
        'contacted': 'Contacted',
        'in-progress': 'In Progress',
        'closed-won': 'Closed - Won (Connected)',
        'closed-lost': 'Closed - Lost',
      };
      newActivities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: new Date().toISOString(),
        type: 'status_change',
        message: `Status updated from "${statusLabels[current.status] || current.status}" to "${statusLabels[updates.status] || updates.status}".`,
        author,
      });
    }

    leads[index] = {
      ...current,
      ...updates,
      activities: newActivities,
    };
    this.saveLeads(leads);

    // Send update to server
    fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, author }),
    })
      .then((res) => res.json())
      .catch((err) => console.warn('Server lead update failed, cached locally:', err));

    return leads[index];
  },

  addActivity(leadId: string, activity: { type: 'status_change' | 'call_logged' | 'note_added' | 'email_sent'; message: string; author?: string }): Lead | null {
    const leads = this.getLeads();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) return null;

    const current = leads[index];
    const newActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      timestamp: new Date().toISOString(),
      type: activity.type,
      message: activity.message,
      author: activity.author || 'Staff',
    };

    leads[index] = {
      ...current,
      activities: [...(current.activities || []), newActivity],
    };
    this.saveLeads(leads);

    // Send activity to server
    fetch(`/api/leads/${leadId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newActivity, author: activity.author || 'Staff' }),
    })
      .then((res) => res.json())
      .catch((err) => console.warn('Server activity update failed, cached locally:', err));

    return leads[index];
  },

  async deleteLead(id: string): Promise<boolean> {
    // 1. Mark as deleted in tombstone storage
    const deletedIds = this.getDeletedLeadIds();
    deletedIds.add(id);
    this.saveDeletedLeadIds(deletedIds);

    // 2. Immediately remove from local memory and cache
    const leads = this.getLeads().filter((l) => l.id !== id);
    this.saveLeads(leads);

    // 3. Delete from central server (permanent deletion for all devices)
    try {
      await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Server lead delete failed:', err);
    }

    return true;
  },

  async clearAllLeads(): Promise<void> {
    const all = this.getLeads();
    const deletedIds = this.getDeletedLeadIds();
    for (const l of all) {
      deletedIds.add(l.id);
    }
    this.saveDeletedLeadIds(deletedIds);

    this.saveLeads([]);
    try {
      await fetch('/api/leads/clear', { method: 'POST' });
    } catch (err) {
      console.warn('Server clear failed:', err);
    }
  },

  async resetSampleLeads(): Promise<void> {
    this.saveDeletedLeadIds(new Set());
    try {
      const res = await fetch('/api/leads/reset', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        if (json.leads) {
          this.saveLeads(json.leads);
          return;
        }
      }
    } catch (err) {
      console.warn('Server reset failed:', err);
    }
    this.saveLeads(INITIAL_LEADS);
  },

  // Admin Passcode Management
  getAdminPasscode(): string {
    return localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;
  },

  setAdminPasscode(newCode: string): void {
    localStorage.setItem(PASSCODE_STORAGE_KEY, newCode.trim());
    fetch('/api/auth/update-passcode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newCode: newCode.trim() }),
    }).catch((err) => console.warn('Server passcode update failed:', err));
  },

  async verifyAdminPasscodeAsync(attempt: string): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attempt: attempt.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        return Boolean(data.success);
      }
    } catch {
      // Fallback to local check
    }
    return this.verifyAdminPasscode(attempt);
  },

  verifyAdminPasscode(attempt: string): boolean {
    const current = this.getAdminPasscode();
    return attempt.trim().toLowerCase() === current.trim().toLowerCase();
  },

  // Export CSV
  exportToCsv(leads: Lead[]): void {
    const headers = [
      'Reference Code',
      'Date Submitted',
      'Full Name',
      'Phone',
      'Email',
      'ZIP Code',
      'Street Address',
      'City',
      'State',
      'Status',
      'Interested Plan',
      'Notes',
    ];

    const escapeCsv = (str: string = '') => `"${str.replace(/"/g, '""')}"`;

    const rows = leads.map((l) => [
      escapeCsv(l.referenceCode),
      escapeCsv(new Date(l.createdAt).toLocaleString()),
      escapeCsv(l.fullName),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.zipCode),
      escapeCsv(l.streetAddress || ''),
      escapeCsv(l.city || ''),
      escapeCsv(l.state || ''),
      escapeCsv(l.status.toUpperCase()),
      escapeCsv(l.selectedPlan || 'General Inquiry'),
      escapeCsv(l.notes || ''),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Cable_Internet_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
