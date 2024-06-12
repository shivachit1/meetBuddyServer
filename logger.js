import log4js from 'log4js';

// Load the log4js configuration
log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: { type: 'file', filename: 'logs/app.log', maxLogSize: 10485760, backups: 3, compress: true }
  },
  categories: {
    default: { appenders: ['console', 'file'], level: 'info' }
  }
});

// Get a logger instance
const logger = log4js.getLogger();

export default logger;