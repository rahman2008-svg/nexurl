import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';

interface PricingSectionProps {
  onSelectPlan: (planName: 'Free' | 'Pro' | 'Bulk 50K' | 'Enterprise') => void;
  user: UserProfile;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onSelectPlan,
  user
}) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Ideal for individuals and quick link shortening.',
      features: [
        '100 Short Links / month',
        'Free Custom Aliases',
        'Standard Dynamic QR Codes',
        'Links Never Expire',
        'Basic Click Counter',
        '30-Day Link History'
      ],
      popular: false,
      cta: user.plan === 'Free' ? 'Current Plan' : 'Get Started Free',
      planKey: 'Free' as const
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnual ? '$9' : '$11',
      period: 'per month',
      subtext: isAnnual ? 'Billed annually ($108/yr)' : 'Billed monthly',
      description: 'The standard for creators, marketers, and fast-growing businesses.',
      features: [
        '125 Short Links / month',
        'Unlimited Tracked Clicks',
        '3 Custom Branded Domains',
        'Full Real-Time Analytics Dashboard',
        '2-Year Click History & Trends',
        'Edit Destination URLs Anytime',
        'Dynamic QR Code Studio & Vector SVG',
        'Full REST API & Token Access'
      ],
      popular: true,
      cta: user.plan === 'Pro' ? 'Current Plan' : 'Upgrade to Pro',
      planKey: 'Pro' as const
    },
    {
      id: 'bulk',
      name: 'Bulk 50K',
      price: isAnnual ? '$69' : '$83',
      period: 'per month',
      subtext: isAnnual ? 'Billed annually ($828/yr)' : 'Billed monthly',
      description: 'High-volume programmatic link shortening at enterprise scale.',
      features: [
        '50,000 Short Links / month',
        '50,000 Tracked Clicks / month',
        '3 Custom Branded Domains',
        'Batch Bulk Shortener Engine',
        'High-Throughput API (10k req/min)',
        'Detailed CSV Data Exports',
        'Dedicated IP Routing Pool',
        'Priority Email Support'
      ],
      popular: false,
      cta: user.plan === 'Bulk 50K' ? 'Current Plan' : 'Choose Bulk 50K',
      planKey: 'Bulk 50K' as const
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'tailored volume',
      subtext: 'Contact sales team',
      description: 'Bespoke solutions for global organizations and security compliance.',
      features: [
        'Unlimited Monthly Short Links',
        'Unlimited Tracked Clicks',
        'Unlimited Custom Domains',
        '99.999% SLA Uptime Guarantee',
        'Single Sign-On (SAML / Okta / Azure)',
        'Custom Security & SOC2 Compliance',
        'Dedicated Customer Success Manager',
        '24/7 Phone & Emergency Slack Access'
      ],
      popular: false,
      cta: user.plan === 'Enterprise' ? 'Current Plan' : 'Contact Enterprise',
      planKey: 'Enterprise' as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
            <Zap className="w-3.5 h-3.5 text-[#00a887]" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Plans that scale with your link volume.
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Shorten links for free, or unlock branded domains, real-time analytics, and high-volume REST APIs.
          </p>

          {/* Billing Interval Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="w-14 h-8 bg-slate-900 rounded-full p-1 transition-colors relative focus:outline-none"
              role="switch"
              aria-checked={isAnnual}
            >
              <div 
                className={`w-6 h-6 bg-[#00d2ad] rounded-full shadow-md transition-transform duration-200 ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>

            <div className="flex items-center gap-1.5">
              <span className={`text-sm font-bold ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                Annual Billing
              </span>
              <span className="px-2 py-0.5 text-xs font-extrabold bg-[#00a887] text-slate-950 rounded-full shadow-xs">
                Save 18%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((p) => {
            const isUserCurrent = user.plan === p.planKey && user.isLoggedIn;

            return (
              <div
                key={p.id}
                className={`relative rounded-2xl flex flex-col justify-between transition-all duration-200 ${
                  p.popular
                    ? 'bg-gradient-to-b from-[#061d33] to-[#0a2745] text-white shadow-2xl shadow-slate-950/20 border-2 border-[#00d2ad] scale-100 lg:-translate-y-2'
                    : 'bg-slate-50/70 border border-slate-200 text-slate-900 hover:shadow-lg'
                } p-6 sm:p-7`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#00a887] to-[#00d2ad] text-slate-950 text-xs font-black uppercase tracking-wider rounded-full shadow-md">
                    ★ Most Popular
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className={`text-xl font-bold ${p.popular ? 'text-white' : 'text-slate-900'}`}>
                      {p.name}
                    </h3>
                    {isUserCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-[#00d2ad] rounded-full border border-emerald-500/30">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <p className={`text-xs ${p.popular ? 'text-slate-300' : 'text-slate-500'} leading-relaxed min-h-[36px]`}>
                    {p.description}
                  </p>

                  <div className="pt-2 border-t border-slate-200/20">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-extrabold tracking-tight ${p.popular ? 'text-white' : 'text-slate-900'}`}>
                        {p.price}
                      </span>
                      <span className={`text-xs font-semibold ${p.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                        / {p.period}
                      </span>
                    </div>
                    {p.subtext && (
                      <p className={`text-[11px] font-medium mt-1 ${p.popular ? 'text-[#00d2ad]' : 'text-slate-500'}`}>
                        {p.subtext}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 space-y-2.5">
                    <p className={`text-xs font-bold uppercase tracking-wider ${p.popular ? 'text-slate-300' : 'text-slate-700'}`}>
                      Included Features:
                    </p>
                    <ul className="space-y-2">
                      {p.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium">
                          <Check className={`w-4 h-4 shrink-0 mt-0.5 ${p.popular ? 'text-[#00d2ad]' : 'text-emerald-600'}`} />
                          <span className={p.popular ? 'text-slate-200' : 'text-slate-600'}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/20">
                  <button
                    onClick={() => onSelectPlan(p.planKey)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all transform active:scale-95 shadow-sm cursor-pointer ${
                      p.popular
                        ? 'bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 font-extrabold shadow-emerald-500/20'
                        : isUserCurrent
                        ? 'bg-slate-200 text-slate-700 cursor-default'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isUserCurrent ? 'Current Plan' : p.cta}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Enterprise Callout Banner */}
        <div className="p-6 sm:p-8 bg-slate-900 text-white rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Need custom enterprise SLA or millions of links per month?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Our engineering team will provision custom domain DNS, dedicated IP proxies, and SSO within 24 hours.
            </p>
          </div>
          <button
            onClick={() => onSelectPlan('Enterprise')}
            className="px-6 py-3 bg-[#00b997] hover:bg-[#00d2ad] text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shrink-0 transition"
          >
            Speak with an Architect
          </button>
        </div>

      </div>
    </section>
  );
};
