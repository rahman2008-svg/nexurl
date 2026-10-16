import React, { useState } from 'react';
import { 
  Link2, 
  Send, 
  Check, 
  ShieldCheck, 
  Heart, 
  ExternalLink 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#041424] text-slate-300 border-t border-slate-800">
      
      {/* Top Newsletter & Value Strip */}
      <div className="border-b border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center lg:text-left">
              <h3 className="text-xl font-bold text-white">
                Stay updated with link management strategies
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Get monthly insights on CTR optimization, branded domains, and marketing analytics.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-500 outline-none focus:border-[#00d2ad]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 font-bold text-xs sm:text-sm rounded-xl shrink-0 transition flex items-center gap-1.5 shadow-md"
              >
                {subscribed ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Subscribe</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand Info Column */}
          <div className="col-span-2 space-y-4">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00a887] to-[#00d2ad] flex items-center justify-center text-slate-950 font-black shadow-lg">
                <Link2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex items-center tracking-tight">
                <span className="text-2xl font-black text-white">nex</span>
                <span className="text-2xl font-black text-[#00d2ad]">URL</span>
              </div>
            </a>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              The original URL shortener. Simplifying the Internet through the power of clean, memorable, and trackable links since 2002.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Type II Certified • 99.99% Global Uptime</span>
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">URL Shortener</a></li>
              <li><a href="#features" className="hover:text-white transition">Custom Aliases</a></li>
              <li><a href="#features" className="hover:text-white transition">Branded Domains</a></li>
              <li><a href="#features" className="hover:text-white transition">Dynamic QR Codes</a></li>
              <li><a href="#features" className="hover:text-white transition">Real-Time Analytics</a></li>
              <li><a href="#" className="hover:text-white transition">Bulk Shortener</a></li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Solutions
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">Social Media Creators</a></li>
              <li><a href="#" className="hover:text-white transition">Digital Marketers</a></li>
              <li><a href="#" className="hover:text-white transition">Small & Local Business</a></li>
              <li><a href="#" className="hover:text-white transition">Software Developers</a></li>
              <li><a href="#" className="hover:text-white transition">Customer Support Teams</a></li>
              <li><a href="#pricing" className="hover:text-white transition">Enterprise Scalability</a></li>
            </ul>
          </div>

          {/* Resources & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Resources & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#" className="hover:text-white transition">REST API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition">System Status (99.99%)</a></li>
              <li><a href="#faq" className="hover:text-white transition">Help Center & FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Security & Trust</a></li>
            </ul>
          </div>

        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 bg-[#030e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2002–2026 NexURL, Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition">Terms</a>
            <a href="#" className="hover:text-slate-300 transition">Acceptable Use</a>
            <a href="#" className="hover:text-slate-300 transition">Cookie Preferences</a>
          </div>
        </div>
      </div>

    </footer>
  );
};
