const express = require('express');
const routes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middlewares/error');

const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple CORS headers for future frontend integration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// API routes
app.use('/api', routes);

// 404 handler for unmatched routes
app.use('*', notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app; 