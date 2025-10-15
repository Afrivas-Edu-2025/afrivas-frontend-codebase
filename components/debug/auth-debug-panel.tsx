"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/components/auth-context';
import { setMockAdminToken, clearAuthTokens, getStoredAuthInfo } from '@/lib/auth-test-utils';

export function AuthDebugPanel() {
  const { user, token, loading } = useAuth();
  const [storageInfo, setStorageInfo] = useState<any>(null);

  const refreshStorageInfo = () => {
    setStorageInfo(getStoredAuthInfo());
  };

  useEffect(() => {
    refreshStorageInfo();
  }, [user, token]);

  const handleSetMockToken = () => {
    setMockAdminToken();
    refreshStorageInfo();
    // Trigger a page refresh to reload with new token
    setTimeout(() => window.location.reload(), 500);
  };

  const handleClearTokens = () => {
    clearAuthTokens();
    refreshStorageInfo();
    setTimeout(() => window.location.reload(), 500);
  };

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="text-orange-800 flex items-center gap-2">
          🔧 Auth Debug Panel (Development Only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Auth Context Status */}
          <div>
            <h4 className="font-medium mb-2">Auth Context Status:</h4>
            <div className="space-y-2 text-sm">
              <div>Loading: <Badge variant={loading ? "destructive" : "secondary"}>{loading ? "Yes" : "No"}</Badge></div>
              <div>User: <Badge variant={user ? "default" : "destructive"}>{user ? `${user.firstName} (${user.role})` : "None"}</Badge></div>
              <div>Token: <Badge variant={token ? "default" : "destructive"}>{token ? "Present" : "None"}</Badge></div>
            </div>
          </div>

          {/* LocalStorage Status */}
          <div>
            <h4 className="font-medium mb-2">LocalStorage Status:</h4>
            <div className="space-y-2 text-sm">
              <div>Token: <Badge variant={storageInfo?.token ? "default" : "destructive"}>{storageInfo?.token ? "Present" : "None"}</Badge></div>
              <div>User: <Badge variant={storageInfo?.user ? "default" : "destructive"}>{storageInfo?.user ? `${storageInfo.user.firstName}` : "None"}</Badge></div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            onClick={handleSetMockToken}
            variant="outline"
            size="sm"
          >
            Set Mock Admin Token
          </Button>
          <Button 
            onClick={handleClearTokens}
            variant="outline"
            size="sm"
          >
            Clear All Tokens
          </Button>
          <Button 
            onClick={refreshStorageInfo}
            variant="outline"
            size="sm"
          >
            Refresh Info
          </Button>
        </div>

        <div className="text-xs text-gray-600 pt-2 border-t">
          <p><strong>Note:</strong> Use "Set Mock Admin Token" to test the admin dashboard without logging in.</p>
          <p>In production, you'll need to login properly through the admin login page.</p>
        </div>
      </CardContent>
    </Card>
  );
}
