"use client";

type SocketClientLike = {
  connected?: boolean;
  on: (event: string, cb: (payload: any) => void) => void;
  off: (event: string, cb?: (payload: any) => void) => void;
  emit: (event: string, payload?: any) => void;
  disconnect: () => void;
};

type SocketFactory = (
  url: string,
  options: Record<string, unknown>,
) => SocketClientLike;

declare global {
  interface Window {
    io?: SocketFactory;
    __afrivasSocket?: SocketClientLike;
    __afrivasSocketToken?: string;
  }
}

const SOCKET_SCRIPT_ID = "afrivas-socketio-client-script";

const resolveApiOrigin = (): string => {
  const fallback = "http://localhost:5050/api/v1";
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || fallback;

  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return "http://localhost:5050";
  }
};

const getStoredToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken") || localStorage.getItem("accessToken");
};

const loadSocketScript = async (): Promise<void> => {
  if (typeof window === "undefined") return;
  if (window.io) return;

  const existingScript = document.getElementById(SOCKET_SCRIPT_ID) as HTMLScriptElement | null;
  if (existingScript) {
    await new Promise<void>((resolve, reject) => {
      if (window.io) {
        resolve();
        return;
      }
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("failed to load socket script")), { once: true });
    });
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SOCKET_SCRIPT_ID;
    script.async = true;
    script.src = `${resolveApiOrigin()}/socket.io/socket.io.js`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("failed to load socket script"));
    document.head.appendChild(script);
  });
};

export const connectRealtimeSocket = async (): Promise<SocketClientLike | null> => {
  if (typeof window === "undefined") return null;

  const token = getStoredToken();
  if (!token) return null;

  try {
    await loadSocketScript();
  } catch (error) {
    console.warn("Realtime socket disabled:", error);
    return null;
  }

  if (!window.io) return null;

  if (window.__afrivasSocket && window.__afrivasSocketToken === token) {
    return window.__afrivasSocket;
  }

  if (window.__afrivasSocket && window.__afrivasSocketToken !== token) {
    window.__afrivasSocket.disconnect();
    window.__afrivasSocket = undefined;
    window.__afrivasSocketToken = undefined;
  }

  const socket = window.io(resolveApiOrigin(), {
    auth: { token },
    withCredentials: true,
    transports: ["websocket", "polling"],
    reconnection: true,
  });

  window.__afrivasSocket = socket;
  window.__afrivasSocketToken = token;

  return socket;
};

export const disconnectRealtimeSocket = (): void => {
  if (typeof window === "undefined") return;
  if (!window.__afrivasSocket) return;

  window.__afrivasSocket.disconnect();
  window.__afrivasSocket = undefined;
  window.__afrivasSocketToken = undefined;
};
