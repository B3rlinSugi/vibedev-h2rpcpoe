import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookMarked } from 'lucide-react';
import { ReadingForm } from './components/ReadingForm';
import { ResultsPanel } from './components/ResultsPanel';
import { Confetti } from './components/Confetti';
import { useReadingCalculator } from './hooks/useReadingCalculator';
import type { ReadingFormValues } from './validators/schema';
import './index.css';

function App() {
  const [formData, setFormData] = useState<Partial<ReadingFormValues>>({});
  const results = useReadingCalculator(formData);

  return (
    <>
      <Confetti active={results?.isComplete || false} />

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-2xl p-6 sm:p-10 mx-auto"
      >
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold font-serif text-textMain flex items-center justify-center gap-3 tracking-tight">
            <BookMarked size={40} className="text-accent" strokeWidth={1.5} />
            Reading Nook
          </h1>
          <p className="text-textMuted text-lg mt-2 font-medium">Curate your reading pace. Master your deadlines.</p>
        </header>

        <main>
          <ReadingForm onValuesChange={setFormData} />

          <AnimatePresence mode="wait">
            {results ? (
              <ResultsPanel key="results" results={results} />
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-8 pt-8 border-t border-textMuted/20 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/50 mb-4 shadow-sm">
                  <BookMarked size={28} className="text-accent/50" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-textMain mb-2">Ready to track your journey?</h3>
                <p className="text-textMuted text-sm max-w-sm mx-auto">
                  Enter your book's details above. We'll automatically calculate your required pace and provide smart insights to help you reach your deadline.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </motion.div>
    </>
  );
}

export default App;
