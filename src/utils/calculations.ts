import { differenceInDays, startOfDay, addDays } from 'date-fns';
import type { ReadingData, ReadingResults, ReadingPaceClassification, HealthStatus } from '../types';
import { ReadingPaceEnum, HealthStatusEnum } from '../types';

export const calculateResults = (data: ReadingData): ReadingResults | null => {
  const { totalPages, pagesRead, targetDate, startDate } = data;
  
  if (!totalPages || totalPages <= 0 || pagesRead < 0 || pagesRead > totalPages || !targetDate) {
    return null;
  }

  const today = startOfDay(new Date());
  const target = startOfDay(new Date(targetDate));
  
  const daysRemaining = Math.max(0, differenceInDays(target, today));
  const pagesRemaining = totalPages - pagesRead;
  const isComplete = pagesRemaining === 0;
  
  const requiredPace = daysRemaining > 0 ? Math.ceil(pagesRemaining / daysRemaining) : pagesRemaining;
  const progress = (pagesRead / totalPages) * 100;
  
  // Predict finish date based on required pace
  const estimatedFinishDate = requiredPace > 0 ? addDays(today, Math.ceil(pagesRemaining / requiredPace)) : today;

  // Pace Classification
  let paceClassification: ReadingPaceClassification = ReadingPaceEnum.NORMAL;
  if (requiredPace >= 100) paceClassification = ReadingPaceEnum.MARATHON;
  else if (requiredPace >= 50) paceClassification = ReadingPaceEnum.INTENSIVE;
  else if (requiredPace >= 20) paceClassification = ReadingPaceEnum.NORMAL;
  else if (requiredPace >= 10) paceClassification = ReadingPaceEnum.COMFORTABLE;
  else paceClassification = ReadingPaceEnum.EASY;

  let healthStatus: HealthStatus = HealthStatusEnum.GREEN;
  let insightMessage = '';

  if (isComplete) {
    healthStatus = HealthStatusEnum.GREEN;
    insightMessage = "Congratulations! You've finished the book!";
    return {
      pagesRemaining, daysRemaining, requiredPace: 0, progress: 100,
      estimatedFinishDate: today, paceClassification: ReadingPaceEnum.EASY,
      healthStatus, insightMessage, isComplete: true
    };
  }

  if (daysRemaining === 0 && pagesRemaining > 0) {
    healthStatus = HealthStatusEnum.RED;
    insightMessage = `Deadline reached. You missed by ${pagesRemaining} pages.`;
  } else if (startDate) {
    const start = startOfDay(new Date(startDate));
    const totalDays = differenceInDays(target, start);
    const elapsedDays = differenceInDays(today, start);
    
    if (totalDays > 0 && elapsedDays >= 0) {
      const expectedPacePerDay = totalPages / totalDays;
      const expectedPagesRead = Math.floor(expectedPacePerDay * elapsedDays);
      
      const aheadByPages = pagesRead - expectedPagesRead;
      
      if (aheadByPages > 0) {
        healthStatus = HealthStatusEnum.GREEN;
        const daysAhead = expectedPacePerDay > 0 ? Math.floor(aheadByPages / expectedPacePerDay) : 0;
        insightMessage = daysAhead > 0 
          ? `You're ahead by ${daysAhead} day${daysAhead > 1 ? 's' : ''}! Great momentum.`
          : `You're slightly ahead of schedule. Keep it up!`;
      } else if (aheadByPages < 0) {
        // Find how many days behind
        const daysBehind = expectedPacePerDay > 0 ? Math.ceil(Math.abs(aheadByPages) / expectedPacePerDay) : 0;
        if (daysBehind > 3) {
          healthStatus = HealthStatusEnum.RED;
          insightMessage = `You're behind by ${daysBehind} days. Weekend reading recommended.`;
        } else {
          healthStatus = HealthStatusEnum.AMBER;
          insightMessage = `Slightly behind. You need ${requiredPace} pages/day to catch up.`;
        }
      } else {
        healthStatus = HealthStatusEnum.GREEN;
        insightMessage = `Perfectly on track. Just ${requiredPace} pages today.`;
      }
    }
  } else {
    // No start date logic
    if (requiredPace > 50) {
      healthStatus = HealthStatusEnum.AMBER;
      insightMessage = `Aggressive pace needed. Try breaking it into multiple sessions.`;
    } else {
      healthStatus = HealthStatusEnum.GREEN;
      insightMessage = `You need ${requiredPace} pages/day to finish on time.`;
    }
  }

  return {
    pagesRemaining,
    daysRemaining,
    requiredPace,
    progress,
    estimatedFinishDate,
    paceClassification,
    healthStatus,
    insightMessage,
    isComplete
  };
};
