export type ReadingPaceClassification = 
  | 'Marathon'
  | 'Intensive'
  | 'Normal'
  | 'Comfortable'
  | 'Easy';

export const ReadingPaceEnum = {
  MARATHON: 'Marathon' as ReadingPaceClassification,
  INTENSIVE: 'Intensive' as ReadingPaceClassification,
  NORMAL: 'Normal' as ReadingPaceClassification,
  COMFORTABLE: 'Comfortable' as ReadingPaceClassification,
  EASY: 'Easy' as ReadingPaceClassification
};

export type HealthStatus = 
  | 'Green'
  | 'Amber'
  | 'Red';

export const HealthStatusEnum = {
  GREEN: 'Green' as HealthStatus,
  AMBER: 'Amber' as HealthStatus,
  RED: 'Red' as HealthStatus
};

export interface ReadingData {
  totalPages: number;
  pagesRead: number;
  targetDate: string;
  startDate?: string;
}

export interface ReadingResults {
  pagesRemaining: number;
  daysRemaining: number;
  requiredPace: number;
  progress: number;
  estimatedFinishDate: Date;
  paceClassification: ReadingPaceClassification;
  healthStatus: HealthStatus;
  insightMessage: string;
  isComplete: boolean;
}
