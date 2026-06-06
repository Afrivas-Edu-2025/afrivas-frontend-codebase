"use client";

import { useEffect, useState } from "react";
import { Laptop, Loader2, MapPin, Monitor, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

type SecurityDevice = {
  id: number;
  deviceName?: string | null;
  deviceType?: string | null;
  browser?: string | null;
  broswer?: string | null;
  location?: string | null;
  ipAddress?: string | null;
  lastUsed: string;
  isCurrent?: boolean;
};

type SecurityActivity = {
  id: number;
  activityType?: string | null;
  description?: string | null;
  ipAddress?: string | null;
  createdAt?: string | null;
};

type SecurityVisit = {
  id: number;
  browser?: string | null;
  deviceName?: string | null;
  deviceType?: string | null;
  ipAddress?: string | null;
  location?: string | null;
  visitedAt: string;
};

type SecurityLogsResponse = {
  activeDevices: SecurityDevice[];
  activities: SecurityActivity[];
  visits: SecurityVisit[];
  maxDevices: number;
};

const getDeviceIcon = (deviceType?: string | null) => {
  const normalized = String(deviceType || "").toLowerCase();
  if (normalized.includes("mobile")) return Smartphone;
  if (normalized.includes("tablet")) return Smartphone;
  if (normalized.includes("desktop")) return Monitor;
  return Laptop;
};

export function SecurityDevicesPanel({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "glass";
}) {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<SecurityLogsResponse>({
    activeDevices: [],
    activities: [],
    visits: [],
    maxDevices: 5,
  });

  useEffect(() => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("accessToken");
    if (!token) return;

    let cancelled = false;
    setLoading(true);

    fetch(`${API_BASE_URL}/auth/security/logs`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load security logs");
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        const data = payload?.data || {};
        setLogs({
          activeDevices: Array.isArray(data.activeDevices) ? data.activeDevices : [],
          activities: Array.isArray(data.activities) ? data.activities : [],
          visits: Array.isArray(data.visits) ? data.visits : [],
          maxDevices: Number(data.maxDevices) || 5,
        });
      })
      .catch(() => {
        if (!cancelled) toast.error("Failed to load security logs");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const cardClassName =
    variant === "glass"
      ? "border-white/20 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden"
      : "border-white/20 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl";

  return (
    <Card className={[cardClassName, className].filter(Boolean).join(" ")}>
      <CardHeader className={variant === "glass" ? "p-8 border-b border-white/10 bg-white/10 dark:bg-slate-900/10" : undefined}>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-indigo-500" />
          Active Devices & Visit Logs
        </CardTitle>
        <CardDescription>
          Logged-in devices, recent sign-ins, and visit metadata. Maximum active devices: {logs.maxDevices}.
        </CardDescription>
      </CardHeader>
      <CardContent className={variant === "glass" ? "p-8 space-y-6" : "space-y-6"}>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading security logs...
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Currently Logged In ({logs.activeDevices.length})</h3>
          {logs.activeDevices.length === 0 ? (
            <p className="text-sm text-muted-foreground">No active device sessions found.</p>
          ) : (
            <div className="space-y-3">
              {logs.activeDevices.map((device) => {
                const Icon = getDeviceIcon(device.deviceType);
                return (
                  <div key={device.id} className="rounded-xl border border-white/20 dark:border-slate-800 px-4 py-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-primary-100/10 p-2 text-primary-100">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {device.deviceName || "Unknown device"} • {device.deviceType || "Unknown type"}
                          </p>
                          <p className="text-muted-foreground">
                            {device.browser || device.broswer || "Unknown browser"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {device.ipAddress || "Unknown IP"}
                            {device.location ? ` • ${device.location}` : ""}
                          </p>
                        </div>
                      </div>
                      {device.isCurrent ? (
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                          This device
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last active: {new Date(device.lastUsed).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Recent Login Activity</h3>
          {logs.activities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No login activity found.</p>
          ) : (
            <div className="space-y-2">
              {logs.activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="rounded-xl border border-white/20 dark:border-slate-800 px-4 py-3 text-sm">
                  <p className="font-medium">{activity.activityType || "ACTIVITY"}</p>
                  <p className="text-muted-foreground">{activity.description || "No description"}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.ipAddress || "Unknown IP"}
                    {activity.createdAt ? ` • ${new Date(activity.createdAt).toLocaleString()}` : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold">Recent Visits</h3>
          {logs.visits.length === 0 ? (
            <p className="text-sm text-muted-foreground">No visit records found.</p>
          ) : (
            <div className="space-y-2">
              {logs.visits.slice(0, 5).map((visit) => (
                <div key={visit.id} className="rounded-xl border border-white/20 dark:border-slate-800 px-4 py-3 text-sm">
                  <p className="font-medium">
                    {visit.deviceName || "Unknown device"} • {visit.browser || "Unknown browser"}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" />
                    {visit.location || "Unknown location"} • {visit.ipAddress || "Unknown IP"}
                  </p>
                  <p className="text-xs text-muted-foreground">{new Date(visit.visitedAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
