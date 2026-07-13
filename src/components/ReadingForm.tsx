import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReadingFormValues } from '../validators/schema';
import { readingFormSchema } from '../validators/schema';
import { BookOpen, Bookmark, Target, CalendarDays, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { cn } from '../lib/utils';

interface ReadingFormProps {
  onValuesChange: (values: Partial<ReadingFormValues>) => void;
}

export function ReadingForm({ onValuesChange }: ReadingFormProps) {
  const [showOptional, setShowOptional] = useState(false);

  const todayStr = useMemo(() => {
    const today = new Date();
    return new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  }, []);

  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(readingFormSchema),
    mode: 'onChange',
    defaultValues: {
      totalPages: undefined,
      pagesRead: undefined,
      targetDate: '',
      startDate: ''
    }
  });

  // Watch all values and pass to parent
  form.watch((val) => {
    onValuesChange(val as Partial<ReadingFormValues>);
  });

  const { register, formState: { errors } } = form;

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col relative">
        <label htmlFor="totalPages" className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-2">Total Pages</label>
        <div className="relative flex items-center group">
          <BookOpen className="absolute left-4 text-accent opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input
            id="totalPages"
            type="number"
            {...register('totalPages', { valueAsNumber: true })}
            className={cn("input-field", errors.totalPages && "border-error focus:border-error focus:ring-error/20")}
            placeholder="e.g. 350"
            aria-invalid={!!errors.totalPages}
          />
        </div>
        {errors.totalPages && <span className="text-error text-sm mt-1">{errors.totalPages.message}</span>}
      </div>

      <div className="flex flex-col relative">
        <label htmlFor="pagesRead" className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-2">Pages Read</label>
        <div className="relative flex items-center group">
          <Bookmark className="absolute left-4 text-accent opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input
            id="pagesRead"
            type="number"
            {...register('pagesRead', { valueAsNumber: true })}
            className={cn("input-field", errors.pagesRead && "border-error focus:border-error focus:ring-error/20")}
            placeholder="e.g. 50"
          />
        </div>
        {errors.pagesRead && <span className="text-error text-sm mt-1">{errors.pagesRead.message}</span>}
      </div>

      <div className="flex flex-col relative md:col-span-2">
        <label htmlFor="targetDate" className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-2">Target Finish Date</label>
        <div className="relative flex items-center group">
          <Target className="absolute left-4 text-accent opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
          <input
            id="targetDate"
            type="date"
            min={todayStr}
            {...register('targetDate')}
            className={cn("input-field", errors.targetDate && "border-error focus:border-error focus:ring-error/20")}
          />
        </div>
        {errors.targetDate && <span className="text-error text-sm mt-1">{errors.targetDate.message}</span>}
      </div>

      <button
        type="button"
        className="md:col-span-2 flex items-center justify-center gap-2 text-sm font-semibold text-accent py-3 rounded-xl hover:bg-accent/5 transition-colors"
        onClick={() => setShowOptional(!showOptional)}
        aria-expanded={showOptional}
      >
        {showOptional ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        {showOptional ? 'Hide pacing settings' : 'Add start date for intelligent pacing'}
      </button>

      <AnimatePresence>
        {showOptional && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:col-span-2 flex flex-col relative overflow-hidden"
          >
            <label htmlFor="startDate" className="text-sm font-semibold text-textMuted uppercase tracking-wider mb-2">Start Date (Optional)</label>
            <div className="relative flex items-center group">
              <CalendarDays className="absolute left-4 text-accent opacity-70 group-focus-within:opacity-100 transition-opacity" size={20} />
              <input
                id="startDate"
                type="date"
                max={todayStr}
                {...register('startDate')}
                className="input-field"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
