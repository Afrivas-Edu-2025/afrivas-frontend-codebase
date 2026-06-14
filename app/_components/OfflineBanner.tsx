'use client';

// app/_components/OfflineBanner.tsx
import { useState, useEffect } from 'react';
import { onlineManager } from '@tanstack/react-query';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

/**
 * OfflineBanner Component
 * 
 * Shows a banner when the user is offline.
 * Features:
 * - Detects online/offline status using browser events
 * - Shows "back online" confirmation briefly
 * - Provides manual refresh option
 * 
 * Designed for users with unreliable connections who need
 * clear feedback about their network status.
 */
export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showReconnected, setShowReconnected] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // Initialize with current state
    const online = navigator.onLine;
    setIsOnline(online);
    
    const handleOnline = () => {
      setIsOnline(true);
      onlineManager.setOnline(true);
      
      // Show "reconnected" message briefly if was offline
      if (wasOffline) {
        setShowReconnected(true);
        setTimeout(() => setShowReconnected(false), 3000);
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      onlineManager.setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  // Handle manual refresh
  const handleRefresh = () => {
    window.location.reload();
  };

  // Don't show anything when online and not showing reconnection message
  if (isOnline && !showReconnected) {
    return null;
  }

  // Show reconnection message
  if (showReconnected) {
    return (
      <div
        className="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300"
        role="status"
        aria-live="polite"
      >
        <Wifi className="h-4 w-4" />
        <span>You&apos;re back online!</span>
      </div>
    );
  }

  // Show offline banner
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-amber-600 text-white px-4 py-2 text-center text-sm font-medium animate-in slide-in-from-top duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center justify-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>You&apos;re offline. Showing cached data.</span>
        <button
          onClick={handleRefresh}
          className="ml-2 inline-flex items-center gap-1 px-2 py-1 bg-amber-700 hover:bg-amber-800 rounded text-xs transition-colors"
          aria-label="Refresh page"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </button>
      </div>
    </div>
  );
}

/**
 * Slim variant for embedding in headers/navbars
 * Shows just an icon indicator
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      className="flex items-center gap-1 text-amber-500"
      title="You're offline"
      role="status"
    >
      <WifiOff className="h-4 w-4" />
      <span className="text-xs hidden sm:inline">Offline</span>
    </div>
  );
}
