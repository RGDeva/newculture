import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Download,
  FileAudio,
  Lock,
  Music,
  Shield,
  Zap,
  Play,
  Pause,
  Volume2,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PRICES, STRIPE_PUBLISHABLE_KEY, mailtoHref } from "@/lib/config";
import { supabase } from "@/lib/supabase";

// ── Types ─────────────────────────────────────────────────────────────────
interface MixOrder {
  email: string;
  artistName: string;
  trackName: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  genres: string[];
  referenceTrack?: string;
  notes?: string;
  price: number;
  status: "pending" | "paid" | "processing" | "completed";
  createdAt: string;
}

const GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Electronic",
  "Rock",
  "Indie",
  "Trap",
  "Afrobeats",
  "Other",
];

const STEPS = [
  { n: "01", label: "UPLOAD", desc: "WAV or MP3, 3–10 mins" },
  { n: "02", label: "ANALYZE", desc: "AI + pro review" },
  { n: "03", label: "MIX", desc: "Release-ready master" },
  { n: "04", label: "DELIVER", desc: "24–48 hours" },
];

// ── Components ─────────────────────────────────────────────────────────────
function GenreChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-2 font-mono text-[10px] tracking-[0.15em] transition-all ${
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
      }`}
    >
      {label.toUpperCase()}
    </button>
  );
}

function TextField(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
        {label}
      </label>
      <input
        {...rest}
        className="w-full border-b border-border bg-transparent py-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-foreground"
      />
    </div>
  );
}

function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }
) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="mb-2 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
        {label}
      </label>
      <textarea
        {...rest}
        className="w-full resize-none border border-border bg-transparent p-3 font-mono text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/30 focus:border-foreground"
      />
    </div>
  );
}

// ── Audio Preview Component ─────────────────────────────────────────────
function AudioPreview({ file }: { file: File }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = vol;
      setVolume(vol);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const objectUrl = URL.createObjectURL(file);

  return (
    <div className="border border-foreground/20 bg-foreground/5 p-4">
      <audio
        ref={audioRef}
        src={objectUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
      <div className="flex items-center gap-3 mb-3">
        <button
          onClick={togglePlay}
          className="flex h-10 w-10 items-center justify-center border border-foreground bg-foreground text-background hover:bg-transparent hover:text-foreground transition-all"
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <div className="flex-1">
          <p className="font-mono text-xs text-foreground mb-1">{file.name}</p>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground w-10">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full"
            />
            <span className="font-mono text-[10px] text-muted-foreground w-10">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Volume2 size={14} className="text-muted-foreground" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-border rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
      <p className="font-mono text-[9px] text-muted-foreground/60 text-center">
        Preview your track before proceeding to payment
      </p>
    </div>
  );
}

// ── Upload Dropzone ───────────────────────────────────────────────────────
function UploadZone({
  onFile,
  file,
}: {
  onFile: (f: File) => void;
  file: File | null;
}) {
  const [drag, setDrag] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDrag(false);
      const f = e.dataTransfer.files[0];
      if (f && (f.type.includes("audio") || f.name.match(/\.(wav|mp3)$/i))) {
        onFile(f);
      }
    },
    [onFile]
  );

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onFile(f);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed p-8 text-center transition-all ${
        drag
          ? "border-foreground bg-foreground/5"
          : "border-border hover:border-foreground/50"
      }`}
    >
      <input
        type="file"
        accept=".wav,.mp3,audio/*"
        onChange={handleInput}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
      <div className="pointer-events-none flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center border border-foreground/20">
          <FileAudio size={20} className="text-foreground" />
        </div>
        <p className="font-mono text-sm text-foreground">
          {file ? file.name : "Drop your track here or click to browse"}
        </p>
        <p className="font-mono text-[10px] text-muted-foreground/60">
          WAV or MP3 · Max 50MB
        </p>
      </div>
    </div>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────
function TrustBar() {
  return (
    <div className="grid gap-4 border border-border bg-card/30 p-6 sm:grid-cols-3">
      {[
        {
          icon: Shield,
          title: "OWNERSHIP",
          text: "You keep 100% of masters and rights",
        },
        {
          icon: Zap,
          title: "AI + PRO",
          text: "RoEx AI mixing, human QC review",
        },
        {
          icon: Lock,
          title: "SECURE",
          text: "Files encrypted, deleted after delivery",
        },
      ].map((t) => (
        <div key={t.title} className="flex items-start gap-3">
          <t.icon size={14} className="mt-0.5 flex-shrink-0 text-foreground" />
          <div>
            <p className="mb-1 font-mono text-[9px] tracking-[0.2em] text-muted-foreground/60">
              {t.title}
            </p>
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
              {t.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Payment Modal (Stripe redirect simulation) ────────────────────────────
function PaymentModal({
  order,
  onClose,
  onSuccess,
}: {
  order: MixOrder;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const price = PRICES.mixAnalysis; // cents
  const priceDisplay = (price / 100).toFixed(0);

  const handlePay = async () => {
    setLoading(true);
    // Simulate Stripe Checkout redirect
    // In production, this calls your backend to create a Checkout Session
    await new Promise((r) => setTimeout(r, 1500));

    // Store order in Supabase or localStorage
    try {
      if (supabase) {
        await supabase.from("mix_orders").insert({
          email: order.email,
          artist_name: order.artistName,
          track_name: order.trackName,
          file_name: order.fileName,
          genres: order.genres,
          reference_track: order.referenceTrack || null,
          notes: order.notes || null,
          price,
          status: "paid",
          created_at: new Date().toISOString(),
        });
      }
      const existing = JSON.parse(localStorage.getItem("nc_mix_orders") || "[]");
      existing.push({ ...order, status: "paid" as const });
      localStorage.setItem("nc_mix_orders", JSON.stringify(existing));
    } catch {}

    setLoading(false);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-foreground bg-background p-8"
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            // CHECKOUT
          </p>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <h2 className="mb-2 font-display text-2xl font-bold text-foreground">
          AI Mix & Master
        </h2>
        <p className="mb-6 font-mono text-sm text-muted-foreground">
          {order.trackName} by {order.artistName}
        </p>

        <div className="mb-6 space-y-2 border-y border-border py-4">
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="text-foreground">Mix + Master + Analysis</span>
          </div>
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-muted-foreground">Delivery</span>
            <span className="text-foreground">24–48 hours</span>
          </div>
          <div className="flex items-center justify-between font-mono text-sm">
            <span className="text-muted-foreground">Revisions</span>
            <span className="text-foreground">1 included</span>
          </div>
        </div>

        <div className="mb-6 flex items-end justify-between">
          <span className="font-mono text-sm text-muted-foreground">Total</span>
          <span className="font-display text-3xl font-bold text-foreground">
            ${priceDisplay}
          </span>
        </div>

        <button
          onClick={handlePay}
          disabled={loading}
          className="mb-3 flex w-full items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-50"
        >
          {loading ? "PROCESSING…" : `PAY $${priceDisplay}`}
          {!loading && <ArrowRight size={14} />}
        </button>

        <p className="text-center font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">
          SECURE PAYMENT VIA STRIPE
        </p>

        {!STRIPE_PUBLISHABLE_KEY && (
          <p className="mt-3 border border-dashed border-border bg-card/40 p-3 font-mono text-[9px] leading-relaxed text-muted-foreground">
            Note: Stripe not configured. This simulates payment flow.
            Set VITE_STRIPE_PUBLISHABLE_KEY in Vercel for real checkout.
          </p>
        )}
      </motion.div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────
export default function MixUploadPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<"upload" | "details" | "review">("upload");
  const [order, setOrder] = useState<Partial<MixOrder>>({
    genres: [],
    price: PRICES.mixAnalysis,
  });
  const [showPayment, setShowPayment] = useState(false);

  const canProceed =
    file &&
    order.email?.includes("@") &&
    order.artistName &&
    order.trackName &&
    order.genres &&
    order.genres.length > 0;

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    navigate("/mix/success");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <section className="border-b border-border px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="mb-4 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
                // PRODUCTIZED SERVICE
              </p>
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                AI Mix & Master.
              </h1>
              <p className="max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
                Upload your track. Our AI partner RoEx analyzes, mixes, and
                masters it — then a professional reviews and delivers a
                release-ready file within 48 hours. You keep 100% ownership.
              </p>
            </motion.div>

            {/* Process strip */}
            <div className="mt-10 grid gap-px bg-border sm:grid-cols-4">
              {STEPS.map((s) => (
                <div key={s.n} className="bg-background p-5">
                  <p className="mb-2 font-mono text-[9px] tracking-[0.25em] text-muted-foreground/50">
                    {s.n}
                  </p>
                  <p className="mb-1 font-mono text-xs font-bold text-foreground">
                    {s.label}
                  </p>
                  <p className="font-mono text-[10px] text-muted-foreground/60">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-2xl">
            {/* Progress */}
            <div className="mb-10 flex items-center gap-2">
              {["upload", "details", "review"].map((s, i) => {
                const active = step === s;
                const done =
                  ["details", "review"].indexOf(step) >
                  ["upload", "details", "review"].indexOf(s);
                return (
                  <div key={s} className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center border font-mono text-[9px] ${
                        active || done
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      {done ? <Check size={10} /> : `0${i + 1}`}
                    </div>
                    <span
                      className={`font-mono text-[9px] tracking-[0.15em] ${
                        active ? "text-foreground" : "text-muted-foreground/50"
                      }`}
                    >
                      {s.toUpperCase()}
                    </span>
                    {i < 2 && (
                      <ChevronRight
                        size={10}
                        className="text-muted-foreground/30"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {step === "upload" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <UploadZone onFile={setFile} file={file} />
                {file && (
                  <>
                    <AudioPreview file={file} />
                    <div className="flex items-center justify-between border border-foreground/20 bg-foreground/5 p-4">
                      <div className="flex items-center gap-3">
                        <Music size={14} className="text-foreground" />
                        <div>
                          <p className="font-mono text-xs text-foreground">
                            {file.name}
                          </p>
                          <p className="font-mono text-[10px] text-muted-foreground/60">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFile(null)}
                        className="font-mono text-[10px] text-muted-foreground underline underline-offset-[3px] hover:text-foreground"
                      >
                        REMOVE
                      </button>
                    </div>
                  </>
                )}
                <button
                  onClick={() => file && setStep("details")}
                  disabled={!file}
                  className="flex w-full items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                >
                  CONTINUE <ArrowRight size={14} />
                </button>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <TextField
                  label="EMAIL *"
                  type="email"
                  required
                  value={order.email || ""}
                  onChange={(e) =>
                    setOrder({ ...order, email: e.target.value })
                  }
                  placeholder="you@domain.com"
                />
                <TextField
                  label="ARTIST NAME *"
                  required
                  value={order.artistName || ""}
                  onChange={(e) =>
                    setOrder({ ...order, artistName: e.target.value })
                  }
                  placeholder="Your artist or project name"
                />
                <TextField
                  label="TRACK NAME *"
                  required
                  value={order.trackName || ""}
                  onChange={(e) =>
                    setOrder({ ...order, trackName: e.target.value })
                  }
                  placeholder="Song title"
                />

                <div>
                  <label className="mb-3 block font-mono text-[10px] tracking-[0.25em] text-muted-foreground/70">
                    GENRE (SELECT ALL THAT APPLY) *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {GENRES.map((g) => (
                      <GenreChip
                        key={g}
                        label={g}
                        selected={order.genres?.includes(g) || false}
                        onClick={() =>
                          setOrder({
                            ...order,
                            genres: order.genres?.includes(g)
                              ? order.genres.filter((x) => x !== g)
                              : [...(order.genres || []), g],
                          })
                        }
                      />
                    ))}
                  </div>
                </div>

                <TextField
                  label="REFERENCE TRACK (OPTIONAL)"
                  value={order.referenceTrack || ""}
                  onChange={(e) =>
                    setOrder({ ...order, referenceTrack: e.target.value })
                  }
                  placeholder="Spotify/YouTube link to a track you want yours to sound like"
                />

                <TextArea
                  label="NOTES FOR THE ENGINEER (OPTIONAL)"
                  rows={3}
                  value={order.notes || ""}
                  onChange={(e) =>
                    setOrder({ ...order, notes: e.target.value })
                  }
                  placeholder="Specific requests, problem areas, or vibe you're going for"
                />

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("upload")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    BACK
                  </button>
                  <button
                    onClick={() =>
                      order.email &&
                      order.artistName &&
                      order.trackName &&
                      order.genres?.length &&
                      setStep("review")
                    }
                    disabled={
                      !order.email?.includes("@") ||
                      !order.artistName ||
                      !order.trackName ||
                      !order.genres?.length
                    }
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground disabled:opacity-40"
                  >
                    REVIEW ORDER <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === "review" && file && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="border border-foreground bg-foreground/5 p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <Music size={16} className="text-foreground" />
                    <div>
                      <p className="font-mono text-sm font-bold text-foreground">
                        {order.trackName}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground">
                        {order.artistName}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 font-mono text-[11px] text-muted-foreground">
                    <p>File: {file.name}</p>
                    <p>Email: {order.email}</p>
                    <p>Genre: {order.genres?.join(", ")}</p>
                    {order.referenceTrack && (
                      <p>Reference: {order.referenceTrack}</p>
                    )}
                  </div>
                </div>

                <TrustBar />

                <div className="flex items-end justify-between border-t border-border pt-6">
                  <div>
                    <p className="mb-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground/60">
                      TOTAL
                    </p>
                    <p className="font-display text-4xl font-bold text-foreground">
                      ${(PRICES.mixAnalysis / 100).toFixed(0)}
                    </p>
                    <p className="font-mono text-[10px] text-muted-foreground/50">
                      One-time payment · No subscription
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("details")}
                    className="border border-border px-6 py-4 font-mono text-xs tracking-[0.15em] text-muted-foreground transition-all hover:border-foreground hover:text-foreground"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() =>
                      setShowPayment(true)
                    }
                    className="flex flex-1 items-center justify-center gap-2 border border-foreground bg-foreground py-4 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
                  >
                    PROCEED TO PAYMENT <ArrowRight size={14} />
                  </button>
                </div>

                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/50">
                  By proceeding, you agree that processed masters are delivered
                  as-is with one included revision. Full terms available on
                  request via{" "}
                  <a href={mailtoHref} className="underline hover:text-foreground">
                    email
                  </a>
                  .
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border px-6 py-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-6 font-mono text-[10px] tracking-[0.3em] text-muted-foreground/60">
              // FAQ
            </p>
            <div className="space-y-6">
              {[
                {
                  q: "What file formats do you accept?",
                  a: "WAV or MP3. For best results, upload uncompressed WAV at 24-bit/44.1kHz or higher.",
                },
                {
                  q: "How is this different from automated mastering?",
                  a: "RoEx AI handles the technical mix/master, then our engineers review and QC before delivery. You get AI speed + human judgment.",
                },
                {
                  q: "Do I own the masters?",
                  a: "Yes. 100% ownership and rights remain with you. We deliver files and delete our copies after delivery.",
                },
                {
                  q: "What if I don't like the mix?",
                  a: "One revision is included. Additional revisions available at $25 each. We aim to get it right the first time via your notes and reference tracks.",
                },
                {
                  q: "How long does it take?",
                  a: "24–48 hours from payment confirmation. Rush delivery (12 hours) available for +$30 — contact us after ordering.",
                },
              ].map((f) => (
                <div key={f.q}>
                  <p className="mb-2 font-mono text-xs font-bold text-foreground">
                    {f.q}
                  </p>
                  <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {showPayment && (
        <PaymentModal
          order={order as MixOrder}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <Footer />
    </div>
  );
}
