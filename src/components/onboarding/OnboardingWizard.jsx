import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';

export const OnboardingWizard = () => {
  const { settings, setSettings } = useApp();

  const [startDate, setStartDate] = useState(settings.startDate || new Date().toISOString().split('T')[0]);
  const [weekdayHours, setWeekdayHours] = useState(settings.weekdayHours || 3.5);
  const [weekendHours, setWeekendHours] = useState(settings.weekendHours || 7.0);
  const [level, setLevel] = useState(settings.preparationLevel || 'Intermediate');
  const [targetScore, setTargetScore] = useState(settings.targetScore || 350);

  if (settings.isOnboarded) return null;

  const weeklyCapacity = (weekdayHours * 5) + (weekendHours * 2);

  const handleGeneratePlan = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      startDate,
      weekdayHours: parseFloat(weekdayHours),
      weekendHours: parseFloat(weekendHours),
      dailyTargetHours: parseFloat(((weekdayHours * 5 + weekendHours * 2) / 7).toFixed(1)),
      preparationLevel: level,
      targetScore: parseInt(targetScore, 10),
      isOnboarded: true,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-xl overflow-hidden" style={{ borderRadius: '4px' }}>
        {/* Banner Header */}
        <div className="bg-black p-6 text-white border-b border-black">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white text-black text-xs font-bold tracking-wider mb-2 w-fit" style={{ borderRadius: '4px' }}>
            <Icon name="auto_awesome" className="text-sm" /> ESE CIVIL 2027 SETUP
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome to your ESE Prep Dashboard</h1>
          <p className="text-white text-xs mt-1 font-semibold">Let's build your personalized study schedule and syllabus strategy.</p>
        </div>

        {/* Wizard Form */}
        <form onSubmit={handleGeneratePlan} className="p-6 space-y-5 bg-white text-black">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black mb-1 flex items-center gap-1">
                <Icon name="calendar_today" className="text-black text-sm" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-black text-black text-sm font-semibold"
                style={{ borderRadius: '4px' }}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1 flex items-center gap-1">
                <Icon name="emoji_events" className="text-black text-sm" /> Target Prelims Score
              </label>
              <input
                type="number"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-black text-black text-sm font-bold"
                style={{ borderRadius: '4px' }}
                placeholder="Target score out of 500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-black mb-1 flex items-center gap-1">
                <Icon name="schedule" className="text-black text-sm" /> Weekday Study Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-black text-black text-sm font-semibold"
                style={{ borderRadius: '4px' }}
              />
              <span className="text-[11px] text-black font-semibold mt-1 block">Mon - Fri daily target</span>
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1 flex items-center gap-1">
                <Icon name="schedule" className="text-black text-sm" /> Weekend Study Hours
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={weekendHours}
                onChange={(e) => setWeekendHours(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-black text-black text-sm font-semibold"
                style={{ borderRadius: '4px' }}
              />
              <span className="text-[11px] text-black font-semibold mt-1 block">Sat - Sun daily target</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-black mb-2">Current Preparation Level</label>
            <div className="grid grid-cols-3 gap-3">
              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                <button
                  type="button"
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  className={`p-2.5 border text-center text-xs font-black transition-colors ${
                    level === lvl
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-black text-black hover:bg-black hover:text-white'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Calculated Capacity Card */}
          <div className="bg-white border border-black p-4 flex items-center justify-between" style={{ borderRadius: '4px' }}>
            <div>
              <span className="text-xs font-black text-black tracking-wider block">Estimated Weekly Capacity</span>
              <span className="text-xl font-black text-black">{weeklyCapacity} Hours / Week</span>
            </div>
            <div className="text-right text-xs text-black font-bold">
              <div>Technical: ~{Math.round(weeklyCapacity * 0.65)}h</div>
              <div>Paper I: ~{Math.round(weeklyCapacity * 0.15)}h</div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm flex items-center justify-center gap-2 transition-colors"
            style={{ borderRadius: '4px' }}
          >
            <span>Generate My Preparation Plan</span>
            <Icon name="arrow_forward" />
          </button>
        </form>
      </div>
    </div>
  );
};
