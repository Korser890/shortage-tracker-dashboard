import type { components, operations } from "./api-types";

export type OverviewResponse = components["schemas"]["OverviewResponse"];
export type CommodityResponse = components["schemas"]["CommodityResponse"];

// Derived from the generated OpenAPI types, so it cannot drift from the API.
export type PriceRange = NonNullable<
  NonNullable<
    operations["get_commodity_api_commodity__slug__get"]["parameters"]["query"]
  >["range"]
>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchOverview(): Promise<OverviewResponse> {
  const res = await fetch(`${API_BASE}/api/overview`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("Failed to fetch overview");
  return res.json();
}

export async function fetchCommodity(
  slug: string,
  range: PriceRange = "1y",
): Promise<CommodityResponse> {
  const res = await fetch(`${API_BASE}/api/commodity/${slug}?range=${range}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`Failed to fetch commodity: ${slug}`);
  return res.json();
}
