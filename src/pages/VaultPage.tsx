import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, Shield, FolderOpen, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function VaultPage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border px-6 py-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <Link
                  to="/tools"
                  className="flex h-10 w-10 items-center justify-center border border-border transition-all hover:border-foreground hover:bg-foreground hover:text-background"
                >
                  <ArrowLeft size={18} />
                </Link>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Shield size={14} className="text-emerald-500" />
                    <span className="font-mono text-[10px] tracking-[0.3em] text-emerald-500">EMBEDDED TOOL</span>
                  </div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">S33R Vault</h1>
                </div>
              </div>
              <a
                href="https://s33r-vault.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-emerald-500 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-emerald-500 transition-all hover:bg-emerald-500 hover:text-white"
              >
                OPEN IN NEW TAB <ExternalLink size={14} />
              </a>
            </div>
            <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-muted-foreground">
              Secure vault for music assets, stems, and project files. Organize, share, and manage your creative work. 
              Access your files directly below or open in a new tab for full-screen experience.
            </p>
          </div>
        </div>

        {/* Embedded Vault */}
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="relative border border-border bg-card overflow-hidden" style={{ height: "calc(100vh - 300px)" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                  <div className="h-8 w-8 animate-spin border-2 border-emerald-500 border-t-transparent rounded-full" />
                  <p className="font-mono text-[11px] text-muted-foreground">Loading S33R Vault...</p>
                </div>
              </div>
            )}
            <iframe
              src="https://s33r-vault.vercel.app"
              className="w-full h-full"
              onLoad={() => setIsLoading(false)}
              allow="clipboard-write; fullscreen"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              title="S33R Vault"
            />
          </div>

          {/* Features Grid */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="border border-border p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center border border-emerald-500/30 bg-emerald-500/5">
                <FolderOpen size={18} className="text-emerald-500" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">Asset Storage</h3>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                Securely store stems, project files, and music assets. Organize by project, artist, or release.
              </p>
            </div>
            <div className="border border-border p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center border border-emerald-500/30 bg-emerald-500/5">
                <Lock size={18} className="text-emerald-500" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">Private & Secure</h3>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                Your files are protected. Share only what you want, when you want, with granular access controls.
              </p>
            </div>
            <div className="border border-border p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center border border-emerald-500/30 bg-emerald-500/5">
                <ExternalLink size={18} className="text-emerald-500" />
              </div>
              <h3 className="mb-2 font-display text-lg font-bold text-foreground">Easy Sharing</h3>
              <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                Generate share links for collaborators, labels, or team members. No file size limits on transfers.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
