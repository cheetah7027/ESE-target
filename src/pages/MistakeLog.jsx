import React, { useState } from 'react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const MistakeLog = ({ onOpenQuickAdd }) => {
  const { mistakeLogs, subjects, toggleMistakeResolved } = useApp();
  const [typeFilter, setTypeFilter] = useState('all');

  const CATEGORIES = ['Conceptual', 'Formula', 'Calculation', 'Silly', 'Guess'];
  const COLORS = ['#1D1F21', '#FFFFFF', '#1D1F21', '#FFFFFF', '#1D1F21'];

  const distributionData = CATEGORIES.map((cat, idx) => {
    const count = mistakeLogs.filter(m => m.type === cat).length;
    return { name: cat, value: count, color: COLORS[idx] };
  }).filter(d => d.value > 0);

  const filteredMistakes = mistakeLogs.filter(m => {
    if (typeFilter === 'all') return true;
    return m.type === typeFilter;
  });

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Preparation Mistake Log & Error Journal
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-1">
            Categorize conceptual errors, formula slips, and calculation mistakes to avoid repeat errors
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="add" />
          <span>+ Log New Mistake</span>
        </button>
      </div>

      {/* Mistake Distribution Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center bg-white border border-black text-black">
          <h3 className="font-black text-black text-base text-center">
            Mistake Distribution Breakdown
          </h3>
          {distributionData.length > 0 ? (
            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#1D1F21' : '#FFFFFF'} stroke="#1D1F21" strokeWidth={2} />
                    ))}
                  </Pie>
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
                </RePieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-black font-bold">
              No mistakes logged yet. Keep going clean!
            </div>
          )}
        </Card>

        {/* Category Cards Filter */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.map((cat, idx) => {
            const count = mistakeLogs.filter(m => m.type === cat).length;
            const isSelected = typeFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setTypeFilter(isSelected ? 'all' : cat)}
                className={`p-4 border text-left transition-colors ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-black text-black hover:bg-black hover:text-white'
                }`}
                style={{ borderRadius: '4px' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wider">{cat}</span>
                  <span className="w-3 h-3 border border-black" style={{ backgroundColor: idx % 2 === 0 ? '#1D1F21' : '#FFFFFF', borderRadius: '2px' }} />
                </div>
                <div className="text-2xl font-black mt-2 font-mono">{count}</div>
                <span className="text-[10px] font-bold opacity-80 mt-1 block font-mono">
                  {mistakeLogs.length > 0 ? Math.round((count / mistakeLogs.length) * 100) : 0}% of total errors
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mistake Entries List */}
      <Card className="bg-white border border-black text-black">
        <div className="flex items-center justify-between pb-4 border-b border-black">
          <div>
            <h2 className="font-extrabold text-black text-base">Recorded Mistakes Journal</h2>
            <p className="text-xs text-black font-bold">Filtered: {typeFilter === 'all' ? 'All Categories' : typeFilter}</p>
          </div>
          {typeFilter !== 'all' && (
            <button
              onClick={() => setTypeFilter('all')}
              className="text-xs font-black text-black hover:underline tracking-wider"
            >
              Clear Filter
            </button>
          )}
        </div>

        {filteredMistakes.length === 0 ? (
          <div className="py-6 text-center text-black font-bold">
            <Icon name="warning" className="text-4xl text-black mb-2" />
            <p className="text-sm font-black">No mistakes found in this category.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filteredMistakes.map((m) => {
              const subObj = subjects.find(s => s.id === m.subjectId);
              return (
                <div
                  key={m.id}
                  className={`p-4 border transition-colors ${
                    m.resolved
                      ? 'bg-white border-black text-black line-through'
                      : 'bg-white border-black text-black'
                  }`}
                  style={{ borderRadius: '4px' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-black">
                        {subObj?.name || 'Civil Technical'}
                      </span>
                      <Badge variant="critical">{m.type}</Badge>
                      {m.resolved && <Badge variant="success">Resolved</Badge>}
                    </div>

                    <button
                      onClick={() => toggleMistakeResolved(m.id)}
                      className={`text-xs font-black flex items-center gap-1.5 px-3 py-1 transition-colors border ${
                        m.resolved
                          ? 'bg-white text-black border-black hover:bg-black hover:text-white'
                          : 'bg-black text-white border-black hover:bg-white hover:text-black'
                      }`}
                      style={{ borderRadius: '4px' }}
                    >
                      <Icon name="check_circle" className="text-base" />
                      <span>{m.resolved ? 'Mark Unresolved' : 'Mark Concept Resolved'}</span>
                    </button>
                  </div>

                  <h3 className="text-base font-black text-black mt-2">
                    {m.question}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-xs font-bold">
                    <div className="p-3 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                      <strong>Why I made it:</strong> {m.whyMade || 'Forgot formula / calculation slip.'}
                    </div>
                    <div className="p-3 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                      <strong>Correct Concept:</strong> {m.correctConcept || 'Review theory in textbook.'}
                    </div>
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
