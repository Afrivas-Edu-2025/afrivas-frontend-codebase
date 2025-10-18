// components/ReduxProvider.tsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/lib/store';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/theme-provider';

export default function ReduxProvider({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        {children}
      </ThemeProvider>
    </Provider>
  );
}