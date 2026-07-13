import { useState, useMemo, useEffect } from 'react';
import { BookOpen, Calendar, Target, CalendarDays, CheckCircle2, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, BookMarked, Bookmark } from 'lucide-react';
import './index.css';

function App() {
  const [totalPages, setTotalPages] = useState<number | ''>('');
  const [pagesRead, setPagesRead] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [showOptional, setShowOptional] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const todayStr = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }, []);

  const results = useMemo(() => {
    if (!totalPages || pagesRead === '' || !targetDate) return null;

    const total = Number(totalPages);
    const read = Number(pagesRead);

    if (total <= 0 || read < 0 || read > total) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 0) return null;

    const pagesRemaining = total - read;
    const requiredPace = Math.ceil(pagesRemaining / daysRemaining);
    const progress = Math.min((read / total) * 100, 100);

    let paceStatus = null;
    let paceMessage = '';
    let statusIcon = null;

    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      const totalDays = Math.ceil((target.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      if (totalDays > 0 && elapsedDays >= 0) {
        const expectedPacePerDay = total / totalDays;
        const expectedPagesRead = Math.floor(expectedPacePerDay * elapsedDays);

        if (read > expectedPagesRead) {
          paceStatus = 'ahead';
          paceMessage = `Incredible pace! You only needed to be on page ${expectedPagesRead} by today.`;
          statusIcon = <TrendingUp size={20} color="var(--success-color)" />;
        } else if (read < expectedPagesRead) {
          paceStatus = 'behind';
          paceMessage = `Falling slightly behind. Aim to reach page ${expectedPagesRead} to get back on track.`;
          statusIcon = <AlertTriangle size={20} color="var(--warning-color)" />;
        } else {
          paceStatus = 'on-track';
          paceMessage = `Perfectly timed! You're exactly where you need to be.`;
          statusIcon = <CheckCircle2 size={20} color="#4682B4" />;
        }
      }
    }

    return {
      pagesRemaining,
      daysRemaining,
      requiredPace,
      progress,
      paceStatus,
      paceMessage,
      statusIcon
    };
  }, [totalPages, pagesRead, targetDate, startDate]);

  if (!mounted) return null;

  return (
    <>
      <div className="decoration deco-1">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(210, 105, 30, 0.25)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
      </div>
      <div className="decoration deco-2">
        <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="rgba(139, 69, 19, 0.15)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
      </div>

      <div className="app-container">
        <header className="header">
          <h1>
            <BookMarked size={36} color="var(--accent-color)" strokeWidth={1.5} />
            Reading Nook
          </h1>
          <p>Curate your reading pace. Master your deadlines.</p>
        </header>

        <main>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="totalPages">Total Pages</label>
              <div className="input-wrapper">
                <input
                  id="totalPages"
                  type="number"
                  min="1"
                  value={totalPages}
                  onChange={(e) => setTotalPages(e.target.value ? Number(e.target.value) : '')}
                  placeholder="e.g. 350"
                />
                <BookOpen className="input-icon" size={20} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="pagesRead">Pages Read</label>
              <div className="input-wrapper">
                <input
                  id="pagesRead"
                  type="number"
                  min="0"
                  max={totalPages || undefined}
                  value={pagesRead}
                  onChange={(e) => setPagesRead(e.target.value !== '' ? Number(e.target.value) : '')}
                  placeholder="e.g. 50"
                />
                <Bookmark className="input-icon" size={20} />
              </div>
            </div>

            <div className="form-group full">
              <label htmlFor="targetDate">Target Finish Date</label>
              <div className="input-wrapper">
                <input
                  id="targetDate"
                  type="date"
                  min={todayStr}
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
                <Target className="input-icon" size={20} />
              </div>
            </div>

            <button 
              className="optional-toggle"
              onClick={() => setShowOptional(!showOptional)}
            >
              {showOptional ? (
                <><ChevronUp size={16} /> Hide pacing settings</>
              ) : (
                <><ChevronDown size={16} /> Add start date for intelligent pacing</>
              )}
            </button>

            {showOptional && (
              <div className="form-group full" style={{ animation: 'slideUp 0.3s ease-out' }}>
                <label htmlFor="startDate">When did you start reading?</label>
                <div className="input-wrapper">
                  <input
                    id="startDate"
                    type="date"
                    max={todayStr}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <CalendarDays className="input-icon" size={20} />
                </div>
              </div>
            )}

            {results && (
              <div className="results-card">
                <div className="results-grid">
                  <div className="stat-box">
                    <div className="label">Remaining</div>
                    <div className="value">{results.pagesRemaining}</div>
                    <div className="unit">pages</div>
                  </div>
                  <div className="stat-box">
                    <div className="label">Time Left</div>
                    <div className="value">{results.daysRemaining}</div>
                    <div className="unit">days</div>
                  </div>
                  <div className="stat-box">
                    <div className="label">Required Pace</div>
                    <div className="value">{results.requiredPace}</div>
                    <div className="unit">pages / day</div>
                  </div>
                </div>

                <div className="progress-section">
                  <div className="progress-label">
                    <div className="progress-title">
                      Journey Progress
                    </div>
                    <div className="progress-percent">
                      {Math.round(results.progress)}%
                    </div>
                  </div>
                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${results.progress}%` }}
                    />
                  </div>
                </div>

                {results.paceStatus && (
                  <div className={`status-indicator ${results.paceStatus}`}>
                    <div className="status-icon">
                      {results.statusIcon}
                    </div>
                    <span>{results.paceMessage}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;
