import { z } from 'zod';
import { startOfDay } from 'date-fns';

export const readingFormSchema = z.object({
  totalPages: z.number().min(1, "Total pages must be at least 1"),
  pagesRead: z.number().min(0, "Cannot be negative"),
  targetDate: z.string().refine((date) => {
    const target = startOfDay(new Date(date));
    const today = startOfDay(new Date());
    return target.getTime() >= today.getTime();
  }, { message: "Deadline cannot be in the past" }),
  startDate: z.string().optional(),
}).refine((data) => data.pagesRead <= data.totalPages, {
  message: "Pages read cannot exceed total pages",
  path: ["pagesRead"],
});

export type ReadingFormValues = z.infer<typeof readingFormSchema>;
