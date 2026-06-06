// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/components/ReduxProvider';
import { AuthProvider } from '@/components/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import ReactQueryProvider from '@/lib/react-query/ReactQueryProvider';
import BootstrapQueries from './_components/BootstrapQueries';
import OfflineBanner from './_components/OfflineBanner';
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import VisitTracker from "@/components/visit-tracker";

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
      <body className="font-sans" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <ReduxProvider>
              <AuthProvider>
                <VisitTracker />
                <OfflineBanner />
                <BootstrapQueries />
                <div className="navbar">
                  <Navbar />
                </div>
                {children}
                <div className="footer">
                  <Footer />
                </div>
              </AuthProvider>
            </ReduxProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
