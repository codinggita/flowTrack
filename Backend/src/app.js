import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes        from './routes/auth.routes.js';
import accountRoutes     from './routes/account.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import reportRoutes      from './routes/report.routes.js';
import recurringRoutes   from './routes/recurring.routes.js';
import settingsRoutes    from './routes/settings.routes.js';
import notificationRoutes  from './routes/notification.routes.js';
import legalRoutes       from './routes/legal.routes.js';
import supportRoutes     from './routes/support.routes.js';
import { errorHandler }  from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization','x-session-token'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.json({
  success: true,
  message: 'FlowTrack API is running ✅',
  timestamp: new Date().toISOString(),
}));

app.use('/api/auth',         authRoutes);
app.use('/api/accounts',     accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports',      reportRoutes);
app.use('/api/recurring',    recurringRoutes);
app.use('/api/settings',     settingsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/legal',        legalRoutes);
app.use('/api/support',      supportRoutes);

app.use('*', (req, res) => res.status(404).json({ success:false, message:`Route ${req.originalUrl} not found` }));
app.use(errorHandler);

export default app;
