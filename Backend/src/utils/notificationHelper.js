import Notification from '../models/Notification.js';

export const createNotification = async ({ userId, type, title, message, link = '/dashboard', metadata = {} }) => {
  try {
    // Prevent duplicate notifications of same type+metadata within 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const duplicate = await Notification.findOne({
      userId,
      type,
      'metadata.key': metadata.key,
      createdAt: { $gte: oneHourAgo },
    });
    if (duplicate) return null;

    return await Notification.create({ userId, type, title, message, link, metadata });
  } catch (err) {
    console.error('Notification creation error:', err.message);
    return null;
  }
};

// Called when user adds expense transaction
export const notifyLargeExpense = (userId, amount, description, category) =>
  createNotification({
    userId,
    type: 'spending_alert',
    title: 'Large Expense Detected',
    message: `You spent ₹${amount.toLocaleString('en-IN')} on "${description}". This is a significant expense.`,
    link: '/transactions',
    metadata: { key: `expense-${description}-${Date.now()}`, amount, category },
  });

// Called when user adds income transaction
export const notifyIncome = (userId, amount, description) =>
  createNotification({
    userId,
    type: 'income',
    title: 'Income Received',
    message: `₹${amount.toLocaleString('en-IN')} credited from "${description}". Your savings are looking good!`,
    link: '/transactions',
    metadata: { key: `income-${description}-${Date.now()}`, amount },
  });

// Called when account balance drops below ₹1,000
export const notifyLowBalance = (userId, accountName, balance) =>
  createNotification({
    userId,
    type: 'low_balance',
    title: 'Low Balance Warning',
    message: `Your ${accountName} balance is ₹${balance.toLocaleString('en-IN')} — below ₹1,000. Consider topping up.`,
    link: '/accounts',
    metadata: { key: `low-balance-${accountName}`, balance },
  });

// Called by cron job for subscription renewals
export const notifyUpcomingBill = (userId, subName, amount, daysLeft) =>
  createNotification({
    userId,
    type: 'upcoming_bill',
    title: `${subName} Renews in ${daysLeft} Day${daysLeft > 1 ? 's' : ''}`,
    message: `Your ${subName} subscription (₹${amount.toLocaleString('en-IN')}/mo) is due soon. Ensure adequate balance.`,
    link: '/recurring',
    metadata: { key: `renewal-${subName}-${daysLeft}`, amount, daysLeft },
  });

// Called when category monthly spend > ₹10,000
export const notifyBudgetAlert = (userId, category, amount) =>
  createNotification({
    userId,
    type: 'budget_alert',
    title: `High ${category} Spending`,
    message: `You've spent ₹${amount.toLocaleString('en-IN')} on ${category} this month. Consider reviewing your expenses.`,
    link: '/reports',
    metadata: { key: `budget-${category}`, amount, category },
  });
