// ONCE API Service
// Powers: release operations, publishing workflows, distribution rail
// Docs: https://docs.once.app/mcp/api-reference
// Protocol: MCP (Model Context Protocol)
// Note: ONCE uses MCP server - requires agent setup at https://docs.once.app/mcp/agents

import { ONCE_API_KEY, ONCE_API_URL } from "@/lib/config";

const ONCE_BASE_URL = ONCE_API_URL || "https://api.once.app/v1";
const hasCredentials = !!ONCE_API_KEY;

// Release Operation States
export type ReleaseState = 
  | "draft"
  | "assets_pending"
  | "assets_ready"
  | "metadata_pending"
  | "metadata_complete"
  | "distribution_ready"
  | "submitted"
  | "processing"
  | "live"
  | "error";

export interface ReleaseOperation {
  id: string;
  artistName: string;
  trackTitle: string;
  state: ReleaseState;
  createdAt: string;
  updatedAt: string;
  
  // Assets
  assets: {
    audio: {
      url: string;
      format: string;
      duration: number;
      waveform?: string;
    } | null;
    coverArt: {
      url: string;
      dimensions: { width: number; height: number };
      approved: boolean;
    } | null;
    metadata: {
      title: string;
      version?: string;
      primaryArtists: string[];
      featuredArtists?: string[];
      writers?: string[];
      producers?: string[];
      genre: string[];
      subgenre?: string[];
      language: string;
      explicit: boolean;
      isrc?: string;
      upc?: string;
    } | null;
  };
  
  // Distribution
  distribution: {
    platforms: string[];
    scheduledReleaseDate: string | null;
    timezone: string;
    preSaveEnabled: boolean;
    preSaveUrl?: string;
  };
  
  // Publishing (if applicable)
  publishing: {
    composer: string[];
    publisher: string;
    proAffiliation?: string;
    splitSheet?: Array<{
      party: string;
      role: string;
      percentage: number;
    }>;
  } | null;
  
  // Workflow Status
  workflow: {
    currentStep: string;
    completedSteps: string[];
    pendingSteps: string[];
    blockedBy: string[];
    notes: string[];
  };
  
  // ONCE Agent Integration
  agent: {
    assigned: boolean;
    agentId?: string;
    lastAction?: string;
    nextScheduledAction?: string;
  };
}

// Task Types
export interface ReleaseTask {
  id: string;
  releaseId: string;
  type: "asset_upload" | "metadata_review" | "dsp_pitch" | "playlist_submission" | "social_asset" | "ad_setup" | "press_outreach";
  status: "pending" | "in_progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo?: string; // agent or user
  dueDate?: string;
  completedAt?: string;
  notes: string[];
  automationEnabled: boolean;
}

// Create a new release operation
export async function createReleaseOperation(
  artistName: string,
  trackTitle: string,
  initialData?: Partial<ReleaseOperation>
): Promise<{ operationId: string; status: string } | null> {
  if (!hasCredentials) {
    console.warn("ONCE: No API key, simulating release creation");
    return { 
      operationId: `once-mock-${Date.now()}`, 
      status: "draft" 
    };
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ONCE_API_KEY}`,
      },
      body: JSON.stringify({ artistName, trackTitle, ...initialData }),
    });

    if (!response.ok) throw new Error(`ONCE API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("ONCE release creation failed:", error);
    return null;
  }
}

// Get release operation status
export async function getReleaseOperation(operationId: string): Promise<ReleaseOperation | null> {
  if (!hasCredentials) {
    return getMockReleaseOperation(operationId);
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases/${operationId}`, {
      headers: { "Authorization": `Bearer ${ONCE_API_KEY}` },
    });

    if (!response.ok) throw new Error(`ONCE API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("ONCE get release failed:", error);
    return null;
  }
}

// Update release state
export async function updateReleaseState(
  operationId: string,
  newState: ReleaseState,
  metadata?: Record<string, any>
): Promise<boolean> {
  if (!hasCredentials) {
    console.warn(`ONCE: Mock state update to ${newState}`);
    return true;
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases/${operationId}/state`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ONCE_API_KEY}`,
      },
      body: JSON.stringify({ state: newState, metadata }),
    });

    return response.ok;
  } catch (error) {
    console.error("ONCE state update failed:", error);
    return false;
  }
}

// Submit for distribution
export async function submitForDistribution(
  operationId: string,
  platforms?: string[]
): Promise<{ submissionId: string; status: string } | null> {
  if (!hasCredentials) {
    console.warn("ONCE: Mock distribution submission");
    return { submissionId: `sub-${Date.now()}`, status: "processing" };
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases/${operationId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ONCE_API_KEY}`,
      },
      body: JSON.stringify({ platforms }),
    });

    if (!response.ok) throw new Error(`ONCE API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("ONCE submission failed:", error);
    return null;
  }
}

// Get tasks for a release
export async function getReleaseTasks(releaseId: string): Promise<ReleaseTask[] | null> {
  if (!hasCredentials) {
    return getMockTasks(releaseId);
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases/${releaseId}/tasks`, {
      headers: { "Authorization": `Bearer ${ONCE_API_KEY}` },
    });

    if (!response.ok) throw new Error(`ONCE API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("ONCE get tasks failed:", error);
    return null;
  }
}

// Create a task
export async function createTask(
  releaseId: string,
  task: Omit<ReleaseTask, "id" | "releaseId">
): Promise<{ taskId: string } | null> {
  if (!hasCredentials) {
    return { taskId: `task-${Date.now()}` };
  }

  try {
    const response = await fetch(`${ONCE_BASE_URL}/releases/${releaseId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ONCE_API_KEY}`,
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) throw new Error(`ONCE API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("ONCE create task failed:", error);
    return null;
  }
}

// Mock implementations
function getMockReleaseOperation(operationId: string): ReleaseOperation {
  return {
    id: operationId,
    artistName: "Demo Artist",
    trackTitle: "Demo Track",
    state: "metadata_pending",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    assets: {
      audio: {
        url: "https://example.com/audio.wav",
        format: "WAV 24-bit",
        duration: 214,
        waveform: "waveform-data",
      },
      coverArt: {
        url: "https://example.com/cover.jpg",
        dimensions: { width: 3000, height: 3000 },
        approved: true,
      },
      metadata: {
        title: "Demo Track",
        primaryArtists: ["Demo Artist"],
        genre: ["R&B", "Alternative"],
        language: "en",
        explicit: false,
      },
    },
    distribution: {
      platforms: ["spotify", "apple", "amazon", "tidal", "deezer"],
      scheduledReleaseDate: new Date(Date.now() + 1209600000).toISOString(), // 2 weeks
      timezone: "America/New_York",
      preSaveEnabled: true,
      preSaveUrl: "https://presave.io/demo",
    },
    publishing: {
      composer: ["Demo Artist"],
      publisher: "NewCulture Publishing",
      splitSheet: [
        { party: "Demo Artist", role: "Writer/Performer", percentage: 100 },
      ],
    },
    workflow: {
      currentStep: "metadata_review",
      completedSteps: ["audio_upload", "cover_art", "basic_metadata"],
      pendingSteps: ["dsp_selection", "schedule_confirm", "submit"],
      blockedBy: [],
      notes: ["Waiting for ISRC assignment"],
    },
    agent: {
      assigned: true,
      agentId: "agent-mock-1",
      lastAction: "Reviewed metadata",
      nextScheduledAction: "ISRC assignment",
    },
  };
}

function getMockTasks(releaseId: string): ReleaseTask[] {
  return [
    {
      id: `task-${Date.now()}-1`,
      releaseId,
      type: "metadata_review",
      status: "in_progress",
      priority: "high",
      assignedTo: "agent-mock-1",
      notes: ["Verify writing credits"],
      automationEnabled: false,
    },
    {
      id: `task-${Date.now()}-2`,
      releaseId,
      type: "dsp_pitch",
      status: "pending",
      priority: "medium",
      dueDate: new Date(Date.now() + 604800000).toISOString(),
      notes: ["Submit to Spotify editorial"],
      automationEnabled: true,
    },
  ];
}

// Helper to check if release is ready for distribution
export function isReleaseReadyForDistribution(release: ReleaseOperation): boolean {
  const requiredStates: ReleaseState[] = ["distribution_ready", "submitted", "processing", "live"];
  return requiredStates.includes(release.state);
}

// Helper to get next steps for a release
export function getNextSteps(release: ReleaseOperation): string[] {
  const stateSteps: Record<ReleaseState, string[]> = {
    draft: ["Upload audio file", "Upload cover art", "Fill metadata"],
    assets_pending: ["Complete audio upload", "Complete cover art"],
    assets_ready: ["Fill track metadata", "Add writing credits"],
    metadata_pending: ["Review metadata accuracy", "Confirm ISRC/UPC"],
    metadata_complete: ["Select DSPs", "Set release date", "Enable pre-save"],
    distribution_ready: ["Review distribution settings", "Submit to DSPs"],
    submitted: ["Monitor processing status", "Prepare marketing assets"],
    processing: ["Wait for DSP approval", "Finalize pre-save campaign"],
    live: ["Monitor performance", "Engage with fans", "Plan next release"],
    error: ["Review error details", "Fix issues", "Resubmit"],
  };
  
  return stateSteps[release.state] || ["Contact support"];
}

export const ONCEService = {
  createReleaseOperation,
  getReleaseOperation,
  updateReleaseState,
  submitForDistribution,
  getReleaseTasks,
  createTask,
  isReleaseReadyForDistribution,
  getNextSteps,
  isConfigured: hasCredentials,
};
