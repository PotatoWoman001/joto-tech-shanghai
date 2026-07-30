import { prependBasePath } from "../i18n/routing";

export interface MallIndexProduct {
  id: number;
  slug: string;
  title: string;
  brand: string | null;
  model: string | null;
  category_path: string[];
  stock_status: string | null;
  condition: string | null;
  demand_tags: string[];
  rating: number | null;
  review_count: number | null;
  summary: string | null;
  images: string[];
  first_seen_at: string;
  last_success_at: string;
  effective_status: string;
}
export interface MallDocument {
  title: string | null;
  url: string;
}

export interface MallProduct extends MallIndexProduct {
  description_html: string | null;
  application_scenarios: Array<Record<string, unknown>>;
  specifications: Record<string, string>;
  documents: MallDocument[];
  related_products: string[];
  source_url: string;
}

interface MallCatalog {
  schema_version: "joto-mall-v1";
  products: MallIndexProduct[];
}

export function mallPublicUrl(path: string): string {
  return prependBasePath(path);
}

async function readJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(mallPublicUrl(path), {
    headers: { Accept: "application/json" },
    signal,
  });
  if (!response.ok) {
    throw new Error(`Mall data request failed with HTTP ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function loadMallCatalog(signal?: AbortSignal): Promise<MallCatalog> {
  const catalog = await readJson<MallCatalog>(
    "/mall-data/data/catalog-index.json",
    signal,
  );
  if (catalog.schema_version !== "joto-mall-v1" || !Array.isArray(catalog.products)) {
    throw new Error("Mall catalog schema is invalid");
  }
  return catalog;
}

export async function loadMallProduct(
  slug: string,
  signal?: AbortSignal,
): Promise<MallProduct> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error("Mall product slug is invalid");
  }
  return readJson<MallProduct>(
    `/mall-data/data/products/${encodeURIComponent(slug)}.json`,
    signal,
  );
}
