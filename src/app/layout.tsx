import type { Metadata } from 'next';
import { Inter, Playfair_Display, Roboto } from 'next/font/google';
import { ThemeProvider } from '@/components/common/theme-provider';
import './globals.css';

// Primary sans-serif font (fallback)
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

// Display font for headings (galam.com style)
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

// Body font (galam.com style)
const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Miyara Brand Discovery',
  description:
    'AI-powered brand discovery for founders. Discover your core values through an interactive voice conversation with Miyara, your AI brand strategist.',
  keywords: ['brand strategy', 'brand values', 'startup', 'founder', 'AI'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${roboto.variable} font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
