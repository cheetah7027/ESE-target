import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Icon } from '../components/common/Icon';

export const Paper1Tracker = () => {
  const { paper1Subjects, updatePaper1ChapterStatus } = useApp();

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Paper I: General Studies & Engineering Aptitude
        </h1>
        <p className="text-xs md:text-sm text-black font-semibold mt-1">
          10 Non-technical General Studies subjects (200 Marks Prelims Paper I)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {paper1Subjects.map((sub) => {
          const completed = sub.chapters.filter(c => c.status === 'revised' || c.status === 'mastered').length;
          const progressPercent = sub.chapters.length > 0 ? Math.round((completed / sub.chapters.length) * 100) : 0;

          return (
            <Card key={sub.id} className="p-5 bg-white border border-black text-black">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-black text-black tracking-widest block">
                    {sub.code}
                  </span>
                  <h3 className="text-lg font-black text-black mt-0.5">
                    {sub.name}
                  </h3>
                </div>
                <Badge variant={sub.priority}>{sub.priority}</Badge>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex justify-between text-xs font-black">
                  <span className="text-black">Completion</span>
                  <span className="text-black font-mono">{progressPercent}%</span>
                </div>
                <ProgressBar progress={progressPercent} size="sm" />
              </div>

              <div className="mt-4 pt-3 border-t border-black space-y-2">
                {sub.chapters.map((ch) => {
                  const isDone = ch.status === 'revised' || ch.status === 'mastered';
                  return (
                    <div key={ch.id} className="flex items-center justify-between text-xs p-2 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                      <span className="font-bold text-black">{ch.name}</span>
                      <button
                        onClick={() => updatePaper1ChapterStatus(sub.id, ch.id, isDone ? 'not-started' : 'mastered')}
                        className={`px-2.5 py-1 text-[11px] font-black transition-colors border ${
                          isDone ? 'bg-black text-white border-black' : 'bg-white text-black border-black hover:bg-black hover:text-white'
                        }`}
                        style={{ borderRadius: '4px' }}
                      >
                        {isDone ? 'Done' : 'Mark Done'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
