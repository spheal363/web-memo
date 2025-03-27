import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import InputField from '../components/InputField';
import Memo from '../components/Memo';
import { AiOutlineEdit } from "react-icons/ai";

export default function App() {
  const [memos, setMemos] = useState<string[]>(() => {
    const stored = localStorage.getItem('memos');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('darkMode');
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    const storedMemos = localStorage.getItem('memos');
    if (storedMemos) {
      setMemos(JSON.parse(storedMemos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  function toggleTheme() {
    setIsDarkMode((prev) => !prev);
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''}`}>
      <div className="min-h-screen w-full flex flex-col items-center bg-white text-black dark:bg-gray-900 dark:text-white px-4">
        <button
          onClick={toggleTheme}
          className="fixed top-4 right-4 z-50 text-xs md:text-sm px-3 py-1 rounded font-bold shadow 
                     bg-gray-800 text-white hover:bg-gray-700 
                     dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          {isDarkMode ? '🔆 Light' : '🌙 Dark'}
        </button>

        <h1 className="text-4xl font-bold text-center mt-16 mb-4">
          <div className="flex items-center justify-center gap-2">
            <AiOutlineEdit />
            WEBメモ帳
          </div>
        </h1>
        <p className="text-center text-sm md:text-base mb-4 text-gray-500 dark:text-gray-300">
          ※メモはダブルクリックで編集できます
        </p>
        <InputField setMemos={setMemos} />
        <Memo memos={memos} setMemos={setMemos} />
      </div>
    </div>
  );
}
