// Recoupable API Service
// Powers: artist research, rollout intelligence, content ideation, audience analysis
// Docs: https://developers.recoupable.com/
// API Key: https://chat.recoupable.com/keys (requires account)
// Base URL: https://recoup-api.vercel.app/api

import { RECOUPABLE_API_KEY, RECOUPABLE_API_URL } from "@/lib/config";

const RECOUP_BASE_URL = RECOUPABLE_API_URL || "https://recoup-api.vercel.app/api";
const hasCredentials = !!RECOUPABLE_API_KEY;

// Research Types
export interface ArtistResearch {
  id: string;
  artistName: string;
  timestamp: string;
  
  // Audience Intelligence
  audience: {
    totalFollowers: number;
    platformBreakdown: Record<string, number>;
    growthRate: number; // monthly
    topCities: Array<{ city: string; country: string; percentage: number }>;
    demographics?: {
      ageRanges: Record<string, number>;
      genderSplit: Record<string, number>;
    };
  };
  
  // Content Performance
  content: {
    topPerformingPosts: Array<{
      platform: string;
      type: string;
      engagement: number;
      viralScore: number;
      themes: string[];
    }>;
    contentGaps: string[];
    recommendedFormats: string[];
  };
  
  // Competitive Landscape
  landscape: {
    similarArtists: Array<{
      name: string;
      followerCount: number;
      differentiationOpportunity: string;
    }>;
    playlistOpportunities: string[];
    collaborationTargets: string[];
  };
  
  // Rollout Intelligence
  rollout: {
    optimalReleaseDay: string;
    optimalReleaseTime: string;
    contentCalendar: Array<{
      day: number; // days before/after release
      action: string;
      platform: string;
      contentType: string;
    }>;
    platformPriorities: string[];
  };
  
  // Generated Insights
  insights: {
    uniquePositioning: string;
    contentPillars: string[];
    hookOpportunities: string[];
    audienceMessaging: string;
  };
}

// Blueprint Generation
export interface BlueprintInput {
  artistName: string;
  genre: string[];
  currentFollowers: number;
  goals: string[];
  budgetRange: string;
  timeline: string;
  strengths: string[];
  challenges: string[];
}

export interface GeneratedBlueprint {
  id: string;
  artistName: string;
  generatedAt: string;
  
  // Strategic Foundation
  positioning: {
    niche: string;
    uniqueAngle: string;
    targetAudience: string;
    competitiveMoat: string;
  };
  
  // 90-Day Roadmap
  roadmap: Array<{
    phase: string;
    duration: string;
    focus: string;
    milestones: string[];
    keyActions: string[];
  }>;
  
  // Content Strategy
  contentStrategy: {
    pillars: Array<{
      name: string;
      description: string;
      postingFrequency: string;
      examples: string[];
    }>;
    viralHooks: string[];
    contentCalendar: string; // link or embedded
  };
  
  // Growth Tactics
  growthTactics: Array<{
    channel: string;
    tactic: string;
    expectedOutcome: string;
    difficulty: "easy" | "medium" | "hard";
    timeInvestment: string;
  }>;
  
  // Monetization Path
  monetization: {
    shortTerm: string[];
    mediumTerm: string[];
    longTerm: string[];
    revenueProjections: Record<string, string>;
  };
  
  // Resource Requirements
  resources: {
    teamNeeds: string[];
    toolStack: string[];
    estimatedBudget: string;
  };
  
  // Success Metrics
  kpis: Array<{
    metric: string;
    target: string;
    timeframe: string;
  }>;
}

// Research an artist across platforms
export async function researchArtist(
  artistName: string,
  platforms?: string[]
): Promise<ArtistResearch | null> {
  if (!hasCredentials) {
    console.warn("Recoupable: No API key, returning mock research");
    return getMockResearch(artistName);
  }

  try {
    const response = await fetch(`${RECOUP_BASE_URL}/research/artist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RECOUPABLE_API_KEY,
      },
      body: JSON.stringify({ artistName, platforms }),
    });

    if (!response.ok) throw new Error(`Recoupable API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Recoupable research failed:", error);
    return null;
  }
}

// Generate strategic blueprint
export async function generateBlueprint(
  input: BlueprintInput
): Promise<GeneratedBlueprint | null> {
  if (!hasCredentials) {
    console.warn("Recoupable: No API key, returning mock blueprint");
    return getMockBlueprint(input);
  }

  try {
    const response = await fetch(`${RECOUP_BASE_URL}/blueprints/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RECOUPABLE_API_KEY,
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) throw new Error(`Recoupable API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Recoupable blueprint generation failed:", error);
    return null;
  }
}

// Get content ideas based on artist profile
export async function generateContentIdeas(
  artistName: string,
  count: number = 10
): Promise<Array<{
  hook: string;
  format: string;
  platform: string;
  expectedEngagement: string;
  productionNotes: string;
}> | null> {
  if (!hasCredentials) {
    return getMockContentIdeas(artistName, count);
  }

  try {
    const response = await fetch(`${RECOUP_BASE_URL}/content/ideas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": RECOUPABLE_API_KEY,
      },
      body: JSON.stringify({ artistName, count }),
    });

    if (!response.ok) throw new Error(`Recoupable API error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Recoupable content ideas failed:", error);
    return null;
  }
}

// Mock implementations for staging
function getMockResearch(artistName: string): ArtistResearch {
  return {
    id: `research-${Date.now()}`,
    artistName,
    timestamp: new Date().toISOString(),
    audience: {
      totalFollowers: 12500,
      platformBreakdown: { instagram: 8000, tiktok: 3000, spotify: 1500 },
      growthRate: 12.5,
      topCities: [
        { city: "Los Angeles", country: "USA", percentage: 18 },
        { city: "London", country: "UK", percentage: 12 },
        { city: "Atlanta", country: "USA", percentage: 9 },
      ],
    },
    content: {
      topPerformingPosts: [
        { platform: "tiktok", type: "behind the scenes", engagement: 4500, viralScore: 78, themes: ["authenticity", "process"] },
        { platform: "instagram", type: "carousel", engagement: 1200, viralScore: 65, themes: ["storytelling", "lyrics"] },
      ],
      contentGaps: ["consistent posting", "user generated content", "collaborations"],
      recommendedFormats: ["short form video", "audio snippets", "story posts"],
    },
    landscape: {
      similarArtists: [
        { name: "Similar Artist A", followerCount: 50000, differentiationOpportunity: "More personal storytelling" },
      ],
      playlistOpportunities: ["Indie R&B", "Late Night Vibes", "Breakup Anthems"],
      collaborationTargets: ["Producer X", "Vocalist Y"],
    },
    rollout: {
      optimalReleaseDay: "Friday",
      optimalReleaseTime: "9 PM EST",
      contentCalendar: [
        { day: -7, action: "Teaser snippet", platform: "all", contentType: "audio" },
        { day: -3, action: "Behind the scenes", platform: "tiktok", contentType: "video" },
        { day: 0, action: "Release", platform: "all", contentType: "announcement" },
        { day: 1, action: "Thank you / engage", platform: "instagram", contentType: "story" },
      ],
      platformPriorities: ["spotify", "tiktok", "instagram"],
    },
    insights: {
      uniquePositioning: "Authentic R&B storytelling for late-night listeners",
      contentPillars: ["Process", "Vulnerability", "Growth", "Collaboration"],
      hookOpportunities: ["Day in the life", "Song breakdown", "Before/after mix"],
      audienceMessaging: "You're not alone in feeling this",
    },
  };
}

function getMockBlueprint(input: BlueprintInput): GeneratedBlueprint {
  return {
    id: `blueprint-${Date.now()}`,
    artistName: input.artistName,
    generatedAt: new Date().toISOString(),
    positioning: {
      niche: "Independent R&B/Alternative",
      uniqueAngle: "Raw, unfiltered emotional storytelling",
      targetAudience: "18-34, urban, streaming-first listeners",
      competitiveMoat: "Authenticity + consistent output",
    },
    roadmap: [
      {
        phase: "Foundation",
        duration: "Month 1",
        focus: "Content system + profile optimization",
        milestones: ["Daily posting cadence", "Bio/link optimization", "3 release-ready tracks"],
        keyActions: ["Set up content calendar", "Create templates", "Batch shoot content"],
      },
      {
        phase: "Activation",
        duration: "Months 2-3",
        focus: "First release + audience building",
        milestones: ["First single release", "1000 new followers", "First playlist add"],
        keyActions: ["Release campaign", "Paid ads test", "Collaboration outreach"],
      },
    ],
    contentStrategy: {
      pillars: [
        { name: "Process", description: "How the music is made", postingFrequency: "2x/week", examples: ["Beat making", "Vocal tracking", "Mix decisions"] },
        { name: "Story", description: "Meaning behind the music", postingFrequency: "1x/week", examples: ["Song breakdowns", "Lyric explanations", "Inspiration stories"] },
      ],
      viralHooks: ["I wrote this song in 10 minutes", "The story behind this lyric", "Before vs after mix"],
      contentCalendar: "Generated calendar link",
    },
    growthTactics: [
      { channel: "TikTok", tactic: "Behind-the-scenes clips", expectedOutcome: "10K views/week", difficulty: "easy", timeInvestment: "2 hrs/week" },
      { channel: "Spotify", tactic: "Playlist pitching", expectedOutcome: "5 playlist adds", difficulty: "medium", timeInvestment: "4 hrs/week" },
    ],
    monetization: {
      shortTerm: ["Streaming revenue", "Sync licensing (small)"],
      mediumTerm: ["Direct-to-fan (Wavi)", "Merch drops"],
      longTerm: ["Touring", "Brand partnerships", "Publishing"],
      revenueProjections: { "6_months": "$500-1000/mo", "12_months": "$2000-5000/mo" },
    },
    resources: {
      teamNeeds: ["Part-time content editor", "Mix engineer (per track)"],
      toolStack: ["Canva", "CapCut", "DistroKid", "Wavi"],
      estimatedBudget: "$300-500/month",
    },
    kpis: [
      { metric: "Monthly listeners", target: "5000", timeframe: "6 months" },
      { metric: "Social followers", target: "15000", timeframe: "6 months" },
      { metric: "Email list", target: "500", timeframe: "6 months" },
    ],
  };
}

function getMockContentIdeas(artistName: string, count: number) {
  const ideas = [
    { hook: "The lyric everyone asks about", format: "TikTok video", platform: "tiktok", expectedEngagement: "High", productionNotes: "Point to lyrics on screen" },
    { hook: "How I made this beat in 5 minutes", format: "Time-lapse", platform: "tiktok", expectedEngagement: "Very High", productionNotes: "Screen record + voiceover" },
    { hook: "Before/after mix comparison", format: "Audio post", platform: "instagram", expectedEngagement: "Medium", productionNotes: "Split screen audio" },
  ];
  return ideas.slice(0, count);
}

// ============================================================================
// CACHE LAYER - Rate limiting & cost control
// ============================================================================

const CACHE_DURATION = 1000 * 60 * 60 * 24; // 24 hours
const requestCache = new Map<string, { data: any; timestamp: number }>();

export async function researchArtistWithCache(
  artistName: string,
  platforms?: string[]
): Promise<ArtistResearch | null> {
  const cacheKey = `${artistName.toLowerCase().trim()}-${platforms?.sort().join(',') || 'all'}`;
  const cached = requestCache.get(cacheKey);
  
  // Return cached if < 24 hours
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`[Recoupable Cache] Hit for ${artistName}`);
    return cached.data;
  }
  
  console.log(`[Recoupable API] Fetching ${artistName}`);
  const data = await researchArtist(artistName, platforms);
  
  if (data) {
    requestCache.set(cacheKey, { data, timestamp: Date.now() });
  }
  
  return data;
}

// ============================================================================
// ENRICHMENT UTILITIES - Merge Recoupable data with our scoring
// ============================================================================

export function enrichPlayerCardWithRecoupable(
  card: any,
  research: ArtistResearch
): { enrichedCard: any; enrichment: import('@/types/artistIntelligence').RecoupableEnrichment } {
  // Calculate adjusted score based on real data
  const realFollowers = research.audience?.totalFollowers || 0;
  const realGrowthRate = research.audience?.growthRate || 0;
  const avgViralScore = research.content?.topPerformingPosts?.reduce(
    (sum, p) => sum + (p.viralScore || 0), 0
  ) / (research.content?.topPerformingPosts?.length || 1);
  
  // Adjust audience score based on real data
  let audienceBonus = 0;
  if (realFollowers > 50000) audienceBonus = 5;
  else if (realFollowers > 10000) audienceBonus = 3;
  else if (realFollowers > 1000) audienceBonus = 1;
  
  // Adjust consistency score based on growth rate
  let consistencyBonus = 0;
  if (realGrowthRate > 20) consistencyBonus = 5;
  else if (realGrowthRate > 10) consistencyBonus = 3;
  else if (realGrowthRate > 5) consistencyBonus = 1;
  
  // Recalculate total score
  const adjustedScore = Math.min(100, card.score + audienceBonus + consistencyBonus);
  
  // Determine trajectory from real growth data
  const currentTrajectory = realGrowthRate > 15 ? 'fast' : 
    realGrowthRate > 5 ? 'steady' : 'slow-growth';
  
  // Build enrichment object
  const enrichment = {
    lastSynced: new Date(),
    audienceSnapshot: {
      followers: realFollowers,
      growthRate: realGrowthRate,
      topCities: research.audience?.topCities?.map(c => c.city) || [],
    },
    contentPerformance: {
      avgEngagement: research.content?.topPerformingPosts?.[0]?.engagement || 0,
      viralScore: Math.round(avgViralScore),
      bestPerformingThemes: research.content?.topPerformingPosts?.[0]?.themes || [],
    },
    competitivePosition: {
      similarArtists: research.landscape?.similarArtists?.map(a => a.name) || [],
      differentiationOpportunity: research.landscape?.similarArtists?.[0]?.differentiationOpportunity || '',
    },
    rolloutIntelligence: research.rollout ? {
      optimalReleaseDay: research.rollout.optimalReleaseDay,
      contentCalendar: research.rollout.contentCalendar,
    } : undefined,
  };
  
  // Create enriched card
  const enrichedCard = {
    ...card,
    score: adjustedScore,
    recoupableEnrichment: enrichment,
    analysis: {
      ...card.analysis,
      growthProjection: {
        ...card.analysis.growthProjection,
        currentTrajectory,
        optimizedPotential: adjustedScore > 70 ? 'breakout' : 'accelerated',
      },
      strengths: [
        ...card.analysis.strengths,
        ...(realGrowthRate > 10 ? [`Strong ${realGrowthRate}% monthly growth trajectory`] : []),
        ...(research.audience?.topCities?.length > 0 
          ? [`Geographic concentration in ${research.audience.topCities[0].city}`] 
          : []),
      ].slice(0, 5),
      strategicInsight: card.analysis.strategicInsight + 
        ` Live intelligence shows ${realFollowers.toLocaleString()} followers across platforms with ${realGrowthRate}% monthly growth.`,
    },
  };
  
  return { enrichedCard, enrichment };
}

// ============================================================================
// LEAD SCORING - Predictive value assessment
// ============================================================================

export interface LeadScore {
  totalScore: number;
  isHighValue: boolean;
  factors: {
    audienceSize: number;
    growthVelocity: number;
    contentPerformance: number;
    competitivePosition: number;
  };
  insights: string[];
}

export function calculateLeadScore(research: ArtistResearch | null): LeadScore {
  if (!research) {
    return {
      totalScore: 0,
      isHighValue: false,
      factors: { audienceSize: 0, growthVelocity: 0, contentPerformance: 0, competitivePosition: 0 },
      insights: ['No Recoupable data available'],
    };
  }
  
  const followers = research.audience?.totalFollowers || 0;
  const growthRate = research.audience?.growthRate || 0;
  const avgViralScore = research.content?.topPerformingPosts?.reduce(
    (sum, p) => sum + (p.viralScore || 0), 0
  ) / (research.content?.topPerformingPosts?.length || 1);
  const hasCompetitors = (research.landscape?.similarArtists?.length || 0) > 0;
  
  // Score each factor 0-25
  const audienceSizeScore = Math.min(25, (followers / 10000) * 5);
  const growthVelocityScore = Math.min(25, growthRate);
  const contentPerformanceScore = Math.min(25, avgViralScore / 4);
  const competitivePositionScore = hasCompetitors ? 15 : 5;
  
  const totalScore = Math.round(
    audienceSizeScore + growthVelocityScore + contentPerformanceScore + competitivePositionScore
  );
  
  return {
    totalScore,
    isHighValue: totalScore > 60,
    factors: {
      audienceSize: Math.round(audienceSizeScore),
      growthVelocity: Math.round(growthVelocityScore),
      contentPerformance: Math.round(contentPerformanceScore),
      competitivePosition: competitivePositionScore,
    },
    insights: [
      followers > 10000 ? `Established audience: ${followers.toLocaleString()} followers` : 'Early-stage audience',
      growthRate > 15 ? `High-growth trajectory: ${growthRate}% monthly` : 'Steady growth pattern',
      avgViralScore > 70 ? 'Strong viral potential identified' : 'Building content momentum',
      hasCompetitors ? 'Clear competitive positioning available' : 'Unique positioning opportunity',
    ],
  };
}

export const RecoupableService = {
  researchArtist,
  researchArtistWithCache,
  generateBlueprint,
  generateContentIdeas,
  enrichPlayerCardWithRecoupable,
  calculateLeadScore,
  isConfigured: hasCredentials,
  getCacheStats: () => ({ size: requestCache.size, keys: Array.from(requestCache.keys()) }),
  clearCache: () => requestCache.clear(),
};
