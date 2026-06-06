"use client";

export type ClientDeviceContext = {
  platform?: string;
  timezone?: string;
  hardware?: {
    memoryGb?: number;
    logicalProcessors?: number;
    maxTouchPoints?: number;
  };
  screen?: {
    width?: number;
    height?: number;
    pixelRatio?: number;
    colorDepth?: number;
  };
  locale?: {
    language?: string;
    languages?: string[];
  };
};

export function collectClientDeviceContext(): ClientDeviceContext {
  if (typeof window === "undefined") return {};

  const navigatorData = window.navigator as Navigator & {
    deviceMemory?: number;
    userAgentData?: { platform?: string };
  };

  return {
    platform:
      navigatorData.userAgentData?.platform ||
      navigatorData.platform ||
      undefined,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || undefined,
    hardware: {
      memoryGb: navigatorData.deviceMemory,
      logicalProcessors: navigatorData.hardwareConcurrency,
      maxTouchPoints: navigatorData.maxTouchPoints,
    },
    screen: {
      width: window.screen?.width,
      height: window.screen?.height,
      pixelRatio: window.devicePixelRatio,
      colorDepth: window.screen?.colorDepth,
    },
    locale: {
      language: navigatorData.language,
      languages: Array.isArray(navigatorData.languages)
        ? navigatorData.languages
        : undefined,
    },
  };
}
