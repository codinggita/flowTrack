import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  userId:          { type:mongoose.Schema.Types.ObjectId, ref:'User',    required:true, index:true },
  accountId:       { type:mongoose.Schema.Types.ObjectId, ref:'Account', required:true },
  name:            { type:String, required:true, trim:true },
  plan:            { type:String, default:'Standard Plan' },
  amount:          { type:Number, required:true, min:0.01 },
  billingCycle:    { type:String, enum:['monthly','yearly','weekly'], default:'monthly' },
  nextRenewalDate: { type:Date,   required:true },
  color:           { type:String, default:'#1a211d' },
  letter:          { type:String, maxlength:2, default:'S' },
  isActive:        { type:Boolean, default:true, index:true },
}, { timestamps:true, toJSON:{ virtuals:true } });

subscriptionSchema.virtual('daysUntilRenewal').get(function() {
  return Math.ceil((this.nextRenewalDate - new Date()) / (1000*60*60*24));
});
subscriptionSchema.virtual('isRenewingSoon').get(function() {
  const d = this.daysUntilRenewal;
  return d >= 0 && d <= 7;
});
subscriptionSchema.virtual('monthlyAmount').get(function() {
  if (this.billingCycle === 'yearly') return parseFloat((this.amount/12).toFixed(2));
  if (this.billingCycle === 'weekly') return parseFloat((this.amount*4.33).toFixed(2));
  return this.amount;
});

export default mongoose.model('Subscription', subscriptionSchema);
