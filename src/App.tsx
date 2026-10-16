/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroShortener } from './components/HeroShortener';
import { LinkHistory } from './components/LinkHistory';
import { QRCodeModal } from './components/QRCodeModal';
import { AnalyticsModal } from './components/AnalyticsModal';
import { BulkShortenerModal } from './components/BulkShortenerModal';
import { RedirectSimulationModal } from './components/RedirectSimulationModal';
import { ApiDocsModal } from './components/ApiDocsModal';
import { AuthModal } from './components/AuthModal';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';

import { ShortLink, UserProfile } from './types';
import { 
  getStoredLinks, 
  saveStoredLinks, 
  recordClick 
} from './utils/urlShortener';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

const USER_STORAGE_KEY = 'nexurl_user_profile_v1';

export default function App() {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [user, setUser] = useState<UserProfile>({
    isLoggedIn: false,
    name: 'Guest',
    email: '',
    plan: 'Free'
  });

  // Modals state
  const [isMyUrlsOpen, setIsMyUrlsOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin'
  });
  const [qrModalLink, setQrModalLink] = useState<ShortLink | null>(null);
  const [analyticsModalLink, setAnalyticsModalLink] = useState<ShortLink | null>(null);
  const [redirectLink, setRedirectLink] = useState<ShortLink | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Load initial data
  useEffect(() => {
    const loaded = getStoredLinks();
    setLinks(loaded);

    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Use default
    }
  }, []);

  const handleLinkCreated = (newLink: ShortLink) => {
    const updated = [newLink, ...links.filter(l => l.id !== newLink.id)];
    setLinks(updated);
    saveStoredLinks(updated);
    showToast(`Created ${newLink.shortUrl}`);
  };

  const handleBulkCreated = (newLinks: ShortLink[]) => {
    const updated = [...newLinks, ...links];
    setLinks(updated);
    saveStoredLinks(updated);
    showToast(`Created ${newLinks.length} bulk short links`);
  };

  const handleDeleteLink = (linkId: string) => {
    const updated = links.filter(l => l.id !== linkId);
    setLinks(updated);
    saveStoredLinks(updated);
    showToast('Link removed from history');
  };

  const handleUpdateLinkDestination = (linkId: string, newUrl: string) => {
    const updated = links.map(l => {
      if (l.id === linkId) {
        return { ...l, originalUrl: newUrl };
      }
      return l;
    });
    setLinks(updated);
    saveStoredLinks(updated);
    showToast('Destination URL updated successfully');
  };

  const handleTestRedirect = (link: ShortLink) => {
    // Register click event
    const updated = recordClick(link.id, 'Test / Direct');
    if (updated) {
      setLinks(prev => prev.map(l => l.id === updated.id ? updated : l));
    }
    setRedirectLink(link);
  };

  const handleProceedRedirect = (destinationUrl: string) => {
    // Click has already been logged
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
    showToast(`Welcome back, ${profile.name}!`);
  };

  const handleLogout = () => {
    const guestUser: UserProfile = {
      isLoggedIn: false,
      name: 'Guest',
      email: '',
      plan: 'Free'
    };
    setUser(guestUser);
    localStorage.removeItem(USER_STORAGE_KEY);
    showToast('Logged out of NexURL');
  };

  const handleSelectPlan = (planName: 'Free' | 'Pro' | 'Bulk 50K' | 'Enterprise') => {
    if (!user.isLoggedIn) {
      setAuthModal({ isOpen: true, mode: 'signup' });
      return;
    }
    const updatedUser: UserProfile = {
      ...user,
      plan: planName
    };
    setUser(updatedUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
    showToast(`Plan updated to ${planName}!`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 animate-slideUp text-xs font-semibold">
          <Sparkles className="w-4 h-4 text-[#00d2ad]" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)} 
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenMyUrls={() => setIsMyUrlsOpen(true)}
        onOpenBulk={() => setIsBulkOpen(true)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        user={user}
        onLogout={handleLogout}
        savedLinksCount={links.length}
      />

      {/* Hero Shortener (The Core Experience) */}
      <main className="flex-1">
        <HeroShortener
          onLinkCreated={handleLinkCreated}
          onOpenQrModal={(link) => setQrModalLink(link)}
          onOpenAnalyticsModal={(link) => setAnalyticsModalLink(link)}
          onTestRedirect={handleTestRedirect}
          savedLinks={links}
        />

        {/* Features & Marketing */}
        <FeaturesSection />

        {/* Pricing Tiers */}
        <PricingSection
          onSelectPlan={handleSelectPlan}
          user={user}
        />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <LinkHistory
        isOpen={isMyUrlsOpen}
        onClose={() => setIsMyUrlsOpen(false)}
        links={links}
        onOpenQrModal={(link) => setQrModalLink(link)}
        onOpenAnalyticsModal={(link) => setAnalyticsModalLink(link)}
        onTestRedirect={handleTestRedirect}
        onDeleteLink={handleDeleteLink}
        onUpdateLinkDestination={handleUpdateLinkDestination}
      />

      <QRCodeModal
        link={qrModalLink}
        onClose={() => setQrModalLink(null)}
      />

      <AnalyticsModal
        link={analyticsModalLink}
        onClose={() => setAnalyticsModalLink(null)}
      />

      <BulkShortenerModal
        isOpen={isBulkOpen}
        onClose={() => setIsBulkOpen(false)}
        onBulkCreated={handleBulkCreated}
      />

      <RedirectSimulationModal
        link={redirectLink}
        onClose={() => setRedirectLink(null)}
        onProceed={handleProceedRedirect}
      />

      <ApiDocsModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ isOpen: false, mode: 'signin' })}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}
