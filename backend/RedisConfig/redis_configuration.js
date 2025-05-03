// redis.js
const { createClient } = require("redis");

const redis = createClient({
  socket: {
    host: 'localhost',
    port: 6379,
  },
});

redis.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
      console.log('Connected to Redis');
    }
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
};

connectRedis()

module.exports = { redis, connectRedis };
