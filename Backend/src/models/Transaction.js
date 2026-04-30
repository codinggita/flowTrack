import mongoose from 'mongoose';

const CATEGORIES = ['Food','Transport','Shopping','Income','Housing','Utilities','Software','Tech','Investment','Others'];

const transactionSchema = new mongoose.Schema({
  userId:      { type:mongoose.Schema.Types.ObjectId, ref:'User',        required:true, index:true },
  accountId:   { type:mongoose.Schema.Types.ObjectId, ref:'Account',     required:true },
  description: { type:String, required:true, trim:true, maxlength:100 },
  amount:      { type:Number, required:true, min:0.01 },
  type:        { type:String, enum:['income','expense'], required:true },
  category:    { type:String, enum:CATEGORIES, required:true },
  date:        { type:Date,   default:Date.now, required:true },
  notes:       { type:String, trim:true, maxlength:500, default:'' },
  isRecurring: { type:Boolean, default:false },
  importedFromCSV: { type:Boolean, default:false },
}, { timestamps:true });

transactionSchema.index({ userId:1, date:-1 });
transactionSchema.index({ userId:1, category:1, date:-1 });
transactionSchema.index({ userId:1, type:1,     date:-1 });

export default mongoose.model('Transaction', transactionSchema);
