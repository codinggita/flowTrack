// Injects JSON-LD schema.org structured data for SEO

export default function StructuredData() {
  const websiteSchema = {
    '@context':'https://schema.org','@type':'WebApplication',
    name:'FlowTrack',url:'https://flow-track-full-stack.vercel.app',
    description:'Personal finance tracker for India. Track expenses, accounts, UPI, subscriptions.',
    applicationCategory:'FinanceApplication',operatingSystem:'Web, iOS, Android',
    offers:{'@type':'Offer',price:'0',priceCurrency:'INR'},
    author:{'@type':'Organization',name:'FlowTrack',url:'https://flow-track-full-stack.vercel.app'},
    featureList:['Track income and expenses','Manage bank accounts, UPI, credit cards',
      'Subscription tracking and renewal alerts','Financial reports and charts',
      'Indian Rupee (INR) support','CSV import for bulk transactions','Hindi language support'],
    inLanguage:['en-IN','hi-IN'],countryOfOrigin:'IN',screenshot:'https://flow-track-full-stack.vercel.app/og-image.png',
  };

  const orgSchema = {
    '@context':'https://schema.org','@type':'Organization',name:'FlowTrack',
    url:'https://flow-track-full-stack.vercel.app',logo:'https://flow-track-full-stack.vercel.app/logo.png',
    contactPoint:{'@type':'ContactPoint',email:'support@flowtrack.in',
      contactType:'customer support',availableLanguage:['English','Hindi']},
  };

  const faqSchema = {
    '@context':'https://schema.org','@type':'FAQPage',
    mainEntity:[
      {'@type':'Question',name:'What is FlowTrack?',
        acceptedAnswer:{'@type':'Answer',text:'FlowTrack is a free personal finance tracker for India that helps you manage expenses, bank accounts, UPI payments, credit cards, and subscriptions in one place.'}},
      {'@type':'Question',name:'Is FlowTrack free?',
        acceptedAnswer:{'@type':'Answer',text:'Yes, FlowTrack offers a free plan with all core features. A Pro plan is available for advanced features.'}},
      {'@type':'Question',name:'Does FlowTrack access my bank account?',
        acceptedAnswer:{'@type':'Answer',text:'No. FlowTrack does not connect to your bank. All financial data is entered manually by you for complete privacy and security.'}},
      {'@type':'Question',name:'Is FlowTrack available in Hindi?',
        acceptedAnswer:{'@type':'Answer',text:'Yes, FlowTrack supports both English and Hindi. You can switch languages in Settings.'}},
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
