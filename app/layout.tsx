// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/ReduxProvider';
import { AuthProvider } from '@/components/auth-context';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Afrivas Learning Platform',
  description: 'A comprehensive educational platform for students and educators',
  generator: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
