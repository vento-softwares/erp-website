// All landing-page copy lives here. Edit text, reorder or add items without
// touching layout code. Icons are referenced by name from ./icons.tsx.
import type { IconName } from './icons';

export const NAV_LINKS = [
  { label: 'Vision', href: '#vision' },
  { label: 'Features', href: '#features' },
  { label: 'Why Vento', href: '#why' },
] as const;

export const CONTACT_EMAIL = 'ventotechteam@gmail.com';

export const HERO = {
  badge: 'All-in-one business management',
  // Each line is split into words for the staggered reveal. `highlight`
  // words render in the brand colour.
  headline: [
    [{ text: 'Your' }, { text: 'entire' }, { text: 'business.' }],
    [{ text: 'One' }, { text: 'connected', highlight: true }, { text: 'system.' }],
  ],
  lead: 'Vento is building a simpler way to manage inventory, production, sales, finance and everyday business operations from one connected platform.',
  primaryCta: 'Join the Waitlist',
  secondaryCta: 'See What We’re Building',
};

export const VISION = {
  eyebrow: 'THE VISION',
  title: 'Business software should feel connected.',
  lead: 'Most businesses run on disconnected tools, spreadsheets and manual handoffs. Vento is being designed to bring inventory, production, sales, finance and the everyday work between them into one clear system.',
  pillars: [
    {
      icon: 'layers',
      title: 'One connected workspace',
      body: 'Inventory, purchases, production, sales, accounting and people — one place, one source of truth.',
    },
    {
      icon: 'gauge',
      title: 'Clear, real-time visibility',
      body: 'Cash flow, stock levels and order status you can read at a glance — always current.',
    },
    {
      icon: 'lines',
      title: 'Simpler everyday operations',
      body: 'Fewer tools and fewer manual steps between deciding something and getting it done.',
    },
  ] satisfies { icon: IconName; title: string; body: string }[],
};

export const PRODUCT_PREVIEW = {
  eyebrow: 'FIRST LOOK',
  title: 'An early look at the Vento workspace.',
};

export const FEATURES = {
  eyebrow: 'THE FEATURES',
  title: 'Powerful modules for complete control.',
  lead: 'Everything a modern manufacturer needs, integrated into one seamless platform.',
  modules: [
    { icon: 'dashboard', title: 'Dashboard Overview', body: 'Real-time command center for sales, cash flow, and production metrics at a glance.' },
    { icon: 'inventory', title: 'Inventory Mgmt', body: 'Track raw materials, WIP, and finished goods across multiple warehouse locations.' },
    { icon: 'cart', title: 'Purchases', body: 'Streamline supplier orders, manage procurement costs, and track incoming stock.' },
    { icon: 'hexagon', title: 'Production', body: 'Plan manufacturing runs, manage Bills of Materials (BOM), and track output efficiency.' },
    { icon: 'tag', title: 'Sales & CRM', body: 'Manage customer orders, generate invoices instantly, and track receivables.' },
    { icon: 'calculator', title: 'Accounting', body: 'Track expenses, revenue, and cash flow. Localized for Nigerian tax requirements.' },
    { icon: 'person', title: 'Human Resources', body: 'Manage employee data, attendance, payroll, and user role permissions securely.' },
    { icon: 'report', title: 'Smart Reports', body: 'Generate detailed financial, sales, and production reports with one click.' },
  ] satisfies { icon: IconName; title: string; body: string }[],
};

export const IMPACT = {
  eyebrow: 'THE IMPACT',
  title: 'The numbers don’t lie.',
  lead: 'Here’s what Vento saves a typical small manufacturing business:',
  stats: [
    {
      value: '15',
      label: 'Revenue Saved',
      tone: 'brand',
      body: ['On a ₦10M/month business, that’s approximately ', { strong: '₦1,500,000 saved monthly' }, ' by plugging leaks.'],
    },
    {
      value: '40',
      label: 'Faster Processes',
      tone: 'brand',
      body: ['Automation cuts manual workload nearly in half, freeing up your team for high-value tasks.'],
    },
    {
      value: '100',
      label: 'Traceability',
      tone: 'accent',
      body: ['From raw materials to finished goods — zero blind spots in your entire production line.'],
    },
  ] satisfies { value: string; label: string; tone: 'brand' | 'accent'; body: (string | { strong: string })[] }[],
  quote: { before: '“Vento pays for itself — ', highlight: 'in the first month.', after: '”' },
};

export const ROADMAP = {
  eyebrow: 'GROWTH ROADMAP',
  title: 'We’re just getting started.',
  lead: 'Vento’s phased rollout covers every business segment.',
  phases: [
    { label: 'PHASE 1 — NOW', title: 'Small Manufacturing', body: 'Core ERP: inventory, production, sales and accounting.', state: 'current' },
    { label: 'PHASE 2 — NEXT', title: 'Retail Sector', body: 'POS integration and retail modules for marts & malls.', state: 'next' },
    { label: 'PHASE 3 — FUTURE', title: 'Large Industrial', body: 'Enterprise-grade, multi-location management.', state: 'future' },
    { label: 'PHASE 4 — VISION', title: 'Integrated Marketplace', body: 'All clients connected in one global ecosystem.', state: 'vision' },
  ] satisfies { label: string; title: string; body: string; state: 'current' | 'next' | 'future' | 'vision' }[],
};

export const FUTURE = {
  eyebrow: 'THE VISION',
  title: 'The future is connected.',
  lead: 'Imagine every Vento client — manufacturers, retailers, industrialists — trading with each other on one platform.',
  ideas: [
    {
      icon: 'search',
      title: 'Supplier Discovery',
      body: 'Find verified Vento-powered suppliers instantly. Reduce procurement time from weeks to minutes.',
    },
    {
      icon: 'exchange',
      title: 'Seamless B2B Transactions',
      body: 'Place orders, generate invoices, and process payments — all integrated within the ecosystem.',
    },
    {
      icon: 'network',
      title: 'Shared Intelligence',
      body: 'Access aggregated market trends, pricing data, and demand signals to make smarter decisions.',
    },
  ] satisfies { icon: IconName; title: string; body: string }[],
  quote: { before: '“Vento isn’t just an ERP. It’s the ', highlight: 'backbone of the future business economy', after: '.”' },
};

export const WAITLIST = {
  title: 'Be among the first to experience Vento.',
  note: 'Early users receive product updates and invitations to test Vento before public launch.',
  success: {
    title: 'You’re on the list.',
    body: 'Thanks for your interest in Vento. We’ll send occasional progress updates and your invitation as early access opens up.',
  },
  duplicate: {
    title: 'You’re already on the list.',
    body: 'You’re already on the waitlist. We’ll be in touch soon.',
  },
};

export const FOOTER = {
  blurb: 'One connected system for inventory, production, sales, finance and the everyday work in between.',
  explore: [
    { label: 'Product', href: '#product' },
    { label: 'Features', href: '#features' },
    { label: 'Vision', href: '#vision' },
    { label: 'Why Vento', href: '#why' },
  ],
  // `href: null` = page not built yet; rendered as an inert placeholder link.
  company: [
    { label: 'Contact', href: `mailto:${CONTACT_EMAIL}` },
    { label: 'LinkedIn', href: null },
    { label: 'Privacy', href: null },
    { label: 'Terms', href: null },
  ],
  tagline: 'ALL-IN-ONE BUSINESS MANAGEMENT',
};
