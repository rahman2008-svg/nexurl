import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { ShortLink, ClickEvent } from '../types';

const STORAGE_KEY = 'nexurl_saved_links_v1';
const USER_KEY = 'nexurl_user_profile_v1';

// Available domains
export const AVAILABLE_DOMAINS = [
  'nexurl.com',
  'nex.link',
  'tiny.sh',
  'click.to',
  'brand.link'
];

// Seed sample links for instant realistic feel if none exist
const SAMPLE_LINKS: ShortLink[] = [
  {
    id: 'link_sample_1',
    originalUrl: 'https://github.com/trending/developers?since=monthly&spoken_language_code=en',
    shortUrl: 'https://nexurl.com/gh-trending',
    domain: 'nexurl.com',
    alias: 'gh-trending',
    title: 'GitHub Trending Developers - Monthly',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 142,
    isCustomAlias: true,
    clickHistory: [
      { timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), referer: 'Twitter / X', country: 'United States', countryCode: 'US', device: 'Mobile', browser: 'Safari' },
      { timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), referer: 'Direct / Email', country: 'Germany', countryCode: 'DE', device: 'Desktop', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), referer: 'LinkedIn', country: 'United Kingdom', countryCode: 'GB', device: 'Desktop', browser: 'Firefox' },
      { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), referer: 'Google Search', country: 'Japan', countryCode: 'JP', device: 'Mobile', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), referer: 'Reddit', country: 'Canada', countryCode: 'CA', device: 'Desktop', browser: 'Edge' },
      { timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), referer: 'Twitter / X', country: 'United States', countryCode: 'US', device: 'Mobile', browser: 'Safari' },
      { timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), referer: 'Direct / Email', country: 'Australia', countryCode: 'AU', device: 'Desktop', browser: 'Chrome' }
    ]
  },
  {
    id: 'link_sample_2',
    originalUrl: 'https://docs.google.com/presentation/d/1eXampl3_Keyn0te_Sl1des_2026_Q4_Strategy_Roadmap/edit#slide=id.p',
    shortUrl: 'https://nex.link/q4-strategy',
    domain: 'nex.link',
    alias: 'q4-strategy',
    title: 'Company Q4 Strategic Roadmap & OKRs',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 89,
    isCustomAlias: true,
    clickHistory: [
      { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), referer: 'Slack / Teams', country: 'United States', countryCode: 'US', device: 'Desktop', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), referer: 'Direct / Email', country: 'United States', countryCode: 'US', device: 'Desktop', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(), referer: 'Direct / Email', country: 'France', countryCode: 'FR', device: 'Tablet', browser: 'Safari' }
    ]
  },
  {
    id: 'link_sample_3',
    originalUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLlaN88a760cEwGfQx4L3a4V3b',
    shortUrl: 'https://nexurl.com/launch-stream',
    domain: 'nexurl.com',
    alias: 'launch-stream',
    title: 'NexURL 2026 Product Keynote Livestream',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    clicks: 341,
    isCustomAlias: true,
    clickHistory: [
      { timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), referer: 'YouTube', country: 'United States', countryCode: 'US', device: 'Mobile', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), referer: 'Twitter / X', country: 'India', countryCode: 'IN', device: 'Mobile', browser: 'Chrome' },
      { timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), referer: 'Google Search', country: 'United Kingdom', countryCode: 'GB', device: 'Desktop', browser: 'Safari' }
    ]
  }
];

export function getStoredLinks(): ShortLink[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_LINKS));
      return SAMPLE_LINKS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load links from localStorage', err);
    return SAMPLE_LINKS;
  }
}

export function saveStoredLinks(links: ShortLink[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  } catch (err) {
    console.error('Failed to save links to localStorage', err);
  }
}

// Generate random short slug
export function generateRandomAlias(length: number = 6): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Validate URL format
export function isValidUrl(input: string): boolean {
  if (!input || input.trim() === '') return false;
  let testStr = input.trim();
  if (!/^https?:\/\//i.test(testStr)) {
    testStr = 'https://' + testStr;
  }
  try {
    const parsed = new URL(testStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

// Normalize URL (ensure https://)
export function normalizeUrl(input: string): string {
  let cleaned = input.trim();
  if (!/^https?:\/\//i.test(cleaned)) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

// Sanitize alias
export function sanitizeAlias(alias: string): string {
  return alias.toLowerCase().replace(/[^a-z0-9-_]/g, '');
}

// Generate QR Code Data URL
export async function generateQrCodeDataUrl(url: string, colorDark: string = '#061d33', colorLight: string = '#ffffff'): Promise<string> {
  try {
    return await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: colorDark,
        light: colorLight
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('QR code generation failed', err);
    return '';
  }
}

// Generate QR Code SVG String
export async function generateQrCodeSvg(url: string, colorDark: string = '#061d33', colorLight: string = '#ffffff'): Promise<string> {
  try {
    return await QRCode.toString(url, {
      type: 'svg',
      width: 400,
      margin: 2,
      color: {
        dark: colorDark,
        light: colorLight
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('QR code SVG generation failed', err);
    return '';
  }
}

// Copy to clipboard with celebratory confetti
export async function copyToClipboard(text: string, triggerConfetti: boolean = true): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    if (triggerConfetti) {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#00b997', '#061d33', '#38bdf8', '#10b981']
      });
    }
    return true;
  } catch (err) {
    console.error('Clipboard copy failed, using fallback', err);
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textarea);
      if (triggerConfetti) {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#00b997', '#061d33', '#38bdf8', '#10b981']
        });
      }
      return true;
    } catch {
      document.body.removeChild(textarea);
      return false;
    }
  }
}

// Track a click event and update storage
export function recordClick(linkId: string, referer: string = 'Direct / Email'): ShortLink | null {
  const links = getStoredLinks();
  const index = links.findIndex(l => l.id === linkId);
  if (index === -1) return null;

  const countries = [
    { country: 'United States', code: 'US' },
    { country: 'United Kingdom', code: 'GB' },
    { country: 'Germany', code: 'DE' },
    { country: 'Japan', code: 'JP' },
    { country: 'Canada', code: 'CA' },
    { country: 'France', code: 'FR' },
    { country: 'Australia', code: 'AU' },
    { country: 'India', code: 'IN' }
  ];
  const randomCountry = countries[Math.floor(Math.random() * countries.length)];
  const devices: ('Desktop' | 'Mobile' | 'Tablet')[] = ['Desktop', 'Mobile', 'Tablet'];
  const randomDevice = devices[Math.floor(Math.random() * (Math.random() > 0.4 ? 2 : 3))];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge'];
  const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];

  const newEvent: ClickEvent = {
    timestamp: new Date().toISOString(),
    referer,
    country: randomCountry.country,
    countryCode: randomCountry.code,
    device: randomDevice,
    browser: randomBrowser
  };

  const updatedLink: ShortLink = {
    ...links[index],
    clicks: links[index].clicks + 1,
    clickHistory: [newEvent, ...(links[index].clickHistory || []).slice(0, 99)]
  };

  links[index] = updatedLink;
  saveStoredLinks(links);
  return updatedLink;
}

// Export links to CSV
export function exportLinksToCsv(links: ShortLink[]): void {
  const headers = ['ID', 'Alias', 'Short URL', 'Original URL', 'Domain', 'Clicks', 'Created At'];
  const rows = links.map(l => [
    l.id,
    l.alias,
    l.shortUrl,
    `"${l.originalUrl.replace(/"/g, '""')}"`,
    l.domain,
    l.clicks,
    l.createdAt
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `nexurl_export_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
