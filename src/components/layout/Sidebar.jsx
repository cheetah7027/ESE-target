import React from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { LogoIcon } from '../common/LogoIcon';

export const Sidebar = ({ currentTab, setCurrentTab, onOpenTimer }) => {
  const { settings, userName, setIsAuthOpen } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', iconName: 'dashboard' },
    { id: 'roadmap', label: 'Roadmap', iconName: 'account_tree' },
    { id: 'subjects', label: 'Subjects', iconName: 'menu_book' },
    { id: 'chapters', label: 'Chapters', iconName: 'format_list_bulleted' },
    { id: 'smart-plan', label: 'Smart Plan', iconName: 'psychology' },
    { id: 'pyqs', label: 'PYQ Tracker', iconName: 'help' },
    { id: 'mock-tests', label: 'Mock Tests', iconName: 'assignment_turned_in' },
    { id: 'mistake-log', label: 'Mistake Log', iconName: 'warning' },
    { id: 'revision', label: 'Revision Engine', iconName: 'autorenew' },
    { id: 'paper1', label: 'Paper I (GS)', iconName: 'school' },
    { id: 'mains', label: 'Mains Mode', iconName: 'edit_note' },
    { id: 'analytics', label: 'Analytics', iconName: 'bar_chart' },
    { id: 'settings', label: 'Settings', iconName: 'settings' },
  ];

  const examDate = new Date(settings.examDate || '2027-01-10');
  const today = new Date();
  const diffTime = examDate - today;
  const daysLeft = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-black bg-black text-white h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black text-sm" style={{ borderRadius: '4px' }}>
            <LogoIcon className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-black text-white text-sm leading-tight tracking-tight">ESE CIVIL 2027</h1>
            <p className="text-[10px] text-white font-bold tracking-widest">Preparation HQ</p>
          </div>
        </div>
      </div>

      {/* Aspirant Profile Badge */}
      <div className="mx-3 mt-3 p-2.5 bg-white text-black border border-black flex items-center justify-between" style={{ borderRadius: '4px' }}>
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon name="person" className="text-black text-base flex-shrink-0" />
          <div className="truncate">
            <span className="text-[9px] font-extrabold text-black uppercase tracking-wider block">Aspirant Profile</span>
            <span className="text-xs font-black text-black truncate block">{userName}</span>
          </div>
        </div>
        <button
          onClick={() => setIsAuthOpen(true)}
          className="p-1 text-black hover:bg-black hover:text-white transition-colors flex-shrink-0"
          style={{ borderRadius: '4px' }}
          title="Switch Aspirant Profile"
        >
          <Icon name="swap_horiz" className="text-sm" />
        </button>
      </div>

      {/* Countdown Banner */}
      <div className="mx-3 mt-3 p-3 bg-black border border-white flex items-center justify-between" style={{ borderRadius: '4px' }}>
        <div>
          <span className="text-[10px] font-bold text-white tracking-widest block">Exam Countdown</span>
          <span className="text-base font-bold text-white">{daysLeft} Days</span>
        </div>
        <span className="text-xs text-white font-bold">Jan 2027</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? 'bg-white text-black font-bold border border-white'
                  : 'text-white hover:bg-white hover:text-black font-semibold border border-transparent'
              }`}
              style={{ borderRadius: '4px' }}
            >
              <Icon name={item.iconName} className={isActive ? 'text-black' : 'text-white'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Action Footer */}
      <div className="p-3 border-t border-white">
        <button
          onClick={onOpenTimer}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white text-black hover:bg-black hover:text-white font-black text-xs border border-white transition-colors"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="timer" />
          <span>Study Focus Timer</span>
        </button>
      </div>
    </aside>
  );
};
