import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  ticketId: {
    // Human-readable ticket ID like FT-2024-0001
    type: String,
    unique: true,
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: 150,
  },
  category: {
    type: String,
    enum: [
      'account',        // Login, password, profile issues
      'transactions',   // Adding, editing, deleting transactions
      'accounts',       // Bank/UPI/wallet accounts
      'reports',        // Charts, graphs not loading
      'subscriptions',  // Recurring billing issues
      'billing',        // Pro plan, payments
      'bug',            // App bugs or errors
      'feature',        // Feature requests
      'data',           // Data export, deletion requests
      'other',          // General queries
    ],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'],
    default: 'open',
    index: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: 2000,
  },
  // Conversation thread
  messages: [{
    sender:    { type: String, enum: ['user', 'support'], required: true },
    message:   { type: String, required: true, maxlength: 2000 },
    sentAt:    { type: Date, default: Date.now },
    senderName:{ type: String, default: 'FlowTrack Support' },
  }],
  // Resolution
  resolvedAt:  { type: Date, default: null },
  closedAt:    { type: Date, default: null },
  // User satisfaction rating after resolution
  rating: {
    score:   { type: Number, min: 1, max: 5, default: null },
    comment: { type: String, default: '' },
    ratedAt: { type: Date, default: null },
  },
  // User's device info for debugging
  userAgent:  { type: String, default: '' },
  appVersion: { type: String, default: '1.0.0' },
}, { timestamps: true, toJSON: { virtuals: true } });

// Auto-generate ticket ID before save
supportTicketSchema.pre('save', async function (next) {
  if (!this.ticketId) {
    const count = await this.constructor.countDocuments();
    const year  = new Date().getFullYear();
    this.ticketId = `FT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

// Virtual: is ticket open?
supportTicketSchema.virtual('isOpen').get(function () {
  return ['open', 'in_progress', 'waiting_for_user'].includes(this.status);
});

supportTicketSchema.index({ userId: 1, status: 1, createdAt: -1 });

export default mongoose.model('SupportTicket', supportTicketSchema);
