import { createClient } from 'redis';

const host = process.env.REDIS_HOST;
const port = parseInt(process.env.REDIS_PORT || '6379'
);

export const redisClient = createClient({
  host,
  port,
});

export const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected for chat service');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
};
