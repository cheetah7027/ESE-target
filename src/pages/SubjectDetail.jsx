import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Icon } from '../components/common/Icon';

export const SubjectDetail = ({ subjectId, onBack, onOpenQuickAdd }) => {
  const { subjects, updateChapterStatus } = useApp();

  const subject = subjects.find(s => s.id === subjectId) || subjects[0];

  if (!subject) return null;

  const STATUS_WEIGHTS = {
    'not-started': 0,
    'learning': 25,
    'pyq': 50,
    'revised': 75,
    'mastered': 100,
  };

  const STAGES = [
    { id: 'not-started', label: 'Not Started' },
    { id: 'learning', label: 'Learning' },
    { id: 'pyq', label: 'PYQ Practice' },
    { id: 'revised', label: 'Revised' },
    { id: 'mastered', label: 'Mastered' },
  ];

  let totalWeight = 0;
  let pyqsAttempted = 0;
  let pyqsCorrect = 0;
  let totalHours = 0;

  subject.chapters.forEach(ch => {
    totalWeight += STATUS_WEIGHTS[ch.status] || 0;
    pyqsAttempted += (ch.pyqsAttempted || 0);
    pyqsCorrect += (ch.pyqsCorrect || 0);
    totalHours += (ch.studyHours || 0);
  });

  const progressPercent = subject.chapters.length > 0 ? Math.round(totalWeight / subject.chapters.length) : 0;
  const accuracyPercent = pyqsAttempted > 0 ? Math.round((pyqsCorrect / pyqsAttempted) * 100) : 0;

  return (
    <div className="space-y-6 pb-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="arrow_back" />
        </button>
        <div>
          <span className="text-xs font-black text-black tracking-widest block">
            {subject.code} Technical Deep Dive
          </span>
          <h1 className="text-2xl font-black text-black tracking-tight">
            {subject.name}
          </h1>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border border-black text-black">
          <span className="text-xs font-black text-black tracking-widest">Syllabus Progress</span>
          <h3 className="text-xl font-black text-black mt-1 font-mono">{progressPercent}%</h3>
          <ProgressBar progress={progressPercent} size="sm" className="mt-2" />
        </Card>

        <Card className="p-4 bg-white border border-black text-black">
          <span className="text-xs font-black text-black tracking-widest">PYQs Attempted</span>
          <h3 className="text-xl font-black text-black mt-1 font-mono">{pyqsAttempted} Qs</h3>
          <span className="text-xs text-black font-extrabold mt-1 block font-mono">{accuracyPercent}% Accuracy</span>
        </Card>

        <Card className="p-4 bg-white border border-black text-black">
          <span className="text-xs font-black text-black tracking-widest">Study Hours Logged</span>
          <h3 className="text-xl font-black text-black mt-1 font-mono">{totalHours.toFixed(1)} hrs</h3>
          <span className="text-xs text-black font-semibold mt-1 block">Concept + Practice</span>
        </Card>

        <Card className="p-4 bg-white border border-black text-black">
          <span className="text-xs font-black text-black tracking-widest">Historical Weightage</span>
          <h3 className="text-xl font-black text-black mt-1 font-mono">~{subject.historicalAvg} Qs</h3>
          <span className="text-xs text-black font-extrabold mt-1 block">Priority: {subject.priority}</span>
        </Card>
      </div>

      {/* Chapter 5-Stage Tracker Table / Cards */}
      <Card className="bg-white border border-black text-black">
        <div className="flex items-center justify-between pb-4 border-b border-black">
          <div>
            <h2 className="font-extrabold text-black text-base">Chapters & 5-Stage Progression</h2>
            <p className="text-xs text-black font-bold">
              Not Started &rarr; Learning &rarr; PYQ Practice &rarr; Revised &rarr; Mastered
            </p>
          </div>
          <button
            onClick={onOpenQuickAdd}
            className="px-3 py-1.5 bg-black hover:bg-white hover:text-black text-white border border-black text-xs font-black transition-colors tracking-wider"
            style={{ borderRadius: '4px' }}
          >
            + Log Session / PYQ
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {subject.chapters.map((ch) => {
            const chPyqAcc = ch.pyqsAttempted > 0 ? Math.round((ch.pyqsCorrect / ch.pyqsAttempted) * 100) : 0;

            return (
              <div
                key={ch.id}
                className="p-4 bg-white border border-black space-y-3 text-black"
                style={{ borderRadius: '4px' }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-black text-sm">
                        {ch.name}
                      </h4>
                      <Badge variant={ch.priority}>{ch.priority}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-black font-bold mt-1 font-mono">
                      <span>PYQs: {ch.pyqsAttempted || 0} ({chPyqAcc}% acc)</span>
                      <span>Hours: {(ch.studyHours || 0).toFixed(1)}h</span>
                      <span>Last Studied: {ch.lastStudied || 'Never'}</span>
                      {ch.nextRevision && <span className="text-black font-black">Next Rev: {ch.nextRevision}</span>}
                    </div>
                  </div>

                  {/* 5-Stage Workflow Buttons */}
                  <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                    {STAGES.map((stage) => {
                      const isActive = ch.status === stage.id;
                      return (
                        <button
                          key={stage.id}
                          onClick={() => updateChapterStatus(subject.id, ch.id, stage.id)}
                          className={`px-2.5 py-1 text-[11px] font-black whitespace-nowrap transition-colors border ${
                            isActive
                              ? 'bg-black text-white border-black'
                              : 'bg-white text-black border-black hover:bg-black hover:text-white'
                          }`}
                          style={{ borderRadius: '4px' }}
                        >
                          {stage.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
