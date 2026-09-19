import React, { useState } from 'react';
import { Icon } from '../common/Icon';

export const UserAuthModal = ({ isOpen, currentUserName, onSelectUser, existingUsers = [] }) => {
  const [inputName, setInputName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) {
      setErrorMsg('Please enter a valid name.');
      return;
    }
    setErrorMsg('');
    onSelectUser(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-white border border-black w-full max-w-md overflow-hidden text-black" style={{ borderRadius: '4px' }}>
        {/* Header */}
        <div className="p-4 border-b border-black bg-black text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white text-black" style={{ borderRadius: '4px' }}>
              <Icon name="person" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base">Aspirant Profile Sign In</h2>
              <p className="text-xs text-white font-semibold">Track personal progress by name</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black text-black mb-1 tracking-wider">
                Enter Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ashwani Pratap"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full px-3 py-2.5 text-sm bg-white border border-black text-black font-bold placeholder:text-black/50 focus:outline-none"
                style={{ borderRadius: '4px' }}
                autoFocus
              />
              {errorMsg && (
                <p className="text-xs font-bold text-black mt-1">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-black hover:bg-white hover:text-black text-white font-black text-xs border border-black transition-colors tracking-wider flex items-center justify-center gap-2"
              style={{ borderRadius: '4px' }}
            >
              <span>Continue Preparation</span>
              <Icon name="arrow_forward" className="text-sm" />
            </button>
          </form>

          {/* Quick Switch Existing Aspirants */}
          {existingUsers.length > 0 && (
            <div className="pt-4 border-t border-black">
              <span className="text-xs font-black text-black tracking-wider block mb-2">
                Or Switch Existing Aspirant Profile:
              </span>
              <div className="flex flex-wrap gap-2">
                {existingUsers.map((u) => (
                  <button
                    key={u}
                    onClick={() => onSelectUser(u)}
                    className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                      currentUserName === u
                        ? 'bg-black text-white border-black font-black'
                        : 'bg-white text-black border-black hover:bg-black hover:text-white'
                    }`}
                    style={{ borderRadius: '4px' }}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
