import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Icon } from '../components/common/Icon';
import { isSupabaseConfigured } from '../lib/supabase';

export const Settings = () => {
  const { settings, setSettings, exportAppData, importAppData, resetAllProgress } = useApp();

  const [formData, setFormData] = useState({
    examDate: settings.examDate || '2027-01-10',
    startDate: settings.startDate || new Date().toISOString().split('T')[0],
    dailyTargetHours: settings.dailyTargetHours || 4.5,
    weekdayHours: settings.weekdayHours || 3.5,
    weekendHours: settings.weekendHours || 7.0,
    targetScore: settings.targetScore || 350,
    negativeMarking: settings.negativeMarking ?? true,
  });

  const [importStatus, setImportStatus] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(prev => ({
      ...prev,
      ...formData,
      theme: 'light',
    }));
    alert('Settings saved successfully!');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        const res = importAppData(json);
        if (res.success) {
          setImportStatus('Backup restored successfully!');
        } else {
          setImportStatus('Invalid JSON backup file.');
        }
      } catch (err) {
        setImportStatus('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="text-2xl font-black text-black tracking-tight">
          Application & Preparation Settings
        </h1>
        <p className="text-xs md:text-sm text-black font-medium mt-1">
          Configure exam target date, study targets, and data backup & restore
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Settings Form */}
        <Card className="lg:col-span-2">
          <form onSubmit={handleSaveSettings} className="space-y-4">
            <h2 className="font-bold text-black text-base pb-3 border-b border-black tracking-wide">
              Exam & Schedule Configuration
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-black tracking-wider mb-1">
                  ESE 2027 Exam Date
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                  style={{ borderRadius: '4px' }}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black tracking-wider mb-1">
                  Preparation Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-black tracking-wider mb-1">
                  Daily Target Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.dailyTargetHours}
                  onChange={(e) => setFormData({ ...formData, dailyTargetHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black tracking-wider mb-1">
                  Weekday Target (h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weekdayHours}
                  onChange={(e) => setFormData({ ...formData, weekdayHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-black tracking-wider mb-1">
                  Weekend Target (h)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.weekendHours}
                  onChange={(e) => setFormData({ ...formData, weekendHours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                  style={{ borderRadius: '4px' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black tracking-wider mb-1">
                Target Score (Out of 500)
              </label>
              <input
                type="number"
                value={formData.targetScore}
                onChange={(e) => setFormData({ ...formData, targetScore: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 text-sm bg-white text-black border border-black focus:outline-none"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-black cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.negativeMarking}
                  onChange={(e) => setFormData({ ...formData, negativeMarking: e.target.checked })}
                  className="accent-black"
                />
                <span>Include UPSC 1/3rd Negative Marking Deduction</span>
              </label>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-black hover:bg-white hover:text-black text-white font-bold text-xs border border-black flex items-center justify-center gap-2 transition-colors tracking-wider"
              style={{ borderRadius: '4px' }}
            >
              <Icon name="save" className="text-base" />
              <span>Save Configuration</span>
            </button>
          </form>
        </Card>

        {/* Data Backup, Import & Reset */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-bold text-black text-base pb-3 border-b border-black tracking-wide">
              Data Backup & Sync
            </h2>

            {/* Supabase Status Indicator */}
            <div className="mt-3 p-3 bg-white border border-black" style={{ borderRadius: '4px' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black">Cloud Storage (Supabase)</span>
                <span className={`text-[10px] font-black px-2 py-0.5 border ${
                  isSupabaseConfigured
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-black'
                }`} style={{ borderRadius: '4px' }}>
                  {isSupabaseConfigured ? 'CONNECTED' : 'LOCAL STORAGE MODE'}
                </span>
              </div>
              <p className="text-[11px] text-black mt-1 font-medium">
                {isSupabaseConfigured
                  ? 'Your progress is connected to Supabase for multi-device cloud sync.'
                  : 'Currently storing progress locally. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env for multi-device cloud sync.'}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <button
                onClick={exportAppData}
                className="w-full py-2.5 px-4 bg-white hover:bg-black hover:text-white text-black font-bold text-xs flex items-center justify-center gap-2 border border-black transition-colors tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                <Icon name="download" className="text-black" />
                <span>Export All Data (.JSON)</span>
              </button>

              <label
                className="w-full py-2.5 px-4 bg-white hover:bg-black hover:text-white text-black font-bold text-xs flex items-center justify-center gap-2 border border-black cursor-pointer transition-colors tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                <Icon name="upload" className="text-black" />
                <span>Import JSON Backup</span>
                <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              </label>

              {importStatus && (
                <p className="text-xs font-bold text-black text-center mt-2 tracking-wider">
                  {importStatus}
                </p>
              )}
            </div>
          </Card>

          <Card className="border border-black bg-white">
            <h2 className="font-bold text-black text-base pb-2 tracking-wide">Danger Zone</h2>
            <p className="text-xs text-black mb-4">Reset all recorded preparation data to a clean initial state.</p>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2.5 px-4 bg-black hover:bg-white hover:text-black text-white font-bold text-xs border border-black transition-colors tracking-wider"
              style={{ borderRadius: '4px' }}
            >
              Reset All Progress
            </button>
          </Card>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black p-6 w-full max-w-sm text-center space-y-4" style={{ borderRadius: '4px' }}>
            <Icon name="warning" className="text-4xl text-black" />
            <h3 className="font-bold text-black text-lg tracking-wide">Are you sure?</h3>
            <p className="text-xs text-black font-medium">
              This will erase all your logged study sessions, PYQs, mistakes, and mock tests from local storage.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 border border-black text-xs font-bold text-black hover:bg-black hover:text-white tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 bg-black hover:bg-white text-white hover:text-black border border-black font-bold text-xs tracking-wider"
                style={{ borderRadius: '4px' }}
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
