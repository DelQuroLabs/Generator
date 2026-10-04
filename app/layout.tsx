import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DelQuro Generator — Craft names that fit',
  description:
    'A local-first name generator with deep controls over field of study, origin, style, length, phonetics and more. Build legitimate-sounding business, product, character and place names — explained and scored.',
  applicationName: 'DelQuro Generator',
  keywords: ['name generator', 'business name generator', 'product name', 'naming tool', 'startup names'],
  authors: [{ name: 'DelQuro' }],
  formatDetection: { telephone: false, email: false, address: false },
  appleWebApp: { capable: true, title: 'DelQuro', statusBarStyle: 'black-translucent' },
  openGraph: {
    title: 'DelQuro Generator — Craft names that fit',
    description:
      'Deeply customizable local-first name generator. Control field, origin, style, length and phonetics.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#08080c' },
    { media: '(prefers-color-scheme: light)', color: '#f7f7fa' },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('delquro-theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='light'){document.documentElement.classList.remove('dark');}else if(t==='dark'||(!t&&d)){document.documentElement.classList.add('dark');}else{document.documentElement.classList.add('dark');}}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
