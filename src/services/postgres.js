const { Client } = require('pg');
const config = require('../config');

class PostgresService {
  async query(sql, params) {
    const client = new Client({ connectionString: config.pgUrl });
    await client.connect();
    try {
      const result = await client.query(sql, params);
      return result;
    } finally {
      await client.end();
    }
  }

  async batchUpsert(metrics) {
    // metrics: [{ autoId, adViews, phoneViews }]
    const client = new Client({ connectionString: config.pgUrl });
    await client.connect();
    try {
      await client.query('BEGIN');
      for (const metric of metrics) {
        await client.query(
          `INSERT INTO auto_metrics (auto_id, ad_views, phone_views)
           VALUES ($1, $2, $3)
           ON CONFLICT (auto_id) DO UPDATE SET
             ad_views = auto_metrics.ad_views + EXCLUDED.ad_views,
             phone_views = auto_metrics.phone_views + EXCLUDED.phone_views,
             updated_at = NOW()`,
          [metric.autoId, metric.adViews, metric.phoneViews]
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.end();
    }
  }
}

module.exports = new PostgresService();