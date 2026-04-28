/**
 * Blueprint Integration Service
 * Connects Recoupable blueprint generation to paid service workflows
 * - Audit Call ($150): Auto-generate blueprint on booking
 * - Marketing Package ($500): Populate targeting from Recoupable
 * - Strategy Roadmap ($5K+): Full competitive analysis
 */

import { RecoupableService } from './recoupable';
import type { ArtistIntakeData } from '@/types/artistIntelligence';

export interface BlueprintContext {
  artistName: string;
  genre?: string;
  currentFollowers?: number;
  goals: string[];
  budget?: string;
  timeline?: string;
  strengths?: string[];
  challenges?: string[];
  serviceTier: 'audit' | 'marketing' | 'strategy';
}

export interface GeneratedBlueprint {
  id: string;
  createdAt: Date;
  context: BlueprintContext;
  recoupableData: any;
  blueprint: {
    rolloutPhases: Array<{
      phase: string;
      duration: string;
      focus: string;
      actions: string[];
      contentIdeas?: string[];
    }>;
    contentStrategy: {
      themes: string[];
      postingSchedule: string;
      platformPriorities: string[];
    };
    targeting: {
      primaryCities: string[];
      similarArtistsToTarget: string[];
      demographics?: string;
    };
    budgetAllocation?: {
      production: number;
      marketing: number;
      operations: number;
    };
  };
  insights: string[];
  nextSteps: string[];
}

/**
 * Generate a blueprint for a paid service engagement
 */
export async function generateServiceBlueprint(
  context: BlueprintContext
): Promise<GeneratedBlueprint | null> {
  try {
    // 1. Fetch Recoupable research with cache
    const recoupableData = await RecoupableService.researchArtistWithCache(
      context.artistName
    );

    if (!recoupableData) {
      console.warn(`[Blueprint] No Recoupable data for ${context.artistName}`);
      return null;
    }

    // 2. Generate blueprint via Recoupable API
    const blueprintResponse = await RecoupableService.generateBlueprint({
      artistName: context.artistName,
      genre: context.genre,
      currentFollowers: recoupableData.audience?.totalFollowers || context.currentFollowers,
      goals: context.goals,
      budgetRange: context.budget,
      timeline: context.timeline || '90 days',
      strengths: context.strengths,
      challenges: context.challenges,
    });

    if (!blueprintResponse) {
      return null;
    }

    // 3. Generate content ideas for retainer clients
    let contentIdeas: string[] = [];
    if (context.serviceTier !== 'audit') {
      const ideas = await RecoupableService.generateContentIdeas(
        context.artistName,
        5
      );
      contentIdeas = ideas?.map(i => i.concept) || [];
    }

    // 4. Enrich blueprint based on service tier
    const enrichedBlueprint = enrichForServiceTier(
      blueprintResponse,
      recoupableData,
      context,
      contentIdeas
    );

    // 5. Calculate lead score for internal prioritization
    const leadScore = RecoupableService.calculateLeadScore(recoupableData);

    return {
      id: `bp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      context,
      recoupableData,
      blueprint: enrichedBlueprint,
      insights: generateInsights(recoupableData, leadScore, context),
      nextSteps: generateNextSteps(context.serviceTier, leadScore),
    };
  } catch (error) {
    console.error('[Blueprint] Generation failed:', error);
    return null;
  }
}

/**
 * Enrich blueprint based on service tier requirements
 */
function enrichForServiceTier(
  baseBlueprint: any,
  recoupableData: any,
  context: BlueprintContext,
  contentIdeas: string[]
): GeneratedBlueprint['blueprint'] {
  const audience = recoupableData.audience;
  const content = recoupableData.content;
  const landscape = recoupableData.landscape;
  const rollout = recoupableData.rollout;

  // Base rollout phases
  const rolloutPhases = [
    {
      phase: 'Foundation',
      duration: '2 weeks',
      focus: 'Audience audit & positioning refinement',
      actions: [
        'Analyze top-performing content themes',
        'Identify engagement patterns by city/time',
        'Refine artist positioning vs. competitors',
      ],
      contentIdeas: contentIdeas.slice(0, 2),
    },
    {
      phase: 'Activation',
      duration: '4 weeks',
      focus: 'Content velocity & community building',
      actions: [
        'Implement optimal posting schedule',
        'Launch engagement pods in top cities',
        'Test viral content formats',
      ],
      contentIdeas: contentIdeas.slice(2, 4),
    },
    {
      phase: 'Growth',
      duration: '4 weeks',
      focus: 'Paid amplification & partnerships',
      actions: [
        'Deploy targeted ads to high-engagement cities',
        'Initiate collaboration outreach',
        'Launch email list building campaign',
      ],
      contentIdeas: contentIdeas.slice(4),
    },
  ];

  // Add budget allocation for marketing+ tiers
  let budgetAllocation;
  if (context.serviceTier !== 'audit') {
    budgetAllocation = {
      production: context.serviceTier === 'strategy' ? 40 : 30,
      marketing: context.serviceTier === 'strategy' ? 45 : 50,
      operations: context.serviceTier === 'strategy' ? 15 : 20,
    };
  }

  // Add strategy tier deep dives
  if (context.serviceTier === 'strategy') {
    rolloutPhases.push({
      phase: 'Scale',
      duration: '8 weeks',
      focus: 'System expansion & automation',
      actions: [
        'Implement CRM for fan management',
        'Launch merchandise line',
        'Book regional tour based on top cities',
        'Establish sync licensing pipeline',
      ],
    });
  }

  return {
    rolloutPhases,
    contentStrategy: {
      themes: content?.topPerformingPosts?.[0]?.themes || ['Behind the scenes', 'Studio sessions'],
      postingSchedule: rollout?.optimalReleaseDay 
        ? `${rollout.optimalReleaseDay}s + 3x weekly`
        : 'Tuesdays + 3x weekly',
      platformPriorities: audience?.topCities?.length > 3 
        ? ['TikTok', 'Instagram', 'Spotify'] 
        : ['Instagram', 'TikTok'],
    },
    targeting: {
      primaryCities: audience?.topCities?.slice(0, 3).map((c: any) => c.city) || [],
      similarArtistsToTarget: landscape?.similarArtists?.slice(0, 3).map((a: any) => a.name) || [],
      demographics: landscape?.similarArtists?.[0]?.audienceDemographics,
    },
    budgetAllocation,
  };
}

/**
 * Generate insights from Recoupable data
 */
function generateInsights(
  recoupableData: any,
  leadScore: any,
  context: BlueprintContext
): string[] {
  const insights: string[] = [];
  const audience = recoupableData.audience;
  const content = recoupableData.content;

  // Audience insights
  if (audience?.growthRate > 20) {
    insights.push(`High-velocity growth detected: ${audience.growthRate}% monthly — strike while momentum is hot`);
  }
  
  if (audience?.topCities?.length > 0) {
    const topCity = audience.topCities[0];
    insights.push(`Geographic concentration in ${topCity.city} — consider local activation`);
  }

  // Content insights
  if (content?.topPerformingPosts?.[0]?.viralScore > 80) {
    insights.push('Viral content pattern identified — can be replicated and scaled');
  }

  // Competitive insights
  if (recoupableData.landscape?.similarArtists?.length > 5) {
    insights.push('Clear competitive set defined — differentiation opportunity available');
  }

  // Lead score insights
  if (leadScore.isHighValue) {
    insights.push(`Lead score: ${leadScore.totalScore}/100 — HIGH PRIORITY client`);
  }

  return insights;
}

/**
 * Generate next steps based on service tier
 */
function generateNextSteps(
  serviceTier: string,
  leadScore: any
): string[] {
  const steps: string[] = [];

  if (serviceTier === 'audit') {
    steps.push(
      'Schedule 60-minute strategy call within 48 hours',
      'Prepare Recoupable dashboard access for client',
      'Send pre-read: Competitive landscape analysis'
    );
  } else if (serviceTier === 'marketing') {
    steps.push(
      'Set up Recoupable tracking for 90-day monitoring',
      'Build ad targeting audiences from top cities',
      'Create content calendar with 4-week rollout',
      'Establish weekly reporting cadence'
    );
  } else if (serviceTier === 'strategy') {
    steps.push(
      'Kickoff: 2-hour deep-dive workshop',
      'Deliver full blueprint within 7 days',
      'Establish monthly strategy reviews',
      'Connect to industry partners based on analysis'
    );
  }

  if (leadScore.isHighValue) {
    steps.unshift('🎯 FLAG: High-value lead — prioritize in pipeline');
  }

  return steps;
}

/**
 * Store blueprint to database (to be implemented with Supabase)
 */
export async function storeBlueprint(
  blueprint: GeneratedBlueprint,
  clientId: string
): Promise<{ success: boolean; error?: string }> {
  // This would integrate with Supabase
  // For now, just log it
  console.log('[Blueprint] Storing for client:', clientId, blueprint.id);
  return { success: true };
}

/**
 * Notify team of high-value lead
 */
export function notifyHighValueLead(
  artistName: string,
  leadScore: number,
  blueprintId: string
): void {
  // This would integrate with Slack webhook
  console.log(`🔥 HIGH-VALUE LEAD: ${artistName} (Score: ${leadScore}) - Blueprint: ${blueprintId}`);
}

// Service export
export const BlueprintService = {
  generateServiceBlueprint,
  storeBlueprint,
  notifyHighValueLead,
};
