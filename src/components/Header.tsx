import React, { useState } from 'react';
import { Phone, Menu, X, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '../config';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onCheckAvailabilityClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onCheckAvailabilityClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainPages = [
    { label: 'Home', path: '/' },
    { label: 'Providers', path: '/providers' },
    { label: 'Bill Lowering Help', path: '/bill-help' },
    { label: 'Contact Us', path: '/contact' },
  ];

  const legalPages = [
    { label: 'Privacy Policy', path: '/privacy' },
    { label: 'Terms & Conditions', path: '/terms' },
    { label: 'Disclaimer', path: '/disclaimer' },
  ];

  const isCurrent = (p: string) => {
    if (p === '/' && (currentPath === '/' || currentPath === '' || currentPath === '#home')) return true;
    return currentPath === p || currentPath === `#${p.replace('/', '')}`;
  };

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Name */}
        <a
          href="/"
          onClick={(e) => handleNav(e, '/')}
          id="brand-logo"
          className="text-lg sm:text-xl font-extrabold tracking-tight text-[#183b6b] hover:opacity-90 transition-opacity flex items-center gap-1.5"
        >
          <span>Cable Internet Plans</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Desktop Navigation">
          {mainPages.map((page) => {
            const active = isCurrent(page.path);
            return (
              <a
                key={page.path}
                href={page.path}
                onClick={(e) => handleNav(e, page.path)}
                className={`px-3 py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#183b6b]/10 text-[#183b6b] font-bold'
                    : 'text-slate-600 hover:text-[#183b6b] hover:bg-slate-50'
                }`}
              >
                {page.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="header-phone-desktop"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-800 text-xs font-bold hover:border-[#183b6b] hover:text-[#183b6b] hover:bg-slate-50 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{SITE_CONFIG.PHONE_NUMBER}</span>
          </a>

          <button
            onClick={() => {
              if (currentPath !== '/' && currentPath !== '' && currentPath !== '#home') {
                onNavigate('/');
                setTimeout(onCheckAvailabilityClick, 100);
              } else {
                onCheckAvailabilityClick();
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#183b6b] hover:bg-[#122f55] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            Check Availability
          </button>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex sm:hidden items-center gap-2">
          <a
            href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
            id="header-phone-button"
            aria-label="Call (800) 624-0038"
            className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:text-[#183b6b] hover:border-slate-400 hover:bg-slate-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
          </a>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="header-menu-toggle"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            className="w-9 h-9 rounded-lg border border-slate-300 flex items-center justify-center text-slate-700 hover:text-[#183b6b] hover:border-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 shadow-xl px-5 py-4 space-y-3 animate-in fade-in duration-150">
          <nav className="space-y-1" aria-label="Mobile Navigation">
            {mainPages.map((page) => {
              const active = isCurrent(page.path);
              return (
                <a
                  key={page.path}
                  href={page.path}
                  onClick={(e) => handleNav(e, page.path)}
                  className={`block px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-[#183b6b]/10 text-[#183b6b] font-bold'
                      : 'text-slate-700 hover:text-[#183b6b] hover:bg-slate-50'
                  }`}
                >
                  {page.label}
                </a>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Legal Disclosures</p>
            {legalPages.map((page) => (
              <a
                key={page.path}
                href={page.path}
                onClick={(e) => handleNav(e, page.path)}
                className="block px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900"
              >
                {page.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (currentPath !== '/' && currentPath !== '' && currentPath !== '#home') {
                  onNavigate('/');
                  setTimeout(onCheckAvailabilityClick, 100);
                } else {
                  onCheckAvailabilityClick();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#183b6b] hover:bg-[#122f55] text-white font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Check Availability
            </button>

            <a
              href={`tel:${SITE_CONFIG.PHONE_NUMBER_RAW}`}
              className="block w-full py-2 px-4 rounded-xl border border-slate-200 text-slate-800 font-semibold text-xs text-center hover:bg-slate-50 transition-colors"
            >
              Call 24/7: {SITE_CONFIG.PHONE_NUMBER}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
