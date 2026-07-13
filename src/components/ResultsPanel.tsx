import { motion } from 'framer-motion';
import type { ReadingResults } from '../types';
import { HealthStatusEnum } from '../types';
import { TrendingUp, AlertTriangle, Clock, CalendarDays, Activity } from 'lucide-react';

interface ResultsPanelProps {
  results: ReadingResults;
}

export function ResultsPanel({ results }: ResultsPanelProps) {
  const getHealthColors = (status: string) => {
    switch (status) {
      case HealthStatusEnum.GREEN: return 'from-success/20 to-success/5 border-success text-success';
      case HealthStatusEnum.AMBER: return 'from-warning/20 to-warning/5 border-warning text-warning';
      case HealthStatusEnum.RED: return 'from-error/20 to-error/5 border-error text-error';
      default: return 'from-success/20 to-success/5 border-success text-success';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case HealthStatusEnum.GREEN: return <TrendingUp size={24} className="text-success" />;
      case HealthStatusEnum.AMBER: return <AlertTriangle size={24} className="text-warning" />;
      case HealthStatusEnum.RED: return <Clock size={24} className="text-error" />;
      default: return <TrendingUp size={24} className="text-success" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 pt-8 border-t border-textMuted/20"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Left</span>
          <span className="text-3xl font-serif font-bold text-accent">{results.pagesRemaining}</span>
          <span className="text-sm font-medium text-textMuted mt-1">pages</span>
        </div>
        <div className="stat-card">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Time</span>
          <span className="text-3xl font-serif font-bold text-accent">{results.daysRemaining}</span>
          <span className="text-sm font-medium text-textMuted mt-1">days</span>
        </div>
        <div className="stat-card md:col-span-2">
          <span className="text-xs font-bold text-textMuted uppercase tracking-wider mb-1">Daily Goal</span>
          <span className="text-3xl font-serif font-bold text-accent">{results.requiredPace}</span>
          <span className="text-sm font-medium text-textMuted mt-1">pages / day</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-end mb-3">
          <span className="font-semibold text-textMain flex items-center gap-2">
            <Activity size={18} className="text-accent" />
            Journey Progress
          </span>
          <span className="text-2xl font-serif font-bold text-accent">{Math.round(results.progress)}%</span>
        </div>
        <div className="h-4 bg-black/5 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${results.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent to-warning rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-5 rounded-2xl border-l-4 bg-gradient-to-r ${getHealthColors(results.healthStatus)} flex items-start gap-4 shadow-sm`}>
          <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            {getHealthIcon(results.healthStatus)}
          </div>
          <div>
            <h4 className="font-semibold mb-1 capitalize">{results.healthStatus} Status</h4>
            <p className="text-sm opacity-90 leading-relaxed">{results.insightMessage}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/50 border border-white shadow-sm flex items-start gap-4">
           <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
            <CalendarDays size={24} className="text-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-textMain mb-1">Predicted Finish</h4>
            <p className="text-sm text-textMuted leading-relaxed">
              Based on your pace, you'll finish on <strong className="text-textMain">{results.estimatedFinishDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong>.
              <br/>
              Pace: <span className="font-semibold">{results.paceClassification}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
