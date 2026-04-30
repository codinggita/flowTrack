import 'dotenv/config';
import 'express-async-errors';
import app from './src/app.js';
import connectDB from './src/config/db.js';
import { startCronJobs } from './src/jobs/cronJobs.js';

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ FlowTrack API running on http://localhost:${PORT}`);
    startCronJobs();
  });
}).catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});
