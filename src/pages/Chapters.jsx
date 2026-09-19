import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const Chapters = ({ onSelectSubject }) => {
  const { subjects, updateChapterStatus } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('all');

  const STAGES = [
    { id: 'not-started', label: 'Not Started' },
    { id: 'learning', label: 'Learning' },
    { id: 'pyq', label: 'PYQ Practice' },
    { id: 'revised', label: 'Revised' },
    { id: 'mastered', label: 'Mastered' },
  ];

  const allChapters = [];
  subjects.forEach(sub => {
    sub.chapters.forEach(ch => {
      allChapters.push({
        ...ch,
        subjectId: sub.id,
        subjectName: sub.name,
        subjectCode: sub.code,
      });
    });
  });

  const filteredChapters = allChapters.filter(ch => {
    const matchesSearch = ch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ch.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'all' || ch.subjectId === selectedSubjectFilter;
    const matchesStatus = selectedStatusFilter === 'all' || ch.status === selectedStatusFilter;
    const matchesPriority = selectedPriorityFilter === 'all' || ch.priority.toLowerCase() === selectedPriorityFilter.toLowerCase();
    return matchesSearch && matchesSubject && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Master Chapter System
        </h1>
        <p className="text-xs md:text-sm text-black font-semibold mt-1">
          Track and manage all 68 Technical Civil Engineering chapters across 5 preparation stages
        </p>
      </div>

      {/* Filter Matrix */}
      <Card className="p-4 space-y-4 bg-white border border-black text-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Icon name="search" className="absolute left-3 top-2.5 text-black text-sm" />
            <input
              type="text"
              placeholder="Search chapters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-6 pr-3 py-2 text-xs bg-white border border-black text-black placeholder:text-black font-bold"
              style={{ borderRadius: '4px' }}
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-bold"
            style={{ borderRadius: '4px' }}
          >
            <option value="all">All Subjects ({subjects.length})</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-bold"
            style={{ borderRadius: '4px' }}
          >
            <option value="all">All Statuses</option>
            {STAGES.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-black text-black font-bold"
            style={{ borderRadius: '4px' }}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div className="text-xs font-black text-black tracking-wider">
          Showing {filteredChapters.length} of {allChapters.length} chapters
        </div>
      </Card>

      {/* Chapters Table / Card List */}
      <div className="space-y-3">
        {filteredChapters.map((ch) => {
          const chPyqAcc = ch.pyqsAttempted > 0 ? Math.round((ch.pyqsCorrect / ch.pyqsAttempted) * 100) : 0;

          return (
            <Card key={ch.id} className="p-4 bg-white border border-black hover:bg-black hover:text-white group transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => onSelectSubject(ch.subjectId)}
                      className="text-xs font-black text-black group-hover:text-white hover:underline cursor-pointer"
                    >
                      {ch.subjectName}
                    </span>
                    <Badge variant={ch.priority}>{ch.priority}</Badge>
                  </div>
                  <h3 className="text-base font-black text-black group-hover:text-white mt-0.5">
                    {ch.name}
                  </h3>
                  <div className="flex items-center gap-4 text-xs font-bold text-black group-hover:text-white mt-1 font-mono">
                    <span>PYQs: {ch.pyqsAttempted || 0} ({chPyqAcc}% acc)</span>
                    <span>Hours: {(ch.studyHours || 0).toFixed(1)}h</span>
                    {ch.nextRevision && <span className="font-black">Next Rev: {ch.nextRevision}</span>}
                  </div>
                </div>

                {/* 5 Stage Status Controls */}
                <div className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
                  {STAGES.map((stage) => {
                    const isActive = ch.status === stage.id;
                    return (
                      <button
                        key={stage.id}
                        onClick={() => updateChapterStatus(ch.subjectId, ch.id, stage.id)}
                        className={`px-2.5 py-1 text-[11px] font-black whitespace-nowrap transition-colors border ${
                          isActive
                            ? 'bg-black text-white border-black group-hover:bg-white group-hover:text-black group-hover:border-white'
                            : 'bg-white text-black border-black group-hover:bg-black group-hover:text-white group-hover:border-white'
                        }`}
                        style={{ borderRadius: '4px' }}
                      >
                        {stage.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
