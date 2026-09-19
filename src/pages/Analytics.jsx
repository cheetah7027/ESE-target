import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const Analytics = () => {
  const { subjects, studySessions, calculateOverallProgress, getAdaptiveRecommendations } = useApp();

  const adaptiveList = getAdaptiveRecommendations();

  const STATUS_WEIGHTS = {
    'not-started': 0,
    'learning': 25,
    'pyq': 50,
    'revised': 75,
    'mastered': 100,
  };

  const subjectProgressData = subjects.map(sub => {
    let totalWeight = 0;
    sub.chapters.forEach(ch => {
      totalWeight += STATUS_WEIGHTS[ch.status] || 0;
    });
    const percent = sub.chapters.length > 0 ? Math.round(totalWeight / sub.chapters.length) : 0;
    return { name: sub.code, progress: percent };
  });

  const generateHeatmapData = () => {
    const grid = [];
    const today = new Date();
    for (let i = 111; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const hours = studySessions
        .filter(s => s.date.split('T')[0] === dateStr)
        .reduce((sum, s) => sum + (parseFloat(s.duration) || 0), 0);
      
      let level = 0;
      if (hours > 0 && hours < 2) level = 1;
      else if (hours >= 2 && hours < 5) level = 2;
      else if (hours >= 5 && hours < 8) level = 3;
      else if (hours >= 8) level = 4;

      grid.push({ date: dateStr, hours, level });
    }
    return grid;
  };

  const heatmapGrid = generateHeatmapData();

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Preparation Analytics & Performance Intelligence
        </h1>
        <p className="text-xs md:text-sm text-black font-medium mt-1">
          Empirical study data analytics, subject distribution, and consistency heatmaps
        </p>
      </div>

      {/* Analytics Disclaimer Notice */}
      <div className="p-4 bg-black text-white border border-black flex items-center gap-3 text-xs font-semibold" style={{ borderRadius: '4px' }}>
        <Icon name="info" className="text-white text-xl flex-shrink-0" />
        <span>
          <strong className="tracking-wider mr-1">Data-driven preparation insights:</strong> This dashboard summarizes your empirical study logs and syllabus coverage. It reflects your historical preparation effort without predictive exam claims.
        </span>
      </div>

      {/* Heatmap Section */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <div>
            <h2 className="font-bold text-black text-base tracking-wide">Study Consistency Heatmap</h2>
            <p className="text-xs text-black">Daily study effort over the last 16 weeks</p>
          </div>
          <Icon name="calendar_today" className="text-black" />
        </div>

        <div className="mt-4 overflow-x-auto pb-2">
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 min-w-[700px]">
            {heatmapGrid.map((day, idx) => (
              <div
                key={idx}
                title={`${day.date}: ${day.hours.toFixed(1)} hours`}
                className={`w-3.5 h-3.5 transition-transform hover:scale-125 ${
                  day.level === 0 ? 'bg-white border border-black' : 'bg-black border border-black'
                }`}
                style={{ borderRadius: '2px' }}
              />
            ))}
          </div>
          <div className="flex items-center justify-end gap-2 text-[10px] text-black mt-3 font-semibold tracking-wider">
            <span>Less Effort</span>
            <span className="w-3.5 h-3.5 bg-white border border-black" style={{ borderRadius: '2px' }} />
            <span className="w-3.5 h-3.5 bg-black border border-black" style={{ borderRadius: '2px' }} />
            <span>More Effort</span>
          </div>
        </div>
      </Card>

      {/* Subject Syllabus Completion Bar Chart */}
      <Card>
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <h3 className="font-bold text-black text-base tracking-wide">Subject Syllabus Progress %</h3>
          <Icon name="bar_chart" className="text-black" />
        </div>

        <div className="h-60 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectProgressData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1D1F21" />
              <XAxis dataKey="name" stroke="#1D1F21" tick={{ fontSize: 11, fill: '#1D1F21' }} />
              <YAxis stroke="#1D1F21" tick={{ fontSize: 11, fill: '#1D1F21' }} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1D1F21',
                  borderColor: '#1D1F21',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '12px'
                }}
                itemStyle={{ color: '#ffffff' }}
              />
              <Bar dataKey="progress" fill="#1D1F21" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ranked Weakest Topics */}
      <Card>
        <div className="pb-3 border-b border-black">
          <h3 className="font-bold text-black text-base tracking-wide">Ranked Weakest & High-Yield Topics</h3>
          <p className="text-xs text-black">Chapters with high historical importance and low recent accuracy</p>
        </div>

        <div className="mt-4 divide-y divide-black">
          {adaptiveList.slice(0, 5).map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-black mr-2 tracking-wider">{item.subjectName} —</span>
                <span className="font-semibold text-black">{item.chapterName}</span>
              </div>
              <Badge variant="high">Weakness Score: {item.score}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
