import SupportTicket from '../models/SupportTicket.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';
import { sendEmail } from '../utils/sendEmail.js';

// ── GET ALL TICKETS FOR USER ────────────────────────────────────────────
export const getTickets = async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = { userId: req.user.id };
  if (status && status !== 'all') query.status = status;

  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await SupportTicket.countDocuments(query);
  const tickets = await SupportTicket.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-messages'); // exclude messages from list view

  return paginatedResponse(res, tickets, total, page, limit);
};

// ── GET SINGLE TICKET WITH FULL CONVERSATION ───────────────────────────
export const getTicket = async (req, res) => {
  const ticket = await SupportTicket.findOne({
    _id:    req.params.id,
    userId: req.user.id,
  });
  if (!ticket) return errorResponse(res, 'Ticket not found', 404);
  return successResponse(res, ticket);
};

// ── CREATE NEW TICKET ──────────────────────────────────────────────────
export const createTicket = async (req, res) => {
  const { subject, category, description, priority } = req.body;

  if (!subject || !category || !description) {
    return errorResponse(res, 'Subject, category and description are required', 400);
  }

  const ticket = await SupportTicket.create({
    userId:      req.user.id,
    subject,
    category,
    description,
    priority:    priority || 'medium',
    userAgent:   req.headers['user-agent'] || '',
    // Add first message from user
    messages: [{
      sender:     'user',
      message:    description,
      senderName: req.user.fullName,
      sentAt:     new Date(),
    }],
  });

  // Send confirmation email to user
  sendEmail({
    to:      req.user.email,
    subject: `Support Ticket ${ticket.ticketId} — Received`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:520px;margin:0 auto;
        background:#0e1511;color:#dce4de;padding:40px;border-radius:12px;">
        <h2 style="color:#42e5b0;">FlowTrack Support</h2>
        <p>Hi ${req.user.fullName},</p>
        <p style="color:#bbcac1;">We've received your support request and will respond within 24 hours.</p>
        <div style="background:#1a211d;border:1px solid #3c4a43;border-radius:8px;padding:16px;margin:20px 0;">
          <p style="margin:0 0 4px;color:#85948c;font-size:12px;">TICKET ID</p>
          <p style="margin:0;font-size:20px;font-weight:700;color:#42e5b0;">${ticket.ticketId}</p>
          <p style="margin:12px 0 4px;color:#85948c;font-size:12px;">SUBJECT</p>
          <p style="margin:0;font-size:14px;">${subject}</p>
        </div>
        <p style="color:#85948c;font-size:12px;">
          Keep this ticket ID for reference. You can track your ticket status in the app under Support.
        </p>
      </div>
    `,
  }).catch(console.error);

  // Forward to Formspree so admin (Swaraj) gets the notification email
  if (process.env.FORMSPREE_URL) {
    fetch(process.env.FORMSPREE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        subject: `[FlowTrack Support] ${subject}`,
        userEmail: req.user.email,
        userName: req.user.fullName,
        ticketId: ticket.ticketId,
        category,
        priority,
        description
      })
    }).catch(err => console.error('Formspree error:', err.message));
  }

  return successResponse(res, ticket, `Ticket ${ticket.ticketId} created successfully`, 201);
};

// ── ADD REPLY TO TICKET ────────────────────────────────────────────────
export const replyToTicket = async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return errorResponse(res, 'Message cannot be empty', 400);

  const ticket = await SupportTicket.findOne({
    _id:    req.params.id,
    userId: req.user.id,
  });
  if (!ticket) return errorResponse(res, 'Ticket not found', 404);
  if (!ticket.isOpen) return errorResponse(res, 'Cannot reply to a closed ticket. Please open a new ticket.', 400);

  ticket.messages.push({
    sender:     'user',
    message:    message.trim(),
    senderName: req.user.fullName,
    sentAt:     new Date(),
  });

  // If ticket was waiting for user reply, move back to in_progress
  if (ticket.status === 'waiting_for_user') {
    ticket.status = 'in_progress';
  }

  await ticket.save();
  return successResponse(res, ticket, 'Reply sent');
};

// ── RATE RESOLVED TICKET ───────────────────────────────────────────────
export const rateTicket = async (req, res) => {
  const { score, comment } = req.body;

  if (!score || score < 1 || score > 5) {
    return errorResponse(res, 'Rating must be between 1 and 5', 400);
  }

  const ticket = await SupportTicket.findOne({
    _id:    req.params.id,
    userId: req.user.id,
  });
  if (!ticket) return errorResponse(res, 'Ticket not found', 404);
  if (ticket.status !== 'resolved') return errorResponse(res, 'Can only rate resolved tickets', 400);
  if (ticket.rating.score) return errorResponse(res, 'Ticket already rated', 400);

  ticket.rating = {
    score,
    comment: comment || '',
    ratedAt: new Date(),
  };
  ticket.status   = 'closed';
  ticket.closedAt = new Date();
  await ticket.save();

  return successResponse(res, null, 'Thank you for your feedback!');
};

// ── CLOSE TICKET (user closes it themselves) ───────────────────────────
export const closeTicket = async (req, res) => {
  const ticket = await SupportTicket.findOne({
    _id:    req.params.id,
    userId: req.user.id,
  });
  if (!ticket) return errorResponse(res, 'Ticket not found', 404);
  if (!ticket.isOpen) return errorResponse(res, 'Ticket is already closed', 400);

  ticket.status   = 'closed';
  ticket.closedAt = new Date();
  await ticket.save();

  return successResponse(res, null, 'Ticket closed');
};

// ── GET SUPPORT STATS FOR USER ─────────────────────────────────────────
export const getSupportStats = async (req, res) => {
  const [total, open, resolved] = await Promise.all([
    SupportTicket.countDocuments({ userId: req.user.id }),
    SupportTicket.countDocuments({ userId: req.user.id, status: { $in: ['open','in_progress','waiting_for_user'] } }),
    SupportTicket.countDocuments({ userId: req.user.id, status: { $in: ['resolved','closed'] } }),
  ]);

  return successResponse(res, { total, open, resolved });
};
