import React, { useState } from 'react';
import { 
  Link2, 
  Menu, 
  X, 
  Layers, 
  Zap, 
  BarChart2, 
  Code2, 
  User, 
  LogOut, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  onOpenMyUrls: () => void;
  onOpenBulk: () => void;
  onOpenApiDocs: () => void;
  onOpenAuth: (mode: 'signin' | 'signup') => void;
  user: UserProfile;
  onLogout: () => void;
  savedLinksCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMyUrls,
  onOpenBulk,
  onOpenApiDocs,
  onOpenAuth,
  user,
  onLogout,
  savedLinksCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#061d33] border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2.5 group focus:outline-none">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00a887] to-[#00d2ad] flex items-center justify-center text-white shadow-lg shadow-emerald-950/40 group-hover:scale-105 transition-transform duration-200">
                <Link2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight">
                  <span className="text-2xl font-black text-white">nex</span>
                  <span className="text-2xl font-black text-[#00d2ad]">URL</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase -mt-1">
                  URL Shortener
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <button
                onClick={onOpenMyUrls}
                className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <Layers className="w-4 h-4 text-[#00d2ad]" />
                <span>My URLs</span>
                {savedLinksCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-[#00d2ad] rounded-full border border-emerald-500/30">
                    {savedLinksCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => scrollToSection('features')}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <span>Features</span>
              </button>

              <button
                onClick={() => scrollToSection('pricing')}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <span>Plans & Pricing</span>
              </button>

              <button
                onClick={onOpenBulk}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Bulk Shortener</span>
              </button>

              <button
                onClick={onOpenApiDocs}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                <Code2 className="w-4 h-4 text-sky-400" />
                <span>API & Docs</span>
              </button>

              <button
                onClick={() => scrollToSection('faq')}
                className="px-3 py-2 text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700/80 rounded-full border border-slate-700 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-[#00d2ad] text-slate-900 font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                    <span className="text-[10px] text-[#00d2ad] font-bold uppercase">{user.plan} Plan</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-[#00d2ad]/20 text-[#00d2ad] rounded-full border border-[#00d2ad]/30">
                        {user.plan} Member
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenMyUrls();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-[#00d2ad]" />
                      My Saved Links ({savedLinksCount})
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        scrollToSection('pricing');
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Manage Subscription
                    </button>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-slate-800 flex items-center gap-2 border-t border-slate-800"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  Log In
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="px-4 py-2 text-sm font-bold bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 rounded-lg shadow-sm hover:shadow-emerald-500/20 transition duration-150 transform active:scale-95"
                >
                  Sign Up Free
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenMyUrls}
              className="p-2 text-slate-300 hover:text-white relative"
              title="My URLs"
            >
              <Layers className="w-5 h-5 text-[#00d2ad]" />
              {savedLinksCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#00b997] text-slate-950 font-bold text-[10px] rounded-full flex items-center justify-center">
                  {savedLinksCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a2745] border-t border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenMyUrls();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-slate-200 bg-slate-800/80 rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-5 h-5 text-[#00d2ad]" />
              <span>My URLs</span>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-500/20 text-[#00d2ad] rounded-full">
              {savedLinksCount} links
            </span>
          </button>

          <button
            onClick={() => scrollToSection('features')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:text-white rounded-lg"
          >
            Features
          </button>

          <button
            onClick={() => scrollToSection('pricing')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:text-white rounded-lg"
          >
            Plans & Pricing
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenBulk();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-200 hover:text-white rounded-lg"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Bulk Shortener</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenApiDocs();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-200 hover:text-white rounded-lg"
          >
            <Code2 className="w-4 h-4 text-sky-400" />
            <span>API & Docs</span>
          </button>

          <button
            onClick={() => scrollToSection('faq')}
            className="w-full text-left px-3 py-2 text-base font-medium text-slate-200 hover:text-white rounded-lg"
          >
            FAQ
          </button>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {user.isLoggedIn ? (
              <div className="p-3 bg-slate-900 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-white">{user.name}</span>
                  <span className="text-xs font-bold text-[#00d2ad]">{user.plan} Plan</span>
                </div>
                <button
                  onClick={onLogout}
                  className="w-full py-2 text-xs font-semibold text-rose-400 bg-rose-500/10 rounded border border-rose-500/20"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signin');
                  }}
                  className="py-2.5 text-center text-sm font-semibold text-slate-200 bg-slate-800 rounded-lg"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="py-2.5 text-center text-sm font-bold bg-[#00b997] text-slate-950 rounded-lg"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
