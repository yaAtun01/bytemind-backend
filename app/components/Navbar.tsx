"use client";

import { useState, useEffect } from "react";
import { UiLang, translations } from "../utils/translations";

interface NavbarProps {
  uiLang: UiLang;
  setUiLang: (lang: UiLang) => void;
}

export default function Navbar({ uiLang, setUiLang }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("bytemind-theme");
    if (stored === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("bytemind-theme", next ? "dark" : "light");
  };

  const navLinks = [
    { label: translations[uiLang].nav.home, href: "#hero" },
    { label: translations[uiLang].nav.workspace, href: "#workspace" },
    { label: translations[uiLang].nav.features, href: "#features" },
  ];

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-glass backdrop-blur-xl border-b border-border-light shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center group-hover:bg-accent/25">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" opacity="0.85" />
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text-primary">
            Byte<span className="text-accent">Mind</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent rounded-lg hover:bg-accent-soft transition-colors">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* Language Switcher Button */}
          <button
            id="lang-toggle"
            onClick={() => setUiLang(uiLang === "id" ? "en" : "id")}
            aria-label="Switch language"
            className="w-10 h-10 rounded-xl bg-bg-card border border-border-light flex items-center justify-center hover:border-accent/40 hover:bg-accent-soft text-xs font-bold text-text-primary transition-all active:scale-95"
          >
            {uiLang === "id" ? "ID" : "EN"}
          </button>

          {/* Theme Toggle Button */}
          <button id="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode"
            className="relative w-10 h-10 rounded-xl bg-bg-card border border-border-light flex items-center justify-center hover:border-accent/40 hover:bg-accent-soft">
            <svg className={`w-[18px] h-[18px] absolute transition-all duration-300 ${isDark ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg className={`w-[18px] h-[18px] absolute transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>

          {/* Mobile Menu Button */}
          <button id="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle mobile menu"
            className="md:hidden w-10 h-10 rounded-xl bg-bg-card border border-border-light flex items-center justify-center hover:border-accent/40">
            <div className="flex flex-col gap-[5px]">
              <span className={`block w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-4 h-[2px] bg-text-secondary rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? "max-h-64 border-b border-border-light" : "max-h-0"}`}>
        <div className="px-5 py-4 bg-bg-glass backdrop-blur-xl space-y-1">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-accent rounded-lg hover:bg-accent-soft transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
