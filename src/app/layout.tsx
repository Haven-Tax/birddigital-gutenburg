import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Gutenberg Explorer',
  description: 'Explore books and analyze content from Project Gutenberg',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-gray-100 font-sans`}
      >
        <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8">
          <main className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-6 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
