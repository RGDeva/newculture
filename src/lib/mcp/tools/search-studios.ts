import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { CSV_STUDIO_PINS } from "@/data/csv-studios";

type Studio = (typeof CSV_STUDIO_PINS)[number];
const toStudioJson = (s: Studio) => ({
  id: s.id,
  name: s.name,
  city: s.city,
  state: s.state,
  lat: s.lat,
  lng: s.lng,
  rating: s.rating ?? null,
  reviewCount: s.reviewCount ?? null,
  website: s.website ?? null,
  phone: s.phone ?? null,
});

export default defineTool({
  name: "search_studios",
  title: "Search recording studios",
  description: "Search the NewCulture US recording studio directory by name, city, or state.",
  inputSchema: {
    query: z.string().optional().describe("Text matched against studio name or city."),
    state: z.string().length(2).optional().describe("Two-letter US state code, e.g. MA."),
    minRating: z.number().min(0).max(5).optional().describe("Minimum Google rating."),
    limit: z.number().int().min(1).max(100).default(20).describe("Max results."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, state, minRating, limit }) => {
    const q = query?.toLowerCase().trim();
    const results = CSV_STUDIO_PINS.filter(
      (s) =>
        (!q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)) &&
        (!state || s.state.toUpperCase() === state.toUpperCase()) &&
        (minRating === undefined || (s.rating ?? 0) >= minRating),
    )
      .slice(0, limit)
      .map(toStudioJson);
    return {
      content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      structuredContent: { total: results.length, studios: results },
    };
  },
});
