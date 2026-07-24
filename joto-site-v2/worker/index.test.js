import { describe, expect, it, vi } from "vitest";
import { createWorker } from "./index.js";

const assets = {
  fetch: vi.fn(async (request) => {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/index.html") return new Response("<main>JOTO</main>", { status: 200 });
    return new Response("missing", { status: 404 });
  }),
};

describe("Sites worker", () => {
  it("proxies captcha with the canonical source host", async () => {
    const upstream = vi.fn(async () =>
      new Response(JSON.stringify({ captchaId: "c1", svg: "data:image/svg+xml;base64,PHN2Zy8+" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const worker = createWorker(upstream);

    const response = await worker.fetch(
      new Request("https://preview.example/api/captcha", {
        headers: {
          Authorization: "Bearer preview-secret",
          Cookie: "session=preview-secret",
          "Proxy-Authorization": "Basic preview-secret",
        },
      }),
      { ASSETS: assets },
    );

    expect(response.status).toBe(200);
    const upstreamRequest = upstream.mock.calls[0][0];
    expect(upstreamRequest.url).toBe("https://admin.jotoai.com/api/captcha");
    expect(upstreamRequest.headers.get("X-Forwarded-Host")).toBe("jotoglobal.com");
    expect(upstreamRequest.headers.get("Authorization")).toBeNull();
    expect(upstreamRequest.headers.get("Cookie")).toBeNull();
    expect(upstreamRequest.headers.get("Proxy-Authorization")).toBeNull();
    expect(response.headers.get("Cache-Control")).toBe("no-store");
  });

  it("proxies the contact body once", async () => {
    const upstream = vi.fn(async (request) => {
      expect(await request.json()).toMatchObject({ name: "Avery", captchaId: "c1" });
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    });
    const worker = createWorker(upstream);

    const response = await worker.fetch(
      new Request("https://preview.example/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Avery", captchaId: "c1" }),
      }),
      { ASSETS: assets },
    );

    expect(response.status).toBe(200);
    expect(upstream).toHaveBeenCalledTimes(1);
  });

  it("returns a safe 502 when the admin upstream fails", async () => {
    const worker = createWorker(vi.fn().mockRejectedValue(new Error("secret upstream detail")));
    const response = await worker.fetch(
      new Request("https://preview.example/api/captcha"),
      { ASSETS: assets },
    );
    expect(response.status).toBe(502);
    expect(await response.json()).toEqual({ success: false, error: "upstream_unavailable" });
  });

  it("preserves the existing SPA fallback", async () => {
    const worker = createWorker(vi.fn());
    const response = await worker.fetch(
      new Request("https://preview.example/zh/contact"),
      { ASSETS: assets },
    );
    expect(response.status).toBe(200);
    expect(await response.text()).toContain("JOTO");
  });

  it("preserves file-like static asset misses without an API or SPA fallback", async () => {
    const upstream = vi.fn();
    const worker = createWorker(upstream);
    const response = await worker.fetch(
      new Request("https://preview.example/assets/missing.js"),
      { ASSETS: assets },
    );

    expect(response.status).toBe(404);
    expect(await response.text()).toBe("missing");
    expect(upstream).not.toHaveBeenCalled();
  });
});
