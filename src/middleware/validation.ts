import { Request, Response, NextFunction } from 'express';
import { BirthData } from '../types/humanDesign';
import { ApiError } from './errorHandler';

export const validateBirthData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body as BirthData;
    const errors: string[] = [];

    // Validate date format (YYYY-MM-DD)
    if (!data.date?.match(/^\d{4}-\d{2}-\d{2}$/)) {
      errors.push('Invalid date format. Use YYYY-MM-DD');
    }

    // Validate time format (HH:mm:ss)
    if (!data.time?.match(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)) {
      errors.push('Invalid time format. Use HH:mm:ss (24-hour format)');
    }

    // Validate location
    if (!data.location) {
      errors.push('Location is required');
    } else {
      // Validate latitude (-90 to 90)
      if (typeof data.location.lat !== 'number' || 
          data.location.lat < -90 || 
          data.location.lat > 90) {
        errors.push('Invalid latitude. Must be between -90 and 90');
      }

      // Validate longitude (-180 to 180)
      if (typeof data.location.lng !== 'number' || 
          data.location.lng < -180 || 
          data.location.lng > 180) {
        errors.push('Invalid longitude. Must be between -180 and 180');
      }

      // Validate timezone
      if (!data.location.timezone || typeof data.location.timezone !== 'string') {
        errors.push('Invalid timezone');
      }
    }

    if (errors.length > 0) {
      const error = new Error('Validation failed') as ApiError;
      error.statusCode = 400;
      error.errors = errors;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  }
};
