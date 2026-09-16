import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { WhyChooseUs } from './components/WhyChooseUs';
import { TechOptionsSection } from './components/TechOptionsSection';
import { Plans } from './components/Plans';
import { BillLoweringSection } from './components/BillLoweringSection';
import { SupportCasesSection } from './components/SupportCasesSection';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { PolicyModal } from './components/PolicyModal';
import { AdminPanel } from './components/AdminPanel';
import { LeadService } from './services/leadService';
import { ProvidersPage } from './pages/ProvidersPage';
import { BillHelpPage } from './pages/BillHelpPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

export default function App() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = window.location.pathname;
    if (p && p !== '/') return p;
    const h = window.location.hash;
    if (h.startsWith('#/') || h === '#providers' || h === '#bill-help' || h === '#contact' || h === '#privacy' || h === '#terms' || h === '#disclaimer') {
      return h.replace('#', '').replace(/^\/?/, '/');
    }
    return '/';
  });

  // Sync leads from centralized server on mount so all devices have current leads
  useEffect(() => {
    LeadService.fetchRemoteLeads();
  }, []);

  // Update page title based on current route
  useEffect(() => {
    if (currentPath === '/providers') {
      document.title = 'Internet Service Options - Cable Internet Plans';
    } else if (currentPath === '/bill-help') {
      document.title = 'Bill Lowering Help - Cable Internet Plans | Reduce Your Internet Bill';
    } else if (currentPath === '/contact') {
      document.title = 'Contact Us - Cable Internet Plans | 24/7 Support';
    } else if (currentPath === '/privacy') {
      document.title = 'Privacy Policy - Cable Internet Plans';
    } else if (currentPath === '/terms') {
      document.title = 'Terms & Conditions - Cable Internet Plans';
    } else if (currentPath === '/disclaimer') {
      document.title = 'Disclaimer & Disclosure - Cable Internet Plans';
    } else {
      document.title = 'Cable Internet Plans | Faster Internet, Lower Bills, Easy Switch';
    }
  }, [currentPath]);

  // Handle location and hash changes
  useEffect(() => {
    const handleLocationChange = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#portal') {
        setIsAdminOpen(true);
        return;
      }
      const p = window.location.pathname;
      if (p && p !== '/') {
        setCurrentPath(p);
        return;
      }
      const h = window.location.hash;
      if (h.startsWith('#/') || h === '#providers' || h === '#bill-help' || h === '#contact' || h === '#privacy' || h === '#terms' || h === '#disclaimer') {
        setCurrentPath(h.replace('#', '').replace(/^\/?/, '/'));
        return;
      }
      if (h === '#home' || !h) {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to quickly open Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState(null, '', path);
    } catch {
      // Fallback for strict iframe environments
      window.location.hash = path;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin' || window.location.hash === '#portal') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const handleScrollToForm = () => {
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById('availability-form');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const input = el.querySelector('input');
          if (input) setTimeout(() => input.focus(), 300);
        }
      }, 150);
      return;
    }

    const el = document.getElementById('availability-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = el.querySelector('input');
      if (input) {
        setTimeout(() => input.focus(), 300);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNavScroll = (href: string) => {
    if (currentPath !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-[#183b6b] selection:text-white">
      {/* 1. Header with Multi-Page Navigation */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onCheckAvailabilityClick={handleScrollToForm}
      />

      {/* Main Content Areas */}
      <main id="main-content" className="flex-grow">
        {currentPath === '/providers' ? (
          <ProvidersPage onCheckAvailabilityClick={handleScrollToForm} onNavigate={navigate} />
        ) : currentPath === '/bill-help' ? (
          <BillHelpPage onCheckAvailabilityClick={handleScrollToForm} />
        ) : currentPath === '/contact' ? (
          <ContactPage />
        ) : currentPath === '/privacy' ? (
          <PrivacyPage />
        ) : currentPath === '/terms' ? (
          <TermsPage />
        ) : currentPath === '/disclaimer' ? (
          <DisclaimerPage />
        ) : (
          /* Home Page */
          <>
            {/* 2. Hero Section with Lead Capture & Availability Checker */}
            <Hero />

            {/* 3. How It Works */}
            <HowItWorks />

            {/* 4. Why Cable Internet Plans */}
            <WhyChooseUs />

            {/* 5. Internet Service Options We Compare */}
            <TechOptionsSection onCheckAvailabilityClick={handleScrollToForm} />

            {/* 6. Popular Packages */}
            <Plans onCheckAvailabilityClick={handleScrollToForm} />

            {/* 7. Bill-Lowering Help */}
            <BillLoweringSection />

            {/* 8. Support Use Cases */}
            <SupportCasesSection onCheckAvailabilityClick={handleScrollToForm} />

            {/* 9. FAQ */}
            <FAQ />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPolicy={(type) => setModalType(type)}
        onNavScroll={handleNavScroll}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={navigate}
      />

      {/* Legal & Policy Modal */}
      <PolicyModal type={modalType} onClose={() => setModalType(null)} />

      {/* Private Admin Panel for Owner Only */}
      <AdminPanel isOpen={isAdminOpen} onClose={handleCloseAdmin} />
    </div>
  );
}
