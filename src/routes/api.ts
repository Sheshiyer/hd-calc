import express from 'express';
import { validateBirthData } from '../middleware/validation';
import { BirthData, BatchCalculationRequest } from '../types/humanDesign';
import { calculateProfile } from '../services/calculator';
import { getCachedProfile, cacheProfile } from '../services/cache';
import { ApiError } from '../middleware/errorHandler';

export const router = express.Router();

// Calculate single profile
router.post('/calculate', validateBirthData, async (req, res, next) => {
  try {
    const birthData: BirthData = req.body;
    
    // Check cache first
    const cacheKey = `profile:${JSON.stringify(birthData)}`;
    const cachedResult = await getCachedProfile(cacheKey);
    
    if (cachedResult) {
      return res.json({
        success: true,
        profile: cachedResult,
        cacheHit: true
      });
    }

    // Calculate new profile
    const profile = await calculateProfile(birthData);
    
    // Cache the result
    await cacheProfile(cacheKey, profile);

    res.json({
      success: true,
      profile,
      cacheHit: false
    });
  } catch (error) {
    next(error);
  }
});

// Lookup cached profile
router.get('/lookup/:id', async (req, res, next) => {
  try {
    const profile = await getCachedProfile(req.params.id);
    
    if (!profile) {
      const error = new Error('Profile not found') as ApiError;
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      profile,
      cacheHit: true
    });
  } catch (error) {
    next(error);
  }
});

// Batch calculate profiles
router.post('/batch', async (req, res, next) => {
  try {
    const { profiles }: BatchCalculationRequest = req.body;
    
    if (!Array.isArray(profiles) || profiles.length === 0) {
      const error = new Error('Invalid batch request') as ApiError;
      error.statusCode = 400;
      throw error;
    }

    const results = await Promise.all(
      profiles.map(async (birthData) => {
        try {
          const profile = await calculateProfile(birthData);
          return { birthData, profile };
        } catch (error) {
          return {
            birthData,
            error: (error as Error).message
          };
        }
      })
    );

    res.json({
      success: true,
      results
    });
  } catch (error) {
    next(error);
  }
});
