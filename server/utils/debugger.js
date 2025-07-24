const debug = require('debug');

// Create different debug namespaces
const dbDebug = debug('app:db');
const apiDebug = debug('app:api');
const errorDebug = debug('app:error');

class Debugger {
  static logRequest(req, res, next) {
    const start = Date.now();
    
    apiDebug(`➡️  ${req.method} ${req.url}`, {
      body: req.body,
      query: req.query,
      params: req.params,
      headers: req.headers
    });

    res.on('finish', () => {
      const duration = Date.now() - start;
      apiDebug(`⬅️  ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });

    next();
  }

  static logDatabase(operation, collection, query = {}) {
    dbDebug(`🗄️  ${operation} on ${collection}`, query);
  }

  static logError(error, context = {}) {
    errorDebug(`❌ Error in ${context.function || 'unknown'}:`, {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  static logPerformance(label, fn) {
    return async (...args) => {
      const start = Date.now();
      try {
        const result = await fn(...args);
        const duration = Date.now() - start;
        apiDebug(`⏱️  ${label} completed in ${duration}ms`);
        return result;
      } catch (error) {
        const duration = Date.now() - start;
        errorDebug(`⏱️  ${label} failed after ${duration}ms:`, error.message);
        throw error;
      }
    };
  }

  static createMemorySnapshot() {
    const usage = process.memoryUsage();
    console.log('Memory Usage:', {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(usage.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(usage.external / 1024 / 1024)} MB`
    });
  }
}

module.exports = Debugger;