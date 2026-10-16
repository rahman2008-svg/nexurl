import React, { useState, useEffect } from 'react';
import { ShortLink } from '../types';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Printer, 
  ExternalLink,
  QrCode as QrIcon,
  Sparkles
} from 'lucide-react';
import { generateQrCodeDataUrl, generateQrCodeSvg, copyToClipboard } from '../utils/urlShortener';

interface QRCodeModalProps {
  link: ShortLink | null;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: 'Navy (Default)', dark: '#061d33', light: '#ffffff' },
  { name: 'Emerald Teal', dark: '#00a887', light: '#ffffff' },
  { name: 'Royal Blue', dark: '#1d4ed8', light: '#ffffff' },
  { name: 'Midnight Violet', dark: '#4c1d95', light: '#ffffff' },
  { name: 'Classic Black', dark: '#000000', light: '#ffffff' },
  { name: 'Dark Mode (Inverted)', dark: '#ffffff', light: '#061d33' }
];

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ link, onClose }) => {
  const [selectedColor, setSelectedColor] = useState(COLOR_PRESETS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (!link) return;
    setIsGenerating(true);
    generateQrCodeDataUrl(link.shortUrl, selectedColor.dark, selectedColor.light)
      .then((url) => {
        setQrDataUrl(url);
        setIsGenerating(false);
      })
      .catch(() => setIsGenerating(false));
  }, [link, selectedColor]);

  if (!link) return null;

  const downloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `nexurl_${link.alias}_qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadSvg = async () => {
    const svgStr = await generateQrCodeSvg(link.shortUrl, selectedColor.dark, selectedColor.light);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexurl_${link.alias}_qr.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = async () => {
    const ok = await copyToClipboard(link.shortUrl, true);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>NexURL QR Code - ${link.alias}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
            .card { text-align: center; border: 2px solid #e2e8f0; padding: 32px; border-radius: 16px; max-width: 400px; }
            img { width: 280px; height: 280px; }
            h2 { margin: 16px 0 8px; color: #061d33; }
            p { color: #64748b; font-size: 14px; word-break: break-all; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Scan to Visit</h2>
            <img src="${qrDataUrl}" />
            <p><strong>${link.shortUrl}</strong></p>
          </div>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-[#00d2ad] flex items-center justify-center font-bold">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Dynamic QR Code</h3>
              <p className="text-xs text-slate-500 font-medium">Scannable on all mobile cameras</p>
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

        {/* QR Code Preview Frame */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-50/50">
          <div 
            className="p-4 rounded-2xl shadow-lg border border-slate-200/80 transition-all duration-300 flex items-center justify-center"
            style={{ backgroundColor: selectedColor.light }}
          >
            {isGenerating ? (
              <div className="w-56 h-56 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR code for ${link.shortUrl}`}
                className="w-56 h-56 object-contain rounded-lg"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="mt-4 text-center max-w-xs">
            <p className="text-sm font-bold font-mono text-slate-900 truncate">
              {link.shortUrl}
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5 font-mono">
              → {link.originalUrl}
            </p>
          </div>
        </div>

        {/* Color Palette Presets */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[#00a887]" />
              Color Theme:
            </span>
            <span className="text-slate-400 font-normal">{selectedColor.name}</span>
          </div>

          <div className="flex items-center gap-2">
            {COLOR_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColor(preset)}
                className={`w-8 h-8 rounded-full border-2 transition-transform ${
                  selectedColor.name === preset.name ? 'scale-110 border-slate-900 shadow-sm' : 'border-slate-200 hover:scale-105'
                }`}
                style={{ backgroundColor: preset.dark }}
                title={preset.name}
              />
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={downloadPng}
              className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PNG</span>
            </button>

            <button
              onClick={downloadSvg}
              className="py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download SVG</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopyLink}
              className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Ready</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
