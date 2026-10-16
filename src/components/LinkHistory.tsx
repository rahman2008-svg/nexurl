import React, { useState } from 'react';
import { 
  ShortLink 
} from '../types';
import { 
  Search, 
  Copy, 
  Check, 
  QrCode, 
  BarChart2, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Download, 
  Layers, 
  Calendar, 
  MousePointerClick,
  X,
  Plus
} from 'lucide-react';
import { copyToClipboard, exportLinksToCsv } from '../utils/urlShortener';

interface LinkHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  links: ShortLink[];
  onOpenQrModal: (link: ShortLink) => void;
  onOpenAnalyticsModal: (link: ShortLink) => void;
  onTestRedirect: (link: ShortLink) => void;
  onDeleteLink: (linkId: string) => void;
  onUpdateLinkDestination: (linkId: string, newUrl: string) => void;
}

export const LinkHistory: React.FC<LinkHistoryProps> = ({
  isOpen,
  onClose,
  links,
  onOpenQrModal,
  onOpenAnalyticsModal,
  onTestRedirect,
  onDeleteLink,
  onUpdateLinkDestination
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editUrlValue, setEditUrlValue] = useState('');

  if (!isOpen) return null;

  const filteredLinks = links.filter(l => 
    l.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (l.title && l.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
    l.alias.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = async (id: string, text: string) => {
    const ok = await copyToClipboard(text, true);
    if (ok) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const startEditing = (link: ShortLink) => {
    setEditingLinkId(link.id);
    setEditUrlValue(link.originalUrl);
  };

  const saveEdit = (linkId: string) => {
    if (editUrlValue.trim()) {
      onUpdateLinkDestination(linkId, editUrlValue.trim());
    }
    setEditingLinkId(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-slideLeft border-l border-slate-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-[#00d2ad] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">My Saved URLs</h2>
              <p className="text-xs text-slate-500 font-medium">
                Manage, edit, and track your {links.length} shortened links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportLinksToCsv(links)}
              className="p-2 sm:px-3 sm:py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 shadow-xs transition"
              title="Export to CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by alias, original URL or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#00b997] focus:bg-white transition"
            />
          </div>
        </div>

        {/* Links List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredLinks.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">No links found</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {searchQuery ? `No results match "${searchQuery}"` : "You haven't shortened any links yet."}
              </p>
            </div>
          ) : (
            filteredLinks.map((link) => (
              <div 
                key={link.id}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition space-y-3"
              >
                {/* Top Row: Short URL + Copy & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    {link.title && (
                      <span className="text-xs font-bold text-slate-900 block truncate max-w-sm">
                        {link.title}
                      </span>
                    )}
                    <a
                      href={link.shortUrl}
                      onClick={(e) => {
                        e.preventDefault();
                        onTestRedirect(link);
                      }}
                      className="text-base font-bold font-mono text-[#008f73] hover:underline flex items-center gap-1.5"
                    >
                      <span>{link.shortUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(link.id, link.shortUrl)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition ${
                        copiedId === link.id
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {copiedId === link.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === link.id ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => onOpenQrModal(link)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="View QR Code"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onOpenAnalyticsModal(link)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="View Analytics"
                    >
                      <BarChart2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => startEditing(link)}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                      title="Edit Destination URL"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteLink(link.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Original URL or Edit Mode */}
                {editingLinkId === link.id ? (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <label className="text-[11px] font-bold text-slate-700 block">
                      Edit Destination URL:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editUrlValue}
                        onChange={(e) => setEditUrlValue(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-mono"
                      />
                      <button
                        onClick={() => saveEdit(link.id)}
                        className="px-3 py-1.5 bg-[#00b997] text-slate-950 font-bold text-xs rounded-lg hover:bg-[#00a384]"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingLinkId(null)}
                        className="px-2.5 py-1.5 bg-slate-100 text-slate-700 font-medium text-xs rounded-lg hover:bg-slate-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 truncate font-mono bg-slate-50 px-2.5 py-1.5 rounded border border-slate-100">
                    <span className="font-semibold text-slate-400 mr-1.5">Destination:</span>
                    {link.originalUrl}
                  </div>
                )}

                {/* Stats & Meta Footer */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-slate-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-emerald-800 border border-emerald-100">
                      <MousePointerClick className="w-3.5 h-3.5 text-[#00a887]" />
                      {link.clicks} clicks
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(link.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {link.isCustomAlias ? 'Custom Alias' : 'Random Slug'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Bottom Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredLinks.length} of {links.length} links
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
