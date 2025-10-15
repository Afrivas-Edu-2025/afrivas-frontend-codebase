import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../services/api';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});

// TypeScript types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;