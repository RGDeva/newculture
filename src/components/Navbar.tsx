import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  Wrench, Network, Send, Menu, X, Home, Layers,
} from "lucide-react";
import logoDark from "@/assets/logo-dark.png";
import type { NavItem } from "@/components/ui/limelight-nav";

const NAV_ITEMS: (NavItem & { href: string })[] = [
  { id: "home",     href: "/",         icon: <Home />,    label: "Home" },
  { id: "services", href: "/services", icon: <Layers />,  label: "Services" },
  { id: "tools",    href: "/tools",    icon: <Wrench />,  label: "Tools" },
  { id: "network",  href: "/network",  icon: <Network />, label: "Network" },
  { id: "apply",    href: "/apply",    icon: <Send />,    label: "Apply" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const activeIndex = Math.max(0, NAV_ITEMS.findIndex((item) =>
    item.href === "/" ? location.pathname === "/" : location.pathname.startsWith(item.href)
  ));

  const limelightItems: NavItem[] = NAV_ITEMS.map((item) => ({
    id: item.id,
    icon: item.icon,
    label: item.label,
    onClick: () => setMobileOpen(false),
  }));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo left */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
          <img src={logoDark} alt="NewCulture OS" className="h-9 w-9 object-contain" />
          <div className="hidden sm:block">
            <p className="font-mono text-[10px] font-bold tracking-[0.25em] text-foreground leading-none">NEWCULTURE</p>
            <p className="font-mono text-[8px] tracking-[0.4em] text-muted-foreground leading-none mt-0.5">OS</p>
          </div>
        </Link>

        {/* LimelightNav centered — desktop */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
          {/* Wrap each limelight item in a Link */}
          <div className="relative inline-flex items-center h-12 rounded-xl bg-card/60 border border-border/60 backdrop-blur-md px-2">
            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeIndex === idx;
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  title={item.label}
                  className={`relative z-20 flex h-full cursor-pointer items-center justify-center px-4 transition-opacity duration-100 ${isActive ? "opacity-100" : "opacity-40 hover:opacity-70"}`}
                >
                  <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                </Link>
              );
            })}
            {/* Limelight highlight */}
            <div
              className="absolute top-0 z-10 w-11 h-[5px] rounded-full bg-primary shadow-[0_50px_15px_var(--primary)] transition-[left] duration-300 ease-in-out pointer-events-none"
              style={{ left: `calc(${activeIndex * (100 / NAV_ITEMS.length)}% + 8px + ${activeIndex * 0}px)` }}
            >
              <div className="absolute left-[-30%] top-[5px] w-[160%] h-14 [clip-path:polygon(5%_100%,25%_0,75%_0,95%_100%)] bg-gradient-to-b from-primary/30 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Right side: CTA + mobile burger */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            to="/apply"
            className="hidden sm:inline-flex font-mono text-[9px] tracking-[0.2em] border border-foreground bg-foreground text-background px-4 py-2 transition-all hover:bg-transparent hover:text-foreground"
          >
            APPLY
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 font-mono text-xs tracking-[0.2em] transition-colors ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <span className="opacity-60 w-4 h-4 flex items-center justify-center">{item.icon}</span>
                    {item.label?.toUpperCase()}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
