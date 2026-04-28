import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  ChevronRight, 
  Sparkles,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArtistIntakeWizard } from '@/components/ArtistIntakeWizard';
import { ArtistPlayerCardView } from '@/components/ArtistPlayerCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import type { ArtistIntakeData, ArtistPlayerCard } from '@/types/artistIntelligence';
import { generatePlayerCard } from '@/lib/artistScoring';

type ViewState = 'landing' | 'intake' | 'processing' | 'result';

export default function ArtistIntelligencePage() {
  const [view, setView] = useState<ViewState>('landing');
  const [intakeData, setIntakeData] = useState<ArtistIntakeData | null>(null);
  const [playerCard, setPlayerCard] = useState<ArtistPlayerCard | null>(null);
  const [hasAudioUpload, setHasAudioUpload] = useState(false);

  const handleStart = () => {
    setView('intake');
  };

  const handleComplete = (data: ArtistIntakeData, audioUpload: boolean) => {
    setIntakeData(data);
    setHasAudioUpload(audioUpload);
    setView('processing');

    // Simulate processing delay for dramatic effect
    setTimeout(() => {
      const card = generatePlayerCard(data, audioUpload);
      setPlayerCard(card);
      setView('result');
    }, 2000);
  };

  const handleReset = () => {
    setView('landing');
    setIntakeData(null);
    setPlayerCard(null);
    setHasAudioUpload(false);
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-16">
        {/* Background Grid */}
        <div className="fixed inset-0 pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <LandingView key="landing" onStart={handleStart} />
          )}
          {view === 'intake' && (
            <IntakeView 
              key="intake" 
              onComplete={handleComplete}
              onCancel={() => setView('landing')}
            />
          )}
          {view === 'processing' && (
            <ProcessingView key="processing" />
          )}
          {view === 'result' && playerCard && intakeData && (
            <ResultView 
              key="result" 
              card={playerCard}
              intakeData={intakeData}
              onReset={handleReset}
            />
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
}

// ============================================================================
// LANDING VIEW
// ============================================================================

function LandingView({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-24"
    >
      <div className="max-w-3xl mx-auto text-center">
        {/* Terminal-style decoration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-white/10 bg-white/5"
        >
          <Terminal className="w-4 h-4 text-white/50" />
          <span className="font-mono text-xs text-white/50 tracking-wider uppercase">
            NewCulture Artist Intelligence System v1.0
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 uppercase"
        >
          Quantify Your
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/50">
            Artist Potential
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-white/50 font-mono mb-4"
        >
          Get your Artist Intelligence Score, strategic breakdown, and exact next moves
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-white/30 font-mono mb-12"
        >
          Takes ~2 minutes. No fluff.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            size="lg"
            onClick={onStart}
            className="font-mono text-sm tracking-[0.2em] uppercase bg-white text-black hover:bg-white/90 px-12 py-8 text-lg group"
          >
            Start Analysis
            <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { icon: BarChart3, label: '100-Point Score' },
            { icon: Sparkles, label: 'AI Analysis' },
            { icon: Terminal, label: 'Strategic Plan' },
            { icon: ChevronRight, label: 'Next Steps' },
          ].map((feature, i) => (
            <div 
              key={feature.label}
              className="p-4 border border-white/10 text-center"
            >
              <feature.icon className="w-5 h-5 mx-auto mb-2 text-white/30" />
              <span className="font-mono text-xs text-white/50">{feature.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// INTAKE VIEW
// ============================================================================

function IntakeView({ 
  onComplete, 
  onCancel 
}: { 
  onComplete: (data: ArtistIntakeData, hasAudio: boolean) => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-4rem)] px-6 py-12"
    >
      <div className="max-w-2xl mx-auto">
        <ArtistIntakeWizard 
          onComplete={onComplete}
          onCancel={onCancel}
        />
      </div>
    </motion.div>
  );
}

// ============================================================================
// PROCESSING VIEW
// ============================================================================

function ProcessingView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6"
    >
      <div className="text-center">
        {/* Animated Terminal */}
        <div className="mb-8 p-6 border border-white/20 bg-black font-mono text-xs text-green-400 w-80 mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {`> analyzing_audio_profile...`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {`> processing_audience_signals...`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {`> calculating_engagement_metrics...`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {`> generating_strategic_insights...`}
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-2"
          >
            <span className="animate-pulse">{`> compiling_player_card...`}</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 border border-white/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/20 border-t-white"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white uppercase mb-2">
            Analyzing Your Data
          </h2>
          <p className="font-mono text-sm text-white/50">
            Computing your Artist Intelligence Score...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// RESULT VIEW
// ============================================================================

function ResultView({ 
  card, 
  intakeData,
  onReset 
}: { 
  card: ArtistPlayerCard;
  intakeData: ArtistIntakeData;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-[calc(100vh-4rem)] px-6 py-12"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header with reset */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-white/50" />
            <span className="font-mono text-xs tracking-wider text-white/50 uppercase">
              Your Artist Intelligence Report
            </span>
          </div>
          <Button
            variant="outline"
            onClick={onReset}
            className="font-mono text-xs tracking-wider uppercase border-white/20 text-white/70 hover:bg-white/5"
          >
            Start Over
          </Button>
        </div>

        {/* Player Card */}
        <ArtistPlayerCardView
          card={card}
          intakeData={intakeData}
          onShare={() => {
            // Share functionality - copy to clipboard or open share dialog
            if (navigator.share) {
              navigator.share({
                title: `${card.artistName} - Artist Intelligence Score: ${card.score}`,
                text: `I scored ${card.score}/100 on my Artist Intelligence assessment. ${card.tier} tier.`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(
                `${card.artistName} - Artist Intelligence Score: ${card.score}/100 (${card.tier})`
              );
            }
          }}
        />
      </div>
    </motion.div>
  );
}
