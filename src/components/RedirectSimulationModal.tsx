import React, { useEffect, useState } from 'react';
import { ShortLink } from '../types';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle, 
  Copy, 
  Clock, 
  Server,
  Zap
} from 'lucide-react';
import { copyToClipboard } from '../utils/urlShortener';

interface RedirectSimulationModalProps {
  link: ShortLink | null;
  onClose: () => void;
  onProceed: (destinationUrl: string) => void;
}

export const RedirectSimulationModal: React.FC<RedirectSimulationModalProps> = ({
  link,
  onClose,
  onProceed
}) => {
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);

  useEffect(() => {
    if (!link) return;
    setCountdown(3);
    setIsAutoRedirecting(false);
  }, [link]);

  if (!link) return null;

  const handleCopyDestination = async () => {
    const ok = await copyToClipboard(link.originalUrl, false);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenNow = () => {
    onProceed(link.originalUrl);
    window.open(link.originalUrl, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#061d33] to-[#0a2745] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00d2ad] text-slate-950 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 fill-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">NexURL Redirection Gateway</h3>
              <p className="text-[11px] text-slate-300">HTTP 301 Moved Permanently</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Security badge */}
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Verified Safe Link • No phishing or malware detected</span>
          </div>

          {/* Route path visual */}
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Requested Short URL</span>
                <span className="text-[#00a887]">200 OK</span>
              </div>
              <p className="text-sm font-mono font-bold text-slate-900 truncate">
                {link.shortUrl}
              </p>
            </div>

            <div className="flex justify-center text-slate-400">
              <div className="flex items-center gap-2 text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                <Server className="w-3.5 h-3.5 text-[#00a887]" />
                <span>Redirecting via Global Edge CDN (~28ms)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Target Destination URL</span>
                <button
                  onClick={handleCopyDestination}
                  className="text-slate-500 hover:text-slate-800 flex items-center gap-1 normal-case font-semibold"
                >
                  {copied ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-mono font-medium text-slate-700 break-all bg-white p-2 rounded border border-slate-200">
                {link.originalUrl}
              </p>
            </div>
          </div>

          {/* Stats update notice */}
          <div className="text-center text-xs text-slate-500">
            Click will be registered in your <span className="font-semibold text-slate-700">Analytics</span> dashboard.
          </div>

          {/* Action Button */}
          <div className="space-y-2">
            <button
              onClick={handleOpenNow}
              className="w-full py-3.5 px-4 bg-[#00b997] hover:bg-[#00a384] text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>Continue to Destination</span>
              <ExternalLink className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition"
            >
              Stay on NexURL
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
