import logoDark from "@/assets/logo-dark.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logoDark} alt="NewCulture" className="h-6 invert" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground">
            NEWCULTURE © {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex gap-8">
          {["TWITTER", "INSTAGRAM", "DISCORD"].map((s) => (
            <a
              key={s}
              href="#"
              className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
