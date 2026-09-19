import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const MainsMode = ({ onOpenQuickAdd }) => {
  const { mainsPractice, subjects } = useApp();

  const totalAttempted = mainsPractice.length;
  const avgScore = totalAttempted > 0
    ? (mainsPractice.reduce((acc, m) => acc + (m.selfScore || 0), 0) / totalAttempted).toFixed(1)
    : 0;
  const avgTime = totalAttempted > 0
    ? Math.round(mainsPractice.reduce((acc, m) => acc + (m.timeTakenMin || 0), 0) / totalAttempted)
    : 0;

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            Mains Mode: Conventional Answer Writing Tracker
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-1">
            Track stage-by-stage step marks, diagrams, formulas, and timing for 600-mark ESE Mains
          </p>
        </div>
        <button
          onClick={onOpenQuickAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="add" />
          <span>+ Log Mains Answer</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard title="Questions Attempted" value={totalAttempted} subtitle="Conventional problems" iconName="edit_note" />
        <StatCard title="Average Self Score" value={`${avgScore} Marks`} subtitle="Per question" iconName="emoji_events" />
        <StatCard title="Average Speed" value={`${avgTime} mins`} subtitle="Target: ~1.2 min / mark" iconName="schedule" />
      </div>

      {/* Mains Journal Log */}
      <Card className="bg-white border border-black text-black">
        <div className="pb-3 border-b border-black">
          <h2 className="font-extrabold text-black text-base">Conventional Answer Practice Log</h2>
        </div>

        {mainsPractice.length === 0 ? (
          <div className="py-6 text-center text-black font-bold">
            <Icon name="edit_note" className="text-4xl text-black mb-2" />
            <p className="text-sm font-black">No Mains conventional questions logged yet.</p>
            <p className="text-xs mt-1">Start writing answers on A4 sheets and record your self-evaluated marks here.</p>
            <button onClick={onOpenQuickAdd} className="mt-4 px-4 py-2 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs tracking-wider" style={{ borderRadius: '4px' }}>
              Log First Mains Answer
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {mainsPractice.map((m) => {
              const subObj = subjects.find(s => s.id === m.subjectId);
              return (
                <div key={m.id} className="p-4 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-black">
                          {subObj?.name || 'Civil Technical'}
                        </span>
                        <Badge variant="default">{m.year} Conventional</Badge>
                      </div>
                      <h3 className="text-base font-black text-black mt-1">
                        {m.question}
                      </h3>
                      <div className="flex items-center gap-3 text-xs font-bold text-black mt-1 font-mono">
                        <span>Time taken: {m.timeTakenMin} mins (Limit: {m.timeLimitMin}m)</span>
                        <span>Date: {m.date}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-2xl font-black text-black font-mono">
                        {m.selfScore} / {m.marks} Marks
                      </span>
                    </div>
                  </div>

                  {/* Checklist Pills */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-black text-[11px] font-bold">
                    <span className={`px-2.5 py-1 border border-black ${m.diagramUsed ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ borderRadius: '4px' }}>
                      {m.diagramUsed ? 'Neat Diagram' : 'No Diagram'}
                    </span>
                    <span className={`px-2.5 py-1 border border-black ${m.stepsShown ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ borderRadius: '4px' }}>
                      {m.stepsShown ? 'Step-by-Step' : 'Steps Missing'}
                    </span>
                    <span className={`px-2.5 py-1 border border-black ${m.formulaUsed ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ borderRadius: '4px' }}>
                      {m.formulaUsed ? 'Formula Stated' : 'No Formula'}
                    </span>
                    <span className={`px-2.5 py-1 border border-black ${m.finalAnswerCorrect ? 'bg-black text-white' : 'bg-white text-black'}`} style={{ borderRadius: '4px' }}>
                      {m.finalAnswerCorrect ? 'Final Answer Correct' : 'Final Answer Error'}
                    </span>
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
