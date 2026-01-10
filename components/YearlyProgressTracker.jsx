'use client';

import React, { useEffect, useState } from 'react';

const YearlyProgressTracker = () => {
  const [progress, setProgress] = useState(0);
  const [daysElapsed, setDaysElapsed] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [weeksElapsed, setWeeksElapsed] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      const startOfYear = new Date(now.getFullYear(), 0, 1, 0, 0, 0);
      const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

      const totalYearMs = endOfYear.getTime() - startOfYear.getTime();
      const elapsedMs = now.getTime() - startOfYear.getTime();

      const yearProgress = Math.round((elapsedMs / totalYearMs) * 100);
      setProgress(Math.min(Math.max(yearProgress, 0), 100));

      // Calculate days and weeks
      const elapsed = Math.floor(elapsedMs / (24 * 60 * 60 * 1000)) + 1;
      const total = Math.floor(totalYearMs / (24 * 60 * 60 * 1000)) + 1;
      const weeks = Math.floor(elapsed / 7);

      setDaysElapsed(elapsed);
      setTotalDays(total);
      setWeeksElapsed(weeks);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Create 120 diamonds (4 rows × 30 columns)
  const totalDiamonds = 120;
  const filledDiamonds = Math.round((progress / 100) * totalDiamonds);

  const diamonds = Array.from({ length: totalDiamonds }, (_, index) => {
    const isFilled = index < filledDiamonds;
    return (
      <div key={index} className="w-3 h-3 flex items-center justify-center">
        <img
          src={isFilled ? '/assets/fill.svg' : '/assets/empty.svg'}
          alt={isFilled ? 'filled' : 'empty'}
          className="w-full h-full"
        />
      </div>
    );
  });

  const currentYear = new Date().getFullYear();
  const isLeapYear =
    (currentYear % 4 === 0 && currentYear % 100 !== 0) ||
    currentYear % 400 === 0;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-2xl p-12 shadow-lg max-w-6xl w-full">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm font-medium text-gray-600">This Year</div>
          <div className="text-4xl font-bold text-gray-800">{progress}%</div>
        </div>

        {/* Middle - Diamonds */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-30 gap-5">{diamonds}</div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 items-end">
          <div className="text-xs text-gray-500 justify-self-start">
            {currentYear}
          </div>
          <div className="flex items-center text-xs text-gray-400 justify-self-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
            Day {daysElapsed}
          </div>
          <div className="text-xs text-gray-400 justify-self-end">
            Week {weeksElapsed} ({isLeapYear ? 'Leap Year' : 'Regular Year'})
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyProgressTracker;
