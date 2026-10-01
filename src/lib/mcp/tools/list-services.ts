import { defineTool } from "@lovable.dev/mcp-js";

const services = [
  { name: "Studio Finder", description: "Locate recording studios with availability and booking." },
  { name: "Producer Match", description: "Match artists with producers by genre and style." },
  { name: "Session Booking", description: "Schedule recording, mixing, and mastering with vetted engineers." },
  { name: "Location Network", description: "Pin yourself on the map and discover collaborators nearby." },
  { name: "Distribution", description: "Release pipeline to all major streaming platforms." },
  { name: "Accelerator", description: "12-week programs with mentorship, funding, and industry placement." },
];

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List the services and tools NewCulture offers to artists and producers.",
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
