import { defineMcp } from "@lovable.dev/mcp-js";
import searchStudios from "./tools/search-studios";
import listArtists from "./tools/list-artists";
import listServices from "./tools/list-services";

export default defineMcp({
  name: "ascent-labs",
  title: "Ascent Labs",
  version: "0.1.0",
  instructions:
    "Public read-only tools for the NewCulture artist incubator. Use `search_studios` to find US recording studios, `list_featured_artists` for the roster, and `list_services` for offerings.",
  tools: [searchStudios, listArtists, listServices],
});
