// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/components/ReduxProvider';
import { AuthProvider } from '@/components/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Afrivas Learning Platform',
  description: 'A comprehensive educational platform for students and educators',
  generator: '', 
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <AuthProvider>
              <div className="navbar">
                <Navbar />
              </div>
              {children}
              <div className="footer">
                <Footer />
              </div>
            </AuthProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
