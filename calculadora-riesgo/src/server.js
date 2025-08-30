const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.port, () => {
  console.log(`Server running at http://localhost:${config.port}/api`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`Press Ctrl+C to stop the server`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
}); 