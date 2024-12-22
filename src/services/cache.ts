import { createClient } from 'redis';
import { HDProfile } from '../types/humanDesign';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect to Redis when the module is imported
redisClient.connect().catch(console.error);

const CACHE_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export const getCachedProfile = async (key: string): Promise<HDProfile | null> => {
  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

export const cacheProfile = async (key: string, profile: HDProfile): Promise<void> => {
  try {
    await redisClient.setEx(key, CACHE_EXPIRY, JSON.stringify(profile));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  try {
    await redisClient.quit();
  } catch (error) {
    console.error('Redis shutdown error:', error);
  }
});
