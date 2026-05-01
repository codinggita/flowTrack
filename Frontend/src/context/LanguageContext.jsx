import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  en: {
    nav: {
      dashboard:'Dashboard',transactions:'Transactions',accounts:'Accounts',
      reports:'Reports',recurring:'Recurring',settings:'Settings',support:'Support',logout:'Logout',
    },
    dashboard: {
      title:'Dashboard',totalSpent:'Total Spent',totalEarned:'Total Earned',netSavings:'Net Savings',
      spendingByCategory:'Spending by Category',thisMonthSummary:'This Month Summary',
      recentTransactions:'Recent Transactions',viewAll:'View All',topCategory:'Top Category',
      noData:'No data for this period',noTransactions:'No transactions yet. Add your first one!',
    },
    transactions: {
      title:'Transactions',addTransaction:'+ Add Transaction',csvUpload:'↑ CSV Upload',
      period:'Period',category:'Category',type:'Type',search:'Search',reset:'Reset',
      allCategories:'All Categories',allTypes:'All',income:'Income',expense:'Expense',
      date:'Date',description:'Description',account:'Account',amount:'Amount',
      showing:'Showing',of:'of',entries:'entries',noTransactions:'No transactions found.',
      addFirst:'Add your first transaction!',addTitle:'Add Transaction',editTitle:'Edit Transaction',
      descPlaceholder:'e.g. Swiggy Order',amountLabel:'Amount (₹)',dateLabel:'Date',
      categoryLabel:'Category',accountLabel:'Account',notesLabel:'Notes (optional)',
      cancel:'Cancel',save:'Save Transaction',saving:'Saving...',
    },
    accounts: {
      title:'Active Accounts',subtitle:'Manage your linked financial sources.',netWorth:'NET WORTH',
      addAccount:'Add Account',accountName:'Account Name',accountType:'Account Type',
      balance:'Current Balance (₹)',creditBalance:'Current Outstanding (₹)',
      creditNote:'Enter the amount you owe. It will be shown as negative.',
      types:{BANK:'Bank Account',UPI:'UPI (GPay, PhonePe)',CREDIT_CARD:'Credit Card',WALLET:'Wallet (PayTM)'},
      labels:{BANK:'Available Balance',UPI:'Available',CREDIT_CARD:'Current Outstanding',WALLET:'Wallet Balance'},
    },
    reports: {
      title:'Financial Performance',subtitle:'Analyze your income and expenditure patterns.',
      totalIncome:'TOTAL INCOME',totalExpenses:'TOTAL EXPENSES',netSavings:'NET SAVINGS',margin:'margin',
      spendingByMerchant:'Spending by Merchant',cashFlowTrend:'Cash Flow Trend',topCategories:'Top Categories',
      viewAllCategories:'View All Categories',income:'Income',expenses:'Expenses',
      transactions:'transactions',ofTotal:'of total',
      periods:{'this-month':'This Month','last-month':'Last Month','this-quarter':'This Quarter','ytd':'YTD'},
    },
    recurring: {
      title:'Recurring Subscriptions',totalMonthly:'TOTAL MONTHLY COMMITMENT',addNew:'+ Add New',
      activeSubs:'ACTIVE SUBS',upcoming:'UPCOMING (7 DAYS)',yearlyProjection:'YEARLY PROJECTION',
      optimizationScore:'Optimization Score',optimizationMessage:'Looking lean. No unused subscriptions detected.',
      activeSubscriptions:'Active Subscriptions',filter:'Filter',sort:'Sort',
      renewsIn:'RENEWS IN',days:'DAYS',active:'ACTIVE',perMonth:'/mo',
    },
    settings: {
      title:'Settings',subtitle:'Manage your profile, security, sessions and preferences.',
      tabs:{profile:'Profile',security:'Security',sessions:'Active Sessions',activity:'Activity Log',
        notifications:'Notifications',preferences:'Preferences',privacy:'Privacy & Consent'},
      profile:{title:'Profile Information',fullName:'FULL NAME',email:'EMAIL ADDRESS',phone:'PHONE NUMBER',
        emailNote:'Email cannot be changed for security reasons.',save:'Save Profile',saving:'Saving...',
        memberSince:'Member Since',lastLogin:'Last Login',accountId:'Account ID',currentPlan:'Current Plan'},
      security:{title:'Change Password',currentPass:'CURRENT PASSWORD',newPass:'NEW PASSWORD',
        confirmPass:'CONFIRM PASSWORD',change:'Change Password',changing:'Changing...',
        twoFA:'Two-Factor Authentication',twoFADesc:'Add an extra layer of security to your account.',
        enabled:'✅ Enabled',disabled:'❌ Disabled',password:'Password',neverChanged:'Never changed',
        lastChanged:'Last changed',securityNote:'Changing your password will log out all other active sessions for security.'},
      sessions:{title:'Active Sessions',revokeAll:'🔴 Revoke All Others',current:'Current Session',
        revoke:'Revoke',revoking:'...',noSessions:'No active sessions found.'},
      notifications:{title:'Notification Preferences',subtitle:'Choose which notifications you want to receive.',
        transaction:'New Transaction Alerts',transactionDesc:'Get notified for every inflow or outflow.',
        weekly:'Weekly Report',weeklyDesc:'A summary of your spending and income every Sunday.',
        renewal:'Subscription Renewal Reminders',renewalDesc:'Alert 3 days before any tracked subscription renews.'},
      preferences:{title:'Interface Theme',dark:'Dark',light:'Light',system:'System',
        currency:'BASE CURRENCY',language:'LANGUAGE',currNote:'All dashboard metrics will use this currency.'},
    },
    auth: {
      login:{title:'FlowTrack',subtitle:'Terminal Authentication',email:'Email Address',password:'Password',
        forgot:'Forgot?',submit:'Initialize Session',or:'OR',google:'Google',apple:'Apple',
        noAccount:'No active profile?',requestAccess:'Request Access',submitting:'Signing in...'},
      register:{title:'FlowTrack',subtitle:'Create your account to start managing finances.',fullName:'Full Name',
        email:'Email Address',password:'Password',agree:'I agree to the',terms:'Terms of Service',
        and:'and',privacy:'Privacy Policy',submit:'Create Account',or:'OR CONTINUE WITH',
        hasAccount:'Already have an account?',login:'Log in',submitting:'Creating...'},
    },
    common: {
      loading:'Loading...',error:'Something went wrong',retry:'Try again',save:'Save',cancel:'Cancel',
      delete:'Delete',edit:'Edit',close:'Close',back:'Back',next:'Next',previous:'Previous',
      search:'Search...',noData:'No data available',amount:'Amount',date:'Date',status:'Status',
    },
    support: {
      title:'Support Center',subtitle:'Get help, browse articles, or contact our team.',
      newTicket:'New Ticket',liveChat:'Live Chat',articles:'Help Articles',faq:'FAQ',myTickets:'My Tickets',
      submitTicket:'Submit a Support Ticket',subject:'Subject',category:'Category',description:'Description',
      priority:'Priority',submit:'Submit Ticket',submitting:'Submitting...',replyPlaceholder:'Add a reply...',
      send:'Send Reply',close:'Close Ticket',rate:'Rate this support',
      status:{open:'Open',in_progress:'In Progress',waiting_for_user:'Waiting for You',resolved:'Resolved',closed:'Closed'},
    },
    notifications: {
      title:'Notifications',markAllRead:'Mark all read',clearAll:'Clear all',
      noNotifs:'All caught up!',noNotifsDesc:'No notifications yet. Add transactions to see alerts.',
      viewAll:'View all notifications →',
    },
  },
  hi: {
    nav: {
      dashboard:'डैशबोर्ड',transactions:'लेनदेन',accounts:'खाते',reports:'रिपोर्ट',
      recurring:'आवर्ती',settings:'सेटिंग्स',support:'सहायता',logout:'लॉगआउट',
    },
    dashboard: {
      title:'डैशबोर्ड',totalSpent:'कुल खर्च',totalEarned:'कुल आय',netSavings:'शुद्ध बचत',
      spendingByCategory:'श्रेणी के अनुसार खर्च',thisMonthSummary:'इस महीने का सारांश',
      recentTransactions:'हाल के लेनदेन',viewAll:'सभी देखें',topCategory:'शीर्ष श्रेणी',
      noData:'इस अवधि के लिए कोई डेटा नहीं',noTransactions:'अभी तक कोई लेनदेन नहीं। पहला लेनदेन जोड़ें!',
    },
    transactions: {
      title:'लेनदेन',addTransaction:'+ लेनदेन जोड़ें',csvUpload:'↑ CSV अपलोड',
      period:'अवधि',category:'श्रेणी',type:'प्रकार',search:'खोजें',reset:'रीसेट',
      allCategories:'सभी श्रेणियां',allTypes:'सभी',income:'आय',expense:'खर्च',
      date:'तिथि',description:'विवरण',account:'खाता',amount:'राशि',
      showing:'दिखा रहे हैं',of:'में से',entries:'प्रविष्टियां',noTransactions:'कोई लेनदेन नहीं मिला।',
      addFirst:'पहला लेनदेन जोड़ें!',addTitle:'लेनदेन जोड़ें',editTitle:'लेनदेन संपादित करें',
      descPlaceholder:'जैसे: Swiggy ऑर्डर',amountLabel:'राशि (₹)',dateLabel:'तिथि',
      categoryLabel:'श्रेणी',accountLabel:'खाता',notesLabel:'नोट्स (वैकल्पिक)',
      cancel:'रद्द करें',save:'सहेजें',saving:'सहेज रहे हैं...',
    },
    accounts: {
      title:'सक्रिय खाते',subtitle:'अपने जुड़े वित्तीय स्रोत प्रबंधित करें।',netWorth:'कुल संपत्ति',
      addAccount:'खाता जोड़ें',accountName:'खाते का नाम',accountType:'खाते का प्रकार',
      balance:'वर्तमान शेष (₹)',creditBalance:'वर्तमान बकाया (₹)',
      creditNote:'देय राशि दर्ज करें। इसे ऋणात्मक दिखाया जाएगा।',
      types:{BANK:'बैंक खाता',UPI:'UPI (GPay, PhonePe)',CREDIT_CARD:'क्रेडिट कार्ड',WALLET:'वॉलेट (PayTM)'},
      labels:{BANK:'उपलब्ध शेष',UPI:'उपलब्ध',CREDIT_CARD:'वर्तमान बकाया',WALLET:'वॉलेट शेष'},
    },
    reports: {
      title:'वित्तीय प्रदर्शन',subtitle:'अपनी आय और व्यय के पैटर्न का विश्लेषण करें।',
      totalIncome:'कुल आय',totalExpenses:'कुल खर्च',netSavings:'शुद्ध बचत',margin:'मार्जिन',
      spendingByMerchant:'व्यापारी के अनुसार खर्च',cashFlowTrend:'नकदी प्रवाह प्रवृत्ति',
      topCategories:'शीर्ष श्रेणियां',viewAllCategories:'सभी श्रेणियां देखें',income:'आय',expenses:'खर्च',
      transactions:'लेनदेन',ofTotal:'कुल का',
      periods:{'this-month':'इस महीने','last-month':'पिछले महीने','this-quarter':'इस तिमाही','ytd':'वर्ष अब तक'},
    },
    recurring: {
      title:'आवर्ती सदस्यताएं',totalMonthly:'कुल मासिक प्रतिबद्धता',addNew:'+ नया जोड़ें',
      activeSubs:'सक्रिय सदस्यताएं',upcoming:'आगामी (7 दिन)',yearlyProjection:'वार्षिक अनुमान',
      optimizationScore:'अनुकूलन स्कोर',optimizationMessage:'बढ़िया! कोई अनुपयोगी सदस्यता नहीं मिली।',
      activeSubscriptions:'सक्रिय सदस्यताएं',filter:'फ़िल्टर',sort:'क्रमबद्ध करें',
      renewsIn:'नवीनीकरण',days:'दिनों में',active:'सक्रिय',perMonth:'/माह',
    },
    settings: {
      title:'सेटिंग्स',subtitle:'अपनी प्रोफ़ाइल, सुरक्षा और प्राथमिकताएं प्रबंधित करें।',
      tabs:{profile:'प्रोफ़ाइल',security:'सुरक्षा',sessions:'सक्रिय सत्र',activity:'गतिविधि लॉग',
        notifications:'सूचनाएं',preferences:'प्राथमिकताएं',privacy:'गोपनीयता'},
      profile:{title:'प्रोफ़ाइल जानकारी',fullName:'पूरा नाम',email:'ईमेल पता',phone:'फ़ोन नंबर',
        emailNote:'सुरक्षा कारणों से ईमेल नहीं बदला जा सकता।',save:'प्रोफ़ाइल सहेजें',saving:'सहेज रहे हैं...',
        memberSince:'सदस्यता तिथि',lastLogin:'अंतिम लॉगिन',accountId:'खाता ID',currentPlan:'वर्तमान योजना'},
      security:{title:'पासवर्ड बदलें',currentPass:'वर्तमान पासवर्ड',newPass:'नया पासवर्ड',
        confirmPass:'पासवर्ड की पुष्टि करें',change:'पासवर्ड बदलें',changing:'बदल रहे हैं...',
        twoFA:'दो-कारक प्रमाणीकरण',twoFADesc:'अपने खाते में सुरक्षा की एक अतिरिक्त परत जोड़ें।',
        enabled:'✅ सक्षम',disabled:'❌ अक्षम',password:'पासवर्ड',neverChanged:'कभी नहीं बदला',
        lastChanged:'अंतिम परिवर्तन',securityNote:'पासवर्ड बदलने से अन्य सभी सक्रिय सत्र लॉगआउट हो जाएंगे।'},
      sessions:{title:'सक्रिय सत्र',revokeAll:'🔴 अन्य सभी रद्द करें',current:'वर्तमान सत्र',
        revoke:'रद्द करें',revoking:'...',noSessions:'कोई सक्रिय सत्र नहीं मिला।'},
      notifications:{title:'सूचना प्राथमिकताएं',subtitle:'चुनें कि आप कौन सी सूचनाएं प्राप्त करना चाहते हैं।',
        transaction:'नए लेनदेन अलर्ट',transactionDesc:'हर आय या व्यय के लिए सूचना प्राप्त करें।',
        weekly:'साप्ताहिक रिपोर्ट',weeklyDesc:'हर रविवार को आपके खर्च और आय का सारांश।',
        renewal:'सदस्यता नवीनीकरण अनुस्मारक',renewalDesc:'किसी भी सदस्यता के नवीनीकरण से 3 दिन पहले अलर्ट।'},
      preferences:{title:'इंटरफ़ेस थीम',dark:'डार्क',light:'लाइट',system:'सिस्टम',
        currency:'आधार मुद्रा',language:'भाषा',currNote:'सभी डैशबोर्ड मेट्रिक्स इस मुद्रा का उपयोग करेंगे।'},
    },
    auth: {
      login:{title:'FlowTrack',subtitle:'टर्मिनल प्रमाणीकरण',email:'ईमेल पता',password:'पासवर्ड',
        forgot:'भूल गए?',submit:'सत्र प्रारंभ करें',or:'या',google:'Google',apple:'Apple',
        noAccount:'कोई प्रोफ़ाइल नहीं?',requestAccess:'पहुंच अनुरोध करें',submitting:'साइन इन हो रहे हैं...'},
      register:{title:'FlowTrack',subtitle:'वित्त प्रबंधन शुरू करने के लिए खाता बनाएं।',fullName:'पूरा नाम',
        email:'ईमेल पता',password:'पासवर्ड',agree:'मैं सहमत हूं',terms:'सेवा की शर्तें',
        and:'और',privacy:'गोपनीयता नीति',submit:'खाता बनाएं',or:'या जारी रखें',
        hasAccount:'पहले से खाता है?',login:'लॉग इन करें',submitting:'बना रहे हैं...'},
    },
    common: {
      loading:'लोड हो रहा है...',error:'कुछ गलत हुआ',retry:'पुनः प्रयास करें',save:'सहेजें',cancel:'रद्द करें',
      delete:'हटाएं',edit:'संपादित करें',close:'बंद करें',back:'वापस',next:'अगला',previous:'पिछला',
      search:'खोजें...',noData:'कोई डेटा उपलब्ध नहीं',amount:'राशि',date:'तिथि',status:'स्थिति',
    },
    support: {
      title:'सहायता केंद्र',subtitle:'सहायता प्राप्त करें, लेख पढ़ें या हमारी टीम से संपर्क करें।',
      newTicket:'नया टिकट',liveChat:'लाइव चैट',articles:'सहायता लेख',faq:'सामान्य प्रश्न',myTickets:'मेरे टिकट',
      submitTicket:'सहायता टिकट जमा करें',subject:'विषय',category:'श्रेणी',description:'विवरण',
      priority:'प्राथमिकता',submit:'टिकट जमा करें',submitting:'जमा हो रहा है...',replyPlaceholder:'उत्तर जोड़ें...',
      send:'उत्तर भेजें',close:'टिकट बंद करें',rate:'सहायता रेट करें',
      status:{open:'खुला',in_progress:'प्रगति में',waiting_for_user:'आपका इंतजार',resolved:'हल हुआ',closed:'बंद'},
    },
    notifications: {
      title:'सूचनाएं',markAllRead:'सभी पढ़ा हुआ चिह्नित करें',clearAll:'सभी साफ करें',
      noNotifs:'सब ठीक है!',noNotifsDesc:'अभी तक कोई सूचना नहीं। अलर्ट देखने के लिए लेनदेन जोड़ें।',
      viewAll:'सभी सूचनाएं देखें →',
    },
  },
};

export function LanguageProvider({ children }) {
  const getInitialLang = () => {
    const saved = localStorage.getItem('ft_language');
    return saved === 'hi' ? 'hi' : 'en';
  };

  const [language, setLanguage] = useState(getInitialLang);

  const changeLanguage = useCallback((lang) => {
    if (!['en','hi'].includes(lang)) return;
    setLanguage(lang);
    localStorage.setItem('ft_language', lang);
    document.documentElement.setAttribute('lang', lang);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, []);

  const t = useCallback((path) => {
    const keys = path.split('.');
    let result = TRANSLATIONS[language];
    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        let fallback = TRANSLATIONS.en;
        for (const k of keys) fallback = fallback?.[k];
        return fallback || path;
      }
    }
    return result || path;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, translations: TRANSLATIONS }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
