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
import Iridescence from './Iridescence';

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
        className="group flex items-center space-x-2 rounded-full px-4 py-2 transition-colors duration-300 bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20"
      >
        <Star className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
        <span className="text-white text-sm font-medium">
          {isLoading ? '...' : starCount.toLocaleString()}
        </span>
        <ExternalLink className="w-3 h-3 text-white/70 group-hover:text-white/90 transition-colors" />
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
        className={`w-full h-full ${filled ? 'invert' : 'opacity-70'}`}
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
      <div className="rounded-2xl p-6 shadow-lg transition-colors duration-300 border h-80 w-72 flex flex-col bg-white/10 border-white/20 backdrop-blur-xl">
        {/* Header / Copy */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl transition-colors bg-white/10 border border-white/15">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{progress}%</div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
          <p className="text-white/90 text-sm leading-relaxed">{description}</p>
        </div>

        {/* Diamonds - vertically centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: totalDiamonds }, (_, index) => (
              <Diamond key={index} filled={index < filledDiamonds} />
            ))}
          </div>
        </div>

        {/* Live updates */}
        <div className="flex items-center justify-center text-xs text-white/80">
          <div className="flex items-center">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse mr-1"></div>
            <span>Live updates</span>
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
      description: 'Real-time daily progress, updated every minute.',
      href: '/day_tracker',
      icon: Clock,
      progress: 65,
    },
    {
      title: 'Monthly Progress',
      description: 'See your month progress at a glance.',
      href: '/month_tracker',
      icon: Calendar,
      progress: 42,
    },
    {
      title: 'Yearly Progress',
      description: 'Track the year with a simple overview.',
      href: '/year_tracker',
      icon: TrendingUp,
      progress: 48,
    },
    {
      title: 'Deadline Tracker',
      description: 'Count down to any custom deadline.',
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
    <div className="min-h-screen relative flex flex-col overflow-hidden text-white">
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <Iridescence
          color={[0.5, 0.6, 0.8]}
          mouseReact={false}
          speed={2}
          amplitude={0.12}
          className="w-full h-full"
        />
      </div>
      {/* GitHub Star Button */}
      <GitHubStarButton />

      <div className="container mx-auto px-6 py-12 flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block rounded-3xl px-8 py-6 bg-white/10 border border-white/20 backdrop-blur-xl">
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Widgetyy
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed ">
              Beautiful progress trackers for your daily, monthly, yearly goals
              and custom deadlines.
              <span className="text-white font-medium">
                {' '}
                Stay motivated, stay focused.
              </span>
            </p>
          </div>
        </div>

        {/* Slider Container - Centered vertically */}
        <div className="relative max-w-6xl mx-auto overflow-hidden flex-1 flex flex-col justify-center ">
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 transition-all duration-300 group shadow-sm hover:shadow-md bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full p-3 transition-all duration-300 group shadow-sm hover:shadow-md bg-white/10 border border-white/20 backdrop-blur-xl hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 py-2 space-x-3 ">
            {widgets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/60 backdrop-blur-xl'
                }`}
                style={{ aspectRatio: '1/1' }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer - Live Updates */}
      <div className="text-center mt-auto pb-6">
        <div className="inline-flex items-center space-x-2 text-white/90 text-sm rounded-full px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-xl">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live updates every minute</span>
        </div>
      </div>
    </div>
  );
};

export default ModernHomePage;
