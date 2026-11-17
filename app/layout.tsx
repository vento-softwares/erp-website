import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-manrope',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const description =
  'Vento is building a simpler way to manage inventory, production, sales, finance and everyday business operations from one connected platform. Join the waitlist for early access.';

export const metadata: Metadata = {
  title: 'Vento — Your entire business. One connected system.',
  description,
  openGraph: {
    title: 'Vento — Your entire business. One connected system.',
    description,
    type: 'website',
    siteName: 'Vento',
  },
};

export const viewport: Viewport = {
  themeColor: '#080A12',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Without JS, show everything that would otherwise animate in. */}
        <noscript>
          <style>{`.reveal,.hero-item{opacity:1!important;transform:none!important}.hero-word{transform:none!important}#loader{display:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
