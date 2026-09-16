import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

interface Activity {
  id: string;
  timestamp: string;
  type: 'status_change' | 'call_logged' | 'note_added' | 'email_sent';
  message: string;
  author: string;
}

interface Lead {
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
  activities?: Activity[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const PASSCODE_FILE = path.join(DATA_DIR, 'passcode.json');
const DELETED_FILE = path.join(DATA_DIR, 'deleted_leads.json');

const DEFAULT_PASSCODE = 'admin123';

const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-001',
    referenceCode: 'CIP-72419',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
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
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    fullName: 'Sarah Jenkins',
    phone: '(555) 872-1194',
    email: 'sjenkins.home@example.com',
    zipCode: '90210',
    streetAddress: '710 N Beverly Dr',
    city: 'Beverly Hills',
    state: 'CA',
    detectedProviders: ['Spectrum', 'AT&T Fiber', 'Frontier'],
    selectedPlan: 'Gigabit Pro (from $70/mo)',
    status: 'contacted',
    notes: 'Called customer; confirmed interest in bundle with TV streaming. Follow-up scheduled.',
    source: 'Direct Phone Inquiry',
    activities: [
      {
        id: 'act-002-a',
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        type: 'note_added',
        message: 'Inquiry logged by customer support agent.',
        author: 'Staff',
      },
      {
        id: 'act-002-b',
        timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
        type: 'call_logged',
        message: 'Spoke with Sarah regarding 1 Gbps installation timeline.',
        author: 'Agent Maria',
      },
    ],
  },
  {
    id: 'lead-003',
    referenceCode: 'CIP-49120',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    fullName: 'Marcus Vance',
    phone: '(555) 419-7721',
    email: 'marcus.vance@example.com',
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

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadLeadsFromFile(): Lead[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(LEADS_FILE)) {
      fs.writeFileSync(LEADS_FILE, JSON.stringify(INITIAL_LEADS, null, 2), 'utf-8');
      return INITIAL_LEADS;
    }
    const raw = fs.readFileSync(LEADS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_LEADS;
  } catch (err) {
    console.error('Error reading leads from file:', err);
    return INITIAL_LEADS;
  }
}

function saveLeadsToFile(leads: Lead[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing leads to file:', err);
  }
}

function loadPasscode(): string {
  try {
    ensureDataDir();
    if (!fs.existsSync(PASSCODE_FILE)) {
      return DEFAULT_PASSCODE;
    }
    const raw = fs.readFileSync(PASSCODE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.passcode || DEFAULT_PASSCODE;
  } catch {
    return DEFAULT_PASSCODE;
  }
}

function savePasscode(code: string): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PASSCODE_FILE, JSON.stringify({ passcode: code }), 'utf-8');
  } catch (err) {
    console.error('Error writing passcode to file:', err);
  }
}

function loadDeletedIds(): Set<string> {
  try {
    ensureDataDir();
    if (!fs.existsSync(DELETED_FILE)) {
      return new Set();
    }
    const raw = fs.readFileSync(DELETED_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return new Set(parsed);
    }
    return new Set();
  } catch {
    return new Set();
  }
}

function saveDeletedIds(ids: Set<string>): void {
  try {
    ensureDataDir();
    fs.writeFileSync(DELETED_FILE, JSON.stringify(Array.from(ids), null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing deleted IDs to file:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory cache synced with disk and tombstones
  let deletedIds: Set<string> = loadDeletedIds();
  let leadsCache: Lead[] = loadLeadsFromFile().filter((l) => !deletedIds.has(l.id));
  saveLeadsToFile(leadsCache);

  // 1. GET /api/leads - Return all stored leads (server authoritative)
  app.get('/api/leads', (_req, res) => {
    // Ensure deleted IDs are strictly excluded
    const activeLeads = leadsCache.filter((l) => !deletedIds.has(l.id));
    res.json({ success: true, leads: activeLeads });
  });

  // 2. POST /api/leads - Add a new lead from any device/browser
  app.post('/api/leads', (req, res) => {
    try {
      const data = req.body;
      if (!data || !data.fullName || !data.phone) {
        return res.status(400).json({ success: false, error: 'Full name and phone are required' });
      }

      if (data.id && deletedIds.has(data.id)) {
        return res.status(400).json({ success: false, error: 'Lead was previously deleted' });
      }

      const randomCode = Math.floor(10000 + Math.random() * 90000);
      const now = new Date().toISOString();

      const newLead: Lead = {
        id: data.id || `lead-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        referenceCode: data.referenceCode || `CIP-${randomCode}`,
        createdAt: data.createdAt || now,
        fullName: String(data.fullName).trim(),
        phone: String(data.phone).trim(),
        email: String(data.email || '').trim(),
        zipCode: String(data.zipCode || '').trim(),
        streetAddress: data.streetAddress ? String(data.streetAddress).trim() : undefined,
        city: data.city,
        state: data.state,
        detectedProviders: data.detectedProviders || [],
        selectedPlan: data.selectedPlan || 'Everyday (from $50/mo)',
        isPackageLocked: !!data.isPackageLocked,
        lockedPackage: data.lockedPackage,
        lockedPrice: data.lockedPrice,
        lockedTerm: data.lockedTerm,
        packageLockedAt: data.packageLockedAt,
        packageLockedBy: data.packageLockedBy,
        packageNotes: data.packageNotes,
        status: data.status || 'new',
        notes: data.notes || '',
        source: data.source || 'Website Availability Checker',
        activities: data.activities || [
          {
            id: `act-${Date.now()}`,
            timestamp: now,
            type: 'note_added',
            message: `Lead created via ${data.source || 'Website'} (Ref: CIP-${randomCode}).`,
            author: 'System',
          },
        ],
      };

      // Check if lead already exists to prevent duplicate insertion
      const existingIdx = leadsCache.findIndex((l) => l.id === newLead.id);
      if (existingIdx !== -1) {
        leadsCache[existingIdx] = newLead;
      } else {
        // Prepend so the newest lead appears first
        leadsCache = [newLead, ...leadsCache];
      }
      saveLeadsToFile(leadsCache);

      return res.status(201).json({ success: true, lead: newLead });
    } catch (err: any) {
      console.error('Error creating lead:', err);
      return res.status(500).json({ success: false, error: 'Failed to save lead' });
    }
  });

  // 3. POST /api/leads/sync - Merge client leads into server (for cross-device migration)
  app.post('/api/leads/sync', (req, res) => {
    try {
      const clientLeads: Lead[] = req.body.leads || [];
      if (!Array.isArray(clientLeads) || clientLeads.length === 0) {
        return res.json({ success: true, leads: leadsCache });
      }

      const existingIds = new Set(leadsCache.map((l) => l.id));
      let addedCount = 0;

      for (const lead of clientLeads) {
        // Discard any lead that has been marked deleted
        if (deletedIds.has(lead.id)) {
          continue;
        }
        if (!existingIds.has(lead.id)) {
          leadsCache.push(lead);
          existingIds.add(lead.id);
          addedCount++;
        }
      }

      if (addedCount > 0) {
        // Sort newest first
        leadsCache.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        saveLeadsToFile(leadsCache);
      }

      return res.json({ success: true, count: leadsCache.length, added: addedCount, leads: leadsCache });
    } catch (err) {
      console.error('Error syncing leads:', err);
      return res.status(500).json({ success: false, error: 'Failed to sync leads' });
    }
  });

  // 4. PATCH /api/leads/:id - Update lead status, notes, or log activity
  app.patch('/api/leads/:id', (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const author = updates.author || 'Staff';

      if (deletedIds.has(id)) {
        return res.status(404).json({ success: false, error: 'Lead was deleted' });
      }

      const index = leadsCache.findIndex((l) => l.id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Lead not found' });
      }

      const current = leadsCache[index];
      const newActivities = [...(current.activities || [])];

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

      if (updates.newActivity) {
        newActivities.push({
          id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          timestamp: new Date().toISOString(),
          type: updates.newActivity.type,
          message: updates.newActivity.message,
          author: updates.newActivity.author || author,
        });
      }

      leadsCache[index] = {
        ...current,
        ...updates,
        activities: newActivities,
      };

      saveLeadsToFile(leadsCache);
      return res.json({ success: true, lead: leadsCache[index] });
    } catch (err) {
      console.error('Error updating lead:', err);
      return res.status(500).json({ success: false, error: 'Failed to update lead' });
    }
  });

  // 5. DELETE /api/leads/:id - Permanently remove lead from all devices
  app.delete('/api/leads/:id', (req, res) => {
    try {
      const { id } = req.params;
      deletedIds.add(id);
      saveDeletedIds(deletedIds);
      leadsCache = leadsCache.filter((l) => l.id !== id);
      saveLeadsToFile(leadsCache);
      return res.json({ success: true, count: leadsCache.length });
    } catch (err) {
      console.error('Error deleting lead:', err);
      return res.status(500).json({ success: false, error: 'Failed to delete lead' });
    }
  });

  // 6. POST /api/leads/reset - Reset sample leads
  app.post('/api/leads/reset', (_req, res) => {
    deletedIds.clear();
    saveDeletedIds(deletedIds);
    leadsCache = [...INITIAL_LEADS];
    saveLeadsToFile(leadsCache);
    return res.json({ success: true, leads: leadsCache });
  });

  // 7. POST /api/leads/clear - Clear all leads
  app.post('/api/leads/clear', (_req, res) => {
    for (const l of leadsCache) {
      deletedIds.add(l.id);
    }
    saveDeletedIds(deletedIds);
    leadsCache = [];
    saveLeadsToFile(leadsCache);
    return res.json({ success: true, leads: [] });
  });

  // 8. Passcode endpoints
  app.post('/api/auth/verify-passcode', (req, res) => {
    const { attempt } = req.body;
    const current = loadPasscode();
    const isValid = String(attempt || '').trim().toLowerCase() === current.trim().toLowerCase();
    return res.json({ success: isValid });
  });

  app.post('/api/auth/update-passcode', (req, res) => {
    const { newCode } = req.body;
    if (!newCode || String(newCode).trim().length < 4) {
      return res.status(400).json({ success: false, error: 'Passcode must be at least 4 characters long.' });
    }
    savePasscode(String(newCode).trim());
    return res.json({ success: true });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
