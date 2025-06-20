const redisService = require('../services/redis');
const postgresService = require('../services/postgres');

/**
 * Synchronizes data from Redis to PostgreSQL.
 *
 * Gets all keys from Redis, parses them into an array of { autoId, adViews, phoneViews } objects
 * and upserts them into PostgreSQL. Then deletes all those keys from Redis.
 *
 * @returns {Promise<void>}
 */
async function execute() {
  const adKeys = await redisService.keys('ad_views:*');
  const phoneKeys = await redisService.keys('phone_views:*');
  const allKeys = [...new Set([...adKeys, ...phoneKeys])];
  
  if (allKeys.length === 0) {
    console.log('No keys to sync');
    return;
  }

  const metricsMap = new Map();
  
  for (const key of allKeys) {
    const [metric, autoId] = key.split(':');
    const count = parseInt(await redisService.get(key));
    
    if (!metricsMap.has(autoId)) {
      metricsMap.set(autoId, { autoId, adViews: 0, phoneViews: 0 });
    }
    
    const metricData = metricsMap.get(autoId);
    if (metric === 'ad_views') metricData.adViews = count;
    if (metric === 'phone_views') metricData.phoneViews = count;
  }

  await postgresService.batchUpsert(Array.from(metricsMap.values()));
  await redisService.del(...allKeys);
  
  console.log(`Synced ${allKeys.length} keys to PostgreSQL`);
}

module.exports = { execute };