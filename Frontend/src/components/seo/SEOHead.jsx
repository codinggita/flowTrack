import { Helmet } from 'react-helmet-async';

const BASE_URL = 'https://flow-track-tawny.vercel.app';
const DEFAULT_IMG = `${BASE_URL}/og-image.png`;

const PAGE_META = {
  dashboard: {
    title:'Dashboard — FlowTrack Personal Finance',
    description:'View your financial overview: total income, expenses, net savings, spending by category and recent transactions.',
    keywords:'personal finance dashboard, expense tracker india, spending overview, budget tracker',
  },
  transactions: {
    title:'Transactions — FlowTrack',
    description:'Track, filter and manage all your financial transactions. Import via CSV or add manually.',
    keywords:'transaction tracker, expense log, income tracker, financial transactions india',
  },
  accounts: {
    title:'Accounts — FlowTrack',
    description:'Manage your bank accounts, UPI, credit cards and digital wallets. Track net worth.',
    keywords:'bank account tracker, UPI tracker, net worth calculator india, wallet tracker',
  },
  reports: {
    title:'Financial Reports — FlowTrack',
    description:'Analyze your income and expenses with interactive charts. Cash flow trends, category breakdowns.',
    keywords:'financial reports, expense analysis, cash flow chart, spending analytics india',
  },
  recurring: {
    title:'Recurring Subscriptions — FlowTrack',
    description:'Track Netflix, Spotify, Amazon Prime and all your subscriptions. Never miss a renewal.',
    keywords:'subscription tracker india, recurring expenses, Netflix tracker, OTT tracker',
  },
  settings: {
    title:'Settings — FlowTrack',
    description:'Manage your profile, security settings, active sessions and notification preferences.',
    keywords:'account settings, privacy settings, security settings',
  },
  support: {
    title:'Support Center — FlowTrack',
    description:'Get help with FlowTrack. Browse FAQs, help articles or submit a support ticket.',
    keywords:'flowtrack support, help center, FAQ, contact support',
  },
  login: {
    title:'Sign In — FlowTrack Personal Finance',
    description:'Sign in to FlowTrack to track your personal finances, expenses and savings.',
    keywords:'flowtrack login, personal finance app india, expense tracker login',
  },
  register: {
    title:'Create Account — FlowTrack',
    description:'Join FlowTrack for free. Track expenses, manage accounts, and achieve your savings goals.',
    keywords:'flowtrack signup, free expense tracker india, personal finance app',
  },
  home: {
    title:'FlowTrack — Personal Finance Tracker for India',
    description:'FlowTrack is a free personal finance app for India. Track expenses, manage bank accounts, UPI, credit cards and subscriptions in one place.',
    keywords:'personal finance app india, free expense tracker, budget tracker india, money manager india, UPI tracker',
  },
};

export default function SEOHead({ page = 'home', customTitle, customDesc }) {
  const meta = PAGE_META[page] || PAGE_META.home;
  const title = customTitle || meta.title;
  const desc = customDesc || meta.description;
  const url = `${BASE_URL}/${page === 'home' ? '' : page}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <meta name="keywords" content={meta.keywords} />
      <meta name="author" content="FlowTrack" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={url} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={DEFAULT_IMG} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="FlowTrack" />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={DEFAULT_IMG} />
      <meta name="application-name" content="FlowTrack" />
      <meta name="theme-color" content="#42e5b0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
}
