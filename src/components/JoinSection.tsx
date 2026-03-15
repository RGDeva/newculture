import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

export function JoinSection() {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="join" className="border-t border-border bg-background py-32">
        <div className="mx-auto max-w-xl px-6 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <CheckCircle size={32} strokeWidth={1} className="mx-auto mb-6 text-foreground" />
            <h3 className="mb-3 font-display text-2xl font-bold text-foreground">APPLICATION RECEIVED</h3>
            <p className="font-mono text-xs text-muted-foreground">
              We'll review your submission and reach out within 48 hours.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="join" className="border-t border-border bg-background py-32">
      <div className="mx-auto max-w-xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="mb-2 font-mono text-[10px] tracking-[0.4em] text-muted-foreground">
            // ONBOARD
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Join the Network
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {[
            { name: "name", label: "FULL NAME", type: "text" },
            { name: "email", label: "EMAIL", type: "email" },
            { name: "role", label: "ROLE (ARTIST / PRODUCER / ENGINEER)", type: "text" },
            { name: "location", label: "CITY, STATE", type: "text" },
            { name: "link", label: "MUSIC LINK (SPOTIFY, SOUNDCLOUD, ETC.)", type: "url" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <label
                className={`absolute left-0 font-mono text-[10px] tracking-[0.2em] transition-all duration-300 ${
                  focused === field.name
                    ? "-top-4 text-foreground"
                    : "top-3 text-muted-foreground"
                }`}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                required
                onFocus={() => setFocused(field.name)}
                onBlur={(e) => {
                  if (!e.target.value) setFocused(null);
                }}
                className="w-full border-b border-border bg-transparent pb-2 pt-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-foreground"
              />
            </div>
          ))}

          <div className="relative">
            <label className="mb-2 block font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              TELL US ABOUT YOUR WORK
            </label>
            <textarea
              rows={4}
              className="w-full resize-none border-b border-border bg-transparent pb-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-foreground"
            />
          </div>

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-3 border border-foreground bg-foreground py-3 font-mono text-xs tracking-[0.15em] text-primary-foreground transition-all hover:bg-transparent hover:text-foreground"
          >
            SUBMIT APPLICATION
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
