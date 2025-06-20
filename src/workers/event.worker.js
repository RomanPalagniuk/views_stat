const rabbitMQService = require('../services/rabbitmq');
const redisService = require('../services/redis');

async function processMessage(msg) {
  try {
    const { autoId, eventType } = JSON.parse(msg.content.toString());
    const redisKey = `${eventType === 'ad_view' ? 'ad_views' : 'phone_views'}:${autoId}`;
    await redisService.incr(redisKey);
    return true;
  } catch (err) {
    console.error('Processing error:', err);
    return false;
  }
}

async function startWorker() {
  try {
    await rabbitMQService.consumeQueue('tracking_events', async (msg) => {
      const success = await processMessage(msg);
      if (success) {
        rabbitMQService.channel.ack(msg);
      } else {
        rabbitMQService.channel.nack(msg, false, false);
      }
    });
    console.log('Event worker started');
  } catch (err) {
    console.error('Worker startup error:', err);
    setTimeout(startWorker, 5000);
  }
}

startWorker();