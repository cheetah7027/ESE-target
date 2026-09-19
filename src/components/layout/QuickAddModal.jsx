import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';

export const QuickAddModal = ({ isOpen, onClose }) => {
  const { subjects, addStudySession, addPyqRecord, addMistakeLog, addMockTest, addMainsPractice } = useApp();
  const [activeForm, setActiveForm] = useState('session');

  const [sessionData, setSessionData] = useState({
    subjectId: subjects[0]?.id || '',
    chapterId: '',
    duration: 1.5,
    activity: 'Concept',
    questionsSolved: 0,
    correctAnswers: 0,
    notes: '',
  });

  const [pyqData, setPyqData] = useState({
    subjectId: subjects[0]?.id || '',
    chapterId: '',
    year: '2023',
    difficulty: 'Medium',
    status: 'correct',
    questionsSolved: 20,
    notes: '',
  });

  const [mistakeData, setMistakeData] = useState({
    subjectId: subjects[0]?.id || '',
    chapterId: '',
    type: 'Conceptual',
    question: '',
    whyMade: '',
    correctConcept: '',
  });

  const [mockData, setMockData] = useState({
    name: 'ESE Prelims Mock Test',
    paper: 'Paper 2 (Tech)',
    score: 180,
    maxMarks: 300,
    correct: 65,
    incorrect: 15,
    unattempted: 20,
    timeTakenMinutes: 180,
    notes: '',
  });

  const [mainsData, setMainsData] = useState({
    subjectId: subjects[0]?.id || '',
    question: '',
    year: '2023',
    marks: 20,
    timeLimitMin: 15,
    timeTakenMin: 14,
    selfScore: 14,
    diagramUsed: true,
    stepsShown: true,
    formulaUsed: true,
    finalAnswerCorrect: true,
  });

  if (!isOpen) return null;

  const currentSubjectObj = subjects.find(s => s.id === (sessionData.subjectId || pyqData.subjectId || mistakeData.subjectId || mainsData.subjectId));

  const handleSessionSubmit = (e) => {
    e.preventDefault();
    addStudySession(sessionData);
    onClose();
  };

  const handlePyqSubmit = (e) => {
    e.preventDefault();
    addPyqRecord(pyqData);
    onClose();
  };

  const handleMistakeSubmit = (e) => {
    e.preventDefault();
    addMistakeLog(mistakeData);
    onClose();
  };

  const handleMockSubmit = (e) => {
    e.preventDefault();
    addMockTest(mockData);
    onClose();
  };

  const handleMainsSubmit = (e) => {
    e.preventDefault();
    addMainsPractice(mainsData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]" style={{ borderRadius: '4px' }}>
        {/* Modal Header */}
        <div className="p-4 border-b border-black flex items-center justify-between bg-black text-white">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black" style={{ borderRadius: '4px' }}>
              <Icon name="add" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Quick Log Action</h2>
              <p className="text-xs text-white font-semibold">Record study, PYQs, mistakes, or mocks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white hover:text-black"
            style={{ borderRadius: '4px' }}
          >
            <Icon name="close" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-black bg-white overflow-x-auto p-1.5 gap-1 scrollbar-none">
          {[
            { id: 'session', label: 'Study Session', icon: 'menu_book' },
            { id: 'pyq', label: 'PYQ Attempt', icon: 'help_outline' },
            { id: 'mistake', label: 'Mistake', icon: 'warning' },
            { id: 'mock', label: 'Mock Test', icon: 'assignment_turned_in' },
            { id: 'mains', label: 'Mains Q', icon: 'edit_note' },
          ].map((tab) => {
            const isActive = activeForm === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveForm(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-black text-white border border-black'
                    : 'bg-white text-black border border-black hover:bg-black hover:text-white'
                }`}
                style={{ borderRadius: '4px' }}
              >
                <Icon name={tab.icon} className="text-sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-white text-black">
          {/* 1. STUDY SESSION FORM */}
          {activeForm === 'session' && (
            <form onSubmit={handleSessionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Subject</label>
                <select
                  value={sessionData.subjectId}
                  onChange={(e) => setSessionData({ ...sessionData, subjectId: e.target.value, chapterId: '' })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Chapter (Optional)</label>
                <select
                  value={sessionData.chapterId}
                  onChange={(e) => setSessionData({ ...sessionData, chapterId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  <option value="">-- All / General Subject Study --</option>
                  {currentSubjectObj?.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Duration (Hours)</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={sessionData.duration}
                    onChange={(e) => setSessionData({ ...sessionData, duration: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Activity Type</label>
                  <select
                    value={sessionData.activity}
                    onChange={(e) => setSessionData({ ...sessionData, activity: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="Concept">Concept Learning</option>
                    <option value="PYQ">PYQ Practice</option>
                    <option value="Revision">Revision</option>
                    <option value="Mock">Mock Test</option>
                    <option value="Mains">Mains Answer Writing</option>
                    <option value="Current Affairs">Current Affairs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Questions Solved</label>
                  <input
                    type="number"
                    value={sessionData.questionsSolved}
                    onChange={(e) => setSessionData({ ...sessionData, questionsSolved: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Correct Answers</label>
                  <input
                    type="number"
                    value={sessionData.correctAnswers}
                    onChange={(e) => setSessionData({ ...sessionData, correctAnswers: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Notes / Key Takeaways</label>
                <textarea
                  rows="2"
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({ ...sessionData, notes: e.target.value })}
                  placeholder="e.g. Revised Mohr circle formulas and completed 25 questions."
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black placeholder:text-black"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Log Study Session
              </button>
            </form>
          )}

          {/* 2. PYQ FORM */}
          {activeForm === 'pyq' && (
            <form onSubmit={handlePyqSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Subject</label>
                <select
                  value={pyqData.subjectId}
                  onChange={(e) => setPyqData({ ...pyqData, subjectId: e.target.value, chapterId: '' })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Chapter</label>
                <select
                  value={pyqData.chapterId}
                  onChange={(e) => setPyqData({ ...pyqData, chapterId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  <option value="">-- Select Chapter --</option>
                  {currentSubjectObj?.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">PYQ Year</label>
                  <select
                    value={pyqData.year}
                    onChange={(e) => setPyqData({ ...pyqData, year: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    {['2024', '2023', '2022', '2021', '2020', '2019', '2018'].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Difficulty</label>
                  <select
                    value={pyqData.difficulty}
                    onChange={(e) => setPyqData({ ...pyqData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Attempt Outcome</label>
                  <select
                    value={pyqData.status}
                    onChange={(e) => setPyqData({ ...pyqData, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="correct">Correct</option>
                    <option value="incorrect">Incorrect</option>
                    <option value="guessed">? Guessed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Questions Batch Solved</label>
                <input
                  type="number"
                  value={pyqData.questionsSolved}
                  onChange={(e) => setPyqData({ ...pyqData, questionsSolved: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Log PYQ Record
              </button>
            </form>
          )}

          {/* 3. MISTAKE FORM */}
          {activeForm === 'mistake' && (
            <form onSubmit={handleMistakeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Subject</label>
                <select
                  value={mistakeData.subjectId}
                  onChange={(e) => setMistakeData({ ...mistakeData, subjectId: e.target.value, chapterId: '' })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Chapter</label>
                  <select
                    value={mistakeData.chapterId}
                    onChange={(e) => setMistakeData({ ...mistakeData, chapterId: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="">-- Select Chapter --</option>
                    {currentSubjectObj?.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Mistake Category</label>
                  <select
                    value={mistakeData.type}
                    onChange={(e) => setMistakeData({ ...mistakeData, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="Conceptual">Conceptual Error</option>
                    <option value="Formula">Forgot Formula</option>
                    <option value="Calculation">Calculation Error</option>
                    <option value="Silly">Silly / Read Error</option>
                    <option value="Guess">Incorrect Guess</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Question / Problem Statement</label>
                <input
                  type="text"
                  placeholder="e.g. Shear stress calculation at neutral axis for T-section"
                  value={mistakeData.question}
                  onChange={(e) => setMistakeData({ ...mistakeData, question: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black placeholder:text-black"
                  style={{ borderRadius: '4px' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Why I made it</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Forgot to multiply width of flange by centroid distance."
                  value={mistakeData.whyMade}
                  onChange={(e) => setMistakeData({ ...mistakeData, whyMade: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black placeholder:text-black"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Correct Concept & Rule</label>
                <textarea
                  rows="2"
                  placeholder="e.g. q = (V * A * y_bar) / (I * b). Always use web width b at neutral axis."
                  value={mistakeData.correctConcept}
                  onChange={(e) => setMistakeData({ ...mistakeData, correctConcept: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black placeholder:text-black"
                  style={{ borderRadius: '4px' }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Log Mistake Entry
              </button>
            </form>
          )}

          {/* 4. MOCK TEST FORM */}
          {activeForm === 'mock' && (
            <form onSubmit={handleMockSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Mock Name</label>
                  <input
                    type="text"
                    value={mockData.name}
                    onChange={(e) => setMockData({ ...mockData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Paper Type</label>
                  <select
                    value={mockData.paper}
                    onChange={(e) => setMockData({ ...mockData, paper: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                    style={{ borderRadius: '4px' }}
                  >
                    <option value="Paper 1">Paper 1 (General Studies)</option>
                    <option value="Paper 2 (Tech)">Paper 2 (Civil Technical)</option>
                    <option value="Full Length">Full Length (500 Marks)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Score Obtained</label>
                  <input
                    type="number"
                    value={mockData.score}
                    onChange={(e) => setMockData({ ...mockData, score: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Maximum Marks</label>
                  <input
                    type="number"
                    value={mockData.maxMarks}
                    onChange={(e) => setMockData({ ...mockData, maxMarks: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Correct Qs</label>
                  <input
                    type="number"
                    value={mockData.correct}
                    onChange={(e) => setMockData({ ...mockData, correct: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Incorrect Qs</label>
                  <input
                    type="number"
                    value={mockData.incorrect}
                    onChange={(e) => setMockData({ ...mockData, incorrect: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Unattempted</label>
                  <input
                    type="number"
                    value={mockData.unattempted}
                    onChange={(e) => setMockData({ ...mockData, unattempted: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Log Mock Score
              </button>
            </form>
          )}

          {/* 5. MAINS PRACTICE FORM */}
          {activeForm === 'mains' && (
            <form onSubmit={handleMainsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Subject</label>
                <select
                  value={mainsData.subjectId}
                  onChange={(e) => setMainsData({ ...mainsData, subjectId: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black"
                  style={{ borderRadius: '4px' }}
                >
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Conventional Question Topic</label>
                <input
                  type="text"
                  placeholder="e.g. Design 2D portal frame or compute settlement of footing"
                  value={mainsData.question}
                  onChange={(e) => setMainsData({ ...mainsData, question: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-black text-black placeholder:text-black"
                  style={{ borderRadius: '4px' }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-black mb-1">Self Score / Max Marks</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={mainsData.selfScore}
                      onChange={(e) => setMainsData({ ...mainsData, selfScore: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                      style={{ borderRadius: '4px' }}
                    />
                    <span className="text-black font-bold">/</span>
                    <input
                      type="number"
                      value={mainsData.marks}
                      onChange={(e) => setMainsData({ ...mainsData, marks: e.target.value })}
                      className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                      style={{ borderRadius: '4px' }}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-1">Time Taken (Mins)</label>
                  <input
                    type="number"
                    value={mainsData.timeTakenMin}
                    onChange={(e) => setMainsData({ ...mainsData, timeTakenMin: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-white border border-black text-black font-bold"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <label className="flex items-center gap-2 p-2 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                  <input
                    type="checkbox"
                    checked={mainsData.diagramUsed}
                    onChange={(e) => setMainsData({ ...mainsData, diagramUsed: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Diagram Used</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                  <input
                    type="checkbox"
                    checked={mainsData.stepsShown}
                    onChange={(e) => setMainsData({ ...mainsData, stepsShown: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Steps Shown</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                  <input
                    type="checkbox"
                    checked={mainsData.formulaUsed}
                    onChange={(e) => setMainsData({ ...mainsData, formulaUsed: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Formula Stated</span>
                </label>
                <label className="flex items-center gap-2 p-2 bg-white border border-black text-black" style={{ borderRadius: '4px' }}>
                  <input
                    type="checkbox"
                    checked={mainsData.finalAnswerCorrect}
                    onChange={(e) => setMainsData({ ...mainsData, finalAnswerCorrect: e.target.checked })}
                    className="accent-black"
                  />
                  <span>Answer Correct</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-sm transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Log Mains Answer
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
