import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';

export const Dashboard = ({ setCurrentTab, setSelectedSubjectId, onOpenQuickAdd, onOpenTimer }) => {
  const {
    settings,
    subjects,
    studySessions,
    calculateOverallProgress,
    getCompletedChaptersCount,
    getTotalChaptersCount,
    getTotalPyqsSolved,
    getMockStats,
    getStudyStreak,
    updateChapterStatus,
    getAdaptiveRecommendations
  } = useApp();

  const overallProgress = calculateOverallProgress();
  const completedChapters = getCompletedChaptersCount();
  const totalChapters = getTotalChaptersCount();
  const pyqsSolved = getTotalPyqsSolved();
  const mockStats = getMockStats();
  const streakDays = getStudyStreak();
  const adaptiveTasks = getAdaptiveRecommendations();

  const topTodayTask = adaptiveTasks[0] || {
    subjectName: 'Strength of Materials',
    subjectId: 'som',
    chapterName:"Principal Stress & Mohr's Circle",
    chapterId: 'som-4',
  };

  const [todayTaskCompleted, setTodayTaskCompleted] = useState(false);

  const getWeeklyHoursData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const dayOfWeek = now.getDay();
    const distanceToMonday = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMonday);

    return days.map((dayLabel, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dateStr = d.toISOString().split('T')[0];
      const hours = studySessions
        .filter(s => s.date.split('T')[0] === dateStr)
        .reduce((sum, s) => sum + (parseFloat(s.duration) || 0), 0);
      return { day: dayLabel, hours: parseFloat(hours.toFixed(1)) };
    });
  };

  const weeklyData = getWeeklyHoursData();
  const examDate = new Date(settings.examDate || '2027-01-10');
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / (1000 * 60 * 60 * 24)));

  const handleMarkTodayComplete = () => {
    if (topTodayTask.subjectId && topTodayTask.chapterId) {
      updateChapterStatus(topTodayTask.subjectId, topTodayTask.chapterId, 'revised');
    }
    setTodayTaskCompleted(true);
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Top Hero Banner - Strong Black Block */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-black p-6 border border-black text-white" style={{ borderRadius: '4px' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-white text-black text-xs font-black tracking-widest" style={{ borderRadius: '4px' }}>
              ESE Civil 2027
            </span>
            <span className="text-white text-xs font-bold tracking-wider">Daily Preparation HQ</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold mt-2 tracking-tight text-white">Target 2027 Prep Status</h1>
          <p className="text-white text-xs md:text-sm mt-1 font-medium">
            Stay consistent with daily technical concepts, PYQs, and spaced revisions.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-black p-3.5 border border-white" style={{ borderRadius: '4px' }}>
          <Icon name="calendar_today" className="text-white text-2xl" />
          <div>
            <span className="text-[10px] font-bold text-white tracking-widest block">Exam Countdown</span>
            <span className="text-xl font-bold text-white">{daysLeft} Days</span>
            <span className="text-[10px] text-white block font-bold">Target: Jan 2027</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          title="Overall Progress"
          value={`${overallProgress}%`}
          subtitle="Syllabus coverage"
          iconName="trending_up"
          progress={overallProgress}
        />
        <StatCard
          title="Syllabus Done"
          value={`${completedChapters}/${totalChapters}`}
          subtitle="Chapters done"
          iconName="menu_book"
        />
        <StatCard
          title="PYQs Solved"
          value={pyqsSolved.toLocaleString()}
          subtitle="All subjects"
          iconName="help_outline"
        />
        <StatCard
          title="Mock Tests"
          value={mockStats.count}
          subtitle="Mocks attempted"
          iconName="assignment_turned_in"
        />
        <StatCard
          title="Avg Mock Score"
          value={mockStats.avgScore ? `${mockStats.avgScore}/500` : 'N/A'}
          subtitle="Target: 350+"
          iconName="emoji_events"
        />
        <StatCard
          title="Study Streak"
          value={`${streakDays}d`}
          subtitle="Consecutive days"
          iconName="local_fire_department"
        />
      </div>

      {/* TODAY'S PLAN SECTION - Visual Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 border border-black bg-white text-black">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-black" />
              <h2 className="font-black text-black text-base tracking-wider">
                Today's Actionable Plan
              </h2>
            </div>
            <Badge variant="primary" className="text-xs font-black">
              High Priority
            </Badge>
          </div>

          <div className="mt-4 p-5 bg-white border border-black" style={{ borderRadius: '4px' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-black tracking-widest block">
                  {topTodayTask.subjectName}
                </span>
                <h3 className="text-xl font-black text-black mt-0.5">
                  {topTodayTask.chapterName}
                </h3>
              </div>
              <button
                onClick={() => {
                  if (topTodayTask.subjectId) {
                    setSelectedSubjectId(topTodayTask.subjectId);
                    setCurrentTab('subject-detail');
                  }
                }}
                className="text-xs font-black text-black hover:underline flex items-center gap-1 tracking-wider"
              >
                View Chapter <Icon name="arrow_forward" className="text-sm text-black" />
              </button>
            </div>

            {/* Sub-task checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-4">
              <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
                <span className="text-[10px] font-black text-black block tracking-wider">Concept</span>
                <span className="text-sm font-black text-black mt-0.5 block font-mono">45 min</span>
              </div>
              <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
                <span className="text-[10px] font-black text-black block tracking-wider">PYQs Practice</span>
                <span className="text-sm font-black text-black mt-0.5 block font-mono">30 Qs</span>
              </div>
              <div className="p-3 bg-white border border-black text-center" style={{ borderRadius: '4px' }}>
                <span className="text-[10px] font-black text-black block tracking-wider">Revision</span>
                <span className="text-sm font-black text-black mt-0.5 block font-mono">15 min</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-black">
              <button
                onClick={onOpenTimer}
                className="flex-1 min-w-[120px] py-2.5 px-4 bg-black hover:bg-white hover:text-black text-white border border-black font-black text-xs flex items-center justify-center gap-1.5 transition-colors tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                <Icon name="play_arrow" />
                <span>Start Session</span>
              </button>

              <button
                onClick={handleMarkTodayComplete}
                disabled={todayTaskCompleted}
                className={`py-2.5 px-4 font-black text-xs flex items-center justify-center gap-1.5 transition-colors tracking-wider ${
                  todayTaskCompleted
                    ? 'bg-black text-white border border-black'
                    : 'bg-white border border-black text-black hover:bg-black hover:text-white'
                }`}
                style={{ borderRadius: '4px' }}
              >
                <Icon name="check_circle" />
                <span>{todayTaskCompleted ? 'Completed' : 'Mark Complete'}</span>
              </button>

              <button
                onClick={onOpenQuickAdd}
                className="py-2.5 px-4 bg-white border border-black text-black font-black text-xs hover:bg-black hover:text-white transition-colors tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                Quick Log
              </button>
            </div>
          </div>
        </Card>

        {/* Weekly Study Hours Chart */}
        <Card className="bg-white border border-black text-black">
          <div className="flex items-center justify-between pb-3 border-b border-black">
            <div>
              <h3 className="font-extrabold text-black text-base">Weekly Study Hours</h3>
              <p className="text-xs font-bold text-black">Target: {settings.dailyTargetHours || 4.5}h / day</p>
            </div>
            <Icon name="schedule" className="text-black" />
          </div>

          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1D1F21" />
                <XAxis dataKey="day" stroke="#1D1F21" tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} />
                <YAxis stroke="#1D1F21" tick={{ fontSize: 11, fill: '#1D1F21', fontWeight: 'bold' }} unit="h" />
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
                <Bar dataKey="hours" fill="#1D1F21" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Adaptive High Priority Recommendations Grid */}
      <Card className="bg-white border border-black text-black">
        <div className="flex items-center justify-between pb-4 border-b border-black">
          <div>
            <h2 className="font-extrabold text-black text-base">Adaptive Recommended Focus</h2>
            <p className="text-xs text-black font-bold">
              Scored using: Historical Weightage × PYQ Weakness × Recency
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('smart-plan')}
            className="text-xs font-black text-black hover:underline flex items-center gap-1 tracking-wider"
          >
            View Full Adaptive Plan <Icon name="arrow_forward" className="text-sm text-black" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {adaptiveTasks.slice(0, 3).map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-white border border-black flex flex-col justify-between"
              style={{ borderRadius: '4px' }}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-black tracking-wider">
                    {item.subjectName}
                  </span>
                  <Badge variant="high">Score: {item.score}</Badge>
                </div>
                <h4 className="font-black text-black text-sm mt-1">
                  {item.chapterName}
                </h4>
                <div className="mt-3 space-y-1">
                  {item.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="text-[11px] text-black font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-black" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedSubjectId(item.subjectId);
                  setCurrentTab('subject-detail');
                }}
                className="mt-4 w-full py-2 bg-black hover:bg-white text-white hover:text-black border border-black text-xs font-black transition-colors tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                Study Chapter
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
