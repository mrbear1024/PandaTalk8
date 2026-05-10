"use client";

import { useEffect, useState } from "react";
import { LuMoon, LuSun } from "react-icons/lu";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = (localStorage.getItem("pt-theme") as Theme | null) ?? "light";
    setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pt-theme", theme);
  }, [theme, mounted]);

  const isDark = mounted && theme === "dark";
  const Icon = isDark ? LuSun : LuMoon;
  const label = isDark ? "Light" : "Dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label="toggle theme"
    >
      <Icon className="theme-toggle-icon" aria-hidden />
      <span className="theme-toggle-text">{label}</span>
    </button>
  );
}
