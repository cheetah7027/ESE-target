import React from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Icon } from '../components/common/Icon';

export const Subjects = ({ onSelectSubject }) => {
  const { subjects } = useApp();

  const STATUS_WEIGHTS = {
    'not-started': 0,
    'learning': 25,
    'pyq': 50,
    'revised': 75,
    'mastered': 100,
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Civil Engineering Technical Subjects
        </h1>
        <p className="text-xs md:text-sm text-black font-semibold mt-1">
          Historical average question weightages and chapter progress tracker
        </p>
      </div>

      {/* Historical Disclaimer Banner */}
      <div className="p-4 bg-white border border-black text-black flex items-center gap-3 text-xs font-semibold" style={{ borderRadius: '4px' }}>
        <Icon name="info" className="text-black text-xl flex-shrink-0" />
        <span>
          <strong>Historical planning averages</strong> — actual UPSC question distribution in ESE 2027 may vary. Use this as a strategic study planning signal.
        </span>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {subjects.map((sub) => {
          let totalWeight = 0;
          let pyqsAttempted = 0;
          let pyqsCorrect = 0;

          sub.chapters.forEach(ch => {
            totalWeight += STATUS_WEIGHTS[ch.status] || 0;
            pyqsAttempted += (ch.pyqsAttempted || 0);
            pyqsCorrect += (ch.pyqsCorrect || 0);
          });

          const progressPercent = sub.chapters.length > 0 ? Math.round(totalWeight / sub.chapters.length) : 0;
          const accuracyPercent = pyqsAttempted > 0 ? Math.round((pyqsCorrect / pyqsAttempted) * 100) : 0;

          return (
            <Card
              key={sub.id}
              hover
              onClick={() => onSelectSubject(sub.id)}
              className="flex flex-col justify-between bg-white border border-black text-black"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
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

                <p className="text-xs text-black font-medium mt-2 line-clamp-2">
                  {sub.description}
                </p>

                <div className="mt-4 pt-3 border-t border-black space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-black font-semibold">Historical Weightage</span>
                    <span className="font-black text-black">~{sub.historicalAvg} questions</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-black font-semibold">PYQs Solved</span>
                    <span className="font-black text-black">{pyqsAttempted} Qs ({accuracyPercent}% acc)</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-xs font-black">
                      <span className="text-black">Progress</span>
                      <span className="text-black font-mono">{progressPercent}%</span>
                    </div>
                    <ProgressBar progress={progressPercent} size="md" />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-black flex items-center justify-between text-xs font-black text-black tracking-wider">
                <span>View {sub.chapters.length} Chapters</span>
                <Icon name="arrow_forward" className="text-base text-black" />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
