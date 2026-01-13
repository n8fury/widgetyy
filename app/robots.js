export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: 'https://widgetyy.vercel.app/sitemap.xml',
  };
}
