'use client';

import React, { useEffect, useState } from 'react';

const MonthlyProgressTracker = () => {
  const [progress, setProgress] = useState(0);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [totalDays, setTotalDays] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
        0,
        0,
        0
      );
      const endOfMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );

      const totalMonthMs = endOfMonth.getTime() - startOfMonth.getTime();
      const elapsedMs = now.getTime() - startOfMonth.getTime();

      const monthProgress = Math.round((elapsedMs / totalMonthMs) * 100);
      setProgress(Math.min(Math.max(monthProgress, 0), 100));

      // Calculate days
      const elapsed = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1; // +1 to include current day
      const total = Math.floor(totalMonthMs / (24 * 60 * 60 * 1000)) + 1;
      setDaysElapsed(elapsed);
      setTotalDays(total);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Create 30 diamonds (3 rows × 10 columns)
  const totalDiamonds = 30;
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

  const now = new Date();
  const monthName = now.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl p-12 shadow-lg max-w-2xl w-full mx-4">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-gray-600">This Month</div>
          <div className="text-4xl font-bold text-gray-800">{progress}%</div>
        </div>

        {/* Middle - Diamonds */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-10 gap-5">{diamonds}</div>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-end">
          <div className="text-xs text-gray-500">{monthName}</div>
          <div></div>
          <div className="flex items-center text-xs text-gray-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            {daysElapsed} of {totalDays}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyProgressTracker;
