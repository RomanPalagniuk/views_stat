const cron = require('node-cron');
const syncJob = require('../jobs/sync.job');
const config = require('../config');

/**
 * Executes the sync job to synchronize data from Redis to PostgreSQL.
 * Logs an error message if the sync job fails.
 */

async function runSync() {
  try {
    await syncJob.execute();
  } catch (err) {
    console.error('Sync job failed:', err);
  }
}

cron.schedule(config.syncInterval, runSync);

console.log('Sync worker started.');