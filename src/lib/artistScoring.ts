// Artist Scoring Engine
// Deterministic 100-point scoring system with AI analysis generation

import type {
  ArtistIntakeData,
  ScoreBreakdown,
  AIAnalysis,
  ArtistPlayerCard,
  AudienceRange,
  EngagementRange,
  RevenueRange,
  ReleaseFrequency,
  ContentFrequency,
  PrimaryGoal,
  StruggleArea,
  GrowthProjection,
} from '@/types/artistIntelligence';

// ============================================================================
// SCORING CONSTANTS
// ============================================================================

const BASE_WEIGHTS = {
  audioQuality: 20,
  audience: 15,
  engagement: 15,
  consistency: 15,
  monetization: 15,
  clarity: 10,
  network: 10,
};

// Audience range score mappings
const AUDIENCE_SCORES: Record<AudienceRange, number> = {
  '0-1k': 2,
  '1k-10k': 5,
  '10k-50k': 8,
  '50k-100k': 11,
  '100k-500k': 13,
  '500k+': 15,
};

// Engagement score mappings
const ENGAGEMENT_SCORES: Record<EngagementRange, number> = {
  '0-100': 2,
  '100-1k': 5,
  '1k-10k': 9,
  '10k-50k': 12,
  '50k+': 15,
};

// Consistency score mappings
const RELEASE_SCORES: Record<ReleaseFrequency, number> = {
  'weekly': 15,
  'monthly': 12,
  'quarterly': 8,
  'rarely': 4,
  'never': 0,
};

const CONTENT_SCORES: Record<ContentFrequency, number> = {
  'daily': 8,
  'few-times-week': 7,
  'weekly': 5,
  'monthly': 3,
  'rarely': 1,
};

// Revenue score mappings
const REVENUE_SCORES: Record<RevenueRange, number> = {
  '0': 0,
  '0-1k': 5,
  '1k-5k': 8,
  '5k-10k': 11,
  '10k-50k': 13,
  '50k+': 15,
};

// ============================================================================
// SCORING FUNCTIONS
// ============================================================================

/**
 * Calculate score breakdown from intake data
 * If no audio uploaded, redistribute audioQuality weight proportionally
 */
export function calculateScoreBreakdown(
  data: ArtistIntakeData,
  hasAudioUpload: boolean
): ScoreBreakdown {
  let weights = { ...BASE_WEIGHTS };

  // Redistribute audio quality weight if no upload
  if (!hasAudioUpload) {
    const redistributedWeight = weights.audioQuality;
    weights.audioQuality = 0;
    
    // Distribute proportionally to other categories
    const otherCategories = ['audience', 'engagement', 'consistency', 'monetization', 'clarity', 'network'] as const;
    const totalOtherWeight = otherCategories.reduce((sum, cat) => sum + weights[cat], 0);
    
    otherCategories.forEach(cat => {
      weights[cat] += (weights[cat] / totalOtherWeight) * redistributedWeight;
    });
  }

  // Calculate individual scores
  const audioQuality = hasAudioUpload 
    ? estimateAudioQualityScore(data.workflow.uploadedTrack, data.workflow.selfMixMaster)
    : 0;

  const audience = calculateAudienceScore(data.audience);
  const engagement = calculateEngagementScore(data.audience);
  const consistency = calculateConsistencyScore(data.consistency);
  const monetization = calculateMonetizationScore(data.monetization);
  const clarity = calculateClarityScore(data.intent, data.workflow);
  const network = 5; // Placeholder for future integration

  // Normalize to weights
  return {
    audioQuality: Math.round((audioQuality / 20) * weights.audioQuality),
    audience: Math.round((audience / 15) * weights.audience),
    engagement: Math.round((engagement / 15) * weights.engagement),
    consistency: Math.round((consistency / 15) * weights.consistency),
    monetization: Math.round((monetization / 15) * weights.monetization),
    clarity: Math.round((clarity / 10) * weights.clarity),
    network: Math.round((network / 10) * weights.network),
  };
}

/**
 * Estimate audio quality score based on file and workflow
 */
function estimateAudioQualityScore(
  file: File | null | undefined,
  selfMixMaster: boolean
): number {
  let score = 10; // Base score for uploading

  // Bonus for file size (proxy for quality)
  if (file && file.size > 5 * 1024 * 1024) score += 3; // >5MB
  if (file && file.size > 10 * 1024 * 1024) score += 3; // >10MB

  // Deduction for self-mix/master (unless professional)
  if (selfMixMaster) score -= 3;

  return Math.min(20, Math.max(0, score));
}

/**
 * Calculate audience score from signals
 */
function calculateAudienceScore(audience: ArtistIntakeData['audience']): number {
  const listenerScore = AUDIENCE_SCORES[audience.monthlyListeners];
  const igScore = AUDIENCE_SCORES[audience.instagramFollowers] * 0.5;
  const tiktokScore = AUDIENCE_SCORES[audience.tiktokFollowers] * 0.3;

  // Weighted combination
  return Math.min(15, Math.round(listenerScore + igScore + tiktokScore));
}

/**
 * Calculate engagement score
 */
function calculateEngagementScore(audience: ArtistIntakeData['audience']): number {
  return ENGAGEMENT_SCORES[audience.avgViewsPerPost];
}

/**
 * Calculate consistency score
 */
function calculateConsistencyScore(consistency: ArtistIntakeData['consistency']): number {
  let score = RELEASE_SCORES[consistency.releaseFrequency];
  score += CONTENT_SCORES[consistency.contentFrequency];
  
  if (consistency.runsAds) score += 2;
  if (consistency.hasEmailList) score += 2;

  return Math.min(15, score);
}

/**
 * Calculate monetization score
 */
function calculateMonetizationScore(monetization: ArtistIntakeData['monetization']): number {
  if (!monetization.isMakingMoney) return 0;

  let score = REVENUE_SCORES[monetization.monthlyRevenue || '0'];

  // Bonus for diversified income
  const sourceCount = monetization.revenueSources?.length || 0;
  if (sourceCount >= 3) score += 3;
  else if (sourceCount >= 2) score += 2;
  else if (sourceCount >= 1) score += 1;

  return Math.min(15, score);
}

/**
 * Calculate clarity/intent score
 */
function calculateClarityScore(
  intent: ArtistIntakeData['intent'],
  workflow: ArtistIntakeData['workflow']
): number {
  let score = 5; // Base clarity score

  // Bonus for clear goal
  if (intent.primaryGoal) score += 3;

  // Self-awareness bonus for identifying struggles
  const struggleCount = workflow.biggestStruggles?.length || 0;
  if (struggleCount >= 1 && struggleCount <= 3) score += 2;

  return Math.min(10, score);
}

// ============================================================================
// TIER DETERMINATION
// ============================================================================

export function determineTier(totalScore: number): AIAnalysis['tier'] {
  if (totalScore >= 85) return 'ready';
  if (totalScore >= 70) return 'advanced';
  if (totalScore >= 40) return 'developing';
  return 'early';
}

export function getTierLabel(tier: AIAnalysis['tier']): string {
  const labels: Record<AIAnalysis['tier'], string> = {
    early: 'EARLY STAGE',
    developing: 'DEVELOPING',
    advanced: 'ADVANCED',
    ready: 'MARKET READY',
  };
  return labels[tier];
}

export function getTierColor(tier: AIAnalysis['tier']): string {
  const colors: Record<AIAnalysis['tier'], string> = {
    early: '#ef4444',    // Red
    developing: '#f59e0b', // Amber
    advanced: '#22c55e',  // Green
    ready: '#8b5cf6',    // Purple
  };
  return colors[tier];
}

// ============================================================================
// AI ANALYSIS GENERATION
// ============================================================================

/**
 * Generate AI-powered strategic analysis
 */
export function generateAIAnalysis(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown,
  totalScore: number
): AIAnalysis {
  const tier = determineTier(totalScore);
  
  return {
    score: totalScore,
    tier,
    strengths: generateStrengths(data, breakdown),
    weaknesses: generateWeaknesses(data, breakdown),
    strategicInsight: generateStrategicInsight(data, breakdown, totalScore),
    actionPlan: generateActionPlan(data, breakdown, tier),
    growthProjection: generateGrowthProjection(data, breakdown, totalScore),
  };
}

/**
 * Generate strengths based on high-scoring areas
 */
function generateStrengths(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown
): string[] {
  const strengths: string[] = [];

  if (breakdown.audience >= 10) {
    strengths.push('Established audience foundation with proven reach');
  }
  if (breakdown.engagement >= 10) {
    strengths.push('Strong content engagement indicates resonant material');
  }
  if (breakdown.consistency >= 10) {
    strengths.push('Disciplined release cadence builds algorithmic momentum');
  }
  if (breakdown.monetization >= 8) {
    strengths.push('Revenue-generating operation with validated business model');
  }
  if (breakdown.audioQuality >= 12) {
    strengths.push('Production quality meets industry release standards');
  }
  if (data.consistency.runsAds) {
    strengths.push('Paid acquisition infrastructure already in place');
  }
  if (data.consistency.hasEmailList) {
    strengths.push('Owned audience channel reduces platform dependency');
  }

  // Ensure at least 3 strengths, fill with generics if needed
  if (strengths.length < 3) {
    if (data.presence.spotifyUrl || data.presence.appleMusicUrl) {
      strengths.push('Multi-platform presence increases discoverability');
    }
    if (data.identity.role === 'producer' || data.identity.role === 'engineer') {
      strengths.push('Technical skillset creates competitive production advantage');
    }
  }

  return strengths.slice(0, 3);
}

/**
 * Generate weaknesses based on low-scoring areas
 */
function generateWeaknesses(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown
): string[] {
  const weaknesses: string[] = [];

  if (breakdown.audioQuality < 8 && data.workflow.selfMixMaster) {
    weaknesses.push('Self-produced audio limits competitive positioning');
  }
  if (breakdown.audience < 5) {
    weaknesses.push('Audience building in early phase — discovery is primary bottleneck');
  }
  if (breakdown.engagement < 5) {
    weaknesses.push('Content not yet achieving viral resonance metrics');
  }
  if (breakdown.consistency < 8) {
    weaknesses.push('Release inconsistency kills algorithmic momentum');
  }
  if (breakdown.monetization === 0) {
    weaknesses.push('No revenue streams — unsustainable without funding injection');
  }
  if (!data.consistency.runsAds && breakdown.audience < 8) {
    weaknesses.push('No paid acquisition — growth limited to organic reach');
  }
  if (!data.consistency.hasEmailList) {
    weaknesses.push('No owned audience — entirely platform-dependent');
  }

  return weaknesses.slice(0, 3);
}

/**
 * Generate strategic insight paragraph
 */
function generateStrategicInsight(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown,
  totalScore: number
): string {
  const tier = determineTier(totalScore);
  const goal = data.intent.primaryGoal;

  const insights: Record<typeof tier, Record<typeof goal, string>> = {
    early: {
      viral: "You're at the foundation stage. Focus on consistency first — the algorithm rewards regularity before it rewards quality. Post weekly, engage daily, and prioritize quantity over perfection until you hit 10k followers.",
      fanbase: "Your fanbase is nascent. The path forward is content velocity + collaboration. Partner with artists at your level, cross-pollinate audiences, and treat every release as a discovery event.",
      monetization: "Monetization at this stage is premature. The ROI on audience building exceeds revenue extraction 10x. Build to 10k true fans first, then introduce low-friction monetization.",
      placements: "Placements require either heat (you don't have yet) or relationships (you need to build). Focus on creating undeniable tracks first — the placements follow the buzz.",
      sound: "Developing your sound is the right priority. Release frequently, gather feedback ruthlessly, and iterate. Your sonic identity crystallizes through volume, not perfectionism.",
      industry: "Industry recognition follows traction. Stop networking, start creating. The calls come when the numbers justify them.",
    },
    developing: {
      viral: "You have momentum. To go viral, you need to study what's working in your niche and amplify it with paid distribution. Your content is good enough — now optimize for shareability.",
      fanbase: "You're in the scaling phase. Double down on what's working, systematize your content workflow, and start segmenting your audience for deeper engagement.",
      monetization: "Time to introduce revenue layers. Start with low-friction offers (digital products, memberships) before high-ticket services. Your audience is warm enough.",
      placements: "You have enough heat for cold outreach. Craft a tight pitch, target the right curators, and follow up relentlessly. Your numbers justify the conversation.",
      sound: "Your sound is emerging. Now refine it through collaboration and feedback. Work with producers and engineers who can elevate your vision.",
      industry: "Industry doors start opening at this level. Be selective — align with partners who accelerate your trajectory, not just attach their name to yours.",
    },
    advanced: {
      viral: "You're one track away from breakout. The infrastructure is there — now optimize for the moment. Build your release playbook, align your partners, and execute flawlessly.",
      fanbase: "You have a real fanbase. Shift from acquisition to retention. Deepen the relationship with exclusive content, direct communication, and community building.",
      monetization: "Scale your revenue architecture. Diversify income streams, build systems for passive revenue, and consider team expansion to handle operations.",
      placements: "You should be getting inbound placement interest. If not, your targeting is off. The industry respects numbers — make sure they know yours.",
      sound: "Your sound is your moat. Protect it while evolving it. Collaborate with artists who challenge you, not just those who complement you.",
      industry: "You're becoming a player. Be strategic about partnerships, equity, and long-term positioning. Think like a business, not just an artist.",
    },
    ready: {
      viral: "You're positioned for sustained success. Focus on catalog depth and legacy thinking. One viral moment is nice; a decade-long career is the goal.",
      fanbase: "You have a sustainable fanbase operation. Optimize for longevity, artist development, and generational impact. Consider what you want to be known for in 20 years.",
      monetization: "You're running a real business. Build infrastructure, diversify revenue, and create generational wealth. Think ownership, not just income.",
      placements: "You're a priority target for curators and sync. Be selective, negotiate hard, and build relationships that compound over years.",
      sound: "Your sound is iconic. Evolve it carefully, protect your catalog, and mentor the next generation. Your artistic legacy is being written now.",
      industry: "You're an industry force. Use your position to open doors for others, shape culture, and build institutions. Success is a responsibility.",
    },
  };

  return insights[tier][goal] || insights[tier]['fanbase'];
}

/**
 * Generate action plan based on tier and data
 */
function generateActionPlan(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown,
  tier: AIAnalysis['tier']
): string[] {
  const actions: string[] = [];

  // Audio quality actions
  if (breakdown.audioQuality < 10 && data.workflow.selfMixMaster) {
    actions.push('Get professional mix/master — the ROI on release quality is immediate');
  }

  // Consistency actions
  if (breakdown.consistency < 10) {
    actions.push('Lock in a release schedule and stick to it for 90 days minimum');
  }

  // Audience actions
  if (breakdown.audience < 8) {
    actions.push('Post daily content — consistency beats virality in the algorithm');
  }

  // Monetization actions
  if (breakdown.monetization === 0) {
    actions.push('Set up Linktree with monetization links — low-hanging revenue');
  }

  // Strategic actions based on tier
  if (tier === 'early') {
    actions.push('Collaborate with 5 artists at your level this quarter');
    actions.push('Study 3 successful artists in your niche — reverse engineer their playbook');
  } else if (tier === 'developing') {
    actions.push('Introduce one revenue stream this month (digital product, membership, etc.)');
    actions.push('Build an email list — start with a simple landing page');
  } else if (tier === 'advanced') {
    actions.push('Systematize your content workflow — hire help if needed');
    actions.push('Strategize your next release as a "breakout" campaign');
  } else {
    actions.push('Build your team infrastructure for scale');
    actions.push('Develop your next artist or producer — legacy thinking');
  }

  return actions.slice(0, 5);
}

/**
 * Generate growth projection
 */
function generateGrowthProjection(
  data: ArtistIntakeData,
  breakdown: ScoreBreakdown,
  totalScore: number
): GrowthProjection {
  const currentTrajectory = calculateTrajectory(breakdown);
  const optimizedPotential = calculateOptimizedPotential(breakdown, data);
  
  const bottlenecks = [
    breakdown.consistency < 8 && 'Release inconsistency',
    breakdown.audioQuality < 10 && 'Production quality ceiling',
    breakdown.audience < 5 && 'Audience discovery stalled',
    breakdown.engagement < 5 && 'Content not resonating',
    breakdown.monetization === 0 && 'No revenue model',
    !data.consistency.runsAds && 'No paid acquisition',
  ].filter(Boolean) as string[];

  const opportunities = [
    breakdown.consistency >= 10 && 'Algorithmic momentum from consistency',
    breakdown.audience >= 10 && 'Audience ready for monetization',
    breakdown.engagement >= 10 && 'Viral-ready content resonance',
    data.consistency.runsAds && 'Scalable paid acquisition',
    data.consistency.hasEmailList && 'Owned audience for direct monetization',
  ].filter(Boolean) as string[];

  return {
    currentTrajectory,
    optimizedPotential,
    bottleneck: bottlenecks[0] || 'None identified',
    opportunity: opportunities[0] || 'General growth potential',
  };
}

function calculateTrajectory(breakdown: ScoreBreakdown): GrowthProjection['currentTrajectory'] {
  const weightedScore = 
    breakdown.consistency * 2 + 
    breakdown.audience + 
    breakdown.engagement;

  if (weightedScore >= 40) return 'fast';
  if (weightedScore >= 25) return 'steady';
  if (weightedScore >= 15) return 'slow';
  return 'stagnant';
}

function calculateOptimizedPotential(
  breakdown: ScoreBreakdown,
  data: ArtistIntakeData
): GrowthProjection['optimizedPotential'] {
  const hasMomentum = breakdown.consistency >= 10;
  hasMomentum && breakdown.audience >= 8;
  const hasQuality = breakdown.audioQuality >= 12;
  const hasSystems = data.consistency.runsAds || data.consistency.hasEmailList;

  if (hasMomentum && hasQuality && hasSystems) return 'viral';
  if (hasMomentum && hasQuality) return 'breakout';
  if (hasMomentum || hasQuality) return 'strong';
  return 'moderate';
}

// ============================================================================
// PLAYER CARD GENERATION
// ============================================================================

export function generatePlayerCard(
  data: ArtistIntakeData,
  hasAudioUpload: boolean
): ArtistPlayerCard {
  const breakdown = calculateScoreBreakdown(data, hasAudioUpload);
  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const analysis = generateAIAnalysis(data, breakdown, totalScore);

  return {
    artistName: data.identity.artistName,
    role: data.identity.role,
    score: totalScore,
    tier: getTierLabel(analysis.tier),
    breakdown,
    analysis,
    submittedAt: new Date(),
  };
}

// ============================================================================
// CSV EXPORT
// ============================================================================

export function generateCSVExport(card: ArtistPlayerCard, data: ArtistIntakeData): string {
  const headers = [
    'Artist Name',
    'Role',
    'Email',
    'Score',
    'Tier',
    'Audio Quality',
    'Audience',
    'Engagement',
    'Consistency',
    'Monetization',
    'Clarity',
    'Network',
    'Primary Goal',
    'Monthly Listeners',
    'IG Followers',
    'TikTok Followers',
    'Making Money',
    'Monthly Revenue',
    'Self Mix/Master',
    'Biggest Struggles',
    'Spotify URL',
    'YouTube URL',
    'Latest Track',
    'Submitted At',
  ];

  const values = [
    card.artistName,
    card.role,
    data.identity.email,
    card.score,
    card.tier,
    card.breakdown.audioQuality,
    card.breakdown.audience,
    card.breakdown.engagement,
    card.breakdown.consistency,
    card.breakdown.monetization,
    card.breakdown.clarity,
    card.breakdown.network,
    data.intent.primaryGoal,
    data.audience.monthlyListeners,
    data.audience.instagramFollowers,
    data.audience.tiktokFollowers,
    data.monetization.isMakingMoney,
    data.monetization.monthlyRevenue || '0',
    data.workflow.selfMixMaster,
    data.workflow.biggestStruggles.join(', '),
    data.presence.spotifyUrl || '',
    data.presence.youtubeUrl,
    data.presence.latestTrackUrl,
    card.submittedAt.toISOString(),
  ];

  return [headers.join(','), values.join(',')].join('\n');
}

// ============================================================================
// ROUTING LOGIC
// ============================================================================

export interface RoutingRecommendation {
  score: number;
  tier: AIAnalysis['tier'];
  primaryCTA: {
    label: string;
    path: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  secondaryCTA?: {
    label: string;
    path: string;
    variant: 'primary' | 'secondary' | 'outline';
  };
  resources: string[];
}

export function getRoutingRecommendation(score: number): RoutingRecommendation {
  const tier = determineTier(score);

  const recommendations: Record<AIAnalysis['tier'], RoutingRecommendation> = {
    early: {
      score,
      tier,
      primaryCTA: {
        label: 'FIX MY SOUND',
        path: '/mix',
        variant: 'primary',
      },
      secondaryCTA: {
        label: 'BEGINNER ROADMAP',
        path: '/services',
        variant: 'outline',
      },
      resources: [
        'Free: Track Health Check',
        '$50: AI Mix & Master',
        'Artist Development Program',
      ],
    },
    developing: {
      score,
      tier,
      primaryCTA: {
        label: 'BOOK STRATEGY CALL',
        path: '/audit-call',
        variant: 'primary',
      },
      secondaryCTA: {
        label: 'GROWTH PLAN',
        path: '/marketing-package',
        variant: 'outline',
      },
      resources: [
        '$150: Growth Audit Call',
        '$500: Marketing Package',
        'Release Execution Program',
      ],
    },
    advanced: {
      score,
      tier,
      primaryCTA: {
        label: 'PRIORITY ACCESS',
        path: '/apply',
        variant: 'primary',
      },
      secondaryCTA: {
        label: 'PARTNERSHIPS',
        path: '/services',
        variant: 'outline',
      },
      resources: [
        'Artist Partnership Program',
        'Label Services',
        'Strategic Advisory',
      ],
    },
    ready: {
      score,
      tier,
      primaryCTA: {
        label: 'EXECUTIVE PARTNERSHIP',
        path: '/apply?priority=executive',
        variant: 'primary',
      },
      secondaryCTA: {
        label: 'CATALOG OPTIMIZATION',
        path: '/services',
        variant: 'outline',
      },
      resources: [
        'Executive Partnership',
        'Catalog Optimization',
        'Strategic Advisory',
      ],
    },
  };

  return recommendations[tier];
}
