import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  DollarSign, 
  Clock, 
  Users, 
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  ChevronRight,
  Music,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Rocket,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { ArtistPlayerCard as PlayerCardData, ArtistIntakeData } from '@/types/artistIntelligence';
import { getRoutingRecommendation, generateCSVExport, type RoutingRecommendation } from '@/lib/artistScoring';
import { Link } from 'react-router-dom';

interface ArtistPlayerCardProps {
  card: PlayerCardData;
  intakeData: ArtistIntakeData;
  onShare?: () => void;
  onDownload?: () => void;
}

export function ArtistPlayerCardView({ card, intakeData, onShare, onDownload }: ArtistPlayerCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [routing, setRouting] = useState<RoutingRecommendation | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Spring animation for score
  const scoreSpring = useSpring(0, { stiffness: 50, damping: 20 });
  const scoreValue = useTransform(scoreSpring, (v) => Math.round(v));

  useEffect(() => {
    scoreSpring.set(card.score);
    const unsubscribe = scoreValue.on("change", (v) => setAnimatedScore(v));
    return () => unsubscribe();
  }, [card.score, scoreSpring, scoreValue]);

  useEffect(() => {
    setRouting(getRoutingRecommendation(card.score));
    // Delay details reveal for dramatic effect
    const timer = setTimeout(() => setShowDetails(true), 1500);
    return () => clearTimeout(timer);
  }, [card.score]);

  // Score color based on tier
  const getScoreColor = () => {
    if (card.score >= 85) return 'from-violet-500 to-purple-600';
    if (card.score >= 70) return 'from-emerald-500 to-green-600';
    if (card.score >= 40) return 'from-amber-500 to-orange-600';
    return 'from-rose-500 to-red-600';
  };

  const getScoreGlow = () => {
    if (card.score >= 85) return 'shadow-violet-500/30';
    if (card.score >= 70) return 'shadow-emerald-500/30';
    if (card.score >= 40) return 'shadow-amber-500/30';
    return 'shadow-rose-500/30';
  };

  const handleExportCSV = () => {
    const csv = generateCSVExport(card, intakeData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.artistName.replace(/\s+/g, '_')}_artist_intelligence.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Main Player Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden bg-black border border-white/20"
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }} />
        </div>

        {/* Glow Effect */}
        <motion.div
          className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-30 bg-gradient-to-br ${getScoreColor()}`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Header */}
        <div className="relative p-8 border-b border-white/10">
          <div className="flex items-start justify-between">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-2 mb-2"
              >
                <Sparkles className="w-4 h-4 text-white/50" />
                <span className="font-mono text-xs tracking-[0.3em] text-white/50 uppercase">
                  Artist Intelligence Report
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase"
              >
                {card.artistName}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 font-mono text-sm text-white/50 uppercase tracking-wider"
              >
                {card.role}
              </motion.p>
            </div>

            {/* Score Circle */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
              className={`relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-white/10 bg-black shadow-2xl ${getScoreGlow()}`}
            >
              {/* Animated Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <motion.circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className={`text-transparent bg-gradient-to-br ${getScoreColor()}`}
                  style={{
                    strokeDasharray: 365,
                    strokeDashoffset: 365,
                  }}
                  animate={{ strokeDashoffset: 365 - (365 * animatedScore) / 100 }}
                  transition={{ duration: 2, ease: "easeOut" }}
                />
              </svg>
              <div className="text-center">
                <motion.span 
                  className={`block text-4xl font-bold bg-gradient-to-br ${getScoreColor()} bg-clip-text text-transparent`}
                >
                  {animatedScore}
                </motion.span>
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">/ 100</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tier Badge */}
        <div className="relative px-8 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center gap-4"
            >
              <span className="font-mono text-xs text-white/50 uppercase tracking-wider">Tier</span>
              <span className={`px-4 py-2 font-mono text-sm font-bold tracking-wider border bg-black ${
                card.score >= 85 ? 'border-violet-500 text-violet-400' :
                card.score >= 70 ? 'border-emerald-500 text-emerald-400' :
                card.score >= 40 ? 'border-amber-500 text-amber-400' :
                'border-rose-500 text-rose-400'
              }`}>
                {card.tier}
              </span>
            </motion.div>
            <div className="flex items-center gap-4">
              {card.recoupableEnrichment && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.75 }}
                  className="flex items-center gap-2 px-3 py-1 border border-amber-500/30 bg-amber-500/5"
                >
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-amber-500 uppercase tracking-wider">
                    Live Intelligence
                  </span>
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="font-mono text-xs text-white/30"
              >
                {card.submittedAt.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="relative p-8">
          <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/50">
            Performance Breakdown
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <ScoreBar 
              label="Audio Quality" 
              score={card.breakdown.audioQuality} 
              max={20}
              color="from-rose-500 to-red-500"
              icon={Music}
              delay={0.9}
            />
            <ScoreBar 
              label="Audience" 
              score={card.breakdown.audience} 
              max={15}
              color="from-violet-500 to-purple-500"
              icon={Users}
              delay={1.0}
            />
            <ScoreBar 
              label="Engagement" 
              score={card.breakdown.engagement} 
              max={15}
              color="from-blue-500 to-cyan-500"
              icon={TrendingUp}
              delay={1.1}
            />
            <ScoreBar 
              label="Consistency" 
              score={card.breakdown.consistency} 
              max={15}
              color="from-amber-500 to-orange-500"
              icon={Clock}
              delay={1.2}
            />
            <ScoreBar 
              label="Monetization" 
              score={card.breakdown.monetization} 
              max={15}
              color="from-emerald-500 to-green-500"
              icon={DollarSign}
              delay={1.3}
            />
            <ScoreBar 
              label="Clarity / Intent" 
              score={card.breakdown.clarity} 
              max={10}
              color="from-pink-500 to-rose-500"
              icon={Target}
              delay={1.4}
            />
          </div>
        </div>
      </motion.div>

      {/* AI Analysis Section */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 md:grid-cols-2"
          >
            {/* Live Intelligence Panel */}
            {card.recoupableEnrichment && (
              <div className="md:col-span-2 p-6 border border-amber-500/30 bg-amber-500/5">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500">
                    Live Intelligence Data
                  </h3>
                  <span className="ml-auto font-mono text-[10px] text-white/30">
                    Synced {new Date(card.recoupableEnrichment.lastSynced).toLocaleTimeString()}
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border border-amber-500/20">
                    <div className="font-mono text-2xl text-white mb-1">
                      {card.recoupableEnrichment.audienceSnapshot.followers.toLocaleString()}
                    </div>
                    <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                      Total Followers
                    </div>
                    <div className={`font-mono text-xs mt-1 ${
                      card.recoupableEnrichment.audienceSnapshot.growthRate > 15 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      +{card.recoupableEnrichment.audienceSnapshot.growthRate}% monthly
                    </div>
                  </div>
                  <div className="p-4 border border-amber-500/20">
                    <div className="font-mono text-2xl text-white mb-1">
                      {card.recoupableEnrichment.contentPerformance.viralScore}
                    </div>
                    <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                      Viral Potential Score
                    </div>
                    <div className="font-mono text-xs mt-1 text-white/50">
                      {card.recoupableEnrichment.contentPerformance.avgEngagement.toFixed(1)}% avg engagement
                    </div>
                  </div>
                  <div className="p-4 border border-amber-500/20">
                    <div className="font-mono text-lg text-white mb-1 truncate">
                      {card.recoupableEnrichment.audienceSnapshot.topCities.slice(0, 2).join(', ')}
                    </div>
                    <div className="font-mono text-[10px] text-white/50 uppercase tracking-wider">
                      Top Markets
                    </div>
                    {card.recoupableEnrichment.competitivePosition.similarArtists.length > 0 && (
                      <div className="font-mono text-[10px] mt-1 text-amber-500/70 truncate">
                        vs {card.recoupableEnrichment.competitivePosition.similarArtists[0]}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Strategic Insight */}
            <div className="p-6 border border-white/20 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-amber-400" />
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Strategic Insight
                </h3>
              </div>
              <p className="font-mono text-sm leading-relaxed text-white/80">
                {card.analysis.strategicInsight}
              </p>
            </div>

            {/* Growth Projection */}
            <div className="p-6 border border-white/20 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Growth Projection
                </h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">Current Trajectory</span>
                  <span className={`font-mono text-xs uppercase ${
                    card.analysis.growthProjection.currentTrajectory === 'fast' ? 'text-emerald-400' :
                    card.analysis.growthProjection.currentTrajectory === 'steady' ? 'text-amber-400' :
                    'text-rose-400'
                  }`}>
                    {card.analysis.growthProjection.currentTrajectory.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white/50">If Optimized</span>
                  <span className="font-mono text-xs uppercase text-emerald-400">
                    {card.analysis.growthProjection.optimizedPotential.replace('-', ' ')} potential
                  </span>
                </div>
                <Separator className="bg-white/10" />
                <p className="font-mono text-xs text-white/40">
                  <span className="text-white/60">Bottleneck:</span> {card.analysis.growthProjection.bottleneck}
                </p>
              </div>
            </div>

            {/* Strengths */}
            <div className="p-6 border border-white/20 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Strengths
                </h3>
              </div>
              <ul className="space-y-2">
                {card.analysis.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1 h-1 mt-2 rounded-full bg-emerald-400" />
                    <span className="font-mono text-sm text-white/70">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-6 border border-white/20 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Areas to Address
                </h3>
              </div>
              <ul className="space-y-2">
                {card.analysis.weaknesses.map((weakness, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + i * 0.1 }}
                    className="flex items-start gap-2"
                  >
                    <span className="w-1 h-1 mt-2 rounded-full bg-rose-400" />
                    <span className="font-mono text-sm text-white/70">{weakness}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Action Plan */}
            <div className="md:col-span-2 p-6 border border-white/20 bg-black">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-white/70">
                  Action Plan
                </h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {card.analysis.actionPlan.map((action, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8 + i * 0.1 }}
                    className="flex items-start gap-3 p-4 border border-white/10"
                  >
                    <span className="flex items-center justify-center w-6 h-6 text-xs font-mono border border-white/20 text-white/50">
                      {i + 1}
                    </span>
                    <span className="font-mono text-sm text-white/80">{action}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Routing & CTAs */}
      <AnimatePresence>
        {showDetails && routing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="space-y-6"
          >
            {/* Recommended Actions */}
            <div className="p-8 border border-white/20 bg-gradient-to-br from-white/5 to-transparent">
              <h3 className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-white/70 text-center">
                Recommended Next Steps
              </h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to={routing.primaryCTA.path}>
                  <Button
                    size="lg"
                    className="font-mono text-sm tracking-wider uppercase bg-white text-black hover:bg-white/90 px-8 py-6"
                  >
                    {routing.primaryCTA.label}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                {routing.secondaryCTA && (
                  <Link to={routing.secondaryCTA.path}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="font-mono text-sm tracking-wider uppercase border-white/20 text-white hover:bg-white/10 px-8 py-6"
                    >
                      {routing.secondaryCTA.label}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Resources */}
            <div className="grid gap-4 md:grid-cols-3">
              {routing.resources.map((resource, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2.2 + i * 0.1 }}
                  className="p-4 border border-white/10 text-center"
                >
                  <span className="font-mono text-xs text-white/50">{resource}</span>
                </motion.div>
              ))}
            </div>

            {/* Export Actions */}
            <div className="flex items-center justify-center gap-4 pt-6 border-t border-white/10">
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="font-mono text-xs tracking-wider uppercase border-white/20 text-white/70 hover:bg-white/5"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={onShare}
                className="font-mono text-xs tracking-wider uppercase border-white/20 text-white/70 hover:bg-white/5"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Card
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Score Bar Component
function ScoreBar({ 
  label, 
  score, 
  max, 
  color, 
  icon: Icon,
  delay 
}: { 
  label: string; 
  score: number; 
  max: number; 
  color: string;
  icon: React.ElementType;
  delay: number;
}) {
  const percentage = (score / max) * 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-white/30" />
          <span className="font-mono text-xs text-white/50 uppercase">{label}</span>
        </div>
        <span className="font-mono text-xs text-white/70">
          {score}<span className="text-white/30">/{max}</span>
        </span>
      </div>
      <div className="h-2 bg-white/10 overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </motion.div>
  );
}
