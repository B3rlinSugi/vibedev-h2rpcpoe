import { useMemo } from 'react';
import type { ReadingFormValues } from '../validators/schema';
import type { ReadingResults } from '../types';
import { calculateResults } from '../utils/calculations';

export const useReadingCalculator = (data: Partial<ReadingFormValues>): ReadingResults | null => {
  return useMemo(() => {
    if (data.totalPages && data.pagesRead !== undefined && data.targetDate) {
      return calculateResults({
        totalPages: data.totalPages,
        pagesRead: data.pagesRead,
        targetDate: data.targetDate,
        startDate: data.startDate
      });
    }
    return null;
  }, [data.totalPages, data.pagesRead, data.targetDate, data.startDate]);
};
