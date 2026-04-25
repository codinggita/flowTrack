export const user = {
  name: 'Arjun Sharma',
  email: 'arjun.s@example.com',
  phone: '+91 98765 43210',
  id: 'FT-849201',
  plan: 'Pro Plan',
  avatar: 'AS',
};

export const accounts = [
  { id:1, name:'GPay',         type:'UPI',         icon:'QR',  balance: 14500.00,  balanceLabel:'Available',          positive:true  },
  { id:2, name:'SBI Savings',  type:'BANK',        icon:'BK',  balance: 450000.00, balanceLabel:'Available Balance',  positive:true  },
  { id:3, name:'HDFC Regalia', type:'CREDIT CARD', icon:'CC',  balance: -32400.50, balanceLabel:'Current Outstanding',positive:false },
  { id:4, name:'PhonePe',      type:'WALLET',      icon:'WL',  balance: 2150.00,   balanceLabel:'Wallet Balance',     positive:true  },
];

export const netWorth = 434249.50;

export const transactions = [
  { id:1,  date:'Oct 24, 2023', desc:'Salary - Tech Corp',    category:'INCOME',     account:'HDFC Bank',    amount:  120000.00, positive:true  },
  { id:2,  date:'Oct 22, 2023', desc:'Apple Store BKC',       category:'TECH',       account:'Credit Card',  amount: -154000.00, positive:false },
  { id:3,  date:'Oct 21, 2023', desc:'Uber Ride',             category:'TRANSPORT',  account:'UPI',          amount:    -450.00, positive:false },
  { id:4,  date:'Oct 20, 2023', desc:'Dividend - RIL',        category:'INVESTMENT', account:'Zerodha',      amount:   4500.00,  positive:true  },
  { id:5,  date:'Oct 18, 2023', desc:"Nature's Basket",       category:'FOOD',       account:'Credit Card',  amount:  -2340.50,  positive:false },
  { id:6,  date:'Oct 15, 2023', desc:'Monthly Rent',          category:'HOUSING',    account:'HDFC Bank',    amount: -35000.00,  positive:false },
  { id:7,  date:'Oct 12, 2023', desc:'AWS Web Services',      category:'SOFTWARE',   account:'Credit Card',  amount:  -1240.00,  positive:false },
  { id:8,  date:'Oct 10, 2023', desc:'Swiggy Order',          category:'FOOD',       account:'PayTM Wallet', amount:   -650.00,  positive:false },
  { id:9,  date:'Oct 08, 2023', desc:'Zara Apparel',          category:'SHOPPING',   account:'ICICI CC',     amount:  -4500.00,  positive:false },
  { id:10, date:'Oct 05, 2023', desc:'Freelance Payment',     category:'INCOME',     account:'SBI Account',  amount:  25000.00,  positive:true  },
  { id:11, date:'Oct 04, 2023', desc:'Zepto Groceries',       category:'FOOD',       account:'GPay',         amount:   -890.00,  positive:false },
  { id:12, date:'Oct 02, 2023', desc:'Electricity Board',     category:'UTILITIES',  account:'HDFC Bank',    amount:  -1850.00,  positive:false },
];

export const recentTransactions = [
  { date:'Oct 24', desc:'Starbucks Coffee',  category:'Food',          account:'HDFC Bank',    amount: -450,    positive:false },
  { date:'Oct 23', desc:'Uber Ride',         category:'Transport',     account:'ICICI CC',     amount: -320,    positive:false },
  { date:'Oct 23', desc:'Netflix Premium',   category:'Subscriptions', account:'HDFC Bank',    amount: -649,    positive:false },
  { date:'Oct 22', desc:'Salary Credit',     category:'Income',        account:'SBI Account',  amount:  55000,  positive:true  },
  { date:'Oct 21', desc:'Amazon Electronics',category:'Shopping',      account:'ICICI CC',     amount: -2400,   positive:false },
  { date:'Oct 20', desc:'Electricity Board', category:'Utilities',     account:'HDFC Bank',    amount: -1850,   positive:false },
  { date:'Oct 19', desc:'Swiggy Order',      category:'Food',          account:'PayTM Wallet', amount: -650,    positive:false },
  { date:'Oct 18', desc:'Zara Apparel',      category:'Shopping',      account:'ICICI CC',     amount: -4500,   positive:false },
];

export const dashboardStats = {
  totalSpent:  24350,
  totalEarned: 55000,
  netSavings:  30650,
};

export const spendingByCategory = [
  { name:'Food',          value:8450,  color:'#42e5b0' },
  { name:'Transport',     value:4800,  color:'#ff9467' },
  { name:'Shopping',      value:3600,  color:'#ffbca2' },
  { name:'Subscriptions', value:2900,  color:'#85948c' },
  { name:'Utilities',     value:2500,  color:'#3c4a43' },
  { name:'Others',        value:2100,  color:'#2a3530' },
];

export const monthSummaryAlerts = [
  {
    id:1,
    icon:'trending-up',
    title:'Food Spending Alert',
    desc:'You spent ₹8,450 on Food this month, which is 15% higher than your usual average. Consider reviewing recent transactions.',
    type:'warning',
  },
  {
    id:2,
    icon:'refresh',
    title:'Upcoming Bill',
    desc:'Your Netflix subscription (₹649) is due tomorrow. Ensure adequate balance in HDFC Bank account.',
    type:'info',
  },
];

export const subscriptions = [
  { id:1, name:'Netflix',      plan:'Premium 4K Plan',      amount:649,  date:'Oct 24, 2023', renewIn:3,  color:'#000000', logo:'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg', status:'renewing' },
  { id:2, name:'Spotify',      plan:'Individual Plan',      amount:119,  date:'Nov 05, 2023', renewIn:null, color:'#000000', logo:'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg', status:'active' },
  { id:3, name:'Amazon Prime', plan:'Monthly Membership',   amount:299,  date:'Oct 26, 2023', renewIn:5,  color:'#000000', logo:'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', status:'renewing' },
  { id:4, name:'Cult.fit',     plan:'Elite Monthly Pass',   amount:1499, date:'Nov 12, 2023', renewIn:null, color:'#000000', logo:'https://cdn-images.cure.fit/www-curefit-com/image/upload/c_fill,w_120,q_auto:eco,dpr_2,f_auto,fl_progressive//image/test/brand-logo/vman-and-white-cult-text.png', status:'active' },
];

export const recurringStats = {
  totalMonthly:   2566,
  activeSubs:     8,
  upcoming7days:  2,
  yearlyProjection: 30792,
  optimizationScore: 92,
};

export const reportStats = {
  totalIncome:   1245000,
  totalExpenses:  482300,
  netSavings:     762700,
  savingsMargin:  61,
};

export const merchantSpending = [
  { name:'Amazon.in',      amount:124500, percent:85 },
  { name:'Swiggy & Zomato',amount:42300,  percent:33 },
  { name:'Shell Petroleum', amount:28900,  percent:22 },
  { name:'Apple Services',  amount:15400,  percent:12 },
  { name:'Uber India',      amount:12100,  percent:9  },
];

export const cashFlowData = [
  { month:'Jan', income:300000,  expenses:100000 },
  { month:'Feb', income:380000,  expenses:140000 },
  { month:'Mar', income:550000,  expenses:210000 },
  { month:'Apr', income:480000,  expenses:190000 },
  { month:'May', income:720000,  expenses:290000 },
  { month:'Jun', income:680000,  expenses:260000 },
  { month:'Jul', income:1100000, expenses:390000 },
  { month:'Aug', income:1420000, expenses:510000 },
  { month:'Sep', income:1260000, expenses:440000 },
  { month:'Oct', income:980000,  expenses:350000 },
  { month:'Nov', income:850000,  expenses:290000 },
];

export const topCategories = [
  { name:'Shopping',       txCount:14, amount:156400, percent:32, icon:'🛒' },
  { name:'Food & Dining',  txCount:38, amount:84200,  percent:17, icon:'🍽️' },
  { name:'Transport',      txCount:24, amount:42500,  percent:9,  icon:'🚗' },
  { name:'Bills & Utilities', txCount:8, amount:38000, percent:8, icon:'⚡' },
];

export const sessions = [
  { device:'MacBook Pro (Safari)', location:'Mumbai, India', status:'CURRENT', statusColor:'#42e5b0', ago:null },
  { device:'iPhone 13 (App)',       location:'Mumbai, India', status:'REVOKE',  statusColor:'#ff4d4d', ago:'Active 2d ago' },
];
