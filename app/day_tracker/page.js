import DailyProgressTracker from '@/components/DailyProgressTracker';

export const metadata = {
  title: 'Daily Progress Tracker Widget',
  description:
    'Free daily progress tracker widget for Notion and embeds. See how much of your day has passed with a beautiful visual progress bar. Perfect for Notion dashboards and productivity tracking.',
  keywords: [
    'daily progress tracker',
    'day progress widget',
    'notion daily widget',
    'time tracker',
    'productivity widget',
  ],
  openGraph: {
    title: 'Daily Progress Tracker - Widgetyy',
    description:
      'Track your daily progress with a beautiful embeddable widget. Perfect for Notion dashboards.',
  },
};

export default function DailyPage() {
  return <DailyProgressTracker />;
}
