'use client';

import React, { useEffect, useState } from 'react';

const DailyProgressTracker = () => {
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const startOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0
      );
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23,
        59,
        59
      );

      const totalDayMs = endOfDay.getTime() - startOfDay.getTime();
      const elapsedMs = now.getTime() - startOfDay.getTime();

      const dayProgress = Math.round((elapsedMs / totalDayMs) * 100);
      setProgress(Math.min(Math.max(dayProgress, 0), 100));

      // Update current time display
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Create 24 diamonds (4 rows × 6 columns)
  const totalDiamonds = 24;
  const filledDiamonds = Math.round((progress / 100) * totalDiamonds);

  const diamonds = Array.from({ length: totalDiamonds }, (_, index) => {
    const isFilled = index < filledDiamonds;
    return (
      <div key={index} className="w-4 h-4 flex items-center justify-center">
        <img
          src={isFilled ? '/assets/fill.svg' : '/assets/empty.svg'}
          alt={isFilled ? 'filled' : 'empty'}
          className="w-full h-full"
        />
      </div>
    );
  });

  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = today.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl p-8 shadow-lg w-[480px]">
        {/* Top row: Today (left), Date (center), Percentage (right) */}
        <div className="grid grid-cols-3 items-center mb-8">
          <div className="flex items-center h-full text-sm font-medium text-gray-600 justify-self-start">
            Today
          </div>
          <div className="flex items-center h-full text-xs font-medium text-gray-500  justify-center whitespace-nowrap">
            {dateString}
          </div>
          <div className="flex items-center h-full text-4xl font-bold text-gray-800 justify-self-end justify-end">
            {progress}%
          </div>
        </div>

        {/* Middle: Diamonds with maximum space */}
        <div className="grid grid-cols-6 gap-[22px] w-fit mx-auto mb-15">
          {diamonds}
        </div>

        {/* Bottom row: Day (left), Clock with dot (right) */}
        <div className="grid grid-cols-3 items-center text-xs">
          <div className="text-gray-500 justify-self-start whitespace-nowrap">
            {dayName}
          </div>
          <div></div>
          <div className="flex items-center text-gray-400 justify-self-end whitespace-nowrap">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
            {currentTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyProgressTracker;
