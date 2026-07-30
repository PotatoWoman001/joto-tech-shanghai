import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loadMallCatalog,
  loadMallProduct,
  mallPublicUrl,
} from "./mall";

afterEach(() => {
  vi.unstubAllGlobals();
});
describe("Mall snapshot client", () => {
  it("loads the immutable catalog schema from local Mall data", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        schema_version: "joto-mall-v1",
        products: [{ id: 16, slug: "ar1220c-s", title: "AR1220C-S" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const catalog = await loadMallCatalog();

    expect(catalog.schema_version).toBe("joto-mall-v1");
    expect(catalog.products[0].slug).toBe("ar1220c-s");
    expect(fetchMock).toHaveBeenCalledWith(
      "/mall-data/data/catalog-index.json",
      expect.objectContaining({
        headers: { Accept: "application/json" },
      }),
    );
  });

  it("rejects unsafe detail slugs before making a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(loadMallProduct("../manifest")).rejects.toThrow("slug");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps snapshot media on the current deployment origin", () => {
    expect(mallPublicUrl("/mall-data/media/images/product.jpg")).toBe(
      "/mall-data/media/images/product.jpg",
    );
  });
});
