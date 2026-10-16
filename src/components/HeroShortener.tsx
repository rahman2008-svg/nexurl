import React, { useState } from 'react';
import { 
  Link2, 
  Scissors, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  BarChart2, 
  ExternalLink, 
  Sparkles, 
  ArrowRight, 
  SlidersHorizontal, 
  RotateCcw,
  ShieldCheck,
  Globe2,
  Clock,
  ClipboardPaste,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ShortLink } from '../types';
import { 
  AVAILABLE_DOMAINS, 
  isValidUrl, 
  normalizeUrl, 
  generateRandomAlias, 
  sanitizeAlias, 
  generateQrCodeDataUrl, 
  copyToClipboard 
} from '../utils/urlShortener';

interface HeroShortenerProps {
  onLinkCreated: (link: ShortLink) => void;
  onOpenQrModal: (link: ShortLink) => void;
  onOpenAnalyticsModal: (link: ShortLink) => void;
  onTestRedirect: (link: ShortLink) => void;
  savedLinks: ShortLink[];
}

export const HeroShortener: React.FC<HeroShortenerProps> = ({
  onLinkCreated,
  onOpenQrModal,
  onOpenAnalyticsModal,
  onTestRedirect,
  savedLinks
}) => {
  const [longUrl, setLongUrl] = useState('');
  const [domain, setDomain] = useState(AVAILABLE_DOMAINS[0]);
  const [customAlias, setCustomAlias] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [latestLink, setLatestLink] = useState<ShortLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);

  // Check if alias is taken
  const cleanAlias = sanitizeAlias(customAlias);
  const isAliasTaken = cleanAlias
    ? savedLinks.some(l => l.domain === domain && l.alias.toLowerCase() === cleanAlias.toLowerCase())
    : false;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setLongUrl(text.trim());
        setError(null);
      }
    } catch {
      // Fallback
    }
  };

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!longUrl || longUrl.trim() === '') {
      setError('Please enter a valid URL to shorten.');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    if (customAlias && isAliasTaken) {
      setError(`The alias "${cleanAlias}" is already in use on ${domain}. Please pick another.`);
      return;
    }

    setIsLoading(true);

    try {
      // Build final long URL with UTM tags if provided
      let finalLongUrl = normalizeUrl(longUrl);
      if (utmSource || utmMedium || utmCampaign) {
        const urlObj = new URL(finalLongUrl);
        if (utmSource) urlObj.searchParams.set('utm_source', utmSource.trim());
        if (utmMedium) urlObj.searchParams.set('utm_medium', utmMedium.trim());
        if (utmCampaign) urlObj.searchParams.set('utm_campaign', utmCampaign.trim());
        finalLongUrl = urlObj.toString();
      }

      const aliasToUse = cleanAlias || generateRandomAlias(6);
      const shortUrl = `https://${domain}/${aliasToUse}`;

      // Generate QR Code
      const qrDataUrl = await generateQrCodeDataUrl(shortUrl);

      const newLink: ShortLink = {
        id: 'link_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        originalUrl: finalLongUrl,
        shortUrl,
        domain,
        alias: aliasToUse,
        title: linkTitle.trim() || undefined,
        createdAt: new Date().toISOString(),
        clicks: 0,
        qrCodeDataUrl: qrDataUrl,
        isCustomAlias: Boolean(cleanAlias),
        utmSource: utmSource.trim() || undefined,
        utmMedium: utmMedium.trim() || undefined,
        utmCampaign: utmCampaign.trim() || undefined,
        clickHistory: []
      };

      // Simulated micro-delay for realistic network feel
      setTimeout(() => {
        onLinkCreated(newLink);
        setLatestLink(newLink);
        setIsLoading(false);
      }, 400);

    } catch (err) {
      setIsLoading(false);
      setError('An unexpected error occurred while shortening the link.');
      console.error(err);
    }
  };

  const handleCopy = async (url: string) => {
    const success = await copyToClipboard(url, true);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const resetForNewLink = () => {
    setLatestLink(null);
    setLongUrl('');
    setCustomAlias('');
    setLinkTitle('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setError(null);
    setShowAdvanced(false);
  };

  const shareUrls = (url: string, title: string = 'Check this out!') => ({
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`
  });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#061d33] via-[#092543] to-[#061d33] py-14 lg:py-20 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-[#00d2ad] rounded-full blur-[140px] opacity-20" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-15" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs sm:text-sm font-semibold text-slate-200 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-[#00d2ad] animate-pulse" />
            <span className="text-[#00d2ad]">The Original URL Shortener</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">Simplifying the web since 2002</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Make your URLs <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d2ad] to-[#38bdf8]">shorter</span>, easier to share.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create clean, memorable links in seconds. Customize aliases, generate trackable QR codes, and measure click analytics with zero hassle.
          </p>
        </div>

        {/* Shortener Card */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-black/40 border border-slate-100 p-6 sm:p-8 text-slate-800 transition-all">
          
          {!latestLink ? (
            /* Shortening Form */
            <form onSubmit={handleShorten} className="space-y-6">
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="long-url" className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Shorten a long URL</span>
                    <span className="text-[11px] font-semibold text-[#00a887] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Free & Never Expires
                    </span>
                  </label>
                  {longUrl && (
                    <button
                      type="button"
                      onClick={() => setLongUrl('')}
                      className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400 pointer-events-none">
                    <Link2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    id="long-url"
                    type="text"
                    value={longUrl}
                    onChange={(e) => {
                      setLongUrl(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter long link (e.g. https://example.com/very-long-url-campaign-page)"
                    className="w-full pl-12 pr-28 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-200 focus:border-[#00b997] focus:bg-white rounded-xl text-slate-900 placeholder:text-slate-400 text-sm sm:text-base outline-none transition font-medium shadow-sm"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    className="absolute right-3 px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/80 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition"
                    title="Paste from clipboard"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Paste</span>
                  </button>
                </div>
              </div>

              {/* Customize Your Link Sub-section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <span>Customize your link</span>
                    <span className="text-xs font-normal text-slate-500">(Optional)</span>
                  </label>
                  <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                    Choose a domain and custom alias
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Domain dropdown */}
                  <div className="sm:col-span-5 relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <select
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full pl-10 pr-8 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-800 text-sm font-semibold outline-none focus:border-[#00b997] focus:bg-white transition cursor-pointer appearance-none shadow-sm"
                    >
                      {AVAILABLE_DOMAINS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs font-bold">
                      ▼
                    </div>
                  </div>

                  {/* Slash separator */}
                  <div className="hidden sm:flex sm:col-span-1 justify-center text-xl font-bold text-slate-400">
                    /
                  </div>

                  {/* Alias input */}
                  <div className="sm:col-span-6 relative">
                    <input
                      type="text"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value)}
                      placeholder="Enter alias (e.g. launch2026)"
                      className={`w-full px-4 py-3 bg-slate-50 border-2 ${
                        cleanAlias && isAliasTaken 
                          ? 'border-rose-400 bg-rose-50/40' 
                          : cleanAlias && !isAliasTaken 
                          ? 'border-emerald-500 bg-emerald-50/30' 
                          : 'border-slate-200'
                      } rounded-xl text-slate-800 placeholder:text-slate-400 text-sm font-medium outline-none focus:border-[#00b997] focus:bg-white transition shadow-sm`}
                    />
                    {cleanAlias && !isAliasTaken && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-xs">
                        <Check className="w-3.5 h-3.5" /> Available
                      </span>
                    )}
                    {cleanAlias && isAliasTaken && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-600 flex items-center gap-1 bg-white px-1.5 py-0.5 rounded shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5" /> Taken
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Advanced options accordion toggle */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00a887]" />
                  <span>{showAdvanced ? 'Hide advanced link options' : 'Show advanced link options (UTM tags, Link Title)'}</span>
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Link Title / Description (for your dashboard)
                      </label>
                      <input
                        type="text"
                        value={linkTitle}
                        onChange={(e) => setLinkTitle(e.target.value)}
                        placeholder="e.g. October Product Launch Deck"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#00b997]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          UTM Source
                        </label>
                        <input
                          type="text"
                          value={utmSource}
                          onChange={(e) => setUtmSource(e.target.value)}
                          placeholder="e.g. twitter, newsletter"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#00b997]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          UTM Medium
                        </label>
                        <input
                          type="text"
                          value={utmMedium}
                          onChange={(e) => setUtmMedium(e.target.value)}
                          placeholder="e.g. social, email, cpc"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#00b997]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">
                          UTM Campaign
                        </label>
                        <input
                          type="text"
                          value={utmCampaign}
                          onChange={(e) => setUtmCampaign(e.target.value)}
                          placeholder="e.g. summer_launch"
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none focus:border-[#00b997]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Error notice */}
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm font-semibold flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-[#00b997] hover:bg-[#00a384] active:bg-[#009275] text-slate-950 font-extrabold text-base sm:text-lg rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition duration-150 transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Creating Short Link...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-5 h-5" />
                    <span>Shorten URL</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium">
                  By clicking Shorten URL, you agree to NexURL's <a href="#terms" className="underline hover:text-slate-800">Terms of Service</a> and <a href="#privacy" className="underline hover:text-slate-800">Privacy Policy</a>.
                </p>
              </div>
            </form>
          ) : (
            /* Result State */
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  <span className="text-base sm:text-lg font-bold text-slate-900">
                    Your Short Link is Ready!
                  </span>
                </div>

                <button
                  onClick={resetForNewLink}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#00a887] hover:text-[#008f73] bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Shorten Another</span>
                </button>
              </div>

              {/* Long URL Truncated Display */}
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Original Destination
                </p>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80 truncate">
                  <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate font-mono">{latestLink.originalUrl}</span>
                </div>
              </div>

              {/* Highlighted Short URL Card */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-[#072440] to-slate-900 rounded-xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#00d2ad] uppercase tracking-wider">
                    NexURL Link
                  </span>
                  <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-white select-all break-all">
                    {latestLink.shortUrl}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(latestLink.shortUrl)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all transform active:scale-95 shadow-md ${
                      copied 
                        ? 'bg-emerald-400 text-slate-950 shadow-emerald-400/30' 
                        : 'bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 shadow-emerald-500/20'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  onClick={() => onOpenQrModal(latestLink)}
                  className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition group"
                >
                  <QrCode className="w-4 h-4 text-[#00a887] group-hover:scale-110 transition-transform" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() => onOpenAnalyticsModal(latestLink)}
                  className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition group"
                >
                  <BarChart2 className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span>Analytics</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition group"
                  >
                    <Share2 className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span>Share</span>
                  </button>

                  {shareMenuOpen && (
                    <div className="absolute left-0 bottom-full mb-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-30 space-y-1">
                      <a
                        href={shareUrls(latestLink.shortUrl).twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Share on X / Twitter
                      </a>
                      <a
                        href={shareUrls(latestLink.shortUrl).whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Share on WhatsApp
                      </a>
                      <a
                        href={shareUrls(latestLink.shortUrl).linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Share on LinkedIn
                      </a>
                      <a
                        href={shareUrls(latestLink.shortUrl).email}
                        className="block px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
                      >
                        Share via Email
                      </a>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => onTestRedirect(latestLink)}
                  className="flex items-center justify-center gap-2 p-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs sm:text-sm transition group"
                >
                  <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Test Redirect</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Value Strip Below Hero Card */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-300">
            <ShieldCheck className="w-5 h-5 text-[#00d2ad]" />
            <span className="text-xs sm:text-sm font-semibold">100% Free Custom Alias</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-300">
            <QrCode className="w-5 h-5 text-[#00d2ad]" />
            <span className="text-xs sm:text-sm font-semibold">Instant High-Res QR Code</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-300">
            <Clock className="w-5 h-5 text-[#00d2ad]" />
            <span className="text-xs sm:text-sm font-semibold">Links Never Expire</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-slate-300">
            <BarChart2 className="w-5 h-5 text-[#00d2ad]" />
            <span className="text-xs sm:text-sm font-semibold">Real-Time Click Tracking</span>
          </div>
        </div>

      </div>
    </section>
  );
};
