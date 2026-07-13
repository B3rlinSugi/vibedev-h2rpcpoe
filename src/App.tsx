import { useState, useMemo } from 'react';
import './index.css';

function App() {
  const [totalPages, setTotalPages] = useState<number | ''>('');
  const [pagesRead, setPagesRead] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [showOptional, setShowOptional] = useState<boolean>(false);

  // Set today's date formatted for min attribute
  const todayStr = useMemo(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }, []);

  const calculateResults = () => {
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
          paceMessage = `You're ahead of pace! You only needed to read ${expectedPagesRead} pages by today.`;
        } else if (read < expectedPagesRead) {
          paceStatus = 'behind';
          paceMessage = `You're a bit behind. You should be on page ${expectedPagesRead} to stay on track.`;
        } else {
          paceStatus = 'on-track';
          paceMessage = `Perfectly on track! Keep it up.`;
        }
      }
    }

    return {
      pagesRemaining,
      daysRemaining,
      requiredPace,
      progress,
      paceStatus,
      paceMessage
    };
  };

  const results = calculateResults();

  return (
    <div className="app-container">
      <header className="header">
        <h1>📚 Reading Nook</h1>
        <p>Track your reading pace and hit your deadline.</p>
      </header>

      <main>
        <div className="form-group">
          <label htmlFor="totalPages">Total pages in book</label>
          <input
            id="totalPages"
            type="number"
            min="1"
            value={totalPages}
            onChange={(e) => setTotalPages(e.target.value ? Number(e.target.value) : '')}
            placeholder="e.g. 350"
          />
        </div>

        <div className="form-group">
          <label htmlFor="pagesRead">Pages read so far</label>
          <input
            id="pagesRead"
            type="number"
            min="0"
            max={totalPages || undefined}
            value={pagesRead}
            onChange={(e) => setPagesRead(e.target.value !== '' ? Number(e.target.value) : '')}
            placeholder="e.g. 50"
          />
        </div>

        <div className="form-group">
          <label htmlFor="targetDate">Target finish date</label>
          <input
            id="targetDate"
            type="date"
            min={todayStr}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />
        </div>

        <button 
          className="optional-toggle"
          onClick={() => setShowOptional(!showOptional)}
        >
          {showOptional ? '- Hide optional start date' : '+ Add optional start date for pace tracking'}
        </button>

        {showOptional && (
          <div className="form-group">
            <label htmlFor="startDate">Start date (Optional)</label>
            <input
              id="startDate"
              type="date"
              max={todayStr}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
        )}

        {results && (
          <div className="results-card">
            <div className="results-grid">
              <div className="stat-box">
                <div className="label">Pages Left</div>
                <div className="value">{results.pagesRemaining}</div>
              </div>
              <div className="stat-box">
                <div className="label">Days Left</div>
                <div className="value">{results.daysRemaining}</div>
              </div>
              <div className="stat-box" style={{ gridColumn: '1 / -1' }}>
                <div className="label">Required Daily Pace</div>
                <div className="value">{results.requiredPace} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>pages/day</span></div>
              </div>
            </div>

            <div className="progress-container">
              <div className="progress-label">
                <span>Progress</span>
                <span>{Math.round(results.progress)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${results.progress}%` }}
                ></div>
              </div>
            </div>

            {results.paceStatus && (
              <div className={`status-indicator ${results.paceStatus}`}>
                <span className="status-icon">
                  {results.paceStatus === 'ahead' ? '🎉' : results.paceStatus === 'behind' ? '⚠️' : '✅'}
                </span>
                <span>{results.paceMessage}</span>
              </div>
            )}
          </div>
        )}

        <div className="bookshelf-motif">
          📖 ☕ 🪴 📚 🕯️
        </div>
      </main>
    </div>
  );
}

export default App;
