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
        <svg className="absolute top-[-5%] right-[-5%] animate-float" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(210, 105, 30, 0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
        <svg className="absolute bottom-[-5%] left-[-5%] animate-float" style={{ animationDirection: 'reverse', animationDuration: '8s' }} width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 69, 19, 0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel w-full max-w-2xl mx-auto"
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
