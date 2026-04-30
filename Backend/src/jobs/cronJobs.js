import cron from 'node-cron';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Subscription from '../models/Subscription.js';
import Notification from '../models/Notification.js';
import { sendWeeklyReportEmail, sendEmail } from '../utils/sendEmail.js';
import { notifyUpcomingBill } from '../utils/notificationHelper.js';

export const startCronJobs = () => {
  console.log('⏰ Cron jobs started');

  // Weekly report — every Sunday 9am
  cron.schedule('0 9 * * 0', async () => {
    const users   = await User.find({ 'notifications.weeklyReport':true });
    const weekAgo = new Date(Date.now() - 7*24*60*60*1000);
    for (const user of users) {
      const [agg] = await Transaction.aggregate([
        { $match: { userId:user._id, date:{ $gte:weekAgo } } },
        { $group: { _id:null,
          income:   { $sum:{ $cond:[{ $eq:['$type','income']  }, '$amount', 0] } },
          expenses: { $sum:{ $cond:[{ $eq:['$type','expense'] }, '$amount', 0] } },
        }},
      ]);
      await sendWeeklyReportEmail(user, agg || { income:0, expenses:0 });
    }
  });

  // Subscription renewal reminders — every day 8am
  cron.schedule('0 8 * * *', async () => {
    const in7Days = new Date(Date.now() + 7*24*60*60*1000);
    const subs = await Subscription.find({
      isActive:true,
      nextRenewalDate:{ $gte:new Date(), $lte:in7Days },
    }).populate('userId');
    
    for (const sub of subs) {
      const user = sub.userId;
      if (!user?.notifications?.subRenewal) continue;
      
      const days = Math.ceil((sub.nextRenewalDate - new Date()) / (1000*60*60*24));
      
      // Use new notification helper
      notifyUpcomingBill(user._id, sub.name, sub.amount, days).catch(console.error);
      
      const existsEmail = await Notification.findOne({
        userId: user._id, type:'upcoming_bill',
        'metadata.subscriptionId': sub._id,
        createdAt: { $gte: new Date(Date.now()-24*60*60*1000) },
      });
      
      if (!existsEmail) {
        await sendEmail({
          to:      user.email,
          subject: `${sub.name} renews in ${days} day${days>1?'s':''}`,
          html:    `<div style="font-family:Inter;background:#0e1511;color:#dce4de;padding:40px;border-radius:12px;">
            <h2 style="color:#42e5b0;">Subscription Reminder</h2>
            <p><strong>${sub.name}</strong> renews in <strong style="color:#ffbca2;">${days} day${days>1?'s':''}</strong>.</p>
            <p style="color:#42e5b0;font-size:20px;">₹${sub.amount.toLocaleString('en-IN')}/mo</p>
          </div>`,
        });
      }
    }
  });

  // Roll over renewal dates — midnight daily
  cron.schedule('0 0 * * *', async () => {
    const expired = await Subscription.find({ isActive:true, nextRenewalDate:{ $lt:new Date() } });
    for (const sub of expired) {
      const d = new Date(sub.nextRenewalDate);
      if (sub.billingCycle==='monthly') d.setMonth(d.getMonth()+1);
      if (sub.billingCycle==='yearly')  d.setFullYear(d.getFullYear()+1);
      if (sub.billingCycle==='weekly')  d.setDate(d.getDate()+7);
      sub.nextRenewalDate = d;
      await sub.save();
    }
  });
};
