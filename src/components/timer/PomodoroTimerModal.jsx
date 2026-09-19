import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';

export const PomodoroTimerModal = ({ isOpen, onClose }) => {
  const { subjects, addStudySession } = useApp();

  const [durationMinutes, setDurationMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const [selectedSubjectId, setSelectedSubjectId] = useState(subjects[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [activity, setActivity] = useState('Concept');
  const [notes, setNotes] = useState('');
  const [isCompletedPrompt, setIsCompletedPrompt] = useState(false);

  const currentSubjectObj = subjects.find(s => s.id === selectedSubjectId);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsCompletedPrompt(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const handleSelectPreset = (mins) => {
    setIsRunning(false);
    setDurationMinutes(mins);
    setTimeLeft(mins * 60);
  };

  const toggleStartPause = () => {
    setIsRunning(prev => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(durationMinutes * 60);
  };

  const handleFinishAndSave = () => {
    const elapsedMinutes = Math.max(1, Math.round((durationMinutes * 60 - timeLeft) / 60));
    const hours = elapsedMinutes / 60;

    addStudySession({
      subjectId: selectedSubjectId,
      chapterId: selectedChapterId,
      duration: hours,
      activity,
      notes: notes || `Completed ${elapsedMinutes} min Pomodoro session.`,
    });

    setIsRunning(false);
    setIsCompletedPrompt(false);
    setTimeLeft(durationMinutes * 60);
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
              <p className="text-xs text-white font-semibold">Pomodoro technique for Civil prep</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-white hover:bg-white hover:text-black" style={{ borderRadius: '4px' }}>
            <Icon name="close" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center bg-white text-black">
          {/* Preset buttons */}
          {!isRunning && !isCompletedPrompt && (
            <div className="flex justify-center gap-2 mb-6">
              {[25, 50, 90].map(mins => (
                <button
                  key={mins}
                  onClick={() => handleSelectPreset(mins)}
                  className={`px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    durationMinutes === mins
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

          {/* Big Digital Clock Display */}
          <div className="relative inline-flex items-center justify-center my-2">
            <div className="w-48 h-48 border border-black flex flex-col items-center justify-center bg-white" style={{ borderRadius: '4px' }}>
              <span className="text-2xl font-bold text-black tracking-tight">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-extrabold text-black mt-1 tracking-widest">
                {isRunning ? 'Focusing...' : 'Paused'}
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
              <Icon name={isRunning ? 'pause' : 'play_arrow'} />
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
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
                  setSelectedSubjectId(e.target.value);
                  setSelectedChapterId('');
                }}
                className="w-full px-3 py-2 text-xs bg-white border border-black text-black"
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
                  onChange={(e) => setSelectedChapterId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-black text-black"
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
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-black text-black"
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
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-black text-black placeholder:text-black"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <button
              onClick={handleFinishAndSave}
              className="w-full py-2 bg-black hover:bg-white hover:text-black text-white border border-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors"
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
