"use client";

import { useState, useCallback, useEffect } from "react";
import { UiLang, translations } from "../utils/translations";

/* Supported programming languages */
const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "html", label: "HTML/CSS" },
  { value: "sql", label: "SQL" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface WorkspaceProps {
  uiLang: UiLang;
}

/* ──────────────────────────────────────────── */
/*  Workspace — Interactive code explanation    */
/* ──────────────────────────────────────────── */
export default function Workspace({ uiLang }: WorkspaceProps) {
  const t = translations[uiLang].workspace;

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [targetLang, setTargetLang] = useState<UiLang>(uiLang);
  const [result, setResult] = useState<{ summary: string; steps: { title: string; detail: string }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTargetLang(uiLang);
    }, 0);
    return () => clearTimeout(timer);
  }, [uiLang]);

  const selectedLang = LANGUAGES.find((l) => l.value === language)!;

  /* ---- Call backend API ---- */
  const handleExplain = useCallback(async () => {
    if (!code.trim()) { setError(t.emptyError); return; }
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/explain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, targetLanguage: targetLang }),
      });
      if (!res.ok) throw new Error(t.serverError);
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.serverError);
    } finally {
      setLoading(false);
    }
  }, [code, language, targetLang, t.emptyError, t.serverError]);

  /* ---- Copy result to clipboard ---- */
  const handleCopy = useCallback(() => {
    if (!result) return;
    const isIndo = targetLang === "id";
    const text = `${t.aiExplanation}:\n${result.summary}\n\n${result.steps.map((s, i) => `${isIndo ? "Langkah" : "Step"} ${i + 1}: ${s.title}\n${s.detail}`).join("\n\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, targetLang, t.aiExplanation]);

  return (
    <section id="workspace" className="relative py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Section heading */}
        <div className="text-center mb-12 animate-fade-up">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
            {t.title}<span className="text-accent">{t.titleAccent}</span>
          </h2>
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto">
            {t.desc}
          </p>
        </div>

        {/* Main workspace card */}
        <div className="glass-card p-5 sm:p-8 rounded-2xl max-w-4xl mx-auto">
          {/* Top bar: language selectors */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
              {/* Programming Language Dropdown */}
              <div className="relative">
                <button id="language-dropdown" onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-light text-sm font-medium text-text-primary hover:border-accent/40 transition-all min-w-[160px]">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  {selectedLang.label}
                  <svg className={`ml-auto w-4 h-4 text-text-tertiary transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1.5 w-full bg-bg-card backdrop-blur-xl border border-border-light rounded-xl shadow-lg z-20 overflow-hidden">
                    {LANGUAGES.map((l) => (
                      <button key={l.value} onClick={() => { setLanguage(l.value); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${l.value === language ? "bg-accent-soft text-accent font-medium" : "text-text-secondary hover:bg-accent-soft hover:text-accent"}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Target Explanation Language Toggle */}
              <div className="flex items-center gap-1.5 bg-bg-secondary border border-border-light rounded-xl p-1 w-full sm:w-auto">
                <span className="text-[10px] sm:text-[11px] font-semibold text-text-tertiary px-2 select-none whitespace-nowrap">
                  {t.targetLangLabel}:
                </span>
                <button
                  onClick={() => setTargetLang("id")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                    targetLang === "id"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Bahasa Indonesia
                </button>
                <button
                  onClick={() => setTargetLang("en")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                    targetLang === "en"
                      ? "bg-accent text-white shadow-md shadow-accent/20"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <span className="text-xs text-text-tertiary hidden md:block">{t.supports}</span>
          </div>

          {/* Code textarea */}
          <div className="relative mb-5">
            {/* Line numbers gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-bg-secondary/50 rounded-l-xl flex flex-col items-center pt-4 text-[11px] font-mono text-text-tertiary select-none pointer-events-none overflow-hidden">
              {Array.from({ length: Math.max((code.split("\n").length), 8) }, (_, i) => (
                <span key={i} className="leading-[1.7] h-[1.7em]">{i + 1}</span>
              ))}
            </div>
            <textarea
              id="code-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.placeholder}
              spellCheck={false}
              className="code-textarea w-full min-h-[220px] bg-bg-secondary border border-border-light rounded-xl pl-14 pr-4 py-4 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 resize-none"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Explain button */}
          <button id="explain-btn" onClick={handleExplain} disabled={loading}
            className="btn-glow w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-2.5">
            {loading ? (
              <>
                <svg className="animate-spin-slow w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                {t.analyzing}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                {t.explainBtn}
              </>
            )}
          </button>
        </div>

        {/* ---- Results area ---- */}
        {loading && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto mt-6">
            <div className="space-y-4">
              <div className="skeleton h-5 w-2/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-5/6 rounded" />
              <div className="skeleton h-4 w-4/6 rounded" />
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="skeleton h-20 w-full rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="glass-card p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto mt-6 animate-fade-up">
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-text-primary mb-1 flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" />
                  </svg>
                  {t.aiExplanation}
                </h3>
                <p className="text-xs text-text-tertiary">{t.poweredBy}</p>
              </div>
              <button id="copy-result-btn" onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-secondary border border-border-light text-xs font-medium text-text-secondary hover:text-accent hover:border-accent/40 transition-all">
                {copied ? (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5" /></svg> {t.copied}</>
                ) : (
                  <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> {t.copy}</>
                )}
              </button>
            </div>

            {/* Summary */}
            <div className="mb-6 p-4 rounded-xl bg-accent-soft border border-border-accent">
              <p className="text-sm text-text-primary leading-relaxed">{result.summary}</p>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {result.steps.map((step, i) => (
                <div key={i} className="p-4 rounded-xl bg-bg-secondary/60 border border-border-light hover:border-accent/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 w-7 h-7 rounded-lg bg-accent/15 text-accent text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-1">{step.title}</h4>
                      <p className="text-sm text-text-secondary leading-relaxed">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
