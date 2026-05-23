import { UiLang, translations } from "../utils/translations";

interface HeroProps {
  uiLang: UiLang;
}

/**
 * Hero — Asymmetric landing section for ByteMind.
 * Highlights the core value proposition with a glowing headline and a decorative code card.
 */
export default function Hero({ uiLang }: HeroProps) {
  const t = translations[uiLang].hero;

  return (
    <section id="hero" className="relative mesh-gradient pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* --- Left column: copy --- */}
          <div className="animate-fade-up max-w-xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-soft border border-border-accent text-xs font-semibold text-accent mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              {t.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-text-primary mb-5">
              {t.title}{" "}
              <span className="bg-gradient-to-r from-accent to-blue-400 bg-clip-text text-transparent">
                {t.titleAccent}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-md">
              {t.desc}
            </p>

            <div className="flex flex-wrap gap-3">
              <a href="#workspace"
                className="btn-glow inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover shadow-lg shadow-accent/20 transition-all">
                {t.tryBtn}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a href="#features"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border-light text-text-secondary font-medium text-sm hover:border-accent/40 hover:text-accent hover:bg-accent-soft transition-all">
                {t.learnMore}
              </a>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6 text-xs text-text-tertiary">
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                {t.free}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                {t.secure}
              </span>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {t.instant}
              </span>
            </div>
          </div>

          {/* --- Right column: decorative code card --- */}
          <div className="hidden lg:block animate-slide-in-right">
            <div className="glass-card p-5 rounded-2xl relative animate-float">
              {/* Fake title bar */}
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 rounded-full bg-red-400/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <span className="w-3 h-3 rounded-full bg-green-400/70" />
                <span className="ml-auto text-[11px] font-mono text-text-tertiary">{t.exampleTitle}</span>
              </div>
              {/* Fake code */}
              <pre className="font-mono text-xs sm:text-sm leading-6 text-text-secondary overflow-hidden">
                <code>{`def greet(name):
    """Say hello to a user"""
    message = f"Hello, {name}!"
    print(message)
    return message

# Call the function
greet("ByteMind")`}</code>
              </pre>
              {/* Decorative glow */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-300/8 rounded-full blur-2xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
