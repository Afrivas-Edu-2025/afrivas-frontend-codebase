"use client";

import { useEffect } from "react";
import { store } from "@/lib/store";
import { adminApi } from "@/services/adminApi";
import { connectRealtimeSocket } from "@/lib/socket/realtime-client";

export default function DashboardRealtimeBridge() {
  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    const setup = async () => {
      const socket = await connectRealtimeSocket();
      if (!socket || cancelled) return;

      const onMessage = () => {
        store.dispatch(adminApi.util.invalidateTags(["Message", "Stats"]));
      };

      const onCalendarNew = () => {
        store.dispatch(adminApi.util.invalidateTags(["CalendarEvent", "Stats"]));
      };

      const onCalendarUpdate = () => {
        store.dispatch(adminApi.util.invalidateTags(["CalendarEvent", "Stats"]));
      };

      socket.on("message:new", onMessage);
      socket.on("calendar:event:new", onCalendarNew);
      socket.on("calendar:event:update", onCalendarUpdate);

      cleanup = () => {
        socket.off("message:new", onMessage);
        socket.off("calendar:event:new", onCalendarNew);
        socket.off("calendar:event:update", onCalendarUpdate);
      };
    };

    setup();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return null;
}
