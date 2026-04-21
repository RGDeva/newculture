import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ToolsSection } from "@/components/ToolsSection";
import { Footer } from "@/components/Footer";
import { mailtoHref } from "@/lib/config";

function FinalCTA() {
  return (
    <section className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-3 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
          // SELECTIVE ONBOARDING
        </p>
        <h2 className="mb-6 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
          Ready to work with us?
        </h2>
        <p className="mx-auto mb-10 max-w-xl font-mono text-sm leading-relaxed text-muted-foreground">
          We take on a limited number of clients each quarter. Apply in under
          four minutes and we'll respond within 48 hours. Otherwise, get in
          touch.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 border border-foreground bg-foreground px-8 py-3 font-mono text-xs tracking-[0.15em] text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            APPLY <ArrowRight size={14} />
          </Link>
<a
            href={mailtoHref}
            className="font-mono text-[11px] tracking-[0.25em] text-muted-foreground underline underline-offset-[6px] hover:text-foreground"
          >
            GET IN TOUCH →
          </a>
        </div>
      </div>
    </section>
  );
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <ToolsSection />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default Index;
