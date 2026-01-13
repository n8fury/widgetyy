'use client';

import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const DeadlineProgressTracker = () => {
  const [progress, setProgress] = useState(0);
  // Default to tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // Format manually to avoid timezone issues
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const [customDeadline, setCustomDeadline] = useState(getTomorrowDate());
  const [deadlineTitle, setDeadlineTitle] = useState('My Deadline');
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    type: 'year',
  });
  const [isExpired, setIsExpired] = useState(false);
  const [customTime, setCustomTime] = useState('12:00');
  const [templateType, setTemplateType] = useState('year');

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Time picker states
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState('00');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  // Load settings from URL parameters on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlTitle = urlParams.get('title');
    const urlDate = urlParams.get('date');
    const urlTime = urlParams.get('time');

    if (urlTitle) setDeadlineTitle(decodeURIComponent(urlTitle));
    if (urlDate) setCustomDeadline(urlDate);
    if (urlTime) {
      setCustomTime(urlTime);
      // Parse time for time picker
      const [hours, minutes] = urlTime.split(':');
      const hour24 = parseInt(hours);
      const period = hour24 >= 12 ? 'PM' : 'AM';
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      setSelectedHour(hour12.toString().padStart(2, '0'));
      setSelectedMinute(minutes);
      setSelectedPeriod(period);
    }
  }, []);

  // Update URL parameters when settings change
  useEffect(() => {
    const updateURL = () => {
      const params = new URLSearchParams();
      params.set('title', encodeURIComponent(deadlineTitle));
      params.set('date', customDeadline);
      params.set('time', customTime);

      const newURL = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newURL);
    };

    // Only update URL if we have meaningful values (not initial defaults)
    if (deadlineTitle && customDeadline && customTime) {
      updateURL();
    }
  }, [deadlineTitle, customDeadline, customTime]);

  useEffect(() => {
    const updateProgress = () => {
      const now = new Date();
      // Set deadline to the specified date and time
      const deadlineDate = new Date(customDeadline + 'T' + customTime + ':00');
      const msRemaining = deadlineDate.getTime() - now.getTime();

      if (msRemaining <= 0) {
        setProgress(100);
        setIsExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, type: 'day' });
        setTemplateType('day');
        return;
      }

      setIsExpired(false);

      const daysRemaining = msRemaining / (24 * 60 * 60 * 1000);
      const hoursRemaining = msRemaining / (60 * 60 * 1000);
      const minutesRemaining = msRemaining / (60 * 1000);
      const secondsRemaining = msRemaining / 1000;

      let currentTemplateType;
      let startDate;
      let totalMs;
      let elapsedMs;

      // Improved boundary logic with hour template for very short deadlines
      if (hoursRemaining <= 1) {
        // Less than or equal to 1 hour - use hour template (most granular)
        currentTemplateType = 'hour';
        // Start from exactly 1 hour before deadline for clean progress
        startDate = new Date(deadlineDate.getTime() - 60 * 60 * 1000);

        totalMs = 60 * 60 * 1000; // 1 hour
        elapsedMs = now.getTime() - startDate.getTime();

        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: Math.floor(minutesRemaining % 60),
          seconds: Math.floor(secondsRemaining % 60),
          type: 'hour',
        });
      } else if (daysRemaining <= 2) {
        // Less than or equal to 2 days - use daily template
        currentTemplateType = 'day';
        startDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0
        );

        // For daily template, calculate progress within the current day period
        const nextDay = new Date(startDate);
        nextDay.setDate(nextDay.getDate() + 1);

        // Use the actual deadline or next day, whichever comes first
        const endDate = deadlineDate < nextDay ? deadlineDate : nextDay;

        totalMs = endDate.getTime() - startDate.getTime();
        elapsedMs = now.getTime() - startDate.getTime();

        setTimeRemaining({
          days: Math.floor(daysRemaining),
          hours: Math.floor(hoursRemaining % 24),
          minutes: Math.floor(minutesRemaining % 60),
          seconds: Math.floor(secondsRemaining % 60),
          type: 'day',
        });
      } else if (daysRemaining <= 60) {
        // Less than or equal to 60 days (2 months) - use monthly template
        currentTemplateType = 'month';
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0);

        // Calculate end date as either deadline or 2 months from start
        const twoMonthsLater = new Date(startDate);
        twoMonthsLater.setMonth(twoMonthsLater.getMonth() + 2);
        twoMonthsLater.setDate(0); // Last day of previous month
        twoMonthsLater.setHours(23, 59, 59);

        const deadlineInRange =
          deadlineDate > twoMonthsLater ? twoMonthsLater : deadlineDate;

        totalMs = deadlineInRange.getTime() - startDate.getTime();
        elapsedMs = now.getTime() - startDate.getTime();

        setTimeRemaining({
          days: Math.floor(daysRemaining),
          hours: Math.floor(hoursRemaining % 24),
          minutes: Math.floor(minutesRemaining % 60),
          seconds: Math.floor(secondsRemaining % 60),
          type: 'month',
        });
      } else {
        // More than 60 days - use yearly template
        currentTemplateType = 'year';
        const currentYear = now.getFullYear();
        const deadlineYear = deadlineDate.getFullYear();

        if (deadlineYear === currentYear) {
          // Deadline is in current year
          startDate = new Date(currentYear, 0, 1, 0, 0, 0);
        } else {
          // Deadline is in future year, show progress from one year before deadline
          startDate = new Date(
            deadlineYear - 1,
            deadlineDate.getMonth(),
            deadlineDate.getDate(),
            0,
            0,
            0
          );
        }

        totalMs = deadlineDate.getTime() - startDate.getTime();
        elapsedMs = now.getTime() - startDate.getTime();

        setTimeRemaining({
          days: Math.floor(daysRemaining),
          hours: Math.floor(hoursRemaining % 24),
          minutes: Math.floor(minutesRemaining % 60),
          seconds: Math.floor(secondsRemaining % 60),
          type: 'year',
        });
      }

      setTemplateType(currentTemplateType);

      // Ensure progress calculation is always valid
      if (elapsedMs <= 0) {
        setProgress(0);
        return;
      }

      if (totalMs <= 0) {
        setProgress(100);
        return;
      }

      const calculatedProgress = Math.round((elapsedMs / totalMs) * 100);
      setProgress(Math.min(Math.max(calculatedProgress, 0), 100));
    };

    updateProgress();
    // Update every second for real-time countdown
    const interval = setInterval(updateProgress, 1000);

    return () => clearInterval(interval);
  }, [customDeadline, customTime]);

  // Diamond configuration based on template type
  const getDiamondConfig = () => {
    switch (templateType) {
      case 'hour':
        return { total: 12, cols: 6, size: 'w-4 h-4', gap: 'gap-5' };
      case 'day':
        return { total: 24, cols: 6, size: 'w-4 h-4', gap: 'gap-5' };
      case 'month':
        return { total: 30, cols: 6, size: 'w-4 h-4', gap: 'gap-5' };
      case 'year':
        return { total: 182, cols: 26, size: 'w-3 h-3', gap: 'gap-5' };
      default:
        return { total: 24, cols: 6, size: 'w-4 h-4', gap: 'gap-5' };
    }
  };

  const diamondConfig = getDiamondConfig();
  const filledDiamonds = Math.round((progress / 100) * diamondConfig.total);

  const diamonds = Array.from({ length: diamondConfig.total }, (_, index) => {
    const isFilled = index < filledDiamonds;
    return (
      <div
        key={index}
        className={`${diamondConfig.size} flex items-center justify-center`}
      >
        {isFilled ? (
          <img
            src="/assets/fill.svg"
            alt="filled"
            className={`w-full h-full ${
              isExpired ? 'filter hue-rotate-0 saturate-150 brightness-75' : ''
            }`}
          />
        ) : (
          <img
            src="/assets/empty.svg"
            alt="empty"
            className={`w-full h-full ${
              isExpired ? 'filter hue-rotate-0 saturate-150 brightness-75' : ''
            }`}
          />
        )}
      </div>
    );
  });

  const handleTitleChange = (e) => {
    setDeadlineTitle(e.target.value);
  };

  // Date picker functions
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleDateSelect = (day) => {
    // Format date manually to avoid timezone issues with toISOString()
    const year = currentYear;
    const month = String(currentMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const formattedDate = `${year}-${month}-${dayStr}`;
    setCustomDeadline(formattedDate);
    setShowDatePicker(false);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const navigateYear = (direction) => {
    if (direction === 'prev') {
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentYear(currentYear + 1);
    }
  };

  const handleMonthSelect = (monthIndex) => {
    setCurrentMonth(monthIndex);
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year) => {
    setCurrentYear(year);
    setShowYearPicker(false);
  };

  const generateYearRange = () => {
    const currentYearActual = new Date().getFullYear();
    const years = [];
    for (
      let year = currentYearActual - 5;
      year <= currentYearActual + 20;
      year++
    ) {
      years.push(year);
    }
    return years;
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  // Time picker functions
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  const handleTimeChange = () => {
    let hour24 = parseInt(selectedHour);
    if (selectedPeriod === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (selectedPeriod === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    const timeString = `${hour24
      .toString()
      .padStart(2, '0')}:${selectedMinute}`;
    setCustomTime(timeString);
    setShowTimePicker(false);
  };

  const deadlineDate = new Date(customDeadline + 'T' + customTime + ':00');
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getCurrentDayDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getDaysRemaining = () => {
    if (isExpired) return 'Deadline has passed';

    const { days, hours, minutes, seconds, type } = timeRemaining;

    if (type === 'hour') {
      // For hour template, show minutes and seconds
      if (minutes > 0) {
        return `${minutes}m ${seconds}s remaining`;
      }
      return `${seconds}s remaining`;
    } else if (type === 'day') {
      // For daily template, if less than 1 full day remaining, don't show days
      if (days < 1) {
        if (hours > 0) {
          return `${hours}h ${minutes}m ${seconds}s remaining`;
        }
        return `${minutes}m ${seconds}s remaining`;
      } else {
        return `${days} day${days !== 1 ? 's' : ''} ${hours}h remaining`;
      }
    } else if (type === 'month') {
      if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} remaining`;
      }
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${days} day${days !== 1 ? 's' : ''} remaining`;
    }
  };

  const getTemplateName = () => {
    switch (templateType) {
      case 'hour':
        return 'Hour Template';
      case 'day':
        return 'Daily Template';
      case 'month':
        return 'Monthly Template';
      case 'year':
        return 'Yearly Template';
      default:
        return 'Template';
    }
  };

  // Format display time
  const formatDisplayTime = () => {
    const [hours, minutes] = customTime.split(':');
    const hour24 = parseInt(hours);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return `${hour12}:${minutes} ${period}`;
  };

  // Format display date
  const formatDisplayDate = () => {
    const date = new Date(customDeadline);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();
    const selectedDate = new Date(customDeadline);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday =
        today.getDate() === day &&
        today.getMonth() === currentMonth &&
        today.getFullYear() === currentYear;
      const isSelected =
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === currentMonth &&
        selectedDate.getFullYear() === currentYear;

      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className={`h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 hover:bg-blue-50 ${
            isSelected
              ? 'bg-blue-500 text-white'
              : isToday
              ? 'bg-blue-100 text-blue-600'
              : 'text-gray-700 hover:text-blue-600'
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className={`w-full ${
          templateType === 'year' ? 'max-w-6xl' : 'max-w-md'
        }`}
      >
        {/* Settings Panel */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Deadline Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                value={deadlineTitle}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black bg-gray-50 hover:bg-white transition-colors duration-200"
                placeholder="Enter deadline name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black bg-gray-50 hover:bg-white transition-colors duration-200 flex items-center justify-between"
                >
                  <span>{formatDisplayDate()}</span>
                  <Calendar className="w-4 h-4 text-gray-400" />
                </button>

                {showDatePicker && (
                  <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 w-80">
                    {/* Header with navigation */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => navigateMonth('prev')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowMonthPicker(!showMonthPicker)}
                          className="px-3 py-1 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-800"
                        >
                          {months[currentMonth]}
                        </button>
                        <button
                          onClick={() => setShowYearPicker(!showYearPicker)}
                          className="px-3 py-1 hover:bg-gray-100 rounded-lg text-sm font-semibold text-gray-800"
                        >
                          {currentYear}
                        </button>
                      </div>

                      <button
                        onClick={() => navigateMonth('next')}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    {/* Quick navigation buttons */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={goToToday}
                        className="px-3 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Today
                      </button>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => navigateYear('next')}
                          className="px-2 py-1 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100 transition-colors"
                        >
                          +1 Year
                        </button>
                      </div>
                    </div>

                    {/* Month picker */}
                    {showMonthPicker && (
                      <div className="grid grid-cols-3 gap-2 mb-4 p-2 bg-gray-50 rounded-lg">
                        {months.map((month, index) => (
                          <button
                            key={month}
                            onClick={() => handleMonthSelect(index)}
                            className={`p-2 text-xs rounded hover:bg-blue-100 transition-colors ${
                              index === currentMonth
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {month.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Year picker */}
                    {showYearPicker && (
                      <div className="grid grid-cols-4 gap-2 mb-4 p-2 bg-gray-50 rounded-lg max-h-32 overflow-y-auto">
                        {generateYearRange().map((year) => (
                          <button
                            key={year}
                            onClick={() => handleYearSelect(year)}
                            className={`p-2 text-xs rounded hover:bg-blue-100 transition-colors ${
                              year === currentYear
                                ? 'bg-blue-500 text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {year}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                        <div
                          key={day}
                          className="h-8 flex items-center justify-center text-xs font-medium text-gray-500"
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {renderCalendarDays()}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <button
                  onClick={() => setShowTimePicker(!showTimePicker)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-black bg-gray-50 hover:bg-white transition-colors duration-200 flex items-center justify-between"
                >
                  <span>{formatDisplayTime()}</span>
                  <Clock className="w-4 h-4 text-gray-400" />
                </button>

                {showTimePicker && (
                  <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-4 w-64">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-800">
                        Select Time
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <select
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {hours.map((hour) => (
                          <option key={hour} value={hour}>
                            {hour}
                          </option>
                        ))}
                      </select>
                      <span className="text-gray-500">:</span>
                      <select
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        {minutes
                          .filter((_, i) => i % 5 === 0)
                          .map((minute) => (
                            <option key={minute} value={minute}>
                              {minute}
                            </option>
                          ))}
                      </select>
                      <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                    <button
                      onClick={handleTimeChange}
                      className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                    >
                      Set Time
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              Template: {getTemplateName()}
            </div>
            <div className="text-xs text-gray-400">
              Deadline: {formattedDeadline} at {formatDisplayTime()}
            </div>
          </div>
        </div>

        {/* Progress Widget */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm font-medium text-gray-600">
                {deadlineTitle}
              </div>
              <div
                className={`text-4xl font-bold ${
                  isExpired ? 'text-red-600' : 'text-gray-800'
                }`}
              >
                {progress}%
              </div>
            </div>
          </div>

          <div
            className={`grid grid-cols-${diamondConfig.cols} ${diamondConfig.gap} w-fit mx-auto mb-6`}
          >
            {diamonds}
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">{getCurrentDayDate()}</div>
            <div className="flex items-center">
              <div
                className={`w-2 h-2 rounded-full mr-2 ${
                  isExpired ? 'bg-red-500' : 'bg-green-500 animate-pulse'
                }`}
              ></div>
              <div
                className={`text-xs ${
                  isExpired ? 'text-red-500' : 'text-gray-400'
                }`}
              >
                {getDaysRemaining()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showDatePicker || showTimePicker) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowDatePicker(false);
            setShowTimePicker(false);
            setShowYearPicker(false);
            setShowMonthPicker(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default DeadlineProgressTracker;
