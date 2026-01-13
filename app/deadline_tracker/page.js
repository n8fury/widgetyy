import DeadlineProgressTracker from '@/components/DeadlineProgressTracker';

export const metadata = {
  title: 'Deadline Countdown Tracker Widget',
  description:
    'Free customizable deadline countdown widget for Notion and embeds. Track any deadline with real-time progress. Set custom dates, times, and titles. Perfect for exams, projects, events, and Notion dashboards.',
  keywords: [
    'deadline tracker',
    'countdown widget',
    'notion countdown',
    'deadline countdown notion',
    'exam countdown widget',
    'project deadline tracker',
    'custom countdown timer',
    'embeddable countdown',
  ],
  openGraph: {
    title: 'Deadline Countdown Tracker - Widgetyy',
    description:
      'Create custom deadline countdowns with beautiful progress visualization. Embed anywhere.',
  },
};

export default function DeadlinePage() {
  return <DeadlineProgressTracker />;
}
