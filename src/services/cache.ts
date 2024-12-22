import { createClient } from 'redis';
import { HDProfile } from '../types/humanDesign';

let redisClient: any = null;
let redisEnabled = false;

// Only initialize Redis if REDIS_URL is provided
if (process.env.REDIS_URL) {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL
    });

    redisClient.on('error', (err: Error) => {
      console.error('Redis Client Error:', err);
      redisEnabled = false;
    });

    redisClient.on('connect', () => {
      console.log('Redis connected successfully');
      redisEnabled = true;
    });

    // Connect to Redis when the module is imported
    redisClient.connect().catch((err: Error) => {
      console.error('Redis connection failed:', err);
      redisEnabled = false;
    });
  } catch (error) {
    console.error('Redis initialization failed:', error);
    redisEnabled = false;
  }
}

const CACHE_EXPIRY = 60 * 60 * 24 * 7; // 7 days in seconds

export const getCachedProfile = async (key: string): Promise<HDProfile | null> => {
  if (!redisEnabled) {
    return null;
  }

  try {
    const cached = await redisClient.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
};

export const cacheProfile = async (key: string, profile: HDProfile): Promise<void> => {
  if (!redisEnabled) {
    return;
  }

  try {
    await redisClient.setEx(key, CACHE_EXPIRY, JSON.stringify(profile));
  } catch (error) {
    console.error('Cache storage error:', error);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  if (redisEnabled && redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      console.error('Redis shutdown error:', error);
    }
  }
});
