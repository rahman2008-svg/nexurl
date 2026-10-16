import React, { useState } from 'react';
import { 
  Link2, 
  Sparkles, 
  BarChart3, 
  QrCode, 
  Globe, 
  ShieldCheck, 
  Code2, 
  ArrowRight, 
  Check, 
  Copy,
  Zap,
  MousePointerClick
} from 'lucide-react';
import { copyToClipboard } from '../utils/urlShortener';

export const FeaturesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'branding' | 'analytics' | 'qrcodes' | 'security'>('branding');
  const [copiedSample, setCopiedSample] = useState(false);

  const sampleLong = 'https://store.acmebrand.com/products/summer-apparel/collection-2026?utm_source=twitter&utm_medium=social&utm_campaign=flash_sale_q3&ref=influencer_98231';
  const sampleShort = 'https://nex.link/summer-sale';

  const handleCopySample = async () => {
    const ok = await copyToClipboard(sampleShort, true);
    if (ok) {
      setCopiedSample(true);
      setTimeout(() => setCopiedSample(false), 2000);
    }
  };

  return (
    <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Sparkles className="w-3.5 h-3.5 text-[#00a887]" />
            <span>Built For Performance & Scale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            More than just short links. A complete link management platform.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From single custom aliases to millions of API redirects, NexURL powers links that inspire confidence, boost engagement, and deliver measurable results.
          </p>
        </div>

        {/* Interactive Link Transformation Preview Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-xl max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00a887] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Interactive Comparison
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
              Transform Cumbersome URLs into Clickable Assets
            </h3>
          </div>

          <div className="space-y-4">
            {/* Cluttered Old Link */}
            <div className="p-4 bg-slate-50 border border-rose-200 rounded-xl space-y-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Messy, intimidating original link (148 chars)
                </span>
                <span className="text-slate-400 font-normal">Low CTR • Hard to read</span>
              </div>
              <p className="text-xs sm:text-sm font-mono text-slate-500 truncate select-all">
                {sampleLong}
              </p>
            </div>

            {/* Down arrow indicator */}
            <div className="flex justify-center -my-1 text-slate-400">
              <div className="w-8 h-8 rounded-full bg-[#00b997] text-slate-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
                ↓
              </div>
            </div>

            {/* Clean NexURL Short Link */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#061d33] via-[#092645] to-[#061d33] text-white rounded-xl shadow-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00d2ad]" />
                  <span className="text-xs font-bold text-[#00d2ad]">
                    NexURL Branded Alias (28 chars)
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-[#00d2ad] px-2 py-0.5 rounded-full border border-emerald-500/30">
                    +34% Higher Click-Through
                  </span>
                </div>
                <p className="text-lg sm:text-xl font-bold font-mono text-white tracking-tight">
                  {sampleShort}
                </p>
              </div>

              <button
                onClick={handleCopySample}
                className="self-start sm:self-center px-4 py-2.5 bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition"
              >
                {copiedSample ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSample ? 'Copied to Clipboard' : 'Copy Example'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 6 Core Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#00a887] border border-emerald-100 flex items-center justify-center">
              <Link2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Custom Aliases & Domains
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Ditch random strings of letters. Claim memorable custom aliases like <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">nexurl.com/event</code> or connect your own brand domain for maximum trust.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Instant availability check
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" /> Free custom alias on all links
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Real-Time Click Analytics
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Track performance at a glance. Uncover your audience's referral channels, device types, geolocations, and peak engagement times with interactive charts.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Referrers & Device breakdowns
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-blue-600" /> Geographic country insights
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <QrCode className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Dynamic QR Code Studio
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bridge the physical and digital divide. Every link comes with a vector-sharp QR code ready for print materials, packaging, brochures, and digital displays.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600" /> Customizable colors & theme presets
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-600" /> High-res PNG & vector SVG downloads
              </li>
            </ul>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <Zap className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Link Editing & Redirection
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Made a typo or need to update a seasonal landing page? Change the target destination anytime without breaking printed marketing collateral or existing posts.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600" /> Zero link expiration on free links
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600" /> Instant destination updates
              </li>
            </ul>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
              <Globe className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Global Edge CDN Reliability
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Hosted on distributed edge servers worldwide. Your visitors experience blazing-fast sub-40ms redirect speeds with 99.99% enterprise uptime guaranteed.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-sky-600" /> Distributed DNS across 6 continents
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-sky-600" /> Automated DDoS & fraud protection
              </li>
            </ul>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-lg hover:border-slate-300 transition space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 border border-slate-200 flex items-center justify-center">
              <Code2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Developer-First REST API
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Automate link creation inside your SaaS, marketing stack, or internal tools. Standard JSON responses, webhooks, and generous rate limits for high volumes.
            </p>
            <ul className="text-xs font-semibold text-slate-600 space-y-2 pt-2 border-t border-slate-100">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-slate-700" /> cURL, Node.js, and Python SDKs
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-slate-700" /> Bulk shortener endpoint supported
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
