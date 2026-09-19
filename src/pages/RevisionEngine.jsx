import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const RevisionEngine = () => {
  const { subjects, completeRevision, snoozeRevision } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];

  const dueTodayChapters = [];
  const upcomingChapters = [];

  subjects.forEach(sub => {
    sub.chapters.forEach(ch => {
      if (ch.nextRevision) {
        const isDue = ch.nextRevision <= todayStr;
        const item = { ...ch, subjectId: sub.id, subjectName: sub.name, subjectCode: sub.code };
        if (isDue) {
          dueTodayChapters.push(item);
        } else {
          upcomingChapters.push(item);
        }
      }
    });
  });

  upcomingChapters.sort((a, b) => a.nextRevision.localeCompare(b.nextRevision));

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Spaced Repetition Revision Engine
        </h1>
        <p className="text-xs md:text-sm text-black font-semibold mt-1">
          Automated retention schedule: R1 (+2d) &rarr; R2 (+7d) &rarr; R3 (+21d) &rarr; R4 (+45d)
        </p>
      </div>

      {/* Interval Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
          <span className="text-[10px] font-black text-black block tracking-wider">R1 Revision</span>
          <span className="text-lg font-black text-black mt-0.5 block font-mono">+2 Days</span>
        </div>
        <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
          <span className="text-[10px] font-black text-black block tracking-wider">R2 Revision</span>
          <span className="text-lg font-black text-black mt-0.5 block font-mono">+7 Days</span>
        </div>
        <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
          <span className="text-[10px] font-black text-black block tracking-wider">R3 Revision</span>
          <span className="text-lg font-black text-black mt-0.5 block font-mono">+21 Days</span>
        </div>
        <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
          <span className="text-[10px] font-black text-black block tracking-wider">R4 Mastered</span>
          <span className="text-lg font-black text-black mt-0.5 block font-mono">+45 Days</span>
        </div>
      </div>

      {/* REVISION DUE TODAY SECTION */}
      <Card className="border border-black bg-white text-black">
        <div className="flex items-center justify-between pb-3 border-b border-black">
          <div className="flex items-center gap-2">
            <Icon name="info" className="text-black text-xl" />
            <h2 className="font-extrabold text-black text-base tracking-wide">
              Revisions Due Today ({dueTodayChapters.length})
            </h2>
          </div>
          <Badge variant="high">Urgent Retention Action</Badge>
        </div>

        {dueTodayChapters.length === 0 ? (
          <div className="py-6 text-center text-black font-bold">
            <Icon name="check_circle" className="text-4xl text-black mb-2" />
            <p className="text-sm font-black">Zero Revisions Due Today!</p>
            <p className="text-xs text-black font-semibold mt-1">Your long-term retention queue is completely up to date.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {dueTodayChapters.map((ch) => (
              <div
                key={ch.id}
                className="p-4 bg-white border border-black flex flex-col md:flex-row md:items-center justify-between gap-3 text-black"
                style={{ borderRadius: '4px' }}
              >
                <div>
                  <span className="text-xs font-black text-black">
                    {ch.subjectName}
                  </span>
                  <h3 className="text-base font-black text-black mt-0.5">
                    {ch.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-black font-bold mt-1 font-mono">
                    <span>Revision Count: #{ch.revisionCount || 0}</span>
                    <span className="font-black">Due Date: {ch.nextRevision}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => completeRevision(ch.subjectId, ch.id)}
                    className="px-4 py-2 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs flex items-center gap-1.5 transition-colors tracking-wider"
                    style={{ borderRadius: '4px' }}
                  >
                    <Icon name="check" className="text-base" />
                    <span>Complete</span>
                  </button>
                  <button
                    onClick={() => snoozeRevision(ch.subjectId, ch.id)}
                    className="px-3 py-2 bg-white border border-black text-black font-black text-xs hover:bg-black hover:text-white transition-colors tracking-wider"
                    style={{ borderRadius: '4px' }}
                  >
                    Snooze +1d
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* UPCOMING REVISIONS QUEUE */}
      <Card className="bg-white border border-black text-black">
        <div className="pb-3 border-b border-black">
          <h2 className="font-extrabold text-black text-base">Upcoming Revision Schedule</h2>
          <p className="text-xs text-black font-bold">Scheduled spaced repetition queue</p>
        </div>

        {upcomingChapters.length === 0 ? (
          <div className="py-6 text-center text-xs text-black font-bold">
            No upcoming revisions scheduled. Mark chapters revised to queue them.
          </div>
        ) : (
          <div className="mt-4 divide-y divide-black">
            {upcomingChapters.map((ch) => (
              <div key={ch.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-black text-black mr-2">{ch.subjectCode}</span>
                  <span className="font-bold text-black">{ch.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-black font-bold">Stage R{(ch.revisionCount || 0) + 1}</span>
                  <span className="font-mono font-black text-black">{ch.nextRevision}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
