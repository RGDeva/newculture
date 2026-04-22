import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Circle,
  CircleDot,
  FileAudio,
  Globe,
  Lock,
  Music,
  Search,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import type { ReleaseOperation, ReleaseState, ArtistResearch, GeneratedBlueprint } from "@/lib/services";

// ── Internal Workflow Architecture ────────────────────────────────────────
// NewCulture Operating System for client projects
// Powers: asset management, analysis results, research briefs, release operations

interface ProjectWorkflow {
  id: string;
  artistName: string;
  projectName: string;
  status: "active" | "paused" | "completed" | "archived";
  engagementType: "mix" | "audit" | "blueprint" | "execution" | "partnership";
  createdAt: string;
  updatedAt: string;
  
  // Assets & Links
  assets: {
    tracks: Array<{
      id: string;
      name: string;
      url: string;
      uploadedAt: string;
      roexAnalysisId?: string;
    }>;
    artwork?: Array<{
      id: string;
      type: string;
      url: string;
      status: "pending" | "approved" | "rejected";
    }>;
    references?: string[];
  };
  
  // RoEx Audio Intelligence
  audioAnalysis?: {
    trackId: string;
    overallScore: number;
    mixQuality: {
      frequencyBalance: number;
      dynamicRange: number;
      stereoImaging: number;
    };
    readyForRelease: boolean;
    recommendations: string[];
    masteredUrl?: string;
  };
  
  // Recoupable Research Intelligence
  research?: ArtistResearch;
  blueprint?: GeneratedBlueprint;
  contentIdeas?: Array<{
    hook: string;
    format: string;
    platform: string;
    status: "draft" | "produced" | "published";
  }>;
  
  // ONCE Release Operations
  releaseOperation?: ReleaseOperation;
  
  // Workflow Steps
  workflow: {
    currentStep: string;
    completedSteps: string[];
    pendingSteps: string[];
    blockedBy?: string[];
  };
  
  // Communications
  notes: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    type: "internal" | "client" | "system";
  }>;
}

// ── Mock Projects (Supabase-ready) ─────────────────────────────────────────
const MOCK_PROJECTS: ProjectWorkflow[] = [
  {
    id: "proj-001",
    artistName: "Kael Rivers",
    projectName: "Midnight Faultline",
    status: "active",
    engagementType: "execution",
    createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
    updatedAt: new Date().toISOString(),
    assets: {
      tracks: [
        { id: "t1", name: "Midnight Faultline (Master)", url: "#", uploadedAt: new Date(Date.now() - 2592000000).toISOString(), roexAnalysisId: "roex-001" },
        { id: "t2", name: "Midnight Faultline (Instrumental)", url: "#", uploadedAt: new Date(Date.now() - 2500000000).toISOString() },
      ],
      artwork: [
        { id: "a1", type: "Cover Art", url: "#", status: "approved" },
        { id: "a2", type: "Social Pack", url: "#", status: "pending" },
      ],
    },
    audioAnalysis: {
      trackId: "t1",
      overallScore: 87,
      mixQuality: {
        frequencyBalance: 88,
        dynamicRange: 85,
        stereoImaging: 88,
      },
      readyForRelease: true,
      recommendations: ["Release-ready", "Strong low-end", "Vocal presence excellent"],
      masteredUrl: "#",
    },
    research: {
      id: "research-001",
      artistName: "Kael Rivers",
      timestamp: new Date(Date.now() - 2400000000).toISOString(),
      audience: {
        totalFollowers: 15400,
        platformBreakdown: { instagram: 9200, tiktok: 4100, spotify: 2100 },
        growthRate: 15.2,
        topCities: [
          { city: "Los Angeles", country: "USA", percentage: 22 },
          { city: "Atlanta", country: "USA", percentage: 14 },
          { city: "London", country: "UK", percentage: 11 },
        ],
      },
      content: {
        topPerformingPosts: [
          { platform: "tiktok", type: "behind the scenes", engagement: 6200, viralScore: 82, themes: ["process", "authenticity"] },
        ],
        contentGaps: ["consistent reels", "story content"],
        recommendedFormats: ["short form", "story posts", "live"],
      },
      landscape: {
        similarArtists: [{ name: "Brent Faiyaz", followerCount: 2500000, differentiationOpportunity: "More intimate storytelling" }],
        playlistOpportunities: ["Alternative R&B", "Late Night"],
        collaborationTargets: ["Producer Maya"],
      },
      rollout: {
        optimalReleaseDay: "Friday",
        optimalReleaseTime: "9 PM EST",
        contentCalendar: [
          { day: -7, action: "Teaser", platform: "all", contentType: "audio" },
          { day: 0, action: "Release", platform: "all", contentType: "announcement" },
        ],
        platformPriorities: ["spotify", "tiktok"],
      },
      insights: {
        uniquePositioning: "Intimate late-night R&B storyteller",
        contentPillars: ["Process", "Vulnerability", "Growth"],
        hookOpportunities: ["Studio diary", "Lyric breakdowns"],
        audienceMessaging: "You're not alone in the dark hours",
      },
    },
    workflow: {
      currentStep: "Pre-release campaign",
      completedSteps: ["Strategy", "Mix/Master", "Assets", "Research", "Blueprint"],
      pendingSteps: ["Distribution submit", "Paid rollout", "D2F setup"],
    },
    notes: [
      { id: "n1", author: "NewCulture", content: "RoEx analysis complete. Track scored 87/100 - release ready.", timestamp: new Date(Date.now() - 2500000000).toISOString(), type: "system" },
      { id: "n2", author: "NewCulture", content: "Recoupable research shows strong Atlanta/LA audience concentration. Recommend geo-targeted ads.", timestamp: new Date(Date.now() - 2400000000).toISOString(), type: "internal" },
      { id: "n3", author: "Client", content: "Approved cover art v2. Love the direction.", timestamp: new Date(Date.now() - 2000000000).toISOString(), type: "client" },
    ],
  },
  {
    id: "proj-002",
    artistName: "DSTL Beats",
    projectName: "Beat Pack Q2 + Placements",
    status: "active",
    engagementType: "partnership",
    createdAt: new Date(Date.now() - 5184000000).toISOString(), // 60 days ago
    updatedAt: new Date().toISOString(),
    assets: {
      tracks: [
        { id: "t3", name: "Midnight Grind (Loop Kit)", url: "#", uploadedAt: new Date(Date.now() - 5000000000).toISOString() },
        { id: "t4", name: "Desert Haze (Stem Pack)", url: "#", uploadedAt: new Date(Date.now() - 4800000000).toISOString() },
      ],
    },
    research: {
      id: "research-002",
      artistName: "DSTL Beats",
      timestamp: new Date(Date.now() - 5000000000).toISOString(),
      audience: {
        totalFollowers: 8400,
        platformBreakdown: { instagram: 3200, youtube: 2800, beatstars: 2400 },
        growthRate: 8.5,
        topCities: [
          { city: "Houston", country: "USA", percentage: 16 },
          { city: "Chicago", country: "USA", percentage: 13 },
        ],
      },
      content: {
        topPerformingPosts: [
          { platform: "youtube", type: "cookup", engagement: 3400, viralScore: 71, themes: ["tutorial", "process"] },
        ],
        contentGaps: ["consistent posting", "placement showcases"],
        recommendedFormats: ["beat breakdowns", "placement stories"],
      },
      landscape: {
        similarArtists: [{ name: "Similar Producer", followerCount: 15000, differentiationOpportunity: "More melodic loops" }],
        playlistOpportunities: ["Producer Playlists"],
        collaborationTargets: ["Artist A", "Artist B"],
      },
      rollout: {
        optimalReleaseDay: "Tuesday",
        optimalReleaseTime: "2 PM EST",
        contentCalendar: [
          { day: 0, action: "Pack drop", platform: "all", contentType: "announcement" },
        ],
        platformPriorities: ["beatstars", "youtube"],
      },
      insights: {
        uniquePositioning: "Melodic trap sample specialist",
        contentPillars: ["Process", "Education", "Results"],
        hookOpportunities: ["This loop became...", "From pack to placement"],
        audienceMessaging: "Your next hit starts here",
      },
    },
    workflow: {
      currentStep: "Outreach campaign",
      completedSteps: ["Strategy", "Research", "Asset prep"],
      pendingSteps: ["Placement outreach", "Licensing deals", "Revenue tracking"],
    },
    notes: [
      { id: "n4", author: "NewCulture", content: "Recoupable research shows strong producer/educator positioning opportunity.", timestamp: new Date(Date.now() - 4900000000).toISOString(), type: "internal" },
      { id: "n5", author: "NewCulture", content: "3 placement leads generated. A&R conversations in progress.", timestamp: new Date(Date.now() - 1000000000).toISOString(), type: "internal" },
    ],
  },
];

// ── Components ────────────────────────────────────────────────────────────
function StateBadge({ state }: { state: ReleaseState }) {
  const colors: Record<ReleaseState, string> = {
    draft: "border-border text-muted-foreground",
    assets_pending: "border-yellow-500 text-yellow-500",
    assets_ready: "border-yellow-500 text-yellow-500",
    metadata_pending: "border-yellow-500 text-yellow-500",
    metadata_complete: "border-blue-500 text-blue-500",
    distribution_ready: "border-blue-500 text-blue-500",
    submitted: "border-purple-500 text-purple-500",
    processing: "border-purple-500 text-purple-500",
    live: "border-green-500 text-green-500",
    error: "border-red-500 text-red-500",
  };
  
  return (
    <span className={`border px-2 py-0.5 font-mono text-[9px] tracking-[0.1em] ${colors[state]}`}>
      {state.replace("_", " ").toUpperCase()}
    </span>
  );
}

function BackendPill({ service, feature }: { service: "roex" | "recoupable" | "once"; feature: string }) {
  const colors = {
    roex: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    recoupable: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    once: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };
  
  const icons = {
    roex: FileAudio,
    recoupable: Search,
    once: Globe,
  };
  
  const Icon = icons[service];
  
  return (
    <div className={`flex items-center gap-1.5 border px-2 py-1 ${colors[service]}`}>
      <Icon size={10} />
      <span className="font-mono text-[8px] tracking-[0.15em]">{feature.toUpperCase()}</span>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWorkflow[]>(MOCK_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<ProjectWorkflow | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "research" | "workflow">("overview");

  // Load from Supabase if configured
  useEffect(() => {
    async function loadProjects() {
      if (!supabase) return;
      try {
        const { data } = await supabase
          .from("projects")
          .select("*")
          .order("updated_at", { ascending: false });
        if (data && data.length > 0) {
          setProjects(data as ProjectWorkflow[]);
        }
      } catch (error) {
        console.warn("Could not load from Supabase, using mock data");
      }
    }
    loadProjects();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="border-b border-border px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // OPERATING SYSTEM
              </p>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                Projects.
              </h1>
              <p className="mt-3 max-w-xl font-mono text-sm text-muted-foreground">
                Internal operating layer for client engagements. RoEx-powered audio, 
                Recoupable-powered research, ONCE-powered release operations.
              </p>
              
              {/* Backend Stack Pills */}
              <div className="mt-6 flex flex-wrap gap-2">
                <BackendPill service="roex" feature="Audio Intelligence" />
                <BackendPill service="recoupable" feature="Research & Strategy" />
                <BackendPill service="once" feature="Release Operations" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project List */}
        <section className="border-b border-border px-6 py-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
                ACTIVE PROJECTS ({projects.length})
              </p>
              <div className="flex items-center gap-2">
                <Lock size={12} className="text-muted-foreground/40" />
                <span className="font-mono text-[9px] text-muted-foreground/40">
                  INTERNAL / CLIENT ACCESS
                </span>
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => { setSelectedProject(project); setActiveTab("overview"); }}
                  className={`border p-6 text-left transition-all hover:border-foreground ${
                    selectedProject?.id === project.id ? "border-foreground bg-foreground/5" : "border-border"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                      {project.engagementType.toUpperCase()}
                    </span>
                    <div className="flex gap-1">
                      {project.audioAnalysis && <BackendPill service="roex" feature="Audio" />}
                      {project.research && <BackendPill service="recoupable" feature="Research" />}
                      {project.releaseOperation && <BackendPill service="once" feature="Ops" />}
                    </div>
                  </div>
                  <h3 className="mb-1 font-display text-xl font-bold text-foreground">
                    {project.projectName}
                  </h3>
                  <p className="mb-3 font-mono text-sm text-muted-foreground">
                    {project.artistName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-border">
                      <div
                        className="h-1 bg-foreground"
                        style={{ width: `${(project.workflow.completedSteps.length / (project.workflow.completedSteps.length + project.workflow.pendingSteps.length)) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground/60">
                      {project.workflow.completedSteps.length}/{project.workflow.completedSteps.length + project.workflow.pendingSteps.length}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Project Detail */}
        {selectedProject && (
          <section className="px-6 py-8">
            <div className="mx-auto max-w-6xl">
              {/* Tabs */}
              <div className="mb-6 flex gap-px bg-border">
                {(["overview", "assets", "research", "workflow"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3 font-mono text-[10px] tracking-[0.15em] transition-all ${
                      activeTab === tab
                        ? "bg-foreground text-background"
                        : "bg-background text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="border border-border p-6 md:p-8">
                {activeTab === "overview" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
                        {selectedProject.projectName}
                      </h2>
                      <p className="font-mono text-sm text-muted-foreground">
                        Engagement: {selectedProject.engagementType} • 
                        Started: {new Date(selectedProject.createdAt).toLocaleDateString()} •
                        Last update: {new Date(selectedProject.updatedAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Current Status */}
                    <div className="border border-border bg-card/30 p-4">
                      <p className="mb-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        CURRENT STEP
                      </p>
                      <p className="font-display text-lg font-bold text-foreground">
                        {selectedProject.workflow.currentStep}
                      </p>
                    </div>

                    {/* Backend Services Active */}
                    <div>
                      <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        BACKEND SERVICES ACTIVE
                      </p>
                      <div className="grid gap-4 sm:grid-cols-3">
                        {selectedProject.audioAnalysis && (
                          <div className="border border-emerald-500/20 bg-emerald-500/5 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <FileAudio size={14} className="text-emerald-500" />
                              <span className="font-mono text-[10px] tracking-[0.15em] text-emerald-500">ROEX</span>
                            </div>
                            <p className="font-mono text-xs text-foreground">
                              Mix Score: {selectedProject.audioAnalysis.overallScore}/100
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground/60">
                              {selectedProject.audioAnalysis.readyForRelease ? "Release Ready" : "Needs Work"}
                            </p>
                          </div>
                        )}
                        {selectedProject.research && (
                          <div className="border border-amber-500/20 bg-amber-500/5 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Search size={14} className="text-amber-500" />
                              <span className="font-mono text-[10px] tracking-[0.15em] text-amber-500">RECOUPABLE</span>
                            </div>
                            <p className="font-mono text-xs text-foreground">
                              {selectedProject.research.audience.totalFollowers.toLocaleString()} followers
                            </p>
                            <p className="font-mono text-[10px] text-muted-foreground/60">
                              {selectedProject.research.landscape.playlistOpportunities.length} playlist opportunities
                            </p>
                          </div>
                        )}
                        {selectedProject.releaseOperation && (
                          <div className="border border-purple-500/20 bg-purple-500/5 p-4">
                            <div className="mb-2 flex items-center gap-2">
                              <Globe size={14} className="text-purple-500" />
                              <span className="font-mono text-[10px] tracking-[0.15em] text-purple-500">ONCE</span>
                            </div>
                            <StateBadge state={selectedProject.releaseOperation.state} />
                            <p className="mt-2 font-mono text-[10px] text-muted-foreground/60">
                              {selectedProject.releaseOperation.distribution.platforms.length} platforms
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Notes */}
                    <div>
                      <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        RECENT NOTES
                      </p>
                      <div className="space-y-2">
                        {selectedProject.notes.slice(-3).map((note) => (
                          <div key={note.id} className="border-l-2 border-border pl-3">
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[9px] ${
                                note.type === "system" ? "text-blue-500" :
                                note.type === "client" ? "text-foreground" :
                                "text-muted-foreground/60"
                              }`}>
                                {note.author.toUpperCase()}
                              </span>
                              <span className="font-mono text-[8px] text-muted-foreground/40">
                                {new Date(note.timestamp).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="font-mono text-xs text-muted-foreground">
                              {note.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "assets" && (
                  <div className="space-y-6">
                    <h3 className="font-display text-xl font-bold text-foreground">Assets</h3>
                    
                    {/* Tracks with RoEx Analysis */}
                    <div>
                      <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        AUDIO TRACKS {selectedProject.audioAnalysis && "• ROEX ANALYZED"}
                      </p>
                      <div className="space-y-2">
                        {selectedProject.assets.tracks.map((track) => (
                          <div key={track.id} className="flex items-center justify-between border border-border p-3">
                            <div className="flex items-center gap-3">
                              <Music size={14} className="text-foreground" />
                              <div>
                                <p className="font-mono text-sm text-foreground">{track.name}</p>
                                <p className="font-mono text-[9px] text-muted-foreground/60">
                                  Uploaded {new Date(track.uploadedAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {track.roexAnalysisId && (
                              <BackendPill service="roex" feature="Analyzed" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Artwork */}
                    {selectedProject.assets.artwork && (
                      <div>
                        <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                          ARTWORK
                        </p>
                        <div className="space-y-2">
                          {selectedProject.assets.artwork.map((art) => (
                            <div key={art.id} className="flex items-center justify-between border border-border p-3">
                              <span className="font-mono text-sm text-foreground">{art.type}</span>
                              <span className={`font-mono text-[10px] ${
                                art.status === "approved" ? "text-green-500" :
                                art.status === "rejected" ? "text-red-500" :
                                "text-yellow-500"
                              }`}>
                                {art.status.toUpperCase()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "research" && selectedProject.research && (
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold text-foreground">Recoupable Research</h3>
                      <BackendPill service="recoupable" feature="Intelligence" />
                    </div>
                    
                    {/* Audience */}
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="border border-border p-4">
                        <p className="mb-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">FOLLOWERS</p>
                        <p className="font-display text-2xl font-bold text-foreground">
                          {selectedProject.research.audience.totalFollowers.toLocaleString()}
                        </p>
                        <p className="font-mono text-[10px] text-emerald-500">
                          +{selectedProject.research.audience.growthRate}% /mo
                        </p>
                      </div>
                      <div className="border border-border p-4">
                        <p className="mb-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">TOP CITY</p>
                        <p className="font-display text-lg font-bold text-foreground">
                          {selectedProject.research.audience.topCities[0]?.city}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground/60">
                          {selectedProject.research.audience.topCities[0]?.percentage}% of audience
                        </p>
                      </div>
                      <div className="border border-border p-4">
                        <p className="mb-1 font-mono text-[9px] tracking-[0.15em] text-muted-foreground/60">POSITIONING</p>
                        <p className="font-mono text-xs text-foreground leading-tight">
                          {selectedProject.research.insights.uniquePositioning}
                        </p>
                      </div>
                    </div>

                    {/* Insights */}
                    <div>
                      <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                        STRATEGIC INSIGHTS
                      </p>
                      <div className="space-y-4">
                        <div className="border-l-2 border-amber-500/30 pl-4">
                          <p className="mb-1 font-mono text-xs text-foreground">Content Pillars</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedProject.research.insights.contentPillars.map((pillar) => (
                              <span key={pillar} className="bg-foreground/10 px-2 py-0.5 font-mono text-[9px] text-foreground">
                                {pillar}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="border-l-2 border-amber-500/30 pl-4">
                          <p className="mb-1 font-mono text-xs text-foreground">Viral Hooks</p>
                          <ul className="space-y-1">
                            {selectedProject.research.insights.hookOpportunities.map((hook) => (
                              <li key={hook} className="font-mono text-[11px] text-muted-foreground">
                                • {hook}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="border-l-2 border-amber-500/30 pl-4">
                          <p className="mb-1 font-mono text-xs text-foreground">Playlist Targets</p>
                          <div className="flex flex-wrap gap-1">
                            {selectedProject.research.landscape.playlistOpportunities.map((playlist) => (
                              <span key={playlist} className="border border-border px-2 py-0.5 font-mono text-[9px] text-muted-foreground">
                                {playlist}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "workflow" && (
                  <div className="space-y-6">
                    <h3 className="font-display text-xl font-bold text-foreground">Workflow</h3>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border">
                        <div
                          className="h-2 bg-foreground"
                          style={{ 
                            width: `${(selectedProject.workflow.completedSteps.length / 
                              (selectedProject.workflow.completedSteps.length + selectedProject.workflow.pendingSteps.length)) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {Math.round((selectedProject.workflow.completedSteps.length / 
                          (selectedProject.workflow.completedSteps.length + selectedProject.workflow.pendingSteps.length)) * 100)}%
                      </span>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                      {selectedProject.workflow.completedSteps.map((step) => (
                        <div key={step} className="flex items-center gap-3 border border-emerald-500/20 bg-emerald-500/5 p-3">
                          <Check size={14} className="text-emerald-500" />
                          <span className="font-mono text-sm text-foreground">{step}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-3 border border-foreground bg-foreground/5 p-3">
                        <CircleDot size={14} className="text-foreground" />
                        <span className="font-mono text-sm font-bold text-foreground">
                          {selectedProject.workflow.currentStep}
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-foreground">ACTIVE</span>
                      </div>
                      {selectedProject.workflow.pendingSteps.map((step) => (
                        <div key={step} className="flex items-center gap-3 border border-border p-3 opacity-60">
                          <Circle size={12} className="text-muted-foreground/40" />
                          <span className="font-mono text-sm text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* ONCE Release State (if available) */}
                    {selectedProject.releaseOperation && (
                      <div className="mt-6 border border-purple-500/20 bg-purple-500/5 p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Globe size={14} className="text-purple-500" />
                          <span className="font-mono text-[10px] tracking-[0.15em] text-purple-500">ONCE RELEASE OPS</span>
                        </div>
                        <StateBadge state={selectedProject.releaseOperation.state} />
                        {selectedProject.releaseOperation.distribution.scheduledReleaseDate && (
                          <p className="mt-2 font-mono text-xs text-muted-foreground">
                            Scheduled: {new Date(selectedProject.releaseOperation.distribution.scheduledReleaseDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
