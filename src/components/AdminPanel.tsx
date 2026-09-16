import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Download,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Lock,
  UserPlus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  FileSpreadsheet,
  Edit3,
  ChevronRight,
  TrendingUp,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Zap,
  Unlock,
  PackageCheck,
  Tag,
} from 'lucide-react';
import { Lead } from '../types';
import { LeadService, lookupZipInfo } from '../services/leadService';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { SITE_CONFIG } from '../config';

export const AVAILABLE_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter (Up to 300 Mbps)',
    defaultPrice: '$70.00/mo',
    speed: 'Up to 300 Mbps',
    description: 'Great for email, browsing & light streaming',
    badge: 'Basic Tier',
  },
  {
    id: 'everyday',
    name: 'Everyday (Up to 600 Mbps)',
    defaultPrice: '$50.00/mo',
    speed: 'Up to 600 Mbps',
    description: 'HD streaming across multiple rooms (Most Popular)',
    badge: 'Popular',
  },
  {
    id: 'gigabit',
    name: 'Fast / Gigabit (Up to 1000+ Mbps)',
    defaultPrice: '$79.99/mo',
    speed: '1000+ Mbps Gigabit',
    description: '4K/8K streaming, competitive gaming & home offices',
    badge: 'High Speed',
  },
  {
    id: 'fiber-ultra',
    name: 'Fiber Gigabit Ultra (1,000 Mbps Symmetrical)',
    defaultPrice: '$65.00/mo',
    speed: '1,000 Mbps Fiber',
    description: 'Ultra-low latency symmetrical upload/download',
    badge: 'Fiber Pro',
  },
  {
    id: 'bundle-tv',
    name: 'Internet + Cable TV Entertainment Bundle',
    defaultPrice: '$89.99/mo',
    speed: '600 Mbps + 125+ Channels',
    description: 'Broadband with live sports, local news & HD cable',
    badge: 'Value Bundle',
  },
  {
    id: 'business-gig',
    name: 'Business Gigabit High-Speed Broadband',
    defaultPrice: '$129.99/mo',
    speed: '1,000 Mbps Dedicated',
    description: 'Priority commercial routing with 24/7 SLA support',
    badge: 'Commercial',
  },
  {
    id: 'custom',
    name: 'Custom Negotiated Package',
    defaultPrice: '$55.00/mo',
    speed: 'Custom Specification',
    description: 'Bespoke promotional package rate negotiated with carrier',
    badge: 'Negotiated',
  },
];

export const GUARANTEE_TERMS = [
  '12-Month Price Guarantee',
  '24-Month Price Guarantee',
  'No-Contract Price Lock',
  'Lifetime Promotional Rate',
  'Fixed Rate (Contractual)',
];

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('cip_admin_authed') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Note editing state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNote, setTempNote] = useState('');

  // Manual Lead Modal state
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    zipCode: '',
    streetAddress: '',
    selectedPlan: 'Everyday (from $50/mo)',
    lockImmediately: false,
    lockedPrice: '$50.00/mo',
    lockedTerm: '12-Month Price Guarantee',
    notes: '',
  });

  // Package Locking Modal state
  const [lockingLead, setLockingLead] = useState<Lead | null>(null);
  const [lockPackageName, setLockPackageName] = useState<string>('Everyday (Up to 600 Mbps)');
  const [customPackageName, setCustomPackageName] = useState<string>('');
  const [lockPrice, setLockPrice] = useState<string>('$50.00/mo');
  const [lockTerm, setLockTerm] = useState<string>('12-Month Price Guarantee');
  const [lockNotes, setLockNotes] = useState<string>('');

  // Settings state
  const [activeTab, setActiveTab] = useState<'leads' | 'settings'>('leads');
  const [newPasscode, setNewPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState('');

  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load leads
  const refreshLeads = async () => {
    const data = LeadService.getLeads();
    setLeads(data);
    if (selectedLead) {
      const updatedSelected = data.find((l) => l.id === selectedLead.id);
      if (updatedSelected) {
        setSelectedLead(updatedSelected);
      }
    }
    // Fetch latest from centralized server
    try {
      setIsSyncing(true);
      const remote = await LeadService.fetchRemoteLeads();
      setLeads(remote);
      if (selectedLead) {
        const updatedSelected = remote.find((l) => l.id === selectedLead.id);
        if (updatedSelected) {
          setSelectedLead(updatedSelected);
        }
      }
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshLeads();
      // Periodically sync with server every 5 seconds so updates or deletions from any device appear live
      const timer = setInterval(() => {
        LeadService.fetchRemoteLeads().then((latest) => {
          setLeads(latest);
          setSelectedLead((curr) => (curr && !latest.some((l) => l.id === curr.id) ? null : curr));
        });
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [isOpen]);

  // Listen for real-time lead updates
  useEffect(() => {
    const handleUpdate = () => {
      const current = LeadService.getLeads();
      setLeads(current);
      if (selectedLead) {
        const updatedSelected = current.find((l) => l.id === selectedLead.id);
        if (updatedSelected) setSelectedLead(updatedSelected);
      }
    };
    window.addEventListener('leads-updated', handleUpdate);
    return () => window.removeEventListener('leads-updated', handleUpdate);
  }, [selectedLead]);

  // Handle Passcode Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const isValid = await LeadService.verifyAdminPasscodeAsync(passcode);
      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem('cip_admin_authed', 'true');
        setPasscode('');
        refreshLeads();
        showToast('Welcome to the Admin Portal');
      } else {
        setAuthError('Incorrect passcode. Please check and try again.');
      }
    } catch {
      setAuthError('Error verifying passcode. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('cip_admin_authed');
    setPasscode('');
    setSelectedLead(null);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.fullName.toLowerCase().includes(q) ||
        lead.phone.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.zipCode.includes(q) ||
        lead.referenceCode.toLowerCase().includes(q) ||
        (lead.lockedPackage && lead.lockedPackage.toLowerCase().includes(q)) ||
        (lead.streetAddress && lead.streetAddress.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'locked'
          ? !!lead.isPackageLocked
          : lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchQuery, statusFilter]);

  // Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const lockedCount = leads.filter((l) => l.isPackageLocked).length;
    const newCount = leads.filter((l) => l.status === 'new').length;
    const contacted = leads.filter((l) => l.status === 'contacted').length;
    const inProgress = leads.filter((l) => l.status === 'in-progress').length;
    const closed = leads.filter((l) => l.status === 'closed-won').length;
    const lost = leads.filter((l) => l.status === 'closed-lost').length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = leads.filter((l) => l.createdAt.slice(0, 10) === todayStr).length;

    return { total, lockedCount, newCount, contacted, inProgress, closed, lost, todayCount };
  }, [leads]);

  // Status badge style helper
  const getStatusBadge = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closed-won':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'closed-lost':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleStatusChange = (id: string, newStatus: Lead['status'], customerName?: string) => {
    LeadService.updateLead(id, { status: newStatus }, 'Staff');
    refreshLeads();
    showToast(`Status updated for ${customerName || 'lead'}`);
  };

  const handleDeleteLead = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the lead for "${name}"? This will permanently delete it across all connected devices.`)) {
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
      await LeadService.deleteLead(id);
      await refreshLeads();
      showToast(`Lead "${name}" permanently deleted`);
    }
  };

  const handleSaveNote = (id: string) => {
    LeadService.updateLead(id, { notes: tempNote });
    setEditingNoteId(null);
    setTempNote('');
    refreshLeads();
  };

  const openLockModal = (lead: Lead) => {
    setLockingLead(lead);
    if (lead.isPackageLocked && lead.lockedPackage) {
      const match = AVAILABLE_PACKAGES.find((p) => p.name === lead.lockedPackage);
      if (match) {
        setLockPackageName(match.name);
        setCustomPackageName('');
      } else {
        setLockPackageName('Custom Negotiated Package');
        setCustomPackageName(lead.lockedPackage);
      }
      setLockPrice(lead.lockedPrice || '$50.00/mo');
      setLockTerm(lead.lockedTerm || '12-Month Price Guarantee');
      setLockNotes(lead.packageNotes || '');
    } else {
      const match = AVAILABLE_PACKAGES.find(
        (p) => lead.selectedPlan && (p.name.toLowerCase().includes(lead.selectedPlan.toLowerCase()) || lead.selectedPlan.toLowerCase().includes(p.id))
      );
      if (match) {
        setLockPackageName(match.name);
        setLockPrice(match.defaultPrice);
      } else {
        setLockPackageName('Everyday (Up to 600 Mbps)');
        setLockPrice('$50.00/mo');
      }
      setCustomPackageName('');
      setLockTerm('12-Month Price Guarantee');
      setLockNotes('');
    }
  };

  const handleSavePackageLock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockingLead) return;

    const finalPackage =
      lockPackageName === 'Custom Negotiated Package'
        ? (customPackageName.trim() || 'Custom Negotiated Package')
        : lockPackageName;

    const isNewLock = !lockingLead.isPackageLocked;

    const updated = LeadService.updateLead(
      lockingLead.id,
      {
        isPackageLocked: true,
        lockedPackage: finalPackage,
        lockedPrice: lockPrice.trim() || '$50.00/mo',
        lockedTerm: lockTerm,
        packageLockedAt: new Date().toISOString(),
        packageLockedBy: 'Admin',
        packageNotes: lockNotes.trim() || undefined,
        selectedPlan: finalPackage,
      },
      'Admin'
    );

    LeadService.addActivity(lockingLead.id, {
      type: 'note_added',
      message: isNewLock
        ? `🔒 Customer locked to package "${finalPackage}" at ${lockPrice.trim()} (${lockTerm}) by Admin.${lockNotes ? ` Note: ${lockNotes}` : ''}`
        : `🔒 Package lock modified: "${finalPackage}" at ${lockPrice.trim()} (${lockTerm}) by Admin.${lockNotes ? ` Note: ${lockNotes}` : ''}`,
      author: 'Admin',
    });

    if (selectedLead?.id === lockingLead.id && updated) {
      setSelectedLead(updated);
    }

    refreshLeads();
    showToast(`🔒 ${lockingLead.fullName} locked to "${finalPackage}"`);
    setLockingLead(null);
  };

  const handleUnlockPackage = () => {
    if (!lockingLead) return;
    if (window.confirm(`Are you sure you want to release the package lock for ${lockingLead.fullName}?`)) {
      const updated = LeadService.updateLead(
        lockingLead.id,
        {
          isPackageLocked: false,
          lockedPackage: undefined,
          lockedPrice: undefined,
          lockedTerm: undefined,
          packageLockedAt: undefined,
          packageLockedBy: undefined,
          packageNotes: undefined,
        },
        'Admin'
      );

      LeadService.addActivity(lockingLead.id, {
        type: 'note_added',
        message: `🔓 Package lock removed by Admin. Account is no longer locked to a specific plan.`,
        author: 'Admin',
      });

      if (selectedLead?.id === lockingLead.id && updated) {
        setSelectedLead(updated);
      }

      refreshLeads();
      showToast(`🔓 Package lock removed for ${lockingLead.fullName}`);
      setLockingLead(null);
    }
  };

  const handleCreateManualLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.fullName || !newLeadForm.phone || !newLeadForm.zipCode) {
      alert('Full Name, Phone Number, and ZIP Code are required.');
      return;
    }

    const zipInfo = lookupZipInfo(newLeadForm.zipCode);

    LeadService.addLead({
      fullName: newLeadForm.fullName.trim(),
      phone: newLeadForm.phone.trim(),
      email: newLeadForm.email.trim() || 'phone-inquiry@customer.local',
      zipCode: newLeadForm.zipCode.trim(),
      streetAddress: newLeadForm.streetAddress.trim() || undefined,
      city: zipInfo.city,
      state: zipInfo.state,
      detectedProviders: zipInfo.providers,
      selectedPlan: newLeadForm.selectedPlan,
      isPackageLocked: newLeadForm.lockImmediately,
      lockedPackage: newLeadForm.lockImmediately ? newLeadForm.selectedPlan : undefined,
      lockedPrice: newLeadForm.lockImmediately ? newLeadForm.lockedPrice : undefined,
      lockedTerm: newLeadForm.lockImmediately ? newLeadForm.lockedTerm : undefined,
      packageLockedAt: newLeadForm.lockImmediately ? new Date().toISOString() : undefined,
      packageLockedBy: newLeadForm.lockImmediately ? 'Admin' : undefined,
      notes: newLeadForm.notes.trim() || 'Manually logged via Admin Panel phone call.',
      source: 'Direct Phone / Inbound Call',
    });

    setShowAddLeadModal(false);
    setNewLeadForm({
      fullName: '',
      phone: '',
      email: '',
      zipCode: '',
      streetAddress: '',
      selectedPlan: 'Everyday (from $50/mo)',
      lockImmediately: false,
      lockedPrice: '$50.00/mo',
      lockedTerm: '12-Month Price Guarantee',
      notes: '',
    });
    refreshLeads();
    showToast('Lead logged successfully');
  };

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasscode.trim().length < 4) {
      alert('Passcode must be at least 4 characters long.');
      return;
    }
    LeadService.setAdminPasscode(newPasscode.trim());
    setPasscodeSuccess('Admin passcode updated successfully!');
    setNewPasscode('');
    setTimeout(() => setPasscodeSuccess(''), 4000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-slate-50 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#10243e] text-white px-5 sm:px-7 py-4 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">Admin &amp; Leads Console</h2>
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Private Access
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Cable Internet Plans • Inbound Lead Management &amp; Dispatch
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  type="button"
                  onClick={refreshLeads}
                  disabled={isSyncing}
                  title="Sync with central database"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
                  <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  title="Log Out of Admin"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              title="Close Admin Panel"
              className="w-9 h-9 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated: Passcode Screen */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-14 max-w-md mx-auto my-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#183b6b] flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8 stroke-[2.2]" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Staff Authentication
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                Enter your administrative passcode to manage customer submissions, export leads, and view performance metrics.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 text-left">
              {authError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label htmlFor="admin-passcode" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Admin Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter private passcode..."
                  required
                  autoFocus
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#183b6b] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-sm rounded-xl transition-all shadow-md active:scale-[0.99] cursor-pointer"
              >
                Unlock Admin Console
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Top Navigation & Metrics Bar */}
            <div className="bg-white border-b border-slate-200 px-5 sm:px-7 py-4 shrink-0 space-y-4">
              
              {/* Tabs & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('leads')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'leads'
                        ? 'bg-[#183b6b] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Leads Inquiries ({leads.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-[#183b6b] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Console Settings
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Log Inbound Call</span>
                  </button>

                  <button
                    onClick={() => LeadService.exportToCsv(leads)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={refreshLeads}
                    title="Refresh leads"
                    className="p-2 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* KPI Metrics Cards (Interactive Filter Triggers) */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-slate-100 border-[#183b6b] ring-2 ring-[#183b6b]/20 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Total Leads
                    </span>
                    {statusFilter === 'all' && <span className="w-2 h-2 rounded-full bg-[#183b6b]" />}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-slate-900">{metrics.total}</span>
                    <span className="text-xs text-slate-500 font-medium">all time</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('locked')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    statusFilter === 'locked'
                      ? 'bg-emerald-100/80 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-emerald-50/60 border-emerald-200 hover:bg-emerald-100/50 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-emerald-600" />
                      <span>Locked</span>
                    </span>
                    {metrics.lockedCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-950">{metrics.lockedCount}</span>
                    <span className="text-xs text-emerald-700 font-medium">to package</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('new')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    statusFilter === 'new'
                      ? 'bg-blue-100/70 border-blue-600 ring-2 ring-blue-500/30 shadow-xs'
                      : 'bg-blue-50/80 border-blue-200 hover:bg-blue-100/60 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                      New Inquiries
                    </span>
                    {metrics.newCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-blue-900">{metrics.newCount}</span>
                    <span className="text-xs text-blue-600 font-medium">pending dispatch</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('in-progress')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    statusFilter === 'in-progress'
                      ? 'bg-purple-100/70 border-purple-600 ring-2 ring-purple-500/30 shadow-xs'
                      : 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/50 hover:border-purple-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
                      In Progress
                    </span>
                    {statusFilter === 'in-progress' && <span className="w-2 h-2 rounded-full bg-purple-600" />}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-purple-900">{metrics.inProgress}</span>
                    <span className="text-xs text-purple-600 font-medium">in discussion</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setStatusFilter('closed-won')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    statusFilter === 'closed-won'
                      ? 'bg-emerald-100/70 border-emerald-600 ring-2 ring-emerald-500/30 shadow-xs'
                      : 'bg-emerald-50/80 border-emerald-200 hover:bg-emerald-100/60 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
                      Closed / Won
                    </span>
                    {statusFilter === 'closed-won' && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-black text-emerald-900">{metrics.closed}</span>
                    <span className="text-xs text-emerald-600 font-medium">connected</span>
                  </div>
                </button>
              </div>

              {/* Quick Status Filter Tabs & Search Bar */}
              {activeTab === 'leads' && (
                <div className="space-y-2.5 pt-1">
                  {/* Status Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-wider shrink-0 mr-1">
                      Filter:
                    </span>
                    {[
                      { id: 'all', label: 'All', count: metrics.total },
                      { id: 'locked', label: '🔒 Locked', count: metrics.lockedCount, highlight: metrics.lockedCount > 0 },
                      { id: 'new', label: 'New', count: metrics.newCount, highlight: metrics.newCount > 0 },
                      { id: 'contacted', label: 'Contacted', count: metrics.contacted },
                      { id: 'in-progress', label: 'In Progress', count: metrics.inProgress },
                      { id: 'closed-won', label: 'Closed Won', count: metrics.closed },
                      { id: 'closed-lost', label: 'Lost', count: metrics.lost },
                    ].map((pill) => {
                      const isActive = statusFilter === pill.id;
                      return (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setStatusFilter(pill.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                            isActive
                              ? 'bg-[#183b6b] text-white shadow-xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span>{pill.label}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                              isActive
                                ? 'bg-blue-900/60 text-blue-100'
                                : pill.highlight
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {pill.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row items-center gap-2.5">
                    <div className="relative flex-1 w-full">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by customer name, phone, email, ZIP code, or ref code..."
                        className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:bg-white transition-all"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="text-xs text-slate-500 whitespace-nowrap pl-1">
                        Showing <strong>{filteredLeads.length}</strong> of {leads.length} leads
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70">
              
              {activeTab === 'leads' ? (
                filteredLeads.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h4 className="text-base font-bold text-slate-800">
                      No matching leads found
                    </h4>
                    <p className="text-xs text-slate-500">
                      {searchQuery || statusFilter !== 'all'
                        ? 'Try clearing your search query or status filter to see all inquiries.'
                        : 'Submit an address check on the homepage to generate new leads, or click "Log Inbound Call" above.'}
                    </p>
                    {(searchQuery || statusFilter !== 'all') && (
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setStatusFilter('all');
                        }}
                        className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs hover:shadow-md transition-all cursor-pointer group ${
                          selectedLead?.id === lead.id
                            ? 'border-[#183b6b] ring-2 ring-[#183b6b]/20 bg-blue-50/10'
                            : 'border-slate-200 hover:border-blue-400/80'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                          
                          {/* Customer & Ref */}
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#183b6b]/10 text-[#183b6b] group-hover:bg-[#183b6b] group-hover:text-white transition-colors flex items-center justify-center font-bold text-sm shrink-0">
                              {lead.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#183b6b] transition-colors">
                                  {lead.fullName}
                                </h4>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(lead.referenceCode);
                                    showToast(`Copied ${lead.referenceCode}`);
                                  }}
                                  title="Click to copy reference code"
                                  className="font-mono text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer"
                                >
                                  {lead.referenceCode}
                                </button>
                                {lead.isPackageLocked && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                                    <Lock className="w-3 h-3 text-emerald-700" />
                                    <span>Locked</span>
                                  </span>
                                )}
                                {lead.source && (
                                  <span className="text-[10px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                    {lead.source}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span>{new Date(lead.createdAt).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions & Status Dropdown */}
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            {/* Call Button */}
                            <a
                              href={`tel:${lead.phone.replace(/\D/g, '')}`}
                              title={`Call ${lead.phone}`}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Call</span>
                            </a>

                            {/* Status selector */}
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value as Lead['status'], lead.fullName)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#183b6b] ${getStatusBadge(
                                lead.status
                              )}`}
                            >
                              <option value="new">● New Inquiry</option>
                              <option value="contacted">● Contacted</option>
                              <option value="in-progress">● In Progress</option>
                              <option value="closed-won">✔ Closed - Won</option>
                              <option value="closed-lost">✖ Closed - Lost</option>
                            </select>

                            {/* View Details Drawer Button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedLead(lead);
                              }}
                              className="px-3 py-1.5 bg-[#183b6b] hover:bg-[#122f55] text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                            >
                              <span>View Details</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteLead(lead.id, lead.fullName)}
                              title="Delete lead"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Middle: Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3 text-xs text-slate-700">
                          
                          {/* Contact Info */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Contact Channels
                            </span>
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <a
                                href={`tel:${lead.phone.replace(/\D/g, '')}`}
                                onClick={(e) => e.stopPropagation()}
                                className="font-bold text-blue-600 hover:underline"
                              >
                                {lead.phone}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <a
                                href={`mailto:${lead.email}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-600 hover:text-slate-900 hover:underline truncate max-w-[200px]"
                              >
                                {lead.email}
                              </a>
                            </div>
                          </div>

                          {/* Address & Carriers */}
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                              Service Physical Address
                            </span>
                            <div className="flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {lead.streetAddress || 'Street address not provided'}
                                </div>
                                <div className="text-slate-500">
                                  {lead.city && lead.state ? `${lead.city}, ${lead.state} ` : ''}
                                  <strong>{lead.zipCode}</strong>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Plan Interest, Lock Status & Actions */}
                          <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                Package Allocation
                              </span>
                              {lead.isPackageLocked ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                                  <Lock className="w-3 h-3 text-emerald-700" />
                                  <span>Locked</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                                  <Unlock className="w-3 h-3 text-slate-400" />
                                  <span>Unlocked</span>
                                </span>
                              )}
                            </div>

                            {lead.isPackageLocked ? (
                              <div className="bg-emerald-50/90 border border-emerald-300 rounded-lg p-2 space-y-0.5">
                                <div className="font-extrabold text-emerald-950 text-xs truncate">
                                  {lead.lockedPackage || lead.selectedPlan}
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-emerald-800 font-bold">
                                  <span>{lead.lockedPrice || '$50.00/mo'}</span>
                                  <span className="text-[10px] font-medium text-emerald-700">{lead.lockedTerm || 'Price Locked'}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="font-semibold text-[#183b6b] text-xs">
                                {lead.selectedPlan || 'Everyday Internet'}
                              </div>
                            )}

                            {lead.detectedProviders && lead.detectedProviders.length > 0 && !lead.isPackageLocked && (
                              <div className="text-[11px] text-slate-500 truncate">
                                Networks: {lead.detectedProviders.join(', ')}
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openLockModal(lead);
                              }}
                              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                lead.isPackageLocked
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-2xs'
                                  : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-400'
                              }`}
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>{lead.isPackageLocked ? 'Edit / Unlock Package' : 'Lock to Package'}</span>
                            </button>
                          </div>

                        </div>

                        {/* Bottom: Notes & Activity Snippet */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <Edit3 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="italic truncate">
                              {lead.notes || (lead.activities && lead.activities.length > 0 ? lead.activities[lead.activities.length - 1].message : 'No notes added yet.')}
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-blue-600 group-hover:underline shrink-0 flex items-center gap-1">
                            Open full file <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>

                      </div>
                    ))}
                  </div>
                )
              ) : (
                /* Tab 2: Settings */
                <div className="max-w-2xl mx-auto space-y-6">
                  
                  {/* Change Passcode */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          Change Admin Passcode
                        </h4>
                        <p className="text-xs text-slate-500">
                          Update the security PIN used to access this console.
                        </p>
                      </div>
                    </div>

                    {passcodeSuccess && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{passcodeSuccess}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePasscode} className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                          New Passcode
                        </label>
                        <input
                          type="password"
                          value={newPasscode}
                          onChange={(e) => setNewPasscode(e.target.value)}
                          placeholder="Enter new private passcode (min. 4 characters)..."
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#183b6b] hover:bg-[#122f55] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        Update Passcode
                      </button>
                    </form>
                  </div>

                  {/* Hotline Display Configuration */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          Dispatch Hotline
                        </h4>
                        <p className="text-xs text-slate-500">
                          Active customer inbound call center phone number.
                        </p>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <div>
                        <strong>Current Line:</strong> {SITE_CONFIG.PHONE_NUMBER}
                      </div>
                      <div>
                        <strong>Direct Link:</strong> <code>tel:{SITE_CONFIG.PHONE_NUMBER_RAW}</code>
                      </div>
                      <div>
                        <strong>Operating Hours:</strong> 24/7 Nationwide Support
                      </div>
                    </div>
                  </div>

                  {/* Data Management */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                    <h4 className="text-base font-bold text-slate-900">
                      Lead Database Management
                    </h4>
                    <p className="text-xs text-slate-500">
                      Reset database to default sample leads or purge test submissions.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <button
                        onClick={async () => {
                          if (window.confirm('Reset lead list with realistic test demo leads?')) {
                            await LeadService.resetSampleLeads();
                            await refreshLeads();
                            showToast('Demo leads restored across all devices');
                          }
                        }}
                        className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Reset Demo Leads
                      </button>

                      <button
                        onClick={async () => {
                          if (window.confirm('WARNING: Are you sure you want to permanently delete ALL stored leads? This cannot be undone.')) {
                            setSelectedLead(null);
                            await LeadService.clearAllLeads();
                            await refreshLeads();
                            showToast('All leads permanently purged across all devices');
                          }
                        }}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Purge All Leads
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Bottom Status Bar */}
            <div className="bg-white border-t border-slate-200 px-5 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Console active • Leads automatically synced across sessions</span>
              </div>
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs cursor-pointer"
              >
                Back to Website
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Manual Inbound Call Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Log Inbound Phone Lead</span>
              </h3>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Customer Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newLeadForm.fullName}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, fullName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newLeadForm.zipCode}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, zipCode: e.target.value.replace(/\D/g, '') })}
                    placeholder="e.g. 90210"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Street Address (Optional)
                </label>
                <input
                  type="text"
                  value={newLeadForm.streetAddress}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, streetAddress: e.target.value })}
                  placeholder="123 Main St, Apt 4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  placeholder="customer@email.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Interested Package
                </label>
                <select
                  value={newLeadForm.selectedPlan}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, selectedPlan: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                >
                  <option value="Starter (from $70/mo)">Starter (from $70/mo)</option>
                  <option value="Everyday (from $50/mo)">Everyday (from $50/mo)</option>
                  <option value="Fast/Gigabit (from $70-$100/mo)">Fast/Gigabit (from $70-$100/mo)</option>
                  <option value="Bill-Lowering Consultation">Bill-Lowering Consultation</option>
                </select>
              </div>

              {/* Lock to Package immediately checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                <label className="flex items-center gap-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newLeadForm.lockImmediately}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, lockImmediately: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Lock Customer to Package Immediately</span>
                  </span>
                </label>

                {newLeadForm.lockImmediately && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Locked Rate</label>
                      <input
                        type="text"
                        value={newLeadForm.lockedPrice}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, lockedPrice: e.target.value })}
                        placeholder="$50.00/mo"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Guarantee Term</label>
                      <select
                        value={newLeadForm.lockedTerm}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, lockedTerm: e.target.value })}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-slate-900 bg-white"
                      >
                        {GUARANTEE_TERMS.map((term) => (
                          <option key={term} value={term}>{term}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes / Call Summary
                </label>
                <textarea
                  rows={2}
                  value={newLeadForm.notes}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  placeholder="Customer called regarding high bill, interested in fiber option..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lock Customer to Package Modal */}
      {lockingLead && (
        <div className="fixed inset-0 z-70 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {lockingLead.isPackageLocked ? 'Manage / Edit Package Lock' : 'Lock Customer to a Package'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {lockingLead.fullName} • Ref: <span className="font-mono font-bold text-slate-700">{lockingLead.referenceCode}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLockingLead(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePackageLock} className="space-y-4 text-xs">
              {/* Customer Quick Summary */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Phone</span>
                  <span className="font-bold text-slate-900">{lockingLead.phone}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Location</span>
                  <span className="font-bold text-slate-900">{lockingLead.city || 'ZIP'}, {lockingLead.state || ''} {lockingLead.zipCode}</span>
                </div>
              </div>

              {/* Package Selector */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Select Broadband Package to Lock *</span>
                  <span className="text-[11px] text-blue-600 font-normal">Choose from certified catalog</span>
                </label>
                <div className="space-y-2">
                  {AVAILABLE_PACKAGES.map((pkg) => {
                    const isSelected = lockPackageName === pkg.name;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => {
                          setLockPackageName(pkg.name);
                          if (pkg.id !== 'custom') {
                            setLockPrice(pkg.defaultPrice);
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/90 border-[#183b6b] ring-2 ring-[#183b6b]/20 shadow-xs'
                            : 'bg-white hover:bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#183b6b] bg-[#183b6b]' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-2">
                              <span>{pkg.name}</span>
                              {pkg.badge && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                  {pkg.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{pkg.description}</div>
                          </div>
                        </div>
                        <div className="text-right shrink-0 font-black text-slate-900 text-xs">
                          {pkg.defaultPrice}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Package Name if selected */}
              {lockPackageName === 'Custom Negotiated Package' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Custom Package Name / Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={customPackageName}
                    onChange={(e) => setCustomPackageName(e.target.value)}
                    placeholder="e.g. Spectrum Ultra 500 Mbps + Sports Package"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                  />
                </div>
              )}

              {/* Price & Term Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Locked Monthly Rate *
                  </label>
                  <input
                    type="text"
                    required
                    value={lockPrice}
                    onChange={(e) => setLockPrice(e.target.value)}
                    placeholder="e.g. $50.00/mo"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Promotional price agreed with customer
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Price Lock Guarantee Term
                  </label>
                  <select
                    value={lockTerm}
                    onChange={(e) => setLockTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#183b6b] bg-white"
                  >
                    {GUARANTEE_TERMS.map((term) => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Contract guarantee duration
                  </span>
                </div>
              </div>

              {/* Special Terms / Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Package Lock Contract Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={lockNotes}
                  onChange={(e) => setLockNotes(e.target.value)}
                  placeholder="e.g. Free Wi-Fi 6 router included; waived $99 activation fee; customer confirmed installation for Friday."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                {lockingLead.isPackageLocked ? (
                  <button
                    type="button"
                    onClick={handleUnlockPackage}
                    className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Unlock / Release Package</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLockingLead(null)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{lockingLead.isPackageLocked ? 'Save Package Lock' : 'Lock Customer to Package'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slide-out Lead Detail Dossier & Inspection Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={(updated) => {
          setSelectedLead(updated);
          refreshLeads();
          showToast(`Updated "${updated.fullName}"`);
        }}
        onDeleteLead={(id, name) => {
          handleDeleteLead(id, name);
          setSelectedLead(null);
        }}
        onLockPackage={openLockModal}
      />

      {/* Real-time Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-80 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
