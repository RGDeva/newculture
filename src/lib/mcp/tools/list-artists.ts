import { defineTool } from "@lovable.dev/mcp-js";

const artists = [
  { id: "NC-001", name: "Kael Rivers", role: "Vocalist / Songwriter", location: "Los Angeles, CA" },
  { id: "NC-002", name: "Nova Saint", role: "R&B / Neo-Soul", location: "Atlanta, GA" },
  { id: "NC-003", name: "Marco Voss", role: "Producer / Engineer", location: "Miami, FL" },
  { id: "NC-004", name: "Shade Element", role: "Hip-Hop / Experimental", location: "New York, NY" },
];

export default defineTool({
  name: "list_featured_artists",
  title: "List featured artists",
  description: "List the featured artists on the NewCulture roster.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(artists, null, 2) }],
    structuredContent: { artists },
  }),
});
