import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'features' | 'domains' | 'api';
}

const FAQS: FAQItem[] = [
  {
    category: 'general',
    question: 'What is NexURL and how does it work?',
    answer: 'NexURL is a premier URL shortening and link management service. When you submit a long, complicated web address, NexURL generates a clean, compact alias that redirects visitors directly to your target destination using standard HTTP 301/302 redirects. This makes links memorable, easy to share across social media or print, and trackable in real-time.'
  },
  {
    category: 'general',
    question: 'Do my NexURL shortened links ever expire?',
    answer: 'No! All links created on NexURL—including free links—never expire by default. As long as your destination website remains active, your NexURL link will continue to redirect visitors indefinitely. Paid Pro and Bulk subscribers also have the option to set custom expiration dates or click caps if they wish.'
  },
  {
    category: 'features',
    question: 'Can I choose my own custom alias?',
    answer: 'Yes! Custom aliases are 100% free on NexURL. Simply type your desired alias in the "Customize your link" input field before clicking Shorten URL. As long as the alias has not been claimed on that domain, it will be assigned to your link.'
  },
  {
    category: 'features',
    question: 'Can I edit the destination URL after sharing?',
    answer: 'Yes. With NexURL Link Management, you can edit the destination URL of any active link from your "My URLs" dashboard. Your shortened URL and printed QR codes remain unchanged, meaning you never need to reprint brochures or update past social media posts if a page URL changes.'
  },
  {
    category: 'domains',
    question: 'How do custom branded domains work?',
    answer: 'With a Pro or Bulk subscription, you can attach your own custom domain (e.g. yourbrand.link) via standard CNAME DNS records. This allows you to create fully branded short links that reflect your company identity and boost click-through rates by up to 34%.'
  },
  {
    category: 'features',
    question: 'Are QR codes included with every link?',
    answer: 'Yes! Every shortened URL automatically generates a high-resolution dynamic QR code. You can preview, customize colors (e.g. brand theme or inverted dark mode), print, and download vector SVG or raster PNG files directly from the QR Code Studio.'
  },
  {
    category: 'api',
    question: 'Is there a REST API for automated link shortening?',
    answer: 'Yes. NexURL provides a fast, developer-friendly REST API. You can generate API tokens from your dashboard and create, query, and manage links programmatically using cURL, Node.js, Python, PHP, or Go. Standard JSON responses, webhooks, and rate limits up to 10,000 req/min are supported.'
  },
  {
    category: 'features',
    question: 'What kind of analytics and click tracking are available?',
    answer: 'NexURL tracks real-time total clicks, unique visitors, referral sources (Twitter/X, LinkedIn, Google, Direct), device breakdowns (Mobile, Desktop, Tablet), and geographic distribution by country. All metrics are updated in real-time without delay.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFaqs = selectedCategory === 'all'
    ? FAQS
    : FAQS.filter(f => f.category === selectedCategory);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <HelpCircle className="w-3.5 h-3.5 text-[#00a887]" />
            <span>Got Questions? We Have Answers.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Everything you need to know about NexURL, custom aliases, QR codes, link expiration, and analytics.
          </p>

          {/* Category Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'general', label: 'General & Basics' },
              { id: 'features', label: 'Features & Editing' },
              { id: 'domains', label: 'Branded Domains' },
              { id: 'api', label: 'Developer API' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs transition-all hover:border-slate-300"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b997]" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#00a887]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
