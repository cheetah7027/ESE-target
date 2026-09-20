import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';

export const PomodoroTimerModal = ({ isOpen, onClose }) => {
  const {
    subjects,
    timerState,
    setTimerState,
    getTimeLeftSeconds,
    startFocusTimer,
    pauseFocusTimer,
    resumeFocusTimer,
    resetFocusTimer,
    finishAndLogTimerSession
  } = useApp();

  const [timeLeftDisplay, setTimeLeftDisplay] = useState(() => getTimeLeftSeconds());
  const [notes, setNotes] = useState(timerState.notes || '');

  const selectedSubjectId = timerState.subjectId || subjects[0]?.id || '';
  const selectedChapterId = timerState.chapterId || '';
  const activity = timerState.activity || 'Concept';

  const currentSubjectObj = subjects.find(s => s.id === selectedSubjectId);

  useEffect(() => {
    const update = () => {
      setTimeLeftDisplay(getTimeLeftSeconds());
    };
    update();
    const interval = setInterval(update, 500);

    const handleSync = () => {
      update();
    };

    window.addEventListener('visibilitychange', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('visibilitychange', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, [timerState.isRunning, timerState.targetEndTime, timerState.pausedTimeLeft]);

  if (!isOpen) return null;

  const handleSelectPreset = (mins) => {
    resetFocusTimer(mins);
  };

  const toggleStartPause = () => {
    if (timerState.isRunning) {
      pauseFocusTimer();
    } else if (timerState.pausedTimeLeft < timerState.durationMinutes * 60 && timerState.pausedTimeLeft > 0) {
      resumeFocusTimer();
    } else {
      startFocusTimer(timerState.durationMinutes);
    }
  };

  const handleReset = () => {
    resetFocusTimer(timerState.durationMinutes);
  };

  const handleFinishAndSave = () => {
    finishAndLogTimerSession(notes);
    onClose();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-md overflow-hidden" style={{ borderRadius: '4px' }}>
        {/* Header */}
        <div className="p-4 border-b border-black flex items-center justify-between bg-black text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black" style={{ borderRadius: '4px' }}>
              <Icon name="timer" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Study Focus Timer</h2>
              <p className="text-xs text-white font-semibold">Background-resilient Pomodoro timer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white hover:bg-white hover:text-black" style={{ borderRadius: '4px' }}>
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center bg-white text-black">
          {/* Preset buttons */}
          {!timerState.isRunning && !timerState.isCompleted && (
            <div className="flex justify-center gap-2 mb-6">
              {[25, 50, 90].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSelectPreset(mins)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    timerState.durationMinutes === mins
                      ? 'bg-black text-white border border-black'
                      : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {mins} min
                </button>
              ))}
            </div>
          )}

          {/* Completion Banner */}
          {timerState.isCompleted && (
            <div className="mb-4 p-3 bg-black text-white text-xs font-bold border border-black flex items-center justify-center gap-2" style={{ borderRadius: '4px' }}>
              <Icon name="emoji_events" className="text-white text-base" />
              <span>Session Finished! Review notes and click Finish to log.</span>
            </div>
          )}

          {/* Big Digital Clock Display */}
          <div className="relative inline-flex items-center justify-center my-2">
            <div className="w-48 h-48 border border-black flex flex-col items-center justify-center bg-white" style={{ borderRadius: '4px' }}>
              <span className="text-3xl font-black text-black tracking-tight font-mono">
                {formatTime(timeLeftDisplay)}
              </span>
              <span className="text-xs font-extrabold text-black mt-1 tracking-widest uppercase">
                {timerState.isCompleted ? 'Completed' : (timerState.isRunning ? 'Focusing...' : 'Paused')}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={toggleStartPause}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-black bg-black text-white border border-black hover:bg-white hover:text-black transition-colors"
              style={{ borderRadius: '4px' }}
            >
              <Icon name={timerState.isRunning ? 'pause' : 'play_arrow'} />
              <span>{timerState.isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors"
              style={{ borderRadius: '4px' }}
              title="Reset Timer"
            >
              <Icon name="refresh" />
            </button>
          </div>

          {/* Subject & Chapter selector */}
          <div className="mt-6 text-left space-y-3 bg-white p-4 border border-black" style={{ borderRadius: '4px' }}>
            <div>
              <label className="block text-xs font-bold text-black mb-1">Target Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setTimerState(prev => ({ ...prev, subjectId: e.target.value, chapterId: '' }));
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-semibold"
                style={{ borderRadius: '4px' }}
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-black mb-1">Chapter</label>
                <select
                  value={selectedChapterId}
                  onChange={(e) => setTimerState(prev => ({ ...prev, chapterId: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-semibold"
                  style={{ borderRadius: '4px' }}
                >
                  <option value="">General</option>
                  {currentSubjectObj?.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-black mb-1">Activity</label>
                <select
                  value={activity}
                  onChange={(e) => setTimerState(prev => ({ ...prev, activity: e.target.value }))}
                  className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-semibold"
                  style={{ borderRadius: '4px' }}
                >
                  <option value="Concept">Concept</option>
                  <option value="PYQ">PYQ Practice</option>
                  <option value="Revision">Revision</option>
                  <option value="Mock">Mock Test</option>
                  <option value="Mains">Mains Practice</option>
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Quick notes on what you accomplished..."
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  setTimerState(prev => ({ ...prev, notes: e.target.value }));
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-black text-black placeholder:text-black/50 font-semibold"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <button
              onClick={handleFinishAndSave}
              className="w-full py-2 bg-black hover:bg-white hover:text-black text-white border border-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors tracking-wider"
              style={{ borderRadius: '4px' }}
            >
              <Icon name="check_circle" className="text-base" />
              <span>Finish & Auto-Log Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
