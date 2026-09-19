import React, { useState } from 'react';
import { LogoIcon } from '../common/LogoIcon';
import { Icon } from '../common/Icon';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export const LoginScreen = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const getUsersFromStorage = () => {
    try {
      const stored = localStorage.getItem('ese_2027_auth_users');
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  };

  const saveUsersToStorage = (usersObj) => {
    localStorage.setItem('ese_2027_auth_users', JSON.stringify(usersObj));
  };

  const syncProfileToSupabase = async (profileName) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('ese_profiles').upsert([
          { user_name: profileName }
        ], { onConflict: 'user_name' });
      } catch (err) {
        console.warn('Supabase profile sync warning:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();

    if (!trimmedName) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!trimmedPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    const existingUsers = getUsersFromStorage();

    if (mode === 'signup') {
      if (trimmedPassword.length < 4) {
        setErrorMsg('Password must be at least 4 characters.');
        return;
      }
      if (trimmedPassword !== confirmPassword.trim()) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      // Check if user already exists
      const userKey = trimmedName.toLowerCase();
      if (existingUsers[userKey]) {
        setErrorMsg('An account with this name already exists. Please log in.');
        return;
      }

      // Create new account
      existingUsers[userKey] = {
        displayName: trimmedName,
        password: trimmedPassword,
        createdAt: new Date().toISOString(),
      };
      saveUsersToStorage(existingUsers);
      await syncProfileToSupabase(trimmedName);
      setErrorMsg('');
      onLoginSuccess(trimmedName);
    } else {
      // Login mode
      const userKey = trimmedName.toLowerCase();
      const userRecord = existingUsers[userKey];

      if (!userRecord) {
        setErrorMsg('No account found with this name. Please create an account.');
        return;
      }

      if (userRecord.password !== trimmedPassword) {
        setErrorMsg('Incorrect password. Please try again.');
        return;
      }

      await syncProfileToSupabase(userRecord.displayName || trimmedName);
      setErrorMsg('');
      onLoginSuccess(userRecord.displayName || trimmedName);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 font-sans select-none">
      <div className="w-full max-w-md bg-black border border-white p-6 space-y-6" style={{ borderRadius: '4px' }}>
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-white">
          <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-black" style={{ borderRadius: '4px' }}>
            <LogoIcon className="w-7 h-7 text-black" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-white mt-1">
            ESE CIVIL 2027
          </h1>
          <p className="text-xs text-white font-bold tracking-widest uppercase">
            Preparation HQ & Analytics
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border border-white p-1 gap-1" style={{ borderRadius: '4px' }}>
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-black transition-colors ${
              mode === 'login'
                ? 'bg-white text-black font-extrabold'
                : 'bg-black text-white hover:bg-white hover:text-black font-semibold'
            }`}
            style={{ borderRadius: '4px' }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-black transition-colors ${
              mode === 'signup'
                ? 'bg-white text-black font-extrabold'
                : 'bg-black text-white hover:bg-white hover:text-black font-semibold'
            }`}
            style={{ borderRadius: '4px' }}
          >
            Create Account
          </button>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-white tracking-wider mb-1">
              Aspirant Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ashwani"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2.5 text-sm bg-black border border-white text-white font-bold placeholder:text-white/40 focus:outline-none focus:bg-white focus:text-black transition-colors"
              style={{ borderRadius: '4px' }}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-white tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMsg('');
              }}
              className="w-full px-3 py-2.5 text-sm bg-black border border-white text-white font-bold placeholder:text-white/40 focus:outline-none focus:bg-white focus:text-black transition-colors"
              style={{ borderRadius: '4px' }}
              required
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-extrabold text-white tracking-wider mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2.5 text-sm bg-black border border-white text-white font-bold placeholder:text-white/40 focus:outline-none focus:bg-white focus:text-black transition-colors"
                style={{ borderRadius: '4px' }}
                required
              />
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 bg-white text-black text-xs font-black border border-white tracking-wider">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-white hover:bg-black text-black hover:text-white border border-white font-black text-xs transition-colors tracking-widest uppercase flex items-center justify-center gap-2 mt-2"
            style={{ borderRadius: '4px' }}
          >
            <span>{mode === 'login' ? 'Access Preparation HQ' : 'Create Aspirant Profile'}</span>
            <Icon name="arrow_forward" className="text-sm" />
          </button>
        </form>

        <p className="text-[11px] text-center text-white/70 font-semibold tracking-wider pt-2 border-t border-white">
          Secure, isolated preparation tracking for ESE Civil Aspirants
        </p>
      </div>
    </div>
  );
};
