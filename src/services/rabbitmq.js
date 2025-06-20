const amqp = require('amqplib');
const config = require('../config');
const { Buffer } = require('buffer');

class RabbitMQService {
  constructor() {
    this.channel = null;
    this.connect();
  }

  async connect() {
    try {
      const conn = await amqp.connect(config.rabbitmqUrl);
      this.channel = await conn.createChannel();
      await this.channel.assertQueue('tracking_events', { durable: true });
      console.log('RabbitMQ connected');
    } catch (err) {
      console.error('RabbitMQ connection error, retrying in 5 sec...', err);
      setTimeout(() => this.connect(), 5000);
    }
  }

  async sendToQueue(queue, message) {
    while (!this.channel) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
  }

  async consumeQueue(queue, callback) {
    while (!this.channel) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    await this.channel.consume(queue, callback, { noAck: false });
  }
}

module.exports = new RabbitMQService();