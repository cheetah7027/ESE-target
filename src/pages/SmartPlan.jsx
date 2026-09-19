import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const SmartPlan = ({ onSelectSubject }) => {
  const { settings, setSettings, getAdaptiveRecommendations } = useApp();

  const [weekdayHours, setWeekdayHours] = useState(settings.weekdayHours || 3.5);
  const [weekendHours, setWeekendHours] = useState(settings.weekendHours || 7.0);
  const [level, setLevel] = useState(settings.preparationLevel || 'Intermediate');

  const [allocation] = useState({
    tech: 65,
    paper1: 15,
    pyq: 10,
    mains: 5,
    revision: 5,
  });

  const weeklyCapacity = (parseFloat(weekdayHours) * 5) + (parseFloat(weekendHours) * 2);
  const adaptiveList = getAdaptiveRecommendations();

  const handleSaveCapacity = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      weekdayHours: parseFloat(weekdayHours),
      weekendHours: parseFloat(weekendHours),
      preparationLevel: level,
      dailyTargetHours: parseFloat((weeklyCapacity / 7).toFixed(1)),
    }));
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Smart Study & Adaptive Priority Planner
        </h1>
        <p className="text-xs md:text-sm text-black font-semibold mt-1">
          Calculate study capacity and dynamically prioritize high-yield civil engineering topics
        </p>
      </div>

      {/* Capacity & Distribution Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border border-black bg-white text-black">
          <div className="flex items-center gap-2 pb-3 border-b border-black">
            <Icon name="schedule" className="text-black" />
            <h2 className="font-black text-black text-base">Study Capacity Input</h2>
          </div>

          <form onSubmit={handleSaveCapacity} className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-black text-black mb-1">
                Weekday Study Hours (Mon-Fri)
              </label>
              <input
                type="number"
                step="0.5"
                value={weekdayHours}
                onChange={(e) => setWeekdayHours(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-black font-black text-black"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1">
                Weekend Study Hours (Sat-Sun)
              </label>
              <input
                type="number"
                step="0.5"
                value={weekendHours}
                onChange={(e) => setWeekendHours(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-black font-black text-black"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black mb-1">
                Preparation Level
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-black font-bold text-black"
                style={{ borderRadius: '4px' }}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="p-3 bg-white border border-black" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">Weekly Total</span>
              <span className="text-xl font-black text-black">{weeklyCapacity} Hours / Week</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors tracking-wider"
              style={{ borderRadius: '4px' }}
            >
              <Icon name="save" />
              <span>Update Smart Capacity</span>
            </button>
          </form>
        </Card>

        {/* Hour Allocation Breakdown */}
        <Card className="lg:col-span-2 bg-white border border-black text-black">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <div>
              <h2 className="font-black text-black text-base">Weekly Hour Allocation</h2>
              <p className="text-xs text-black font-bold">Total: {weeklyCapacity} hours/week</p>
            </div>
            <Icon name="pie_chart" className="text-black" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
            <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">Technical (65%)</span>
              <span className="text-xl font-black text-black mt-1 block font-mono">{((weeklyCapacity * allocation.tech) / 100).toFixed(1)}h</span>
            </div>
            <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">Paper I (15%)</span>
              <span className="text-xl font-black text-black mt-1 block font-mono">{((weeklyCapacity * allocation.paper1) / 100).toFixed(1)}h</span>
            </div>
            <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">PYQs (10%)</span>
              <span className="text-xl font-black text-black mt-1 block font-mono">{((weeklyCapacity * allocation.pyq) / 100).toFixed(1)}h</span>
            </div>
            <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">Mains (5%)</span>
              <span className="text-xl font-black text-black mt-1 block font-mono">{((weeklyCapacity * allocation.mains) / 100).toFixed(1)}h</span>
            </div>
            <div className="p-3 bg-white border border-black text-center col-span-2 md:col-span-1" style={{ borderRadius: '4px' }}>
              <span className="text-[10px] font-black text-black block tracking-wider">Revision (5%)</span>
              <span className="text-xl font-black text-black mt-1 block font-mono">{((weeklyCapacity * allocation.revision) / 100).toFixed(1)}h</span>
            </div>
          </div>

          <div className="mt-5 p-4 bg-white border border-black" style={{ borderRadius: '4px' }}>
            <h4 className="font-black text-black text-xs tracking-wider mb-2 flex items-center gap-1">
              <Icon name="info" className="text-black text-base" /> How Priority Scoring Works
            </h4>
            <div className="text-xs text-black font-semibold space-y-1">
              <p><code>Priority Score = Historical Weightage × Weakness Factor × Days Unstudied</code></p>
              <p>Topics with high historical question averages, low recent PYQ accuracy, or long unstudied intervals are pushed to the top of your daily plan.</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Adaptive Recommendation Ranked List */}
      <Card className="bg-white border border-black text-black">
        <div className="flex items-center justify-between pb-4 border-b border-black">
          <div>
            <h2 className="font-black text-black text-base">Adaptive Chapter Priority Ranking</h2>
            <p className="text-xs text-black font-bold">
              Dynamically ordered based on your performance and exam weightage
            </p>
          </div>
          <Badge variant="primary">{adaptiveList.length} Chapters Analyzed</Badge>
        </div>

        <div className="mt-4 space-y-3">
          {adaptiveList.slice(0, 10).map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-black flex flex-col md:flex-row md:items-center justify-between gap-3 text-black"
              style={{ borderRadius: '4px' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-black text-white font-black text-xs flex items-center justify-center flex-shrink-0 font-mono" style={{ borderRadius: '4px' }}>
                  #{idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-black">
                      {item.subjectName}
                    </span>
                    <Badge variant={item.priority}>{item.priority}</Badge>
                    <span className="text-[10px] font-mono text-black font-extrabold">Score: {item.score}</span>
                  </div>
                  <h4 className="font-black text-black text-sm mt-0.5">
                    {item.chapterName}
                  </h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.reasons.map((r, rIdx) => (
                      <span
                        key={rIdx}
                        className="px-2 py-0.5 bg-white border border-black text-black text-[11px] font-bold"
                        style={{ borderRadius: '4px' }}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectSubject(item.subjectId)}
                className="px-3.5 py-2 bg-black hover:bg-white hover:text-black border border-black text-xs font-black text-white transition-colors flex items-center justify-center gap-1.5 tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                <span>Study Now</span>
                <Icon name="arrow_forward" className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
