import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName:  { type:String, required:true, trim:true, minlength:2, maxlength:50 },
  email:     { type:String, required:true, unique:true, lowercase:true, trim:true },
  password:  { type:String, minlength:8, select:false },
  phone:     { type:String, trim:true, default:'' },
  plan:      { type:String, enum:['free','pro'], default:'free' },
  googleId:  { type:String, unique:true, sparse:true },
  avatar:    { type:String, default:'' },
  preferences: {
    currency: { type:String, default:'INR' },
    language: { type:String, default:'en-IN' },
    theme:    { type:String, enum:['dark','light','system'], default:'dark' },
  },
  notifications: {
    newTransaction: { type:Boolean, default:true },
    weeklyReport:   { type:Boolean, default:true },
    subRenewal:     { type:Boolean, default:true },
  },
  twoFAEnabled:         { type:Boolean, default:false },
  resetPasswordToken:   { type:String, select:false },
  resetPasswordExpires: { type:Date,   select:false },
  lastLoginAt:          { type:Date },
}, { timestamps:true, toJSON:{ virtuals:true } });

userSchema.virtual('initials').get(function() {
  return this.fullName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
});
userSchema.virtual('accountId').get(function() {
  return `FT-${this._id.toString().slice(-6).toUpperCase()}`;
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
