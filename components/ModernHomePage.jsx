'use client';

import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Star,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const GitHubStarButton = () => {
  const [starCount, setStarCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch GitHub star count
    const fetchStarCount = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/n8fury/widgetyy'
        );
        if (response.ok) {
          const data = await response.json();
          setStarCount(data.stargazers_count);
        }
      } catch (error) {
        console.error('Failed to fetch star count:', error);
        setStarCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStarCount();
  }, []);

  const handleStarClick = () => {
    window.open(
      'https://github.com/n8fury/widgetyy',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed top-6 right-6 z-50">
      <button
        onClick={handleStarClick}
        className="group flex items-center space-x-2 bg-white border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
      >
        <Star className="w-4 h-4 text-yellow-500 group-hover:text-yellow-600 transition-colors" />
        <span className="text-gray-700 text-sm font-medium">
          {isLoading ? '...' : starCount.toLocaleString()}
        </span>
        <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-gray-500 transition-colors" />
      </button>
    </div>
  );
};

// Diamond component to replace the dots
const Diamond = ({ filled }) => {
  return (
    <div className="w-3 h-3 flex items-center justify-center">
      <img
        src={filled ? '/assets/fill.svg' : '/assets/empty.svg'}
        alt={filled ? 'filled' : 'empty'}
        className="w-full h-full"
      />
    </div>
  );
};

const WidgetCard = ({ title, description, href, icon: Icon, progress = 0 }) => {
  // Create 12 diamonds for the progress visualization
  const totalDiamonds = 12;
  const filledDiamonds = Math.round((progress / 100) * totalDiamonds);

  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 h-80 w-72 flex flex-col">
        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                <Icon className="w-6 h-6 text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-gray-800">
                {progress}%
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Progress Section */}
          <div className="mt-4">
            {/* Diamond visualization - centered */}
            <div className="flex justify-center mb-4">
              <div className="grid grid-cols-6 gap-2">
                {Array.from({ length: totalDiamonds }, (_, index) => (
                  <Diamond key={index} filled={index < filledDiamonds} />
                ))}
              </div>
            </div>

            {/* Time indicator */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Track your progress</span>
              <div className="flex items-center">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-1"></div>
                <span>Live updates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ModernHomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const widgets = [
    {
      title: 'Daily Progress',
      description:
        "Track your daily journey with real-time updates every minute. See how much of today you've conquered.",
      href: '/day_tracker',
      icon: Clock,
      progress: 65,
    },
    {
      title: 'Monthly Progress',
      description:
        'Monitor your monthly achievements and milestones. Perfect for tracking monthly goals and habits.',
      href: '/month_tracker',
      icon: Calendar,
      progress: 42,
    },
    {
      title: 'Yearly Progress',
      description:
        'Visualize your annual journey. See how much of the year has passed and plan ahead effectively.',
      href: '/year_tracker',
      icon: TrendingUp,
      progress: 48,
    },
    {
      title: 'Deadline Tracker',
      description:
        'Set custom deadlines and track progress toward your most important goals and projects.',
      href: '/deadline_tracker',
      icon: Target,
      progress: 78,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % widgets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + widgets.length) % widgets.length);
  };

  useEffect(() => {
    if (isAutoPlaying) {
      const interval = setInterval(nextSlide, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoPlaying]);

  return (
    <div className="min-h-screen bg-gray-100 relative flex flex-col">
      {/* GitHub Star Button */}
      <GitHubStarButton />

      <div className="container mx-auto px-6 py-12 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl md:text-7xl font-black text-gray-800 mb-6 tracking-tight">
            Widgetyy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Beautiful progress trackers for your daily, monthly, yearly goals
            and custom deadlines.
            <span className="text-gray-800 font-medium">
              {' '}
              Stay motivated, stay focused.
            </span>
          </p>
        </div>

        {/* Slider Container - Centered vertically */}
        <div className="relative max-w-6xl mx-auto overflow-hidden flex-1 flex flex-col justify-center">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {widgets.map((widget, index) => (
              <div key={index} className="w-full flex-none flex justify-center">
                <WidgetCard {...widget} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full p-3 transition-all duration-300 group shadow-sm hover:shadow-md"
          >
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 py-2 space-x-3">
            {widgets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-gray-800 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                style={{ aspectRatio: '1/1' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer - Live Updates */}
      <div className="text-center mt-auto pb-6">
        <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live updates every minute</span>
        </div>
      </div>
    </div>
  );
};

export default ModernHomePage;
