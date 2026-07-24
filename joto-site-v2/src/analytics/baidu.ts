declare global {
  interface Window {
    _hmt?: unknown[][];
  }
}

const configuredTrackingId = import.meta.env.VITE_BAIDU_TONGJI_ID?.trim() || "";
let enabled = false;
let lastTrackedPath = "";

export function initBaiduAnalytics(
  trackingId = configuredTrackingId,
  documentRef: Document = document,
): boolean {
  const id = trackingId.trim();
  if (!id) return false;
  enabled = true;
  window._hmt = window._hmt || [];
  if (!window._hmt.some((entry) => entry[0] === "_setAutoPageview")) {
    window._hmt.push(["_setAutoPageview", false]);
  }
  if (!documentRef.getElementById("baidu-hm")) {
    const script = documentRef.createElement("script");
    script.id = "baidu-hm";
    script.async = true;
    script.src = `https://hm.baidu.com/hm.js?${encodeURIComponent(id)}`;
    documentRef.head.appendChild(script);
  }
  return true;
}

export function trackPageView(path: string): void {
  if (!enabled || !path || path === lastTrackedPath) return;
  lastTrackedPath = path;
  window._hmt = window._hmt || [];
  window._hmt.push(["_trackPageview", path]);
}

export function trackContactConversion(): void {
  if (!enabled) return;
  window._hmt = window._hmt || [];
  window._hmt.push(["_trackPageview", "/poc-submitted"]);
  window._hmt.push(["_trackEvent", "转化", "表单提交", "jotoglobal"]);
}

export function resetBaiduAnalyticsForTests(): void {
  enabled = false;
  lastTrackedPath = "";
}
