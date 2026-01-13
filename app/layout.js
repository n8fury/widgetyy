import { Analytics } from '@vercel/analytics/next';
import { JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL('https://widgetyy.vercel.app'),
  title: {
    default: 'Widgetyy - Beautiful Progress Widgets for Notion & Embeds',
    template: '%s | Widgetyy',
  },
  description:
    'Free, beautiful progress tracker widgets for Notion, websites, and dashboards. Track daily, monthly, yearly progress and custom deadlines with stunning visual widgets. Embed anywhere!',
  keywords: [
    'notion widgets',
    'notion progress bar',
    'notion embed',
    'progress tracker',
    'daily progress widget',
    'yearly progress tracker',
    'deadline countdown',
    'embeddable widgets',
    'free notion widgets',
    'notion dashboard widgets',
    'time tracking widget',
    'goal tracker',
    'productivity widgets',
    'notion aesthetic widgets',
  ],
  authors: [{ name: 'Widgetyy' }],
  creator: 'Widgetyy',
  publisher: 'Widgetyy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://widgetyy.vercel.app',
    siteName: 'Widgetyy',
    title: 'Widgetyy - Beautiful Progress Widgets for Notion & Embeds',
    description:
      'Free, beautiful progress tracker widgets for Notion, websites, and dashboards. Track your day, month, year, and custom deadlines.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Widgetyy - Progress Tracker Widgets',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Widgetyy - Beautiful Progress Widgets for Notion',
    description:
      'Free progress tracker widgets for Notion and embeds. Track daily, monthly, yearly progress with beautiful visuals.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://widgetyy.vercel.app',
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Widgetyy',
    description:
      'Free, beautiful progress tracker widgets for Notion, websites, and dashboards.',
    url: 'https://widgetyy.vercel.app',
    applicationCategory: 'ProductivityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Daily progress tracking',
      'Monthly progress tracking',
      'Yearly progress tracking',
      'Custom deadline countdown',
      'Embeddable widgets',
      'Notion integration',
      'Real-time updates',
    ],
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
