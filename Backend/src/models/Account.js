import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId:   { type:mongoose.Schema.Types.ObjectId, ref:'User', required:true, index:true },
  name:     { type:String, required:true, trim:true, maxlength:50 },
  type:     { type:String, enum:['UPI','BANK','CREDIT_CARD','WALLET'], required:true },
  balance:  { type:Number, default:0 },
  icon:     { type:String, default:'', maxlength:3 },
  color:    { type:String, default:'#242c28' },
  isActive: { type:Boolean, default:true, index:true },
}, { timestamps:true, toJSON:{ virtuals:true } });

accountSchema.virtual('balanceLabel').get(function() {
  return { UPI:'Available', BANK:'Available Balance', CREDIT_CARD:'Current Outstanding', WALLET:'Wallet Balance' }[this.type] || 'Balance';
});
accountSchema.virtual('isPositive').get(function() { return this.balance >= 0; });

export default mongoose.model('Account', accountSchema);
