import React, { useState } from 'react';
import { 
  X, 
  Code2, 
  Copy, 
  Check, 
  Play, 
  Terminal, 
  Sparkles,
  Key
} from 'lucide-react';
import { copyToClipboard } from '../utils/urlShortener';

interface ApiDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiDocsModal: React.FC<ApiDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copied, setCopied] = useState(false);
  const [apiOutput, setApiOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const codeSnippets = {
    curl: `curl -X POST https://api.nexurl.com/v1/create \\
  -H "Authorization: Bearer nex_live_79a2c89fe3108" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/very-long-url-campaign",
    "domain": "nexurl.com",
    "alias": "special-offer"
  }'`,
    js: `const response = await fetch('https://api.nexurl.com/v1/create', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer nex_live_79a2c89fe3108',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/very-long-url-campaign',
    domain: 'nexurl.com',
    alias: 'special-offer'
  })
});

const data = await response.json();
console.log(data.data.shortUrl); // https://nexurl.com/special-offer`,
    python: `import requests

url = "https://api.nexurl.com/v1/create"
headers = {
    "Authorization": "Bearer nex_live_79a2c89fe3108",
    "Content-Type": "application/json"
}
payload = {
    "url": "https://example.com/very-long-url-campaign",
    "domain": "nexurl.com",
    "alias": "special-offer"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json()["data"]["shortUrl"])`
  };

  const handleCopyCode = async () => {
    const ok = await copyToClipboard(codeSnippets[activeTab], false);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRunTest = () => {
    setIsRunning(true);
    setTimeout(() => {
      setApiOutput(JSON.stringify({
        status: 200,
        success: true,
        data: {
          id: "link_api_live_" + Math.random().toString(36).substring(2, 7),
          shortUrl: "https://nexurl.com/special-offer",
          originalUrl: "https://example.com/very-long-url-campaign",
          domain: "nexurl.com",
          alias: "special-offer",
          clicks: 0,
          createdAt: new Date().toISOString(),
          qrCodeUrl: "https://api.nexurl.com/v1/qr/special-offer.svg",
          analyticsUrl: "https://nexurl.com/stats/special-offer"
        }
      }, null, 2));
      setIsRunning(false);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-scaleUp flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Developer REST API</h3>
              <p className="text-xs text-slate-500 font-medium">Programmatically shorten and manage URLs</p>
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* API Key box */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Demo API Token:</span>
              <code className="text-xs font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                nex_live_79a2c89fe3108
              </code>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active • 1,000 req/min
            </span>
          </div>

          {/* Code Tabs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                <button
                  onClick={() => setActiveTab('curl')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${activeTab === 'curl' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  cURL
                </button>
                <button
                  onClick={() => setActiveTab('js')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${activeTab === 'js' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  JavaScript
                </button>
                <button
                  onClick={() => setActiveTab('python')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition ${activeTab === 'python' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Python
                </button>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Block */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 overflow-x-auto text-xs font-mono shadow-inner border border-slate-800">
              <pre>{codeSnippets[activeTab]}</pre>
            </div>
          </div>

          {/* Interactive Playground Runner */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-600" />
                Live API Response Preview
              </span>
              <button
                onClick={handleRunTest}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00b997] hover:bg-[#00a384] text-slate-950 rounded-lg text-xs font-bold shadow-xs transition"
              >
                {isRunning ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                )}
                <span>Test Request</span>
              </button>
            </div>

            {apiOutput ? (
              <div className="bg-slate-950 text-emerald-400 p-4 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800">
                <pre>{apiOutput}</pre>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 text-center font-medium">
                Click "Test Request" to execute a live simulated API call and view the response payload.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Full documentation available at <span className="font-semibold text-slate-700">docs.nexurl.com</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
