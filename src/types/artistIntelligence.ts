// Artist Intelligence System - Types
// High-converting intake + scoring system inspired by Nextwave ARI

export type ArtistRole = 'artist' | 'producer' | 'engineer' | 'studio' | 'other';

export type AudienceRange = '0-1k' | '1k-10k' | '10k-50k' | '50k-100k' | '100k-500k' | '500k+';
export type EngagementRange = '0-100' | '100-1k' | '1k-10k' | '10k-50k' | '50k+';

export type ReleaseFrequency = 'weekly' | 'monthly' | 'quarterly' | 'rarely' | 'never';
export type ContentFrequency = 'daily' | 'few-times-week' | 'weekly' | 'monthly' | 'rarely';

export type RevenueRange = '0' | '0-1k' | '1k-5k' | '5k-10k' | '10k-50k' | '50k+';
export type RevenueSource = 'streaming' | 'live' | 'merch' | 'sync' | 'production' | 'teaching' | 'none';

export type PrimaryGoal = 'viral' | 'fanbase' | 'monetization' | 'placements' | 'sound' | 'industry';

export type StruggleArea = 
  | 'mixing' 
  | 'marketing' 
  | 'consistency' 
  | 'fanbase' 
  | 'monetization' 
  | 'time' 
  | 'network' 
  | 'sound';

export interface ArtistIdentity {
  artistName: string;
  email: string;
  role: ArtistRole;
}

export interface MusicPresence {
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl: string;
  soundcloudUrl?: string;
  latestTrackUrl: string;
}

export interface AudienceSignals {
  monthlyListeners: AudienceRange;
  instagramFollowers: AudienceRange;
  tiktokFollowers: AudienceRange;
  avgViewsPerPost: EngagementRange;
}

export interface ConsistencyMetrics {
  releaseFrequency: ReleaseFrequency;
  contentFrequency: ContentFrequency;
  runsAds: boolean;
  hasEmailList: boolean;
}

export interface MonetizationData {
  isMakingMoney: boolean;
  monthlyRevenue?: RevenueRange;
  revenueSources: RevenueSource[];
}

export interface WorkflowQuality {
  selfMixMaster: boolean;
  uploadedTrack?: File | null;
  biggestStruggles: StruggleArea[];
}

export interface ArtistIntent {
  primaryGoal: PrimaryGoal;
}

export interface ArtistIntakeData {
  identity: ArtistIdentity;
  presence: MusicPresence;
  audience: AudienceSignals;
  consistency: ConsistencyMetrics;
  monetization: MonetizationData;
  workflow: WorkflowQuality;
  intent: ArtistIntent;
  submittedAt?: Date;
}

// Scoring System Types
export interface ScoreBreakdown {
  audioQuality: number;      // 0-20 (or redistributed if no upload)
  audience: number;          // 0-15
  engagement: number;        // 0-15
  consistency: number;       // 0-15
  monetization: number;      // 0-15
  clarity: number;           // 0-10
  network: number;           // 0-10 (placeholder for future)
}

export interface GrowthProjection {
  currentTrajectory: 'stagnant' | 'slow' | 'steady' | 'fast';
  optimizedPotential: 'moderate' | 'strong' | 'breakout' | 'viral';
  bottleneck: string;
  opportunity: string;
}

export interface AIAnalysis {
  score: number;             // 0-100
  tier: 'early' | 'developing' | 'advanced' | 'ready';
  strengths: string[];
  weaknesses: string[];
  strategicInsight: string;
  actionPlan: string[];
  growthProjection: GrowthProjection;
}

export interface RecoupableEnrichment {
  lastSynced: Date;
  audienceSnapshot: {
    followers: number;
    growthRate: number;
    topCities: string[];
  };
  contentPerformance: {
    avgEngagement: number;
    viralScore: number;
    bestPerformingThemes: string[];
  };
  competitivePosition: {
    similarArtists: string[];
    differentiationOpportunity: string;
  };
  rolloutIntelligence?: {
    optimalReleaseDay: string;
    contentCalendar: Array<{
      day: number;
      action: string;
      platform: string;
      contentType: string;
    }>;
  };
}

export interface ArtistPlayerCard {
  artistName: string;
  role: ArtistRole;
  score: number;
  tier: string;
  breakdown: ScoreBreakdown;
  analysis: AIAnalysis;
  submittedAt: Date;
  recoupableEnrichment?: RecoupableEnrichment;
}

// Database storage format
export interface ArtistIntelligenceRecord extends ArtistIntakeData {
  id: string;
  score: number;
  tier: string;
  breakdown: ScoreBreakdown;
  analysis: AIAnalysis;
  playerCard: ArtistPlayerCard;
  csvExport: string;
}
