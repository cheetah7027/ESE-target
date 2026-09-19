import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const Roadmap = () => {
  const { roadmap, toggleRoadmapMilestone, addCustomRoadmapMilestone } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    month: 'DEC 2026',
    title: '',
    subjectsStr: '',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMilestone.title) return;
    addCustomRoadmapMilestone({
      month: newMilestone.month,
      title: newMilestone.title,
      subjects: newMilestone.subjectsStr ? newMilestone.subjectsStr.split(',').map(s => s.trim()) : [],
    });
    setNewMilestone({ month: 'DEC 2026', title: '', subjectsStr: '' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">
            ESE 2027 Strategic Roadmap
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-1">
            12-Month structured preparation timeline from Sep 2026 to Sep 2027
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="add" />
          <span>Add Custom Milestone</span>
        </button>
      </div>

      {/* Timeline Grid */}
      <div className="relative border-l-2 border-black ml-4 md:ml-6 space-y-5">
        {roadmap.map((milestone) => {
          const isDone = milestone.completed;
          return (
            <div key={milestone.id} className="relative pl-6 md:pl-6 group">
              {/* Dot Icon */}
              <button
                onClick={() => toggleRoadmapMilestone(milestone.id)}
                className={`absolute -left-[17px] top-1.5 w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                  isDone
                    ? 'bg-black border-black text-white'
                    : milestone.isCurrent
                    ? 'bg-black border-black text-white'
                    : 'bg-white border-black text-black'
                }`}
                style={{ borderRadius: '4px' }}
              >
                <Icon name={isDone ? 'check' : 'radio_button_unchecked'} className="text-base" />
              </button>

              <Card className={`transition-colors ${isDone ? 'bg-white text-black border border-black line-through' : 'bg-white text-black border border-black'}`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-black text-white border border-black font-black text-xs" style={{ borderRadius: '4px' }}>
                      {milestone.month}
                    </span>
                    {milestone.isCurrent && <Badge variant="primary">Current Phase</Badge>}
                    {milestone.custom && <Badge variant="medium">Custom Task</Badge>}
                  </div>
                  <button
                    onClick={() => toggleRoadmapMilestone(milestone.id)}
                    className="text-xs font-black text-black hover:underline tracking-wider"
                  >
                    {isDone ? 'Mark Incomplete' : 'Mark Phase Complete'}
                  </button>
                </div>

                <h3 className="text-lg font-black text-black mt-2">
                  {milestone.title}
                </h3>

                <div className="flex flex-wrap gap-2 mt-3">
                  {milestone.subjects.map((sub, subIdx) => (
                    <span
                      key={subIdx}
                      className="px-2.5 py-1 bg-white border border-black text-black text-xs font-bold"
                      style={{ borderRadius: '4px' }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Add Custom Milestone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border border-black p-6 w-full max-w-md text-black" style={{ borderRadius: '4px' }}>
            <h3 className="font-black text-black text-lg">Add Custom Milestone</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Target Month</label>
                <input
                  type="text"
                  placeholder="e.g. NOV 2026"
                  value={newMilestone.month}
                  onChange={(e) => setNewMilestone({ ...newMilestone, month: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                  style={{ borderRadius: '4px' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Milestone Title</label>
                <input
                  type="text"
                  placeholder="e.g. Complete Structural Analysis + FLT Mocks"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                  style={{ borderRadius: '4px' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Subjects (Comma Separated)</label>
                <input
                  type="text"
                  placeholder="e.g. SOM, Geotech, Paper 1 Maths"
                  value={newMilestone.subjectsStr}
                  onChange={(e) => setNewMilestone({ ...newMilestone, subjectsStr: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-black text-xs font-black text-black hover:bg-black hover:text-white tracking-wider"
                  style={{ borderRadius: '4px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-white hover:text-black border border-black text-white font-black text-xs tracking-wider"
                  style={{ borderRadius: '4px' }}
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
