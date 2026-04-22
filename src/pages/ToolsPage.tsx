import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight, Search, X, Star, ExternalLink, Zap, Lock,
  Activity, BarChart3, Layers, Bot, Users, Workflow, FileAudio, Target, Megaphone, Globe,
} from "lucide-react";
import { PRICES } from "@/lib/config";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// ── MCP-compatible tool schema ────────────────────────────────────────────
type ToolTier = "free" | "pro" | "elite";
type IntegrationLevel = "integrated" | "directory";
type ToolCategory =
  | "ai-mixing"
  | "distribution"
  | "monetization"
  | "collaboration"
  | "ai"
  | "crm"
  | "analytics"
  | "infrastructure"
  | "all";

interface ToolInput {
  name: string;
  type: "audio" | "text" | "url" | "json" | "file";
  description: string;
  required: boolean;
}

interface ToolOutput {
  name: string;
  type: "audio" | "text" | "json" | "url" | "report";
  description: string;
}

interface MCPToolSchema {
  name: string;
  description: string;
  inputs: ToolInput[];
  outputs: ToolOutput[];
  callable: boolean;
}

interface Tool {
  id: string;
  name: string;
  url: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  color: string;
  featured?: boolean;
  partner?: boolean;
  badge?: string;
  features: string[];
  integration: IntegrationLevel;
  tier: ToolTier;
  apiReady?: boolean;
  mcpSchema?: MCPToolSchema;
  workflowHint?: string;
  pricingModel?: "free" | "usage" | "subscription" | "rev-share";
}

// ── Usage tracking hook ───────────────────────────────────────────────────
function trackToolEvent(toolId: string, event: "view" | "open" | "use" | "convert") {
  const key = "nc_tool_events";
  try {
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    existing.push({ toolId, event, ts: Date.now() });
    // keep last 500 events
    localStorage.setItem(key, JSON.stringify(existing.slice(-500)));
  } catch {}
}

function useToolAnalytics(toolId: string) {
  const key = "nc_tool_events";
  try {
    const all = JSON.parse(localStorage.getItem(key) || "[]");
    const events = all.filter((e: any) => e.toolId === toolId);
    return {
      views: events.filter((e: any) => e.event === "view").length,
      opens: events.filter((e: any) => e.event === "open").length,
      uses: events.filter((e: any) => e.event === "use").length,
      conversions: events.filter((e: any) => e.event === "convert").length,
    };
  } catch {
    return { views: 0, opens: 0, uses: 0, conversions: 0 };
  }
}

// ── Tool data ─────────────────────────────────────────────────────────────
const TOOLS: Tool[] = [
  // ── INTEGRATED PARTNER TOOLS ────────────────────────────────────────
  {
    id: "roex-automix",
    name: "RoEx Automix",
    url: "https://roexaudio.com/automix",
    tagline: "AI Multitrack Mixing & Mastering",
    description: "Professional AI-powered multitrack mixing and mastering. Upload stems, set your reference, and get a release-ready mix in minutes. Powered by the Tonn API for deep integration with NewCulture workflows.",
    category: "ai-mixing",
    color: "#f43f5e",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "pro",
    apiReady: true,
    pricingModel: "usage",
    features: ["AI Multitrack Mixing", "Automated Mastering", "Reference Track Matching", "Stem Upload & Processing"],
    workflowHint: "Upload track → Automix → Submit to Opportunity",
    mcpSchema: {
      name: "roex_automix",
      description: "AI-powered multitrack mixing and mastering service",
      inputs: [
        { name: "stems", type: "audio", description: "Array of audio stem files (WAV/FLAC)", required: true },
        { name: "reference_track", type: "audio", description: "Reference track for tonal matching", required: false },
        { name: "genre", type: "text", description: "Target genre for mix profile", required: false },
        { name: "master_loudness", type: "text", description: "Target LUFS for mastering (-14 to -8)", required: false },
      ],
      outputs: [
        { name: "mixed_track", type: "audio", description: "Final mixed and mastered audio file" },
        { name: "mix_report", type: "report", description: "Detailed mix analysis and settings used" },
      ],
      callable: true,
    },
  },
  {
    id: "roex-mixcheck",
    name: "Mix Check Studio",
    url: "https://roexaudio.com/mix-check-studio",
    tagline: "AI Audio Analysis & Feedback",
    description: "Get instant AI-powered feedback on your mix. Frequency analysis, dynamic range assessment, stereo imaging review, and actionable improvement suggestions. Know exactly what to fix before you submit.",
    category: "ai-mixing",
    color: "#8b5cf6",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "free",
    apiReady: true,
    pricingModel: "usage",
    features: ["Frequency Spectrum Analysis", "Dynamic Range Assessment", "Stereo Imaging Review", "Actionable Mix Feedback"],
    workflowHint: "Run Mix Check → Improve Track → Apply to A&R",
    mcpSchema: {
      name: "roex_mixcheck",
      description: "AI audio analysis providing detailed feedback on mix quality",
      inputs: [
        { name: "audio_file", type: "audio", description: "Audio file to analyze (WAV/MP3/FLAC)", required: true },
        { name: "reference_track", type: "audio", description: "Optional reference for comparison", required: false },
        { name: "genre", type: "text", description: "Genre context for analysis standards", required: false },
      ],
      outputs: [
        { name: "analysis_report", type: "report", description: "Comprehensive mix analysis with scores" },
        { name: "frequency_data", type: "json", description: "Detailed frequency spectrum data" },
        { name: "suggestions", type: "text", description: "Actionable improvement suggestions" },
      ],
      callable: true,
    },
  },
  {
    id: "dreamster",
    name: "Dreamster",
    url: "https://dreamster.io/",
    tagline: "Digital Music Ownership",
    description: "Bring true music ownership back to fans and artists. Listen, own, earn, and resell music as Digital Music Assets — backed by blockchain verification. A new format for a new era.",
    category: "monetization",
    color: "#a855f7",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "free",
    pricingModel: "rev-share",
    features: ["Digital Music Assets (DMA)", "Own & Resell Music", "Fan Earnings via DSTER", "Artist Direct Monetization"],
    workflowHint: "Release track → Mint as DMA → Earn from fans",
  },
  {
    id: "wavi",
    name: "Wavi",
    url: "https://wavi.stream/",
    tagline: "Collaborative Music Vault",
    description: "A workspace for music teams to organize audio projects, share them securely, and get paid. Simple checkout and automated splits for beats, sessions, and releases — all in one collaborative vault.",
    category: "collaboration",
    color: "#06b6d4",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "free",
    pricingModel: "subscription",
    features: ["Audio Project Organization", "Secure File Sharing", "Beat & Session Checkout", "Automated Revenue Splits"],
  },
  {
    id: "takerecord",
    name: "Record Financial",
    url: "https://takerecord.com",
    tagline: "IP Finance & Asset Management",
    description: "The first financial institution focused on intellectual property. Royalty management, asset-backed lending, brokerage services, and a rightsholder portal — building the largest alternative asset class in music.",
    category: "monetization",
    color: "#f59e0b",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "pro",
    pricingModel: "rev-share",
    features: ["Royalty Management", "Asset-Backed Lending", "Music Catalog Brokerage", "Rightsholder Portal"],
  },
  {
    id: "teamrollouts",
    name: "Team Rollouts",
    url: "https://www.teamrollouts.com/",
    tagline: "Music Release OS",
    description: "The operating system for music releases. AI-powered release planning, team collaboration, and real-time analytics — built for artists, managers, and labels to streamline every rollout from strategy to launch.",
    category: "analytics",
    color: "#22c55e",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "pro",
    pricingModel: "subscription",
    features: ["AI-Powered Release Planning", "Team Collaboration", "Real-Time Analytics", "Label & Manager Workflows"],
  },
  {
    id: "once-mcp",
    name: "Once MCP",
    url: "https://docs.once.app/mcp",
    tagline: "Agent Infrastructure & Tool Orchestration",
    description: "Model Context Protocol infrastructure enabling AI agents to orchestrate tools and workflows. The backbone for NewCulture's automated creative workflows — connecting mixing, analysis, distribution, and opportunity submission into seamless pipelines.",
    category: "infrastructure",
    color: "#0ea5e9",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "elite",
    apiReady: true,
    pricingModel: "usage",
    features: ["MCP-Compatible Tool Registry", "Agent Workflow Orchestration", "Tool-to-Tool Pipelines", "Event-Driven Automation"],
    mcpSchema: {
      name: "once_mcp_orchestrator",
      description: "Orchestrate multi-tool workflows via MCP protocol",
      inputs: [
        { name: "workflow_definition", type: "json", description: "JSON workflow definition with tool chain", required: true },
        { name: "input_files", type: "file", description: "Input files for the workflow", required: false },
        { name: "trigger_event", type: "text", description: "Event that triggers the workflow", required: false },
      ],
      outputs: [
        { name: "workflow_result", type: "json", description: "Aggregated results from all tools in the chain" },
        { name: "execution_log", type: "text", description: "Step-by-step execution log" },
      ],
      callable: true,
    },
  },
  {
    id: "relationl",
    name: "Relationl",
    url: "https://relationl.com",
    tagline: "Music Industry CRM & Deal Flow",
    description: "Manage relationships, deal flow, and outreach across the music industry. Built for creators, studios, managers, and labels to track contacts, pipeline deals, and automate follow-ups.",
    category: "crm",
    color: "#14b8a6",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "pro",
    pricingModel: "subscription",
    features: ["Contact & Relationship Management", "Deal Flow Pipeline", "Automated Follow-ups", "Industry Network Mapping"],
  },
  {
    id: "wavewarz",
    name: "WaveWarz",
    url: "https://wavewarz.com",
    tagline: "Music Battle Platform",
    description: "Epic music battles where fans decide the winner. Upload your tracks, challenge other artists, and let the community vote. Build your reputation, grow your fanbase, and compete for prizes — all through head-to-head music battles.",
    category: "collaboration",
    color: "#e11d48",
    featured: true,
    partner: true,
    integration: "integrated",
    tier: "free",
    pricingModel: "free",
    features: ["Head-to-Head Music Battles", "Community Voting", "Artist Reputation System", "Fan Engagement & Discovery"],
    workflowHint: "Upload track → Enter battle → Fans vote → Grow audience",
  },

  // ── EXPLORE / DIRECTORY TOOLS ──────────────────────────────────────
  {
    id: "distrokid",
    name: "DistroKid",
    url: "https://distrokid.com",
    tagline: "Music Distribution",
    description: "Upload unlimited songs and albums to Spotify, Apple Music, and 150+ stores for a flat annual fee. Fastest distribution in the industry — keep 100% of your earnings.",
    category: "distribution",
    color: "#3b82f6",
    badge: "POPULAR",
    integration: "directory",
    tier: "free",
    pricingModel: "subscription",
    features: ["Unlimited Uploads", "100% Royalties", "150+ Platforms", "Same-Day Distribution"],
  },
  {
    id: "splice",
    name: "Splice",
    url: "https://splice.com",
    tagline: "AI-Powered Samples & Sounds",
    description: "The world's leading sample marketplace. Access millions of royalty-free sounds, loops, and presets. AI-powered search to find exactly what your track needs.",
    category: "ai",
    color: "#ec4899",
    integration: "directory",
    tier: "free",
    pricingModel: "subscription",
    features: ["50M+ Royalty-Free Samples", "AI Sound Search", "DAW Plugin", "Producer Presets"],
  },
  {
    id: "submithub",
    name: "SubmitHub",
    url: "https://www.submithub.com",
    tagline: "Music Blog & Playlist Pitching",
    description: "Send your music directly to blogs, playlist curators, labels, and radio stations. Get guaranteed feedback. Track your submission stats and build your promo network.",
    category: "crm",
    color: "#f97316",
    integration: "directory",
    tier: "free",
    pricingModel: "usage",
    features: ["Playlist Pitching", "Blog Submissions", "Guaranteed Feedback", "Label Pitching"],
  },
  {
    id: "soundcharts",
    name: "Soundcharts",
    url: "https://soundcharts.com",
    tagline: "Music Analytics & Intelligence",
    description: "Real-time music analytics across streaming, social, radio, and charts. Monitor your entire catalog, track competitors, and discover editorial trends before they go mainstream.",
    category: "analytics",
    color: "#8b5cf6",
    integration: "directory",
    tier: "pro",
    pricingModel: "subscription",
    features: ["Streaming Analytics", "Social Monitoring", "Chart Tracking", "Competitor Intelligence"],
  },
  {
    id: "haulix",
    name: "Haulix",
    url: "https://www.haulix.com",
    tagline: "Music Promo & Press CRM",
    description: "The industry-standard music promo platform. Send advance streams and downloads to press, radio, and tastemakers — with full tracking and anti-leak watermarking.",
    category: "crm",
    color: "#64748b",
    integration: "directory",
    tier: "free",
    pricingModel: "subscription",
    features: ["Advance Promo Streams", "Anti-Leak Watermarking", "Press List CRM", "Engagement Tracking"],
  },
  {
    id: "landr",
    name: "LANDR",
    url: "https://www.landr.com",
    tagline: "AI Mastering & Distribution",
    description: "Instant AI-powered mastering for your tracks. LANDR's algorithm adapts to your genre and references to deliver release-quality masters in minutes. Distribution included.",
    category: "ai",
    color: "#f43f5e",
    integration: "directory",
    tier: "free",
    pricingModel: "subscription",
    features: ["Instant AI Mastering", "Genre-Adaptive Algorithm", "Unlimited Masters", "Distribution Built-In"],
  },
];

const CATEGORY_META: Record<string, { label: string; icon: typeof Zap }> = {
  "all":            { label: "All Tools",         icon: Layers },
  "ai-mixing":      { label: "AI Mixing",         icon: Activity },
  "distribution":   { label: "Distribution",       icon: ArrowUpRight },
  "monetization":   { label: "Monetization",       icon: BarChart3 },
  "collaboration":  { label: "Collaboration",      icon: Users },
  "ai":             { label: "AI Tools",           icon: Bot },
  "crm":            { label: "CRM / Promo",        icon: Users },
  "analytics":      { label: "Analytics",          icon: BarChart3 },
  "infrastructure": { label: "Infrastructure",     icon: Workflow },
};

const TIER_COLORS: Record<ToolTier, string> = {
  free: "#22c55e",
  pro: "#f59e0b",
  elite: "#a855f7",
};

// ── Tool Card ─────────────────────────────────────────────────────────────
function ToolCard({ tool, onOpen }: { tool: Tool; onOpen: (t: Tool) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative flex flex-col border border-border bg-background transition-all hover:border-foreground/40 hover:bg-card"
    >
      <div className="h-0.5 w-full" style={{ background: tool.color }} />

      {/* Badges */}
      <div className="absolute right-4 top-4 flex gap-1.5">
        {tool.partner && (
          <span className="border px-2 py-0.5 font-mono text-[7px] tracking-[0.2em]"
            style={{ color: tool.color, borderColor: tool.color + "50" }}>PARTNER</span>
        )}
        {tool.apiReady && (
          <span className="border border-[#0ea5e940] px-2 py-0.5 font-mono text-[7px] tracking-[0.2em] text-[#0ea5e9]">API</span>
        )}
        {tool.badge && (
          <span className="border border-[#22c55e40] px-2 py-0.5 font-mono text-[7px] tracking-[0.2em] text-[#22c55e]">{tool.badge}</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {/* Tier + Category */}
        <div className="mb-2 flex items-center gap-2">
          <span className="border px-1.5 py-0.5 font-mono text-[7px] tracking-[0.15em]"
            style={{ color: TIER_COLORS[tool.tier], borderColor: TIER_COLORS[tool.tier] + "40" }}>
            {tool.tier.toUpperCase()}
          </span>
          <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: tool.color }}>
            {CATEGORY_META[tool.category]?.label.toUpperCase() ?? tool.category.toUpperCase()}
          </span>
        </div>

        <h3 className="mb-1 font-display text-2xl font-bold tracking-tight text-foreground">{tool.name}</h3>
        <p className="mb-3 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">{tool.tagline.toUpperCase()}</p>
        <p className="mb-5 flex-1 font-mono text-[11px] leading-relaxed text-muted-foreground">{tool.description}</p>

        {/* Features */}
        <ul className="mb-4 space-y-1.5">
          {tool.features.map((f) => (
            <li key={f} className="flex items-center gap-2 font-mono text-[9px] text-muted-foreground">
              <span className="inline-block h-1 w-1 flex-shrink-0 rounded-full" style={{ background: tool.color }} />
              {f}
            </li>
          ))}
        </ul>

        {/* Workflow hint */}
        {tool.workflowHint && (
          <div className="mb-4 flex items-center gap-2 border border-dashed border-border px-3 py-2">
            <Workflow size={10} className="flex-shrink-0 text-muted-foreground/50" />
            <p className="font-mono text-[8px] text-muted-foreground/70">{tool.workflowHint}</p>
          </div>
        )}

        {/* MCP badge */}
        {tool.mcpSchema && (
          <div className="mb-4 flex items-center gap-2 border border-[#0ea5e920] bg-[#0ea5e906] px-3 py-2">
            <Bot size={10} className="flex-shrink-0 text-[#0ea5e9]" />
            <p className="font-mono text-[8px] text-[#0ea5e9]/80">MCP-COMPATIBLE · Agent-callable tool</p>
          </div>
        )}

        {/* Pricing model */}
        {tool.pricingModel && (
          <p className="mb-4 font-mono text-[8px] text-muted-foreground/40">
            {tool.pricingModel === "free" && "FREE"}
            {tool.pricingModel === "usage" && "PAY PER USE"}
            {tool.pricingModel === "subscription" && "SUBSCRIPTION"}
            {tool.pricingModel === "rev-share" && "REVENUE SHARE"}
          </p>
        )}

        {/* CTAs — route to appropriate service */}
        <Link
          to={tool.id.includes("roex") ? "/mix" : "/apply?interest=${tool.id}"}
          className="mb-2 flex items-center justify-between border border-foreground bg-foreground/0 px-4 py-2.5 font-mono text-[9px] tracking-[0.2em] text-foreground transition-all hover:bg-foreground hover:text-background"
        >
          <span>{tool.id.includes("roex") ? "GET MIXED & MASTERED →" : "LET US HANDLE THIS →"}</span>
        </Link>
        <div className="flex gap-2">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackToolEvent(tool.id, "open")}
            className="flex flex-1 items-center justify-between border px-4 py-3 font-mono text-[9px] tracking-[0.2em] text-muted-foreground transition-all hover:text-foreground"
            style={{ borderColor: "hsl(var(--border))" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = tool.color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
          >
            <span>{tool.integration === "integrated" ? "OPEN TOOL" : "VISIT"}</span>
            <ArrowUpRight size={12} />
          </a>
          {tool.mcpSchema && (
            <button
              onClick={() => onOpen(tool)}
              className="flex items-center gap-1.5 border border-border px-3 py-3 font-mono text-[8px] tracking-[0.1em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
            >
              <Bot size={10} /> SCHEMA
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ── MCP Schema Modal ──────────────────────────────────────────────────────
function SchemaModal({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const schema = tool.mcpSchema!;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto border border-border bg-background"
      >
        <div className="h-1 w-full" style={{ background: tool.color }} />
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Bot size={12} className="text-[#0ea5e9]" />
              <span className="font-mono text-[8px] tracking-[0.3em] text-[#0ea5e9]">MCP TOOL SCHEMA</span>
            </div>
            <h3 className="font-display text-xl font-bold text-foreground">{tool.name}</h3>
            <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{schema.name}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground transition-colors hover:text-foreground"><X size={16} /></button>
        </div>
        <div className="space-y-5 px-6 py-5">
          <div>
            <p className="mb-1 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">DESCRIPTION</p>
            <p className="font-mono text-xs text-muted-foreground">{schema.description}</p>
          </div>
          <div>
            <p className="mb-2 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">INPUTS</p>
            <div className="space-y-2">
              {schema.inputs.map((inp) => (
                <div key={inp.name} className="border border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[10px] text-foreground">{inp.name}</code>
                    <span className="border border-border px-1.5 py-0.5 font-mono text-[7px] text-muted-foreground">{inp.type}</span>
                    {inp.required && <span className="font-mono text-[7px] text-[#f43f5e]">REQUIRED</span>}
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground/70">{inp.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 font-mono text-[8px] tracking-[0.3em] text-muted-foreground/60">OUTPUTS</p>
            <div className="space-y-2">
              {schema.outputs.map((out) => (
                <div key={out.name} className="border border-border px-3 py-2">
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[10px] text-foreground">{out.name}</code>
                    <span className="border border-border px-1.5 py-0.5 font-mono text-[7px] text-muted-foreground">{out.type}</span>
                  </div>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground/70">{out.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-border pt-4">
            <p className="font-mono text-[8px] text-muted-foreground/50">
              Callable: {schema.callable ? "Yes — agent-ready via Once MCP" : "Manual only"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const [tab, setTab] = useState<"integrated" | "explore">("integrated");
  const [activeCategory, setActiveCategory] = useState<ToolCategory>("all");
  const [query, setQuery] = useState("");
  const [schemaModal, setSchemaModal] = useState<Tool | null>(null);

  const toolsForTab = useMemo(() =>
    TOOLS.filter(t => tab === "integrated" ? t.integration === "integrated" : t.integration === "directory"),
    [tab]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return toolsForTab.filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) return false;
      if (!q) return true;
      return (
        t.name.toLowerCase().includes(q) ||
        t.tagline.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.features.some(f => f.toLowerCase().includes(q))
      );
    });
  }, [toolsForTab, activeCategory, query]);

  const categories = useMemo(() => {
    const cats = new Set(toolsForTab.map(t => t.category));
    return [{ id: "all" as ToolCategory, label: "All" }, ...Array.from(cats).map(c => ({
      id: c,
      label: CATEGORY_META[c]?.label ?? c,
    }))];
  }, [toolsForTab]);

  const handleOpen = useCallback((tool: Tool) => {
    trackToolEvent(tool.id, "view");
    setSchemaModal(tool);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">// OPERATING STACK</p>
                <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">The backend systems powering our work.</h1>
                <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
                  RoEx for audio intelligence. Recoupable for research & strategy. 
                  ONCE for release operations. You get the outcomes — we handle the stack.
                </p>
              </div>
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 self-start border border-foreground bg-foreground px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground md:self-end"
              >
                APPLY →
              </Link>
            </div>
          </div>
        </div>

        {/* Backend Stack Overview */}
        <div className="border-b border-border bg-card/10 px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-px bg-border md:grid-cols-3">
              <div className="bg-background p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center border border-emerald-500/30 bg-emerald-500/5">
                  <FileAudio size={18} className="text-emerald-500" />
                </div>
                <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-emerald-500">ROEX</p>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Audio Intelligence</h3>
                <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                  Powers our Mix & Master product. Spectral analysis, mix scoring, 
                  and AI-assisted mastering for release-ready audio.
                </p>
              </div>
              <div className="bg-background p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center border border-amber-500/30 bg-amber-500/5">
                  <Search size={18} className="text-amber-500" />
                </div>
                <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-amber-500">RECOUPABLE</p>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Research & Strategy</h3>
                <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                  Powers our Growth Audits and marketing campaigns. Audience analysis, 
                  content intelligence, and competitive research.
                </p>
              </div>
              <div className="bg-background p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center border border-purple-500/30 bg-purple-500/5">
                  <Globe size={18} className="text-purple-500" />
                </div>
                <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-purple-500">ONCE</p>
                <h3 className="mb-2 font-display text-lg font-bold text-foreground">Release Operations</h3>
                <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                  Powers our release execution layer. Distribution workflow, 
                  publishing management, and release pipeline automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Tab switch: Integrated / Explore */}
          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center gap-0 border border-border">
              <button
                onClick={() => { setTab("integrated"); setActiveCategory("all"); setQuery(""); }}
                className={`flex items-center gap-2 px-5 py-3 font-mono text-[10px] tracking-[0.15em] transition-all ${tab === "integrated" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Zap size={12} /> INTEGRATED TOOLS
              </button>
              <button
                onClick={() => { setTab("explore"); setActiveCategory("all"); setQuery(""); }}
                className={`flex items-center gap-2 border-l border-border px-5 py-3 font-mono text-[10px] tracking-[0.15em] transition-all ${tab === "explore" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Search size={12} /> EXPLORE TOOLS
              </button>
            </div>

            {/* Search + category filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-sm flex-1">
                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools, features, workflows..."
                  className="w-full border border-border bg-transparent py-2.5 pl-9 pr-8 font-mono text-xs text-foreground placeholder:text-muted-foreground/40 focus:border-foreground focus:outline-none"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={11} />
                  </button>
                )}
              </div>
              <p className="font-mono text-[10px] text-muted-foreground sm:ml-auto">{filtered.length} tools</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`border px-3 py-1.5 font-mono text-[9px] tracking-[0.1em] transition-all ${
                    activeCategory === cat.id
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  }`}
                >
                  {cat.label.toUpperCase()}
                  <span className="ml-1.5 opacity-50">
                    ({cat.id === "all" ? toolsForTab.length : toolsForTab.filter(t => t.category === cat.id).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversion banner — persistent */}
          <div className="mb-8 flex flex-col gap-3 border border-foreground bg-foreground/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <Zap size={14} className="mt-0.5 flex-shrink-0 text-foreground" />
              <div>
                <p className="font-mono text-[11px] font-bold text-foreground">Overwhelmed by the stack?</p>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  We handle all of this for clients. Mix, master, rollout, distribution, direct-to-fan — operated end-to-end.
                </p>
              </div>
            </div>
<Link
              to="/free-analysis"
              className="inline-flex items-center gap-2 border border-foreground px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-foreground transition-all hover:bg-foreground hover:text-background"
            >
              FREE ANALYSIS →
            </Link>
            <Link
              to="/mix"
              className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
            >
              MIX & MASTER →
            </Link>
          </div>

          {/* Tab description */}
          {tab === "integrated" && (
            <div className="mb-8 border border-dashed border-border bg-card/50 px-5 py-4">
              <div className="flex items-start gap-3">
                <Zap size={14} className="mt-0.5 flex-shrink-0 text-[#f59e0b]" />
                <div>
                  <p className="font-mono text-[10px] font-bold text-foreground">Tools we actively run for clients</p>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                    These providers are built into our Release Execution and Artist Development programs. When we run your release, we operate these on your behalf.
                  </p>
                </div>
              </div>
            </div>
          )}
          {tab === "explore" && (
            <div className="mb-8 border border-dashed border-border bg-card/50 px-5 py-4">
              <div className="flex items-start gap-3">
                <Search size={14} className="mt-0.5 flex-shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-mono text-[10px] font-bold text-foreground">Tool Directory</p>
                  <p className="mt-1 font-mono text-[9px] text-muted-foreground">
                    Curated index of music tech tools. No deep integration — this is a discovery layer for the ecosystem.
                  </p>
                </div>
              </div>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-3 border border-border py-24">
              <p className="font-mono text-sm text-muted-foreground">No tools match your search.</p>
              <button onClick={() => { setQuery(""); setActiveCategory("all"); }}
                className="font-mono text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onOpen={handleOpen} />
              ))}
            </div>
          )}

          {/* Workflow section */}
          {tab === "integrated" && (
            <div className="mt-16 border border-border">
              <div className="border-b border-border px-6 py-5">
                <div className="flex items-center gap-2">
                  <Workflow size={14} className="text-muted-foreground" />
                  <h3 className="font-display text-lg font-bold text-foreground">Tool → Outcome Workflows</h3>
                </div>
                <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                  Tools connect to outcomes. Every tool is a step in a larger workflow — not an isolated feature.
                </p>
              </div>
              <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
                {[
                  { title: "Mix & Master", steps: ["Upload stems", "Run Automix", "Get mastered track", "Submit to A&R"], color: "#f43f5e" },
                  { title: "Quality Check", steps: ["Upload mix", "Run Mix Check", "Get feedback", "Improve & resubmit"], color: "#8b5cf6" },
                  { title: "Release & Earn", steps: ["Finalize track", "Distribute via partner", "Mint as DMA", "Earn from fans"], color: "#22c55e" },
                ].map((wf) => (
                  <div key={wf.title} className="px-6 py-5">
                    <p className="mb-3 font-mono text-[9px] tracking-[0.2em]" style={{ color: wf.color }}>{wf.title.toUpperCase()}</p>
                    <ol className="space-y-2">
                      {wf.steps.map((step, i) => (
                        <li key={i} className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                          <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center border font-mono text-[7px]"
                            style={{ borderColor: wf.color + "40", color: wf.color }}>{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Monetization tiers */}
          <div className="mt-12 border border-border">
            <div className="border-b border-border px-6 py-5">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-muted-foreground" />
                <h3 className="font-display text-lg font-bold text-foreground">Access Tiers</h3>
              </div>
              <p className="mt-2 font-mono text-[10px] text-muted-foreground">Tool access scales with your subscription.</p>
            </div>
            <div className="grid divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
              {([
                { tier: "free" as ToolTier, label: "Free", desc: "Basic access to directory tools and limited integrated features.", price: "$0" },
                { tier: "pro" as ToolTier, label: "Pro", desc: "Full access to integrated tools, API usage credits, and workflow automation.", price: "$19/mo" },
                { tier: "elite" as ToolTier, label: "Elite", desc: "Unlimited API usage, MCP agent orchestration, priority support, and custom workflows.", price: "$49/mo" },
              ]).map(({ tier, label, desc, price }) => (
                <div key={tier} className="px-6 py-5">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="border px-2 py-0.5 font-mono text-[8px] tracking-[0.15em]"
                      style={{ color: TIER_COLORS[tier], borderColor: TIER_COLORS[tier] }}>{label.toUpperCase()}</span>
                    <span className="font-mono text-xs font-bold text-foreground">{price}</span>
                  </div>
                  <p className="mb-3 font-mono text-[10px] text-muted-foreground">{desc}</p>
                  <p className="font-mono text-[8px] text-muted-foreground/50">
                    {TOOLS.filter(t => t.tier === tier || (tier === "pro" && t.tier === "free") || tier === "elite").length} tools available
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Productized offers CTA */}
          <div className="mt-12 grid gap-px border border-border bg-border md:grid-cols-3">
            <div className="bg-background p-6 md:p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center border border-foreground/20">
                <Zap size={16} className="text-foreground" />
              </div>
              <p className="mb-1 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">FREE</p>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">Track Health Check</h3>
              <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                AI analysis of your mix. Report in 10 minutes. No credit card required.
              </p>
              <Link to="/free-analysis" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-foreground underline underline-offset-[4px] hover:opacity-70">
                START FREE →
              </Link>
            </div>
            <div className="bg-background p-6 md:p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center border border-foreground/20">
                <FileAudio size={16} className="text-foreground" />
              </div>
              <p className="mb-1 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">${(PRICES.mixAnalysis / 100).toFixed(0)}</p>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">AI Mix & Master</h3>
              <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                Release-ready mix in 48 hours. You keep 100% ownership. One revision included.
              </p>
              <Link to="/mix" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-foreground underline underline-offset-[4px] hover:opacity-70">
                UPLOAD TRACK →
              </Link>
            </div>
            <div className="bg-background p-6 md:p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center border border-foreground/20">
                <Target size={16} className="text-foreground" />
              </div>
              <p className="mb-1 font-mono text-[9px] tracking-[0.3em] text-muted-foreground/60">${(PRICES.auditCall / 100).toFixed(0)}</p>
              <h3 className="mb-2 font-display text-xl font-bold text-foreground">Growth Audit Call</h3>
              <p className="mb-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                45-min strategy session. Positioning, release plan, monetization. Recorded.
              </p>
              <Link to="/audit-call" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-foreground underline underline-offset-[4px] hover:opacity-70">
                BOOK CALL →
              </Link>
            </div>
          </div>

          {/* Full service CTA */}
          <div className="mt-8 border border-foreground bg-foreground px-6 py-6 md:px-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="mb-1 font-mono text-[10px] tracking-[0.3em] text-background/60">NEED FULL-SERVICE SUPPORT?</p>
                <h3 className="font-display text-xl font-bold text-background">Strategy, Execution, or Partnership</h3>
                <p className="font-mono text-[11px] text-background/70">
                  Application required. Custom-scoped engagements for serious artists and operators.
                </p>
              </div>
              <Link to="/apply" className="inline-flex items-center gap-2 border border-background bg-background px-5 py-2.5 font-mono text-[11px] tracking-[0.15em] text-foreground transition-all hover:bg-transparent hover:text-background">
                APPLY <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Modal */}
      <AnimatePresence>
        {schemaModal && <SchemaModal tool={schemaModal} onClose={() => setSchemaModal(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
