import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { Icon } from '../components/common/Icon';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const UserManagement = () => {
  const { userName } = useApp();
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);

  const loadAllUsers = async () => {
    setLoading(true);
    let allUsersObj = {};
    try {
      const stored = localStorage.getItem('ese_2027_auth_users');
      if (stored) allUsersObj = JSON.parse(stored);
    } catch (e) {
      allUsersObj = {};
    }

    // Ensure Ashwani Pratap Singh is included
    const adminKey = 'ashwani pratap singh';
    if (!allUsersObj[adminKey]) {
      allUsersObj[adminKey] = {
        displayName: 'Ashwani Pratap Singh',
        password: 'Ashwani@7027',
        isAdmin: true,
        createdAt: new Date().toISOString(),
      };
    }

    // Also fetch profiles from Supabase if configured
    let supabaseProfiles = [];
    if (isSupabaseConfigured && supabase) {
      try {
        const { data } = await supabase.from('ese_profiles').select('*');
        if (data) supabaseProfiles = data;
      } catch (err) {
        console.warn('Could not fetch Supabase profiles', err);
      }
    }

    // Combine local & Supabase user profiles
    const usersMap = {};
    Object.keys(allUsersObj).forEach(key => {
      const u = allUsersObj[key];
      usersMap[u.displayName] = {
        name: u.displayName,
        isAdmin: Boolean(u.isAdmin),
        createdAt: u.createdAt || new Date().toISOString(),
      };
    });

    supabaseProfiles.forEach(sp => {
      if (sp.user_name && !usersMap[sp.user_name]) {
        usersMap[sp.user_name] = {
          name: sp.user_name,
          isAdmin: sp.user_name.toLowerCase() === 'ashwani pratap singh',
          createdAt: sp.created_at || new Date().toISOString(),
        };
      }
    });

    // Compute progress snapshot for each user
    const usersWithStats = Object.values(usersMap).map(u => {
      const uname = u.name;
      const getStoredUser = (k, def) => {
        try {
          const item = localStorage.getItem(`${k}_${uname}`) || localStorage.getItem(k);
          return item ? JSON.parse(item) : def;
        } catch (e) {
          return def;
        }
      };

      const sessions = getStoredUser('ese_2027_sessions', []);
      const pyqs = getStoredUser('ese_2027_pyqs', []);
      const mocks = getStoredUser('ese_2027_mocks', []);
      const subjects = getStoredUser('ese_2027_subjects', []);

      const totalHours = sessions.reduce((sum, s) => sum + (parseFloat(s.duration) || 0), 0);
      let totalChapters = 0;
      let completedChapters = 0;

      if (Array.isArray(subjects)) {
        subjects.forEach(sub => {
          if (sub.chapters) {
            sub.chapters.forEach(ch => {
              totalChapters++;
              if (ch.status === 'mastered' || ch.status === 'revised') {
                completedChapters++;
              }
            });
          }
        });
      }

      const progressPercent = totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;

      return {
        ...u,
        totalSessions: sessions.length,
        totalHours: parseFloat(totalHours.toFixed(1)),
        totalPyqs: pyqs.length,
        totalMocks: mocks.length,
        completedChapters,
        totalChapters,
        progressPercent,
      };
    });

    setUsersList(usersWithStats);
    setLoading(false);
  };

  useEffect(() => {
    loadAllUsers();
  }, []);

  const handleDeleteUser = async (userToDelete) => {
    const targetName = userToDelete.name;

    // Remove from localStorage users auth
    try {
      const stored = localStorage.getItem('ese_2027_auth_users');
      if (stored) {
        const usersObj = JSON.parse(stored);
        delete usersObj[targetName.toLowerCase()];
        localStorage.setItem('ese_2027_auth_users', JSON.stringify(usersObj));
      }
    } catch (e) {}

    // Clear user's individual storage keys
    const keys = ['ese_2027_settings', 'ese_2027_subjects', 'ese_2027_paper1', 'ese_2027_sessions', 'ese_2027_pyqs', 'ese_2027_mistakes', 'ese_2027_mocks', 'ese_2027_mains', 'ese_2027_roadmap'];
    keys.forEach(k => {
      localStorage.removeItem(`${k}_${targetName}`);
    });

    // Delete from Supabase if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ese_profiles').delete().eq('user_name', targetName);
        await supabase.from('ese_study_sessions').delete().eq('user_name', targetName);
        await supabase.from('ese_pyq_records').delete().eq('user_name', targetName);
        await supabase.from('ese_mistake_logs').delete().eq('user_name', targetName);
        await supabase.from('ese_mock_tests').delete().eq('user_name', targetName);
        await supabase.from('ese_settings').delete().eq('user_name', targetName);
      } catch (err) {
        console.warn('Error deleting user data from Supabase:', err);
      }
    }

    setSelectedUserToDelete(null);
    loadAllUsers();
  };

  return (
    <div className="space-y-6 pb-6 select-none">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-black tracking-widest uppercase" style={{ borderRadius: '4px' }}>
              Superuser Control
            </span>
            <span className="text-xs font-bold text-black tracking-wider">Logged as: {userName}</span>
          </div>
          <h1 className="text-2xl font-black text-black tracking-tight mt-1">
            User Manager & Aspirant Analytics
          </h1>
          <p className="text-xs md:text-sm text-black font-semibold mt-0.5">
            Monitor onboarded ESE Civil aspirants, view progress snapshots, and manage access
          </p>
        </div>

        <button
          onClick={loadAllUsers}
          className="flex items-center gap-2 px-3.5 py-2 bg-black hover:bg-white text-white hover:text-black border border-black text-xs font-bold transition-colors tracking-wider"
          style={{ borderRadius: '4px' }}
        >
          <Icon name="autorenew" className="text-sm" />
          <span>Refresh Users</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Onboarded Aspirants"
          value={usersList.length}
          subtitle="Registered profiles"
          iconName="group"
        />
        <StatCard
          title="Total Study Hours"
          value={`${usersList.reduce((s, u) => s + u.totalHours, 0).toFixed(1)} hrs`}
          subtitle="Logged across users"
          iconName="timer"
        />
        <StatCard
          title="Total PYQs Attempted"
          value={usersList.reduce((s, u) => s + u.totalPyqs, 0)}
          subtitle="Platform practice"
          iconName="help_outline"
        />
        <StatCard
          title="Mock Tests Taken"
          value={usersList.reduce((s, u) => s + u.totalMocks, 0)}
          subtitle="Total attempted"
          iconName="assignment_turned_in"
        />
      </div>

      {/* Aspirants Table Card */}
      <Card className="bg-white border border-black text-black">
        <div className="pb-3 border-b border-black flex items-center justify-between">
          <h2 className="font-black text-black text-base tracking-wide">
            Onboarded Aspirants Directory ({usersList.length})
          </h2>
          <span className="text-xs font-bold text-black font-mono">
            {isSupabaseConfigured ? 'Supabase Sync Active' : 'Local Storage Mode'}
          </span>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs font-bold text-black">
            Loading user list & progress snapshots...
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-black bg-black text-white">
                  <th className="p-3 font-extrabold tracking-wider">Aspirant Name</th>
                  <th className="p-3 font-extrabold tracking-wider">Joined Date</th>
                  <th className="p-3 font-extrabold tracking-wider">Syllabus Done</th>
                  <th className="p-3 font-extrabold tracking-wider">Study Hours</th>
                  <th className="p-3 font-extrabold tracking-wider">PYQs & Mocks</th>
                  <th className="p-3 font-extrabold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black font-semibold text-black">
                {usersList.map((u) => (
                  <tr key={u.name} className="hover:bg-black/5 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm">{u.name}</span>
                        {u.isAdmin && (
                          <Badge variant="primary" className="text-[10px]">ADMIN</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3 font-mono">
                      <span className="font-bold">{u.completedChapters}</span> / {u.totalChapters || 68} ({u.progressPercent}%)
                    </td>
                    <td className="p-3 font-mono font-bold">
                      {u.totalHours} hrs ({u.totalSessions} sessions)
                    </td>
                    <td className="p-3 font-mono">
                      {u.totalPyqs} PYQs | {u.totalMocks} Mocks
                    </td>
                    <td className="p-3 text-right">
                      {u.isAdmin ? (
                        <span className="text-[10px] font-extrabold text-black/40 tracking-wider">System Admin</span>
                      ) : (
                        <button
                          onClick={() => setSelectedUserToDelete(u)}
                          className="px-2.5 py-1 bg-black text-white hover:bg-white hover:text-black border border-black font-extrabold text-xs transition-colors"
                          style={{ borderRadius: '4px' }}
                        >
                          Remove User
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      {selectedUserToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border border-black p-6 w-full max-w-md text-black space-y-4" style={{ borderRadius: '4px' }}>
            <div className="flex items-center gap-2 pb-2 border-b border-black">
              <Icon name="warning" className="text-black text-xl" />
              <h3 className="font-black text-black text-base">Remove Aspirant Account</h3>
            </div>
            <p className="text-xs font-bold text-black leading-relaxed">
              Are you sure you want to permanently remove <strong className="font-black underline">{selectedUserToDelete.name}</strong>?
            </p>
            <p className="text-[11px] font-semibold text-black/80">
              This action will erase all study sessions, PYQs, mistake logs, and test data for this user.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserToDelete(null)}
                className="px-4 py-2 bg-white text-black border border-black font-bold text-xs hover:bg-black hover:text-white transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUserToDelete)}
                className="px-4 py-2 bg-black text-white border border-black font-black text-xs hover:bg-white hover:text-black transition-colors"
                style={{ borderRadius: '4px' }}
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
