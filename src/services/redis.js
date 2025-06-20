const Redis = require('ioredis');
const config = require('../config');

class RedisService {
  constructor() {
    this.client = new Redis(config.redisUrl);
  }

  async incr(key) {
    return this.client.incr(key);
  }

  async get(key) {
    return this.client.get(key);
  }

  async keys(pattern) {
    return this.client.keys(pattern);
  }

  async del(...keys) {
    return this.client.del(...keys);
  }
}

module.exports = new RedisService();