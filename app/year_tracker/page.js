import YearlyProgressTracker from '@/components/YearlyProgressTracker';

export const metadata = {
  title: 'Yearly Progress Tracker Widget',
  description:
    'Free yearly progress tracker widget for Notion and embeds. See how much of the year has passed with a stunning visual display. Perfect for annual goal tracking and Notion dashboards.',
  keywords: [
    'yearly progress tracker',
    'year progress widget',
    'notion year widget',
    'annual progress bar',
    'year tracker notion',
    'new year countdown',
  ],
  openGraph: {
    title: 'Yearly Progress Tracker - Widgetyy',
    description:
      'Track your yearly progress with a beautiful embeddable widget. Perfect for Notion dashboards.',
  },
};

export default function YearlyPage() {
  return <YearlyProgressTracker />;
}
