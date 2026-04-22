// RoEx Audio API Service
// Powers: mix/master analysis, audio processing, release-readiness scoring
// https://tonn-portal.roexaudio.com/docs/

import { ROEX_API_KEY, ROEX_API_URL } from "@/lib/config";

const hasCredentials = !!ROEX_API_KEY;

export interface RoExAnalysisResult {
  id: string;
  status: "pending" | "processing" | "completed" | "error";
  overallScore: number; // 0-100
  mixQuality: {
    frequencyBalance: number;
    dynamicRange: number;
    stereoImaging: number;
    clarity: number;
  };
  loudness: {
    integratedLUFS: number;
    truePeak: number;
    loudnessRange: number;
  };
  issues: Array<{
    type: "warning" | "critical" | "suggestion";
    category: string;
    description: string;
    suggestion?: string;
  }>;
  recommendations: string[];
  readyForRelease: boolean;
  mastered?: {
    url: string;
    format: string;
    processingApplied: string[];
  };
}

export interface RoExMixRequest {
  audioUrl: string;
  referenceTrackUrl?: string;
  genre?: string[];
  targetLoudness?: number; // e.g., -14 for streaming
  stemCount?: number;
}

// Analyze a track for mix quality and release readiness
export async function analyzeTrack(audioUrl: string): Promise<RoExAnalysisResult | null> {
  if (!hasCredentials) {
    console.warn("RoEx: No API key configured, returning mock data");
    return getMockAnalysis();
  }

  try {
    const response = await fetch(`${ROEX_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ROEX_API_KEY}`,
      },
      body: JSON.stringify({ audioUrl }),
    });

    if (!response.ok) throw new Error(`RoEx API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("RoEx analysis failed:", error);
    return null;
  }
}

// Request AI mix and master
export async function requestMixMaster(
  request: RoExMixRequest
): Promise<{ jobId: string; status: string } | null> {
  if (!hasCredentials) {
    console.warn("RoEx: No API key, simulating mix request");
    return { jobId: `mock-${Date.now()}`, status: "processing" };
  }

  try {
    const response = await fetch(`${ROEX_API_URL}/automix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ROEX_API_KEY}`,
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error(`RoEx API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("RoEx mix request failed:", error);
    return null;
  }
}

// Check job status
export async function getJobStatus(jobId: string): Promise<RoExAnalysisResult | null> {
  if (!hasCredentials) {
    // Simulate progression
    return getMockAnalysis(jobId);
  }

  try {
    const response = await fetch(`${ROEX_API_URL}/jobs/${jobId}`, {
      headers: { "Authorization": `Bearer ${ROEX_API_KEY}` },
    });

    if (!response.ok) throw new Error(`RoEx API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("RoEx job status failed:", error);
    return null;
  }
}

// Mock data for development/staging
function getMockAnalysis(jobId?: string): RoExAnalysisResult {
  return {
    id: jobId || `mock-${Date.now()}`,
    status: "completed",
    overallScore: 78,
    mixQuality: {
      frequencyBalance: 82,
      dynamicRange: 75,
      stereoImaging: 80,
      clarity: 76,
    },
    loudness: {
      integratedLUFS: -14.2,
      truePeak: -1.1,
      loudnessRange: 8.5,
    },
    issues: [
      {
        type: "suggestion",
        category: "Low End",
        description: "Sub frequencies could be tighter",
        suggestion: "Consider high-pass filtering below 30Hz",
      },
      {
        type: "warning",
        category: "Vocals",
        description: "Vocal presence dips around 2-4kHz",
        suggestion: "Gentle presence boost or de-ess adjustment",
      },
    ],
    recommendations: [
      "Overall mix is release-ready with minor tweaks",
      "Consider master bus compression for cohesion",
      "Check mono compatibility on bass elements",
    ],
    readyForRelease: true,
    mastered: {
      url: "https://example.com/mastered-track.wav",
      format: "WAV 24-bit",
      processingApplied: ["EQ", "Compression", "Limiting", "Stereo Enhancement"],
    },
  };
}

export const RoExService = {
  analyzeTrack,
  requestMixMaster,
  getJobStatus,
  isConfigured: hasCredentials,
};
