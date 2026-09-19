import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const PYQTracker = ({ onOpenQuickAdd }) => {
  const { pyqRecords, subjects } = useApp();

  const [subjectFilter, setSubjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const filteredRecords = pyqRecords.filter(r => {
    const matchesSubject = subjectFilter === 'all' || r.subjectId === subjectFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesDifficulty = difficultyFilter === 'all' || r.difficulty === difficultyFilter;
    return matchesSubject && matchesStatus && matchesDifficulty;
  });

  const totalAttempted = pyqRecords.reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
  const totalCorrect = pyqRecords.filter(r => r.status === 'correct').reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
  const totalIncorrect = pyqRecords.filter(r => r.status === 'incorrect').reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;

  const subjectAccuracyData = subjects.map(sub => {
    const subRecords = pyqRecords.filter(r => r.subjectId === sub.id);
    const attempted = subRecords.reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
    const correct = subRecords.filter(r => r.status === 'correct').reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
    const accPercent = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
    return { name: sub.code, accuracy: accPercent, attempted };
  }).filter(d => d.attempted > 0);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Previous Year Questions (PYQ) Tracker
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-1">
            Log UPSC ESE question practice, track accuracy, and eliminate weak topic gaps
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="add" />
          <span>+ Log PYQ Attempt</span>
        </button>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total PYQs Practiced" value={totalAttempted.toLocaleString()} subtitle="Questions solved" />
        <StatCard title="Correct Answers" value={totalCorrect.toLocaleString()} subtitle="Direct hits" />
        <StatCard title="Incorrect Answers" value={totalIncorrect.toLocaleString()} subtitle="Need revision" />
        <StatCard title="Overall Accuracy" value={`${accuracy}%`} subtitle="Target: > 75%" progress={accuracy} />
      </div>

      {/* Accuracy Chart by Subject */}
      {subjectAccuracyData.length > 0 && (
        <Card className="bg-white border border-black text-black">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <h3 className="font-extrabold text-black text-base">PYQ Accuracy % by Subject</h3>
            <Icon name="bar_chart" className="text-black" />
          </div>
          <div className="h-56 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectAccuracyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1D1F21" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} />
                <YAxis tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} unit="%" domain={[0, 100]} />
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
                <Bar dataKey="accuracy" fill="#1D1F21" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* PYQ Attempt Log Table */}
      <Card className="bg-white border border-black text-black">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-black gap-3">
          <h2 className="font-extrabold text-black text-base">Practice Attempt History</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-black text-black font-bold"
              style={{ borderRadius: '4px' }}
            >
              <option value="all">All Subjects</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-black text-black font-bold"
              style={{ borderRadius: '4px' }}
            >
              <option value="all">All Statuses</option>
              <option value="correct">Correct</option>
              <option value="incorrect">Incorrect</option>
              <option value="guessed">? Guessed</option>
            </select>

            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-black text-black font-bold"
              style={{ borderRadius: '4px' }}
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="py-6 text-center text-black font-bold">
            <Icon name="help_outline" className="text-4xl text-black mb-2" />
            <p className="text-sm font-black">No PYQ logs recorded yet.</p>
            <p className="text-xs mt-1">Start practicing PYQs to build your accuracy timeline.</p>
            <button
              onClick={onOpenQuickAdd}
              className="mt-4 px-4 py-2 bg-black hover:bg-white text-white hover:text-black border border-black font-black text-xs tracking-wider"
              style={{ borderRadius: '4px' }}
            >
              Log First PYQ
            </button>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-black">
            {filteredRecords.map((r) => {
              const subObj = subjects.find(s => s.id === r.subjectId);
              return (
                <div key={r.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-black">
                        {subObj?.name || 'Technical'}
                      </span>
                      <Badge variant="default">{r.year} PYQ</Badge>
                      <Badge variant={r.difficulty}>{r.difficulty}</Badge>
                    </div>
                    <p className="text-sm font-black text-black mt-0.5 font-mono">
                      Solved batch: {r.questionsSolved} questions
                    </p>
                    {r.notes && <p className="text-xs text-black font-semibold mt-1">{r.notes}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-black font-bold">{r.date}</span>
                    {r.status === 'correct' && (
                      <span className="px-2.5 py-1 bg-black text-white border border-black text-xs font-black flex items-center gap-1" style={{ borderRadius: '4px' }}>
                        <Icon name="check_circle" className="text-sm" /> Correct
                      </span>
                    )}
                    {r.status === 'incorrect' && (
                      <span className="px-2.5 py-1 bg-white text-black border border-black text-xs font-black flex items-center gap-1" style={{ borderRadius: '4px' }}>
                        <Icon name="cancel" className="text-sm" /> Incorrect
                      </span>
                    )}
                    {r.status === 'guessed' && (
                      <span className="px-2.5 py-1 bg-white text-black border border-black text-xs font-black flex items-center gap-1" style={{ borderRadius: '4px' }}>
                        <Icon name="help_outline" className="text-sm" /> Guessed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};
