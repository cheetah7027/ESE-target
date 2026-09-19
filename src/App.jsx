import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar } from './components/layout/MobileNavbar';
import { QuickAddModal } from './components/layout/QuickAddModal';
import { PomodoroTimerModal } from './components/timer/PomodoroTimerModal';
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import { LoginScreen } from './components/auth/LoginScreen';
import { Icon } from './components/common/Icon';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Roadmap } from './pages/Roadmap';
import { Subjects } from './pages/Subjects';
import { SubjectDetail } from './pages/SubjectDetail';
import { Chapters } from './pages/Chapters';
import { SmartPlan } from './pages/SmartPlan';
import { PYQTracker } from './pages/PYQTracker';
import { MockTests } from './pages/MockTests';
import { MistakeLog } from './pages/MistakeLog';
import { RevisionEngine } from './pages/RevisionEngine';
import { Paper1Tracker } from './pages/Paper1Tracker';
import { MainsMode } from './pages/MainsMode';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { UserManagement } from './pages/UserManagement';

const MainLayout = () => {
  const { isAuthenticated, handleLogin } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState('som');

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleLogin} />;
  }

  const handleSelectSubject = (subId) => {
    setSelectedSubjectId(subId);
    setCurrentTab('subject-detail');
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            setCurrentTab={setCurrentTab}
            setSelectedSubjectId={setSelectedSubjectId}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onOpenTimer={() => setIsTimerOpen(true)}
          />
        );
      case 'roadmap':
        return <Roadmap />;
      case 'subjects':
        return <Subjects onSelectSubject={handleSelectSubject} />;
      case 'subject-detail':
        return (
          <SubjectDetail
            subjectId={selectedSubjectId}
            onBack={() => setCurrentTab('subjects')}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          />
        );
      case 'chapters':
        return <Chapters onSelectSubject={handleSelectSubject} />;
      case 'smart-plan':
        return <SmartPlan onSelectSubject={handleSelectSubject} />;
      case 'pyqs':
        return <PYQTracker onOpenQuickAdd={() => setIsQuickAddOpen(true)} />;
      case 'mock-tests':
        return <MockTests onOpenQuickAdd={() => setIsQuickAddOpen(true)} />;
      case 'mistake-log':
        return <MistakeLog onOpenQuickAdd={() => setIsQuickAddOpen(true)} />;
      case 'revision':
        return <RevisionEngine onSelectSubject={handleSelectSubject} />;
      case 'paper1':
        return <Paper1Tracker />;
      case 'mains':
        return <MainsMode onOpenQuickAdd={() => setIsQuickAddOpen(true)} />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'user-management':
        return <UserManagement />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} setSelectedSubjectId={setSelectedSubjectId} onOpenQuickAdd={() => setIsQuickAddOpen(true)} onOpenTimer={() => setIsTimerOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenTimer={() => setIsTimerOpen(true)}
      />

      {/* Mobile Top Navbar */}
      <MobileNavbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenTimer={() => setIsTimerOpen(true)}
      />

      {/* Main Content Workspace Container */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full pb-24 lg:pb-6 overflow-x-hidden">
        {renderActivePage()}
      </main>

      {/* Floating (+) Quick Add Action Button (Mobile & Desktop) */}
      <button
        onClick={() => setIsQuickAddOpen(true)}
        className="fixed bottom-20 lg:bottom-8 right-6 z-40 w-12 h-12 bg-black text-white hover:bg-white hover:text-black flex items-center justify-center border border-black transition-colors"
        style={{ borderRadius: '4px' }}
        title="Quick Log Action"
      >
        <Icon name="add" className="text-2xl" />
      </button>

      {/* Modals */}
      <QuickAddModal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} />
      <PomodoroTimerModal isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />
      <OnboardingWizard />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
