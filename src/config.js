module.exports = {
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  rabbitmqUrl: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  pgUrl: process.env.PG_URL || 'postgres://postgres:postgres@localhost:5432/auto_stats',
  port: process.env.PORT || 3000,
  syncInterval: process.env.SYNC_INTERVAL || '*/2 * * * *'
};