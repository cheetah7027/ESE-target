import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const MockTests = ({ onOpenQuickAdd }) => {
  const { mockTests } = useApp();

  const scores = mockTests.map(m => m.score || 0);
  const bestScore = mockTests.length > 0 ? Math.max(...scores) : 0;
  const avgScore = mockTests.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / mockTests.length) : 0;
  const latestScore = mockTests.length > 0 ? scores[0] : 0;
  const previousScore = mockTests.length > 1 ? scores[1] : latestScore;
  const improvement = latestScore - previousScore;

  const trendData = mockTests.map((m) => ({
    name: m.name.substring(0, 10),
    score: m.score,
    max: m.maxMarks,
  })).reverse();

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Mock Test Performance Tracker
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-1">
            Track Prelims Paper 1 (200 marks), Paper 2 Tech (300 marks) & Full Length Test Series
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="add" />
          <span>+ Log Mock Test Score</span>
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Best Mock Score" value={bestScore ? `${bestScore}` : '0'} subtitle="Personal Record" />
        <StatCard title="Average Score" value={avgScore ? `${avgScore}` : '0'} subtitle="Target: 350+" />
        <StatCard title="Latest Score" value={latestScore ? `${latestScore}` : '0'} subtitle="Most recent test" />
        <StatCard
          title="Improvement"
          value={improvement >= 0 ? `+${improvement}` : `${improvement}`}
          subtitle="From previous mock"
        />
      </div>

      {/* Score Trend Line Chart */}
      {trendData.length > 0 ? (
        <Card className="bg-white border border-black text-black">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <h3 className="font-extrabold text-black text-base">Mock Test Score Trend</h3>
            <Icon name="trending_up" className="text-black" />
          </div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1D1F21" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#1D1F21',
                    borderRadius: '4px',
                    color: '#1D1F21',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                />
                <Line type="monotone" dataKey="score" stroke="#1D1F21" strokeWidth={3} dot={{ r: 5, fill: '#1D1F21' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      ) : (
        <Card className="py-6 text-center text-black bg-white border border-black">
          <Icon name="assignment_turned_in" className="text-4xl text-black mb-2" />
          <p className="text-sm font-black">No mock tests recorded yet.</p>
          <p className="text-xs mt-1">Your score trend will appear here after your first mock.</p>
          <button onClick={onOpenQuickAdd} className="mt-4 px-4 py-2 bg-black text-white hover:bg-white hover:text-black border border-black font-black text-xs tracking-wider" style={{ borderRadius: '4px' }}>
            Add First Mock Test
          </button>
        </Card>
      )}

      {/* Mock Tests Log Table */}
      {mockTests.length > 0 && (
        <Card className="bg-white border border-black text-black">
          <div className="pb-3 border-b border-black">
            <h2 className="font-extrabold text-black text-base">Mock Test History Log</h2>
          </div>

          <div className="mt-4 divide-y divide-black">
            {mockTests.map((m) => {
              const totalAttempted = (m.correct || 0) + (m.incorrect || 0);
              const acc = totalAttempted > 0 ? Math.round((m.correct / totalAttempted) * 100) : 0;
              const percent = Math.round((m.score / m.maxMarks) * 100);

              return (
                <div key={m.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-black text-base">
                        {m.name}
                      </h3>
                      <Badge variant="primary">{m.paper}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-black mt-1 font-mono">
                      <span>Date: {m.date}</span>
                      <span>Correct: {m.correct}</span>
                      <span>Incorrect: {m.incorrect}</span>
                      <span>Accuracy: {acc}%</span>
                      <span>Time: {m.timeTakenMinutes} mins</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-2xl font-black text-black font-mono">
                        {m.score} / {m.maxMarks}
                      </span>
                      <span className="text-xs font-black text-black block font-mono">{percent}% score</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
