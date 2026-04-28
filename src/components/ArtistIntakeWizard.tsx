import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Music, 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign, 
  Mic2, 
  Zap,
  Check,
  Upload,
  Globe,
  Mail,
  User,
  Hash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import type { 
  ArtistIntakeData, 
  ArtistRole, 
  AudienceRange, 
  EngagementRange,
  ReleaseFrequency,
  ContentFrequency,
  RevenueRange,
  RevenueSource,
  PrimaryGoal,
  StruggleArea
} from '@/types/artistIntelligence';

const TOTAL_STEPS = 7;

const STEP_ICONS = [
  User,
  Music,
  Users,
  TrendingUp,
  DollarSign,
  Mic2,
  Target,
];

const STEP_TITLES = [
  'Identity',
  'Presence',
  'Audience',
  'Consistency',
  'Monetization',
  'Workflow',
  'Intent',
];

interface ArtistIntakeWizardProps {
  onComplete: (data: ArtistIntakeData, hasAudioUpload: boolean) => void;
  onCancel?: () => void;
}

export function ArtistIntakeWizard({ onComplete, onCancel }: ArtistIntakeWizardProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAudioUpload, setHasAudioUpload] = useState(false);

  // Form data state
  const [formData, setFormData] = useState<Partial<ArtistIntakeData>>({
    identity: {
      artistName: '',
      email: '',
      role: 'artist',
    },
    presence: {
      youtubeUrl: '',
      latestTrackUrl: '',
    },
    audience: {
      monthlyListeners: '0-1k',
      instagramFollowers: '0-1k',
      tiktokFollowers: '0-1k',
      avgViewsPerPost: '0-100',
    },
    consistency: {
      releaseFrequency: 'rarely',
      contentFrequency: 'rarely',
      runsAds: false,
      hasEmailList: false,
    },
    monetization: {
      isMakingMoney: false,
      revenueSources: [],
    },
    workflow: {
      selfMixMaster: false,
      biggestStruggles: [],
    },
    intent: {
      primaryGoal: 'fanbase',
    },
  });

  const updateField = useCallback(<K extends keyof ArtistIntakeData>(
    section: K,
    field: keyof ArtistIntakeData[K],
    value: ArtistIntakeData[K][keyof ArtistIntakeData[K]]
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const nextStep = () => {
    if (step < TOTAL_STEPS) {
      setDirection(1);
      setStep(s => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(s => s - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    onComplete(formData as ArtistIntakeData, hasAudioUpload);
    setIsSubmitting(false);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.identity?.artistName && formData.identity?.email;
      case 2:
        return formData.presence?.youtubeUrl && formData.presence?.latestTrackUrl;
      default:
        return true;
    }
  };

  const CurrentIcon = STEP_ICONS[step - 1];
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 mb-4 border border-white/20 rounded-none bg-white/5">
          <CurrentIcon className="w-5 h-5 text-white" />
        </div>
        <h2 className="mb-2 text-2xl font-mono font-bold tracking-tight text-white uppercase">
          {STEP_TITLES[step - 1]}
        </h2>
        <p className="font-mono text-xs text-white/50">
          Step {step} of {TOTAL_STEPS}
        </p>
        <div className="mt-4 h-0.5 w-full bg-white/10">
          <motion.div 
            className="h-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {step === 1 && (
              <StepIdentity 
                data={formData.identity!} 
                onUpdate={(field, value) => updateField('identity', field, value)} 
              />
            )}
            {step === 2 && (
              <StepPresence 
                data={formData.presence!} 
                onUpdate={(field, value) => updateField('presence', field, value)} 
              />
            )}
            {step === 3 && (
              <StepAudience 
                data={formData.audience!} 
                onUpdate={(field, value) => updateField('audience', field, value)} 
              />
            )}
            {step === 4 && (
              <StepConsistency 
                data={formData.consistency!} 
                onUpdate={(field, value) => updateField('consistency', field, value)} 
              />
            )}
            {step === 5 && (
              <StepMonetization 
                data={formData.monetization!} 
                onUpdate={(field, value) => updateField('monetization', field, value)} 
              />
            )}
            {step === 6 && (
              <StepWorkflow 
                data={formData.workflow!} 
                onUpdate={(field, value) => updateField('workflow', field, value)}
                onFileUpload={(hasUpload) => setHasAudioUpload(hasUpload)}
              />
            )}
            {step === 7 && (
              <StepIntent 
                data={formData.intent!} 
                onUpdate={(field, value) => updateField('intent', field, value)} 
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
        <Button
          variant="outline"
          onClick={step === 1 ? onCancel : prevStep}
          className="font-mono text-xs tracking-wider uppercase bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          {step === 1 ? 'Cancel' : 'Back'}
        </Button>

        {step < TOTAL_STEPS ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="font-mono text-xs tracking-wider uppercase bg-white text-black hover:bg-white/90"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="font-mono text-xs tracking-wider uppercase bg-emerald-500 text-white hover:bg-emerald-600"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Get My Score
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function StepIdentity({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['identity']; 
  onUpdate: (field: keyof ArtistIntakeData['identity'], value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Artist / Project Name *
        </Label>
        <Input
          value={data.artistName}
          onChange={(e) => onUpdate('artistName', e.target.value)}
          placeholder="e.g. Neon Horizon"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Email *
        </Label>
        <Input
          type="email"
          value={data.email}
          onChange={(e) => onUpdate('email', e.target.value)}
          placeholder="artist@example.com"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Role
        </Label>
        <RadioGroup 
          value={data.role} 
          onValueChange={(v) => onUpdate('role', v as ArtistRole)}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { value: 'artist', label: 'Artist' },
            { value: 'producer', label: 'Producer' },
            { value: 'engineer', label: 'Engineer' },
            { value: 'studio', label: 'Studio' },
          ].map((role) => (
            <Label
              key={role.value}
              className={`flex items-center justify-center p-4 border cursor-pointer transition-all font-mono text-xs uppercase tracking-wider ${
                data.role === role.value 
                  ? 'border-white bg-white/10 text-white' 
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={role.value} className="sr-only" />
              {role.label}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}

function StepPresence({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['presence']; 
  onUpdate: (field: keyof ArtistIntakeData['presence'], value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          YouTube or SoundCloud URL *
        </Label>
        <Input
          value={data.youtubeUrl}
          onChange={(e) => onUpdate('youtubeUrl', e.target.value)}
          placeholder="https://youtube.com/yourchannel"
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Latest Track / Best Work URL *
        </Label>
        <Input
          value={data.latestTrackUrl}
          onChange={(e) => onUpdate('latestTrackUrl', e.target.value)}
          placeholder="https://open.spotify.com/track/..."
          className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
            Spotify (optional)
          </Label>
          <Input
            value={data.spotifyUrl || ''}
            onChange={(e) => onUpdate('spotifyUrl', e.target.value)}
            placeholder="Spotify URL"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
            Apple Music (optional)
          </Label>
          <Input
            value={data.appleMusicUrl || ''}
            onChange={(e) => onUpdate('appleMusicUrl', e.target.value)}
            placeholder="Apple Music URL"
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 font-mono"
          />
        </div>
      </div>
    </div>
  );
}

function StepAudience({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['audience']; 
  onUpdate: (field: keyof ArtistIntakeData['audience'], value: any) => void;
}) {
  const ranges: { label: string; value: AudienceRange | EngagementRange }[][] = [
    [
      { label: '0-1K', value: '0-1k' },
      { label: '1K-10K', value: '1k-10k' },
      { label: '10K-50K', value: '10k-50k' },
      { label: '50K-100K', value: '50k-100k' },
      { label: '100K-500K', value: '100k-500k' },
      { label: '500K+', value: '500k+' },
    ],
    [
      { label: '0-100', value: '0-100' },
      { label: '100-1K', value: '100-1k' },
      { label: '1K-10K', value: '1k-10k' },
      { label: '10K-50K', value: '10k-50k' },
      { label: '50K+', value: '50k+' },
    ],
  ];

  return (
    <div className="space-y-6">
      <RangeSelector
        label="Monthly Listeners (Spotify/Apple)"
        options={ranges[0] as { label: string; value: AudienceRange }[]}
        value={data.monthlyListeners}
        onChange={(v) => onUpdate('monthlyListeners', v)}
      />

      <RangeSelector
        label="Instagram Followers"
        options={ranges[0] as { label: string; value: AudienceRange }[]}
        value={data.instagramFollowers}
        onChange={(v) => onUpdate('instagramFollowers', v)}
      />

      <RangeSelector
        label="TikTok Followers"
        options={ranges[0] as { label: string; value: AudienceRange }[]}
        value={data.tiktokFollowers}
        onChange={(v) => onUpdate('tiktokFollowers', v)}
      />

      <RangeSelector
        label="Average Views Per Post"
        options={ranges[1] as { label: string; value: EngagementRange }[]}
        value={data.avgViewsPerPost}
        onChange={(v) => onUpdate('avgViewsPerPost', v)}
      />
    </div>
  );
}

function RangeSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
        {label}
      </Label>
      <RadioGroup 
        value={value} 
        onValueChange={onChange}
        className="flex flex-wrap gap-2"
      >
        {options.map((opt) => (
          <Label
            key={opt.value}
            className={`px-3 py-2 border cursor-pointer transition-all font-mono text-xs ${
              value === opt.value 
                ? 'border-white bg-white text-black' 
                : 'border-white/20 text-white/50 hover:border-white/40'
            }`}
          >
            <RadioGroupItem value={opt.value} className="sr-only" />
            {opt.label}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}

function StepConsistency({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['consistency']; 
  onUpdate: (field: keyof ArtistIntakeData['consistency'], value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          How often do you release music?
        </Label>
        <RadioGroup 
          value={data.releaseFrequency} 
          onValueChange={(v) => onUpdate('releaseFrequency', v as ReleaseFrequency)}
          className="grid grid-cols-1 gap-2"
        >
          {[
            { value: 'weekly', label: 'Weekly or more' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'quarterly', label: 'Every few months' },
            { value: 'rarely', label: 'Rarely' },
            { value: 'never', label: 'Never released' },
          ].map((opt) => (
            <Label
              key={opt.value}
              className={`flex items-center p-3 border cursor-pointer transition-all font-mono text-xs ${
                data.releaseFrequency === opt.value 
                  ? 'border-white bg-white/10 text-white' 
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={opt.value} className="sr-only" />
              {opt.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Content posting frequency
        </Label>
        <RadioGroup 
          value={data.contentFrequency} 
          onValueChange={(v) => onUpdate('contentFrequency', v as ContentFrequency)}
          className="grid grid-cols-1 gap-2"
        >
          {[
            { value: 'daily', label: 'Daily' },
            { value: 'few-times-week', label: 'Few times a week' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'rarely', label: 'Rarely' },
          ].map((opt) => (
            <Label
              key={opt.value}
              className={`flex items-center p-3 border cursor-pointer transition-all font-mono text-xs ${
                data.contentFrequency === opt.value 
                  ? 'border-white bg-white/10 text-white' 
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={opt.value} className="sr-only" />
              {opt.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4">
        <div 
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
            data.runsAds ? 'border-white bg-white/10' : 'border-white/20'
          }`}
          onClick={() => onUpdate('runsAds', !data.runsAds)}
        >
          <span className="font-mono text-xs text-white">Running paid ads?</span>
          <div className={`w-5 h-5 border flex items-center justify-center ${
            data.runsAds ? 'bg-white border-white' : 'border-white/30'
          }`}>
            {data.runsAds && <Check className="w-3 h-3 text-black" />}
          </div>
        </div>

        <div 
          className={`flex items-center justify-between p-4 border cursor-pointer transition-all ${
            data.hasEmailList ? 'border-white bg-white/10' : 'border-white/20'
          }`}
          onClick={() => onUpdate('hasEmailList', !data.hasEmailList)}
        >
          <span className="font-mono text-xs text-white">Have email list?</span>
          <div className={`w-5 h-5 border flex items-center justify-center ${
            data.hasEmailList ? 'bg-white border-white' : 'border-white/30'
          }`}>
            {data.hasEmailList && <Check className="w-3 h-3 text-black" />}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepMonetization({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['monetization']; 
  onUpdate: (field: keyof ArtistIntakeData['monetization'], value: any) => void;
}) {
  const revenueOptions: { label: string; value: RevenueSource }[] = [
    { label: 'Streaming', value: 'streaming' },
    { label: 'Live Shows', value: 'live' },
    { label: 'Merchandise', value: 'merch' },
    { label: 'Sync / Licensing', value: 'sync' },
    { label: 'Production Work', value: 'production' },
    { label: 'Teaching', value: 'teaching' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Are you currently making money from your music?
        </Label>
        <RadioGroup 
          value={data.isMakingMoney ? 'yes' : 'no'} 
          onValueChange={(v) => onUpdate('isMakingMoney', v === 'yes')}
          className="flex gap-3"
        >
          {[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ].map((opt) => (
            <Label
              key={opt.value}
              className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all font-mono text-xs uppercase ${
                (data.isMakingMoney ? 'yes' : 'no') === opt.value 
                  ? 'border-white bg-white text-black' 
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={opt.value} className="sr-only" />
              {opt.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      {data.isMakingMoney && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          <div className="space-y-3">
            <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
              Monthly revenue range
            </Label>
            <RadioGroup 
              value={data.monthlyRevenue || '0'} 
              onValueChange={(v) => onUpdate('monthlyRevenue', v as RevenueRange)}
              className="grid grid-cols-2 gap-2"
            >
              {[
                { value: '0-1k', label: '$0 - $1K' },
                { value: '1k-5k', label: '$1K - $5K' },
                { value: '5k-10k', label: '$5K - $10K' },
                { value: '10k-50k', label: '$10K - $50K' },
                { value: '50k+', label: '$50K+' },
              ].map((opt) => (
                <Label
                  key={opt.value}
                  className={`flex items-center justify-center p-3 border cursor-pointer transition-all font-mono text-xs ${
                    data.monthlyRevenue === opt.value 
                      ? 'border-white bg-white/10 text-white' 
                      : 'border-white/20 text-white/50 hover:border-white/40'
                  }`}
                >
                  <RadioGroupItem value={opt.value} className="sr-only" />
                  {opt.label}
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
              Revenue sources (select all)
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {revenueOptions.map((opt) => {
                const isSelected = data.revenueSources?.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    className={`flex items-center p-3 border cursor-pointer transition-all ${
                      isSelected ? 'border-white bg-white/10' : 'border-white/20'
                    }`}
                    onClick={() => {
                      const newSources = isSelected
                        ? (data.revenueSources || []).filter(s => s !== opt.value)
                        : [...(data.revenueSources || []), opt.value];
                      onUpdate('revenueSources', newSources);
                    }}
                  >
                    <div className={`w-4 h-4 border mr-3 flex items-center justify-center ${
                      isSelected ? 'bg-white border-white' : 'border-white/30'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-black" />}
                    </div>
                    <span className="font-mono text-xs text-white">{opt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function StepWorkflow({ 
  data, 
  onUpdate,
  onFileUpload,
}: { 
  data: ArtistIntakeData['workflow']; 
  onUpdate: (field: keyof ArtistIntakeData['workflow'], value: any) => void;
  onFileUpload: (hasUpload: boolean) => void;
}) {
  const struggleOptions: { label: string; value: StruggleArea }[] = [
    { label: 'Mixing / Mastering', value: 'mixing' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Consistency', value: 'consistency' },
    { label: 'Building Fanbase', value: 'fanbase' },
    { label: 'Monetization', value: 'monetization' },
    { label: 'Time Management', value: 'time' },
    { label: 'Industry Network', value: 'network' },
    { label: 'Finding My Sound', value: 'sound' },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Do you mix and master yourself?
        </Label>
        <RadioGroup 
          value={data.selfMixMaster ? 'yes' : 'no'} 
          onValueChange={(v) => onUpdate('selfMixMaster', v === 'yes')}
          className="flex gap-3"
        >
          {[
            { value: 'yes', label: 'Yes, DIY' },
            { value: 'no', label: 'No, I work with pros' },
          ].map((opt) => (
            <Label
              key={opt.value}
              className={`flex-1 flex items-center justify-center p-4 border cursor-pointer transition-all font-mono text-xs ${
                (data.selfMixMaster ? 'yes' : 'no') === opt.value 
                  ? 'border-white bg-white text-black' 
                  : 'border-white/20 text-white/50 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={opt.value} className="sr-only" />
              {opt.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Upload a track for analysis (optional)
        </Label>
        <div 
          className="border border-dashed border-white/20 p-8 text-center cursor-pointer hover:border-white/40 transition-all"
          onClick={() => document.getElementById('track-upload')?.click()}
        >
          <Upload className="w-8 h-8 mx-auto mb-3 text-white/30" />
          <p className="font-mono text-xs text-white/50 mb-1">
            {data.uploadedTrack ? data.uploadedTrack.name : 'Click to upload or drag and drop'}
          </p>
          <p className="font-mono text-[10px] text-white/30">
            WAV, MP3, FLAC (max 50MB)
          </p>
          <input
            id="track-upload"
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              onUpdate('uploadedTrack', file);
              onFileUpload(!!file);
            }}
          />
        </div>
        {data.uploadedTrack && (
          <p className="font-mono text-xs text-emerald-400">
            ✓ {data.uploadedTrack.name} uploaded
          </p>
        )}
      </div>

      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          Biggest struggles (select up to 3)
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {struggleOptions.map((opt) => {
            const isSelected = data.biggestStruggles?.includes(opt.value);
            const canSelect = !isSelected && (data.biggestStruggles?.length || 0) < 3;
            
            return (
              <div
                key={opt.value}
                className={`flex items-center p-3 border cursor-pointer transition-all ${
                  isSelected 
                    ? 'border-white bg-white/10' 
                    : canSelect 
                      ? 'border-white/20 hover:border-white/40' 
                      : 'border-white/10 opacity-50 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (isSelected) {
                    onUpdate('biggestStruggles', data.biggestStruggles?.filter(s => s !== opt.value));
                  } else if (canSelect) {
                    onUpdate('biggestStruggles', [...(data.biggestStruggles || []), opt.value]);
                  }
                }}
              >
                <div className={`w-4 h-4 border mr-3 flex items-center justify-center ${
                  isSelected ? 'bg-white border-white' : 'border-white/30'
                }`}>
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="font-mono text-xs text-white">{opt.label}</span>
              </div>
            );
          })}
        </div>
        <p className="font-mono text-[10px] text-white/30">
          {data.biggestStruggles?.length || 0} of 3 selected
        </p>
      </div>
    </div>
  );
}

function StepIntent({ 
  data, 
  onUpdate 
}: { 
  data: ArtistIntakeData['intent']; 
  onUpdate: (field: keyof ArtistIntakeData['intent'], value: any) => void;
}) {
  const goals: { label: string; value: PrimaryGoal; description: string }[] = [
    { 
      label: 'Go Viral', 
      value: 'viral',
      description: 'Breakthrough moment, massive exposure'
    },
    { 
      label: 'Build Fanbase', 
      value: 'fanbase',
      description: 'Loyal, engaged community'
    },
    { 
      label: 'Monetize', 
      value: 'monetization',
      description: 'Sustainable income from music'
    },
    { 
      label: 'Get Placements', 
      value: 'placements',
      description: 'Sync, labels, playlists'
    },
    { 
      label: 'Perfect My Sound', 
      value: 'sound',
      description: 'Develop unique sonic identity'
    },
    { 
      label: 'Industry Recognition', 
      value: 'industry',
      description: 'Respect from peers and gatekeepers'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="font-mono text-xs uppercase tracking-wider text-white/70">
          What's your primary goal right now?
        </Label>
        <RadioGroup 
          value={data.primaryGoal} 
          onValueChange={(v) => onUpdate('primaryGoal', v as PrimaryGoal)}
          className="grid grid-cols-1 gap-3"
        >
          {goals.map((opt) => (
            <Label
              key={opt.value}
              className={`flex flex-col p-4 border cursor-pointer transition-all ${
                data.primaryGoal === opt.value 
                  ? 'border-white bg-white/10' 
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <RadioGroupItem value={opt.value} className="sr-only" />
              <span className="font-mono text-sm text-white mb-1">{opt.label}</span>
              <span className="font-mono text-xs text-white/50">{opt.description}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
