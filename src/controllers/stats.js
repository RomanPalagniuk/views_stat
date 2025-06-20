const redisService = require('../services/redis');

class StatsController {
  /**
   * Fetches a set of metrics for an auto with the given `autoId`.
   * Responds with a JSON object containing the requested metrics.
   * If no metrics are specified, defaults to `ad_views` and `phone_views`.
   * @param {string} autoId
   * @param {string} [metrics] comma-separated list of metrics to fetch
   * @returns {Promise<import('koa').Context>} Koa context
   */
  async getStats(ctx) {
    const autoId = ctx.params.autoId;
    const metrics = ctx.query.metrics ? ctx.query.metrics.split(',') : ['ad_views', 'phone_views'];
    
    const validMetrics = ['ad_views', 'phone_views'];
    const result = { autoId };
    
    try {
      for (const metric of metrics) {
        if (validMetrics.includes(metric)) {
          result[metric] = parseInt(await redisService.get(`${metric}:${autoId}`)) || 0;
        }
      }
      ctx.body = result;
    } catch (err) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch stats' };
      console.error('Failed to fetch stats:', err);
    }
  }
}

module.exports = new StatsController();