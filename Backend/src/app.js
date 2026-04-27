const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to FlowTrack API' });
});

// Import and use routes here
// app.use('/api/auth', require('./routes/auth.routes'));

// Error Handler
app.use(errorHandler);

module.exports = app;
