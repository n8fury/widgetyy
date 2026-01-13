import MonthlyProgressTracker from '@/components/MonthlyProgressTracker';

export const metadata = {
  title: 'Monthly Progress Tracker Widget',
  description:
    'Free monthly progress tracker widget for Notion and embeds. Visualize how much of the current month has passed. Embed in Notion, websites, or any dashboard.',
  keywords: [
    'monthly progress tracker',
    'month progress widget',
    'notion monthly widget',
    'calendar progress',
    'month tracker notion',
  ],
  openGraph: {
    title: 'Monthly Progress Tracker - Widgetyy',
    description:
      'Track your monthly progress with a beautiful embeddable widget. Perfect for Notion dashboards.',
  },
};

export default function MonthlyPage() {
  return <MonthlyProgressTracker />;
}
