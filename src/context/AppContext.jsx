import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SETTINGS, CIVIL_SUBJECTS, PAPER_1_SUBJECTS, INITIAL_ROADMAP, INITIAL_SESSIONS } from '../data/initialData';
import { supabase, isSupabaseConfigured, syncUserProfile, syncAllLocalProfiles } from '../lib/supabase';

const AppContext = createContext();

const STORAGE_KEYS = {
  SETTINGS: 'ese_2027_settings',
  SUBJECTS: 'ese_2027_subjects',
  PAPER1: 'ese_2027_paper1',
  SESSIONS: 'ese_2027_sessions',
  PYQS: 'ese_2027_pyqs',
  MISTAKES: 'ese_2027_mistakes',
  MOCKS: 'ese_2027_mocks',
  MAINS: 'ese_2027_mains',
  ROADMAP: 'ese_2027_roadmap',
};

const isDummySession = (s) => {
  if (!s) return true;
  if (s.id && String(s.id).startsWith('sess_init_')) return true;
  if (
    s.notes === 'Study session' &&
    s.questionsSolved === 20 &&
    s.correctAnswers === 16 &&
    s.subjectId === 'som' &&
    s.chapterId === 'som-1'
  ) return true;
  return false;
};

const getStoredUser = (key, name, fallback) => {
  try {
    const userKey = `${key}_${name}`;
    const item = localStorage.getItem(userKey);
    if (item !== null) {
      const parsed = JSON.parse(item);
      if (key === STORAGE_KEYS.SESSIONS && Array.isArray(parsed)) {
        return parsed.filter(s => !isDummySession(s));
      }
      return parsed;
    }

    if (name && (name.toLowerCase() === 'ashwani' || name.toLowerCase() === 'ashwani pratap singh')) {
      const legacyItem = localStorage.getItem(key);
      if (legacyItem !== null) {
        const parsed = JSON.parse(legacyItem);
        if (key === STORAGE_KEYS.SESSIONS && Array.isArray(parsed)) {
          return parsed.filter(s => !isDummySession(s));
        }
        return parsed;
      }
    }

    return fallback;
  } catch (err) {
    console.error(`Error reading ${key} for user ${name} from localStorage`, err);
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('ese_2027_auth_active') === 'true');
  const [userName, setUserNameState] = useState(() => localStorage.getItem('ese_2027_current_user') || 'Ashwani');

  const userNameRef = React.useRef(userName);
  useEffect(() => {
    userNameRef.current = userName;
  }, [userName]);

  const [settings, setSettings] = useState(() => getStoredUser(STORAGE_KEYS.SETTINGS, userName, INITIAL_SETTINGS));
  const [subjects, setSubjects] = useState(() => getStoredUser(STORAGE_KEYS.SUBJECTS, userName, CIVIL_SUBJECTS));
  const [paper1Subjects, setPaper1Subjects] = useState(() => getStoredUser(STORAGE_KEYS.PAPER1, userName, PAPER_1_SUBJECTS));
  const [studySessions, setStudySessions] = useState(() => getStoredUser(STORAGE_KEYS.SESSIONS, userName, []));
  const [pyqRecords, setPyqRecords] = useState(() => getStoredUser(STORAGE_KEYS.PYQS, userName, []));
  const [mistakeLogs, setMistakeLogs] = useState(() => getStoredUser(STORAGE_KEYS.MISTAKES, userName, []));
  const [mockTests, setMockTests] = useState(() => getStoredUser(STORAGE_KEYS.MOCKS, userName, []));
  const [mainsPractice, setMainsPractice] = useState(() => getStoredUser(STORAGE_KEYS.MAINS, userName, []));
  const [roadmap, setRoadmap] = useState(() => getStoredUser(STORAGE_KEYS.ROADMAP, userName, INITIAL_ROADMAP));

  const loadUserDataFor = (name) => {
    userNameRef.current = name;
    setSettings(getStoredUser(STORAGE_KEYS.SETTINGS, name, INITIAL_SETTINGS));
    setSubjects(getStoredUser(STORAGE_KEYS.SUBJECTS, name, CIVIL_SUBJECTS));
    setPaper1Subjects(getStoredUser(STORAGE_KEYS.PAPER1, name, PAPER_1_SUBJECTS));
    setStudySessions(getStoredUser(STORAGE_KEYS.SESSIONS, name, []));
    setPyqRecords(getStoredUser(STORAGE_KEYS.PYQS, name, []));
    setMistakeLogs(getStoredUser(STORAGE_KEYS.MISTAKES, name, []));
    setMockTests(getStoredUser(STORAGE_KEYS.MOCKS, name, []));
    setMainsPractice(getStoredUser(STORAGE_KEYS.MAINS, name, []));
    setRoadmap(getStoredUser(STORAGE_KEYS.ROADMAP, name, INITIAL_ROADMAP));
  };

  const handleLogin = (name) => {
    if (!name) return;
    const trimmed = name.trim();
    userNameRef.current = trimmed;
    localStorage.setItem('ese_2027_current_user', trimmed);
    localStorage.setItem('ese_2027_auth_active', 'true');
    setUserNameState(trimmed);
    setIsAuthenticated(true);
    loadUserDataFor(trimmed);
  };

  const logout = () => {
    localStorage.removeItem('ese_2027_auth_active');
    setIsAuthenticated(false);
  };
  
  // Timer State
  const [timerState, setTimerState] = useState({
    isOpen: false,
    duration: 25 * 60, // seconds
    timeLeft: 25 * 60,
    isRunning: false,
    subjectId: '',
    chapterId: '',
    activity: 'Concept',
  });

  // Purge any legacy un-suffixed or contaminated dummy seed session data from localStorage
  useEffect(() => {
    try {
      const keysToClean = [STORAGE_KEYS.SESSIONS, `${STORAGE_KEYS.SESSIONS}_${userName}`];
      keysToClean.forEach(key => {
        const item = localStorage.getItem(key);
        if (item) {
          const parsed = JSON.parse(item);
          if (Array.isArray(parsed)) {
            const cleaned = parsed.filter(s => !isDummySession(s));
            if (cleaned.length !== parsed.length) {
              localStorage.setItem(key, JSON.stringify(cleaned));
            }
          }
        }
      });
    } catch (e) {}
  }, [userName]);

  // Sync state to local storage with username key
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.SETTINGS}_${userNameRef.current}`, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.SUBJECTS}_${userNameRef.current}`, JSON.stringify(subjects)); }, [subjects]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.PAPER1}_${userNameRef.current}`, JSON.stringify(paper1Subjects)); }, [paper1Subjects]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.SESSIONS}_${userNameRef.current}`, JSON.stringify(studySessions)); }, [studySessions]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.PYQS}_${userNameRef.current}`, JSON.stringify(pyqRecords)); }, [pyqRecords]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.MISTAKES}_${userNameRef.current}`, JSON.stringify(mistakeLogs)); }, [mistakeLogs]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.MOCKS}_${userNameRef.current}`, JSON.stringify(mockTests)); }, [mockTests]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.MAINS}_${userNameRef.current}`, JSON.stringify(mainsPractice)); }, [mainsPractice]);
  useEffect(() => { if (userNameRef.current) localStorage.setItem(`${STORAGE_KEYS.ROADMAP}_${userNameRef.current}`, JSON.stringify(roadmap)); }, [roadmap]);

  // Auto-sync active profile and all local users to Supabase database
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      if (userName) {
        syncUserProfile(userName);
      }
      syncAllLocalProfiles();
    }
  }, [userName]);

  // Dark mode class toggle on root html element
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Status weight map
  const STATUS_WEIGHTS = {
    'not-started': 0,
    'learning': 25,
    'pyq': 50,
    'revised': 75,
    'mastered': 100,
  };

  // Compute Overall Progress
  const calculateOverallProgress = () => {
    let totalChapters = 0;
    let totalWeight = 0;
    subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        totalChapters++;
        totalWeight += STATUS_WEIGHTS[ch.status] || 0;
      });
    });
    if (totalChapters === 0) return 0;
    return Math.round(totalWeight / totalChapters);
  };

  // Compute Completed Chapters Count
  const getCompletedChaptersCount = () => {
    let count = 0;
    subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        if (ch.status === 'revised' || ch.status === 'mastered') count++;
      });
    });
    return count;
  };

  const getTotalChaptersCount = () => {
    return subjects.reduce((acc, sub) => acc + sub.chapters.length, 0);
  };

  // Total PYQs Solved
  const getTotalPyqsSolved = () => {
    return pyqRecords.reduce((acc, r) => acc + (parseInt(r.questionsSolved, 10) || 1), 0);
  };

  // Average Mock Score
  const getMockStats = () => {
    if (mockTests.length === 0) return { count: 0, avgScore: 0, bestScore: 0, latestScore: 0 };
    const scores = mockTests.map(m => m.score || 0);
    const sum = scores.reduce((a, b) => a + b, 0);
    const count = mockTests.length;
    const avgScore = Math.round(sum / count);
    const bestScore = Math.max(...scores);
    const latestScore = scores[scores.length - 1];
    return { count, avgScore, bestScore, latestScore };
  };

  // Calculate Study Streak 
  const getStudyStreak = () => {
    if (studySessions.length === 0) return 0;
    const dates = Array.from(new Set(studySessions.map(s => s.date.split('T')[0]))).sort().reverse();
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (!dates.includes(today) && !dates.includes(yesterday)) {
      return 0;
    }

    let streak = 0;
    let checkDate = dates.includes(today) ? new Date() : new Date(Date.now() - 86400000);

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  // Spaced Repetition Helper
  const getNextRevisionDate = (currentCount = 0) => {
    const daysArr = [2, 7, 21, 45];
    const daysToAdd = daysArr[Math.min(currentCount, daysArr.length - 1)];
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  // Update Chapter Status
  const updateChapterStatus = (subjectId, chapterId, newStatus) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        chapters: sub.chapters.map(ch => {
          if (ch.id !== chapterId) return ch;
          const isCompleting = (newStatus === 'revised' || newStatus === 'mastered');
          const revCount = isCompleting ? (ch.revisionCount || 0) + 1 : (ch.revisionCount || 0);
          return {
            ...ch,
            status: newStatus,
            lastStudied: new Date().toISOString().split('T')[0],
            nextRevision: isCompleting ? getNextRevisionDate(revCount) : ch.nextRevision,
            revisionCount: revCount
          };
        })
      };
    }));
  };

  // Update Paper 1 Chapter Status
  const updatePaper1ChapterStatus = (subjectId, chapterId, newStatus) => {
    setPaper1Subjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        chapters: sub.chapters.map(ch => (ch.id === chapterId ? { ...ch, status: newStatus } : ch))
      };
    }));
  };

  // Log Study Session
  const addStudySession = (session) => {
    const newSession = {
      id: 'sess_' + Date.now(),
      date: session.date || new Date().toISOString().split('T')[0],
      duration: parseFloat(session.duration) || 0.5, // in hours
      subjectId: session.subjectId,
      chapterId: session.chapterId || '',
      activity: session.activity || 'Concept',
      questionsSolved: parseInt(session.questionsSolved, 10) || 0,
      correctAnswers: parseInt(session.correctAnswers, 10) || 0,
      notes: session.notes || '',
    };
    setStudySessions(prev => [newSession, ...prev]);

    // Update study hours in chapter if selected
    if (session.subjectId && session.chapterId) {
      setSubjects(prev => prev.map(sub => {
        if (sub.id !== session.subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map(ch => {
            if (ch.id !== session.chapterId) return ch;
            return {
              ...ch,
              studyHours: (ch.studyHours || 0) + parseFloat(session.duration || 0),
              lastStudied: new Date().toISOString().split('T')[0]
            };
          })
        };
      }));
    }
  };

  // Log PYQ Attempt
  const addPyqRecord = (record) => {
    const newRecord = {
      id: 'pyq_' + Date.now(),
      date: record.date || new Date().toISOString().split('T')[0],
      subjectId: record.subjectId,
      chapterId: record.chapterId,
      year: record.year || '2023',
      difficulty: record.difficulty || 'Medium',
      status: record.status || 'correct', // correct | incorrect | guessed
      questionsSolved: parseInt(record.questionsSolved, 10) || 1,
      correctAnswers: record.status === 'correct' ? 1 : 0,
      timeTakenSec: parseInt(record.timeTakenSec, 10) || 120,
      notes: record.notes || ''
    };
    setPyqRecords(prev => [newRecord, ...prev]);

    // Update chapter pyq stats
    if (record.subjectId && record.chapterId) {
      setSubjects(prev => prev.map(sub => {
        if (sub.id !== record.subjectId) return sub;
        return {
          ...sub,
          chapters: sub.chapters.map(ch => {
            if (ch.id !== record.chapterId) return ch;
            const solved = (ch.pyqsAttempted || 0) + 1;
            const correct = (ch.pyqsCorrect || 0) + (record.status === 'correct' ? 1 : 0);
            return {
              ...ch,
              pyqsAttempted: solved,
              pyqsCorrect: correct,
              lastStudied: new Date().toISOString().split('T')[0]
            };
          })
        };
      }));
    }
  };

  // Log Mistake
  const addMistakeLog = (mistake) => {
    const newMistake = {
      id: 'mst_' + Date.now(),
      date: mistake.date || new Date().toISOString().split('T')[0],
      subjectId: mistake.subjectId,
      chapterId: mistake.chapterId,
      type: mistake.type || 'Conceptual', // Conceptual | Formula | Calculation | Silly | Guess
      question: mistake.question || '',
      whyMade: mistake.whyMade || '',
      correctConcept: mistake.correctConcept || '',
      revisionDate: getNextRevisionDate(0),
      resolved: false
    };
    setMistakeLogs(prev => [newMistake, ...prev]);
  };

  const toggleMistakeResolved = (id) => {
    setMistakeLogs(prev => prev.map(m => m.id === id ? { ...m, resolved: !m.resolved } : m));
  };

  // Log Mock Test
  const addMockTest = (mock) => {
    const newMock = {
      id: 'mock_' + Date.now(),
      date: mock.date || new Date().toISOString().split('T')[0],
      name: mock.name || 'Mock Test',
      paper: mock.paper || 'Paper 2 (Tech)', // Paper 1 | Paper 2 (Tech) | Full Length
      score: parseFloat(mock.score) || 0,
      maxMarks: parseFloat(mock.maxMarks) || 300,
      correct: parseInt(mock.correct, 10) || 0,
      incorrect: parseInt(mock.incorrect, 10) || 0,
      unattempted: parseInt(mock.unattempted, 10) || 0,
      timeTakenMinutes: parseInt(mock.timeTakenMinutes, 10) || 180,
      notes: mock.notes || ''
    };
    setMockTests(prev => [newMock, ...prev]);
  };

  // Log Mains Practice
  const addMainsPractice = (mains) => {
    const newMains = {
      id: 'mains_' + Date.now(),
      date: mains.date || new Date().toISOString().split('T')[0],
      subjectId: mains.subjectId,
      question: mains.question || '',
      year: mains.year || '2023',
      marks: parseInt(mains.marks, 10) || 20,
      timeLimitMin: parseInt(mains.timeLimitMin, 10) || 15,
      timeTakenMin: parseInt(mains.timeTakenMin, 10) || 15,
      selfScore: parseFloat(mains.selfScore) || 12,
      maxScore: parseFloat(mains.maxScore) || 20,
      diagramUsed: mains.diagramUsed || false,
      stepsShown: mains.stepsShown || false,
      formulaUsed: mains.formulaUsed || false,
      finalAnswerCorrect: mains.finalAnswerCorrect || false,
      answerUploaded: mains.answerUploaded || false,
    };
    setMainsPractice(prev => [newMains, ...prev]);
  };

  // Complete Revision Item
  const completeRevision = (subjectId, chapterId) => {
    updateChapterStatus(subjectId, chapterId, 'revised');
  };

  // Snooze Revision Item (+1 day)
  const snoozeRevision = (subjectId, chapterId) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.id !== subjectId) return sub;
      return {
        ...sub,
        chapters: sub.chapters.map(ch => {
          if (ch.id !== chapterId) return ch;
          const d = new Date();
          d.setDate(d.getDate() + 1);
          return { ...ch, nextRevision: d.toISOString().split('T')[0] };
        })
      };
    }));
  };

  // Roadmap toggles & editing
  const toggleRoadmapMilestone = (id) => {
    setRoadmap(prev => prev.map(rm => rm.id === id ? { ...rm, completed: !rm.completed } : rm));
  };

  const addCustomRoadmapMilestone = (milestone) => {
    const newMilestone = {
      id: 'rm_' + Date.now(),
      month: milestone.month || 'CUSTOM',
      title: milestone.title || 'New Milestone',
      subjects: milestone.subjects || [],
      completed: false,
      custom: true
    };
    setRoadmap(prev => [...prev, newMilestone]);
  };

  // Calculate Adaptive Recommendations
  const getAdaptiveRecommendations = () => {
    const list = [];
    subjects.forEach(sub => {
      sub.chapters.forEach(ch => {
        // Calculate weakness
        const pyqAcc = ch.pyqsAttempted > 0 ? (ch.pyqsCorrect / ch.pyqsAttempted) : 0.5;
        const weakness = 1.0 - pyqAcc;
        const weightageVal = sub.historicalAvg || 5;

        // Recency score (days since last studied)
        let daysUnstudied = 30;
        if (ch.lastStudied) {
          const diff = Date.now() - new Date(ch.lastStudied).getTime();
          daysUnstudied = Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
        }

        const score = weightageVal * (1 + weakness * 2) * (1 + Math.min(daysUnstudied, 30) / 10);
        
        let reason = [];
        if (sub.historicalAvg >= 13) reason.push('High historical weightage (' + sub.historicalAvg + ' avg Qs)');
        if (ch.pyqsAttempted > 0 && pyqAcc < 0.6) reason.push(`Low PYQ accuracy (${Math.round(pyqAcc * 100)}%)`);
        if (!ch.lastStudied || daysUnstudied > 14) reason.push('Not studied recently (' + daysUnstudied + ' days ago)');
        if (ch.status === 'not-started') reason.push('Status: Not Started yet');

        list.push({
          subjectName: sub.name,
          subjectId: sub.id,
          chapterName: ch.name,
          chapterId: ch.id,
          priority: ch.priority,
          status: ch.status,
          score: Math.round(score),
          reasons: reason,
          pyqAcc: Math.round(pyqAcc * 100),
          daysUnstudied
        });
      });
    });

    return list.sort((a, b) => b.score - a.score);
  };

  // Export Data to JSON
  const exportAppData = () => {
    const data = {
      settings,
      subjects,
      paper1Subjects,
      studySessions,
      pyqRecords,
      mistakeLogs,
      mockTests,
      mainsPractice,
      roadmap,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ESE_Civil_2027_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Data from JSON
  const importAppData = (jsonData) => {
    try {
      if (jsonData.settings) setSettings(jsonData.settings);
      if (jsonData.subjects) setSubjects(jsonData.subjects);
      if (jsonData.paper1Subjects) setPaper1Subjects(jsonData.paper1Subjects);
      if (jsonData.studySessions) setStudySessions(jsonData.studySessions);
      if (jsonData.pyqRecords) setPyqRecords(jsonData.pyqRecords);
      if (jsonData.mistakeLogs) setMistakeLogs(jsonData.mistakeLogs);
      if (jsonData.mockTests) setMockTests(jsonData.mockTests);
      if (jsonData.mainsPractice) setMainsPractice(jsonData.mainsPractice);
      if (jsonData.roadmap) setRoadmap(jsonData.roadmap);
      return { success: true };
    } catch (err) {
      console.error('Import error:', err);
      return { success: false, error: err.message };
    }
  };

  // Reset Progress
  const resetAllProgress = () => {
    setSettings(INITIAL_SETTINGS);
    setSubjects(CIVIL_SUBJECTS);
    setPaper1Subjects(PAPER_1_SUBJECTS);
    setStudySessions([]);
    setPyqRecords([]);
    setMistakeLogs([]);
    setMockTests([]);
    setMainsPractice([]);
    setRoadmap(INITIAL_ROADMAP);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        userName,
        handleLogin,
        logout,
        settings,
        setSettings,
        subjects,
        setSubjects,
        paper1Subjects,
        setPaper1Subjects,
        studySessions,
        pyqRecords,
        mistakeLogs,
        mockTests,
        mainsPractice,
        roadmap,
        timerState,
        setTimerState,
        calculateOverallProgress,
        getCompletedChaptersCount,
        getTotalChaptersCount,
        getTotalPyqsSolved,
        getMockStats,
        getStudyStreak,
        updateChapterStatus,
        updatePaper1ChapterStatus,
        addStudySession,
        addPyqRecord,
        addMistakeLog,
        toggleMistakeResolved,
        addMockTest,
        addMainsPractice,
        completeRevision,
        snoozeRevision,
        toggleRoadmapMilestone,
        addCustomRoadmapMilestone,
        getAdaptiveRecommendations,
        exportAppData,
        importAppData,
        resetAllProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
