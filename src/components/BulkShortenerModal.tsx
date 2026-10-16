import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Copy, 
  Check, 
  Download, 
  RotateCcw,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { ShortLink } from '../types';
import { 
  AVAILABLE_DOMAINS, 
  isValidUrl, 
  normalizeUrl, 
  generateRandomAlias, 
  generateQrCodeDataUrl, 
  copyToClipboard, 
  exportLinksToCsv 
} from '../utils/urlShortener';

interface BulkShortenerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBulkCreated: (links: ShortLink[]) => void;
}

export const BulkShortenerModal: React.FC<BulkShortenerModalProps> = ({
  isOpen,
  onClose,
  onBulkCreated
}) => {
  const [inputText, setInputText] = useState('');
  const [domain, setDomain] = useState(AVAILABLE_DOMAINS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ShortLink[]>([]);
  const [allCopied, setAllCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcessBulk = async () => {
    setError(null);
    const lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (lines.length === 0) {
      setError('Please paste at least one valid URL.');
      return;
    }

    if (lines.length > 25) {
      setError('Free tier limit: maximum 25 URLs at once. For 50,000+ links, check our Bulk 50K Plan.');
      return;
    }

    setIsProcessing(true);

    const generated: ShortLink[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (!isValidUrl(line)) continue;

      const finalUrl = normalizeUrl(line);
      const alias = generateRandomAlias(6);
      const shortUrl = `https://${domain}/${alias}`;
      const qrDataUrl = await generateQrCodeDataUrl(shortUrl);

      generated.push({
        id: 'bulk_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 5),
        originalUrl: finalUrl,
        shortUrl,
        domain,
        alias,
        createdAt: new Date().toISOString(),
        clicks: 0,
        qrCodeDataUrl: qrDataUrl,
        isCustomAlias: false,
        clickHistory: []
      });
    }

    setTimeout(() => {
      setResults(generated);
      onBulkCreated(generated);
      setIsProcessing(false);
    }, 600);
  };

  const handleCopyAll = async () => {
    if (results.length === 0) return;
    const text = results.map(r => `${r.shortUrl} -> ${r.originalUrl}`).join('\n');
    const ok = await copyToClipboard(text, true);
    if (ok) {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    }
  };

  const reset = () => {
    setResults([]);
    setInputText('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Bulk URL Shortener</h3>
              <p className="text-xs text-slate-500 font-medium">Shorten up to 25 URLs in a single click</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {results.length === 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Paste URLs (one URL per line):
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Domain:</span>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1"
                  >
                    {AVAILABLE_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError(null);
                }}
                rows={7}
                placeholder={`https://example.com/blog/2026-strategy-update\nhttps://youtube.com/watch?v=sample123\nhttps://github.com/my-awesome-repo`}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00b997] focus:bg-white transition"
              />

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleProcessBulk}
                disabled={isProcessing}
                className="w-full py-3.5 bg-[#00b997] hover:bg-[#00a384] text-slate-950 font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    <span>Processing links...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Shorten All Links</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800">
                <span className="text-xs font-bold">
                  ✓ Successfully generated {results.length} short URLs!
                </span>
                <button
                  onClick={reset}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 underline"
                >
                  <RotateCcw className="w-3 h-3" /> Shorten More
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Short URL</th>
                      <th className="p-3">Original Destination</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {results.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#008f73] whitespace-nowrap">
                          {r.shortUrl}
                        </td>
                        <td className="p-3 text-slate-500 truncate max-w-xs">
                          {r.originalUrl}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          <button
                            onClick={() => copyToClipboard(r.shortUrl, true)}
                            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-sans font-semibold"
                          >
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyAll}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  {allCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{allCopied ? 'All Links Copied!' : 'Copy All Links'}</span>
                </button>

                <button
                  onClick={() => exportLinksToCsv(results)}
                  className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
