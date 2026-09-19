import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Icon } from '../common/Icon';
import { LogoIcon } from '../common/LogoIcon';

export const MobileNavbar = ({ currentTab, setCurrentTab, onOpenTimer }) => {
  const { userName, setIsAuthOpen } = useApp();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  const primaryBottomTabs = [
    { id: 'dashboard', label: 'Home', iconName: 'dashboard' },
    { id: 'subjects', label: 'Subjects', iconName: 'menu_book' },
    { id: 'smart-plan', label: 'Plan', iconName: 'psychology' },
    { id: 'mock-tests', label: 'Tests', iconName: 'assignment_turned_in' },
    { id: 'more', label: 'More', iconName: 'menu' },
  ];

  const moreMenuItems = [
    { id: 'roadmap', label: 'Roadmap Timeline', iconName: 'account_tree' },
    { id: 'chapters', label: 'All Chapters', iconName: 'format_list_bulleted' },
    { id: 'pyqs', label: 'PYQ Tracker', iconName: 'help' },
    { id: 'mistake-log', label: 'Mistake Log', iconName: 'warning' },
    { id: 'revision', label: 'Revision Engine', iconName: 'autorenew' },
    { id: 'paper1', label: 'Paper I (GS)', iconName: 'school' },
    { id: 'mains', label: 'Mains Practice', iconName: 'edit_note' },
    { id: 'analytics', label: 'Analytics', iconName: 'bar_chart' },
    { id: 'settings', label: 'Settings', iconName: 'settings' },
  ];

  const handleTabClick = (tabId) => {
    if (tabId === 'more') {
      setIsMoreMenuOpen(prev => !prev);
    } else {
      setCurrentTab(tabId);
      setIsMoreMenuOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-40 bg-black border-b border-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-black text-xs" style={{ borderRadius: '4px' }}>
            <LogoIcon className="w-4 h-4 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-white text-sm leading-none">ESE Civil 2027</h1>
            <span className="text-[10px] text-white font-semibold">Prep Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenTimer}
            className="p-2 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors"
            style={{ borderRadius: '4px' }}
            title="Pomodoro Timer"
          >
            <Icon name="timer" />
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className="p-2 bg-black border border-white text-white hover:bg-white hover:text-black transition-colors"
            style={{ borderRadius: '4px' }}
            title="Settings"
          >
            <Icon name="settings" />
          </button>
        </div>
      </header>

      {/* More Menu Slide Up Modal */}
      {isMoreMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black flex flex-col justify-end">
          <div className="bg-black border-t border-white p-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-white">
              <h2 className="font-bold text-white text-sm">All Navigation Sections</h2>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="p-1 text-white hover:bg-white hover:text-black"
                style={{ borderRadius: '4px' }}
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {moreMenuItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setIsMoreMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-2.5 border text-left text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-white text-black border-white font-bold'
                        : 'bg-black border-white text-white hover:bg-white hover:text-black'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    <Icon name={item.iconName} className={isActive ? 'text-black' : 'text-white'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white px-2 py-1 flex items-center justify-around">
        {primaryBottomTabs.map((tab) => {
          const isActive = currentTab === tab.id || (tab.id === 'more' && isMoreMenuOpen);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 transition-colors ${
                isActive ? 'text-white font-black underline' : 'text-white font-semibold'
              }`}
            >
              <Icon name={tab.iconName} />
              <span className="text-[11px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
