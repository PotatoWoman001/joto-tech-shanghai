const ADMIN_ORIGIN = "https://admin.jotoai.com";
const CANONICAL_HOST = "jotoglobal.com";
const API_PATHS = new Set(["/api/captcha", "/api/contact"]);

function jsonError(status, error) {
  return new Response(JSON.stringify({ success: false, error }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function createWorker(fetchImpl = globalThis.fetch) {
  return {
    async fetch(request, env) {
      const url = new URL(request.url);
      if (API_PATHS.has(url.pathname)) {
        try {
          const upstreamUrl = new URL(`${url.pathname}${url.search}`, ADMIN_ORIGIN);
          const headers = new Headers(request.headers);
          headers.set("X-Forwarded-Host", CANONICAL_HOST);
          headers.set("X-Forwarded-Proto", "https");
          headers.delete("Cookie");
          headers.delete("Authorization");
          headers.delete("Proxy-Authorization");
          headers.delete("Content-Length");
          const hasBody = request.method !== "GET" && request.method !== "HEAD";
          const upstreamRequest = new Request(upstreamUrl, {
            method: request.method,
            headers,
            body: hasBody ? await request.arrayBuffer() : undefined,
            redirect: "manual",
          });
          const response = await fetchImpl(upstreamRequest);
          const responseHeaders = new Headers(response.headers);
          responseHeaders.set("Cache-Control", "no-store");
          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
          });
        } catch {
          return jsonError(502, "upstream_unavailable");
        }
      }

      const response = await env.ASSETS.fetch(request);
      if (response.status !== 404 || request.method !== "GET") return response;
      if (url.pathname.includes(".")) return response;
      url.pathname = "/index.html";
      return env.ASSETS.fetch(
        new Request(url, {
          method: request.method,
          headers: request.headers,
        }),
      );
    },
  };
}

export default createWorker();
