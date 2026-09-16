import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Copy,
  CheckCheck,
  Send,
  Trash2,
  ExternalLink,
  Wifi,
  Zap,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Shield,
  FileText,
  User,
  PhoneCall,
  Flame,
  Lock,
  Unlock,
  Tag,
} from 'lucide-react';
import { Lead, LeadActivity } from '../types';
import { LeadService, lookupZipInfo } from '../services/leadService';
import { SITE_CONFIG } from '../config';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLead: (updated: Lead) => void;
  onDeleteLead: (id: string, name: string) => void;
  onLockPackage?: (lead: Lead) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onUpdateLead,
  onDeleteLead,
  onLockPackage,
}) => {
  const [newNote, setNewNote] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedDossier, setCopiedDossier] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'script'>('overview');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const cleanPhone = lead.phone.replace(/\D/g, '');
  const zipInfo = lookupZipInfo(lead.zipCode);

  const handleStatusSelect = (newStatus: Lead['status']) => {
    const updated = LeadService.updateLead(lead.id, { status: newStatus }, 'Staff');
    if (updated) {
      onUpdateLead(updated);
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const updated = LeadService.addActivity(lead.id, {
      type: 'call_logged',
      message: newNote.trim(),
      author: 'Staff',
    });

    if (updated) {
      // Also sync into main lead notes
      const withNotes = LeadService.updateLead(lead.id, {
        notes: newNote.trim(),
      });
      if (withNotes) {
        onUpdateLead(withNotes);
      }
    }

    setNewNote('');
  };

  const handleQuickTagNote = (preset: string) => {
    const updated = LeadService.addActivity(lead.id, {
      type: 'call_logged',
      message: preset,
      author: 'Staff',
    });
    if (updated) {
      onUpdateLead(updated);
    }
  };

  const copyRefCode = () => {
    navigator.clipboard.writeText(lead.referenceCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(lead.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(lead.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const copyFullDossier = () => {
    const text = `
LEAD DOSSIER: ${lead.fullName} (${lead.referenceCode})
Status: ${lead.status.toUpperCase()}
Phone: ${lead.phone}
Email: ${lead.email}
Address: ${lead.streetAddress || 'N/A'}, ${lead.city || zipInfo.city}, ${lead.state || zipInfo.state} ${lead.zipCode}
Plan Interest: ${lead.selectedPlan || 'Everyday Internet'}
Carriers in ZIP: ${zipInfo.providers.join(', ')}
Max Speed in Area: ${zipInfo.maxSpeed}
Submitted: ${new Date(lead.createdAt).toLocaleString()}
Notes: ${lead.notes || 'None'}
`.trim();
    navigator.clipboard.writeText(text);
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2200);
  };

  const copyScript = () => {
    const scriptText = `Hello ${lead.fullName}, this is from Cable Internet Plans returning your inquiry (Ref: ${lead.referenceCode}). We verified that your address in ${lead.city || zipInfo.city}, ${lead.state || zipInfo.state} has service available with speeds up to ${zipInfo.maxSpeed}. Are you looking to lower your current monthly bill or activate new high-speed service?`;
    navigator.clipboard.writeText(scriptText);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  // Helper for status badge colors
  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          dot: 'bg-blue-600',
          label: 'New Inquiry',
        };
      case 'contacted':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-700',
          dot: 'bg-amber-500',
          label: 'Contacted',
        };
      case 'in-progress':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-700',
          dot: 'bg-purple-600',
          label: 'In Progress',
        };
      case 'closed-won':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-700',
          dot: 'bg-emerald-600',
          label: 'Closed - Won (Connected)',
        };
      case 'closed-lost':
        return {
          bg: 'bg-slate-100',
          border: 'border-slate-300',
          text: 'text-slate-700',
          dot: 'bg-slate-500',
          label: 'Closed - Lost',
        };
    }
  };

  const statusInfo = getStatusColor(lead.status);

  // Calculate relative time (e.g. "35 mins ago")
  const getRelativeTime = (isoString: string) => {
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-70 flex justify-end">
        {/* Smooth Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        />

        {/* Slide-out Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="relative w-full max-w-2xl bg-white shadow-2xl border-l border-slate-200 h-full flex flex-col z-10 overflow-hidden"
        >
          {/* Top Sticky Header */}
          <div className="bg-[#10243e] text-white px-5 sm:px-6 py-4 border-b border-blue-900 shrink-0 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-300 font-black text-lg shrink-0">
                {lead.fullName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-black tracking-tight truncate">
                    {lead.fullName}
                  </h3>
                  <button
                    onClick={copyRefCode}
                    title="Click to copy Reference Code"
                    className="inline-flex items-center gap-1 font-mono text-xs font-black px-2 py-0.5 rounded-md bg-blue-900/80 text-blue-200 border border-blue-700/60 hover:bg-blue-800 transition-colors cursor-pointer"
                  >
                    <span>{lead.referenceCode}</span>
                    {copiedCode ? <CheckCheck className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-300" />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-300" />
                  <span>Submitted {getRelativeTime(lead.createdAt)} ({new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={copyFullDossier}
                title="Copy Full Lead Dossier for CRM/Dialer"
                className="px-2.5 py-1.5 bg-blue-950/80 hover:bg-blue-900 text-slate-200 border border-blue-800/80 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedDossier ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-300" />
                    <span className="hidden sm:inline">Copy Dossier</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                title="Close drawer (Esc)"
                className="w-8 h-8 rounded-lg bg-blue-950/80 hover:bg-blue-900 text-slate-300 hover:text-white flex items-center justify-center border border-blue-800/80 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Communication Action Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex flex-wrap items-center gap-2">
              {/* Direct Call Button */}
              <a
                href={`tel:${cleanPhone}`}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {lead.phone}</span>
              </a>

              {/* SMS Button */}
              <a
                href={`sms:${cleanPhone}?&body=Hello%20${encodeURIComponent(lead.fullName)},%20this%20is%20Cable%20Internet%20Plans%20regarding%20your%20availability%20inquiry%20(Ref:%20${lead.referenceCode}).`}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Send SMS</span>
              </a>

              {/* Email Button */}
              <a
                href={`mailto:${lead.email}?subject=Your%20Internet%20Availability%20Options%20(Ref:%20${lead.referenceCode})&body=Hello%20${encodeURIComponent(lead.fullName)},%0D%0A%0D%0AThank%20you%20for%20checking%20internet%20service%20availability%20with%20Cable%20Internet%20Plans.%20Your%20promotional%20reference%20code%20is%20${lead.referenceCode}.%0D%0A%0D%0APlease%20call%20our%20desk%20at%20${SITE_CONFIG.PHONE_NUMBER}%20to%20lock%20in%20your%20promotions.`}
                className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email</span>
              </a>
            </div>

            {/* Delete Lead Action */}
            <button
              onClick={() => onDeleteLead(lead.id, lead.fullName)}
              title="Delete this lead"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer ml-auto"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Pipeline / Status Selector */}
          <div className="bg-white border-b border-slate-200 px-5 sm:px-6 py-3 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Lead Pipeline Status
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusInfo.bg} ${statusInfo.border} ${statusInfo.text} flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                {statusInfo.label}
              </span>
            </div>

            {/* Status Tabs */}
            <div className="grid grid-cols-5 gap-1.5">
              {(
                [
                  { id: 'new', label: 'New', color: 'hover:border-blue-400 hover:bg-blue-50/50' },
                  { id: 'contacted', label: 'Contacted', color: 'hover:border-amber-400 hover:bg-amber-50/50' },
                  { id: 'in-progress', label: 'In Progress', color: 'hover:border-purple-400 hover:bg-purple-50/50' },
                  { id: 'closed-won', label: 'Closed Won', color: 'hover:border-emerald-400 hover:bg-emerald-50/50' },
                  { id: 'closed-lost', label: 'Lost', color: 'hover:border-slate-400 hover:bg-slate-100' },
                ] as const
              ).map((s) => {
                const isActive = lead.status === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => handleStatusSelect(s.id)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg border transition-all text-center cursor-pointer ${
                      isActive
                        ? 'bg-[#183b6b] text-white border-[#183b6b] shadow-xs'
                        : `bg-slate-50 text-slate-600 border-slate-200 ${s.color}`
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Navigation for Detail Views */}
          <div className="bg-slate-50/80 border-b border-slate-200 px-5 sm:px-6 flex items-center gap-4 shrink-0 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'border-[#183b6b] text-[#183b6b]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Dossier &amp; Infrastructure</span>
            </button>

            <button
              onClick={() => setActiveTab('activity')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'activity'
                  ? 'border-[#183b6b] text-[#183b6b]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Call Log &amp; Timeline ({lead.activities?.length || 1})</span>
            </button>

            <button
              onClick={() => setActiveTab('script')}
              className={`py-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'script'
                  ? 'border-[#183b6b] text-[#183b6b]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Sales Call Script</span>
            </button>
          </div>

          {/* Drawer Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-slate-100/40">
            {activeTab === 'overview' && (
              <div className="space-y-5">
                {/* Contact Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>Customer Contact Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Phone */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Phone Number
                      </span>
                      <div className="flex items-center justify-between">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="font-bold text-blue-600 hover:underline text-sm"
                        >
                          {lead.phone}
                        </a>
                        <button
                          onClick={copyPhone}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                          title="Copy phone"
                        >
                          {copiedPhone ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Email Address
                      </span>
                      <div className="flex items-center justify-between">
                        <a
                          href={`mailto:${lead.email}`}
                          className="font-semibold text-slate-800 hover:underline truncate mr-2"
                        >
                          {lead.email}
                        </a>
                        <button
                          onClick={copyEmail}
                          className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer shrink-0"
                          title="Copy email"
                        >
                          {copiedEmail ? <CheckCheck className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Service Address */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 sm:col-span-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Service Physical Address
                      </span>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {lead.streetAddress || 'Street address not provided'}
                          </div>
                          <div className="text-slate-600 text-xs mt-0.5">
                            {lead.city || zipInfo.city}, {lead.state || zipInfo.state}{' '}
                            <span className="font-bold text-slate-800">({lead.zipCode})</span>
                          </div>
                        </div>

                        {lead.streetAddress && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              `${lead.streetAddress}, ${lead.city || zipInfo.city}, ${lead.state || zipInfo.state} ${lead.zipCode}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline px-2 py-1 bg-blue-50 border border-blue-200 rounded"
                          >
                            <span>Google Maps</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Verified Regional Infrastructure Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-blue-600" />
                      <span>Confirmed Regional Line Feasibility</span>
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Lines Active
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-blue-600 block">
                        Speed Capability at Location
                      </span>
                      <div className="text-lg font-black text-[#183b6b] flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span>Up to {zipInfo.maxSpeed}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        Fiber &amp; Gigabit Coaxial broadband nodes detected.
                      </span>
                    </div>

                    <div className={`p-3 rounded-xl border space-y-1.5 ${
                      lead.isPackageLocked
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">
                          {lead.isPackageLocked ? 'Locked Package Contract' : 'Package Interest'}
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

                      <div className={`text-sm font-extrabold ${lead.isPackageLocked ? 'text-emerald-950' : 'text-slate-900'}`}>
                        {lead.lockedPackage || lead.selectedPlan || 'Everyday (from $50/mo)'}
                      </div>

                      {lead.isPackageLocked && (
                        <div className="flex items-center justify-between text-xs text-emerald-900 font-bold pt-0.5">
                          <span>{lead.lockedPrice || 'Locked Rate'}</span>
                          <span className="text-[11px] font-medium text-emerald-700">{lead.lockedTerm || 'Guaranteed Rate'}</span>
                        </div>
                      )}

                      {lead.packageNotes && (
                        <div className="text-[11px] text-emerald-800 bg-white/70 p-2 rounded border border-emerald-200/80 italic">
                          "{lead.packageNotes}"
                        </div>
                      )}

                      {lead.packageLockedAt && (
                        <div className="text-[10px] text-slate-400">
                          Locked on {new Date(lead.packageLockedAt).toLocaleDateString()} {lead.packageLockedBy ? `by ${lead.packageLockedBy}` : ''}
                        </div>
                      )}

                      {onLockPackage && (
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => onLockPackage(lead)}
                            className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
                              lead.isPackageLocked
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600 shadow-xs'
                                : 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>{lead.isPackageLocked ? 'Edit / Unlock Package' : 'Lock Customer to Package'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Providers */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      Verified Network Carriers in ZIP {lead.zipCode}:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {zipInfo.providers.map((carrier, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-lg text-xs font-bold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          <span>{carrier}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Primary Notes Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Current Inbound Notes</span>
                  </h4>
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 italic leading-relaxed">
                    {lead.notes || 'No customer notes added yet.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Activity Log & Call Notes */}
            {activeTab === 'activity' && (
              <div className="space-y-5">
                {/* New Call Note Form */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Log Call or Add Representative Note</span>
                  </h4>

                  {/* Quick-tag preset buttons */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickTagNote('Called customer — left voicemail with Reference Code.')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + Left Voicemail
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTagNote('Customer requested callback tomorrow afternoon.')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + Callback Tomorrow
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTagNote(`Quoted promotional pricing starting at $50/mo. Customer reviewing options.`)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + Quoted Promo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickTagNote('Order confirmed with carrier; installation appointment scheduled.')}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      + Install Scheduled
                    </button>
                  </div>

                  <form onSubmit={handleAddNote} className="space-y-2 pt-1">
                    <textarea
                      rows={3}
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Type details about your conversation, customer preferences, existing provider bill..."
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#183b6b] focus:bg-white transition-all"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNote.trim()}
                        className="px-4 py-2 bg-[#183b6b] hover:bg-[#122f55] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Add to Log</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Timeline History */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Chronological Timeline
                  </h4>

                  <div className="space-y-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {(lead.activities || [
                      {
                        id: 'act-init',
                        timestamp: lead.createdAt,
                        type: 'note_added' as const,
                        message: `Lead registered with Reference Code ${lead.referenceCode}`,
                        author: 'System',
                      },
                    ])
                      .slice()
                      .reverse()
                      .map((act) => (
                        <div key={act.id} className="relative flex items-start gap-3 pl-2">
                          <div className="w-5 h-5 rounded-full bg-white border-2 border-[#183b6b] flex items-center justify-center shrink-0 z-10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#183b6b]" />
                          </div>
                          <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-900">
                                {act.author || 'Staff'}
                              </span>
                              <span className="text-slate-400">
                                {new Date(act.timestamp).toLocaleString([], {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {act.message}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Sales Call Script & Talking Points */}
            {activeTab === 'script' && (
              <div className="space-y-5">
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                        Agent Call-Opening Script
                      </h4>
                    </div>
                    <button
                      onClick={copyScript}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedScript ? (
                        <>
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Script</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Generated Pitch Box */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed space-y-2">
                    <p>
                      <strong>Representative:</strong> "Hello <strong>{lead.fullName}</strong>! My name is <em>[Your Name]</em> with Cable Internet Plans. I’m following up on your availability check for your address in <strong>{lead.city || zipInfo.city}</strong> under reference code <strong>{lead.referenceCode}</strong>."
                    </p>
                    <p>
                      <strong>Feasibility Pitch:</strong> "Great news — our system confirmed active carrier lines in your area with speeds up to <strong>{zipInfo.maxSpeed}</strong> from top networks including <strong>{zipInfo.providers.slice(0, 2).join(' and ')}</strong>."
                    </p>
                    {lead.isPackageLocked && (
                      <p className="bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200">
                        🔒 <strong>Locked Package Offer:</strong> "I see your inquiry has been locked into the <strong>{lead.lockedPackage || lead.selectedPlan}</strong> plan at <strong>{lead.lockedPrice || '$50/mo'}</strong> ({lead.lockedTerm || 'Price Guaranteed'}). We can secure this promotional installation right away."
                      </p>
                    )}
                    <p>
                      <strong>Closing Question:</strong> "Are you currently trying to lower a high monthly internet bill, or are you looking to set up brand new high-speed service this week?"
                    </p>
                  </div>
                </div>

                {/* Objection Handling */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                    Quick Objection Handlers
                  </h4>

                  <div className="space-y-2.5 text-slate-700">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Customer: "How much will this cost per month?"
                      </span>
                      <span>
                        "Promotional rates start between $50 to $70/mo depending on your speed tier, with modem equipment discounts and no hidden contract fees."
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="font-bold text-slate-900 block mb-0.5">
                        Customer: "Can I keep my current Wi-Fi equipment?"
                      </span>
                      <span>
                        "In most cases, yes! We verify equipment compatibility so you don't have to pay extra monthly rental fees."
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Footer */}
          <div className="bg-white border-t border-slate-200 px-5 sm:px-6 py-3.5 flex items-center justify-between shrink-0 text-xs">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onDeleteLead(lead.id, lead.fullName)}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Lead</span>
              </button>
              <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                ID: {lead.id}
              </span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
            >
              Done Reviewing
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
