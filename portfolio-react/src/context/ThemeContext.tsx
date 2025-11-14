import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemeName = "kid" | "purple" | "black";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_CLASSES: ThemeName[] = ["kid", "purple", "black"];
const THEME_STORAGE_KEY = "theme";
const ANIMATION_STORAGE_KEY = "animations";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return "kid";
    const stored = window.localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeName | null;
    return stored && THEME_CLASSES.includes(stored) ? stored : "kid";
  });

  const [animationsEnabled, setAnimationsEnabledState] = useState<boolean>(
    () => {
      if (typeof window === "undefined") return true;
      const stored = window.localStorage.getItem(ANIMATION_STORAGE_KEY);
      return stored !== "false";
    }
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    THEME_CLASSES.forEach((name) => body.classList.remove(`theme-${name}`));
    body.classList.add(`theme-${theme}`);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.classList.toggle("animations-disabled", !animationsEnabled);
    try {
      window.localStorage.setItem(
        ANIMATION_STORAGE_KEY,
        String(animationsEnabled)
      );
    } catch {
      /* ignore */
    }
  }, [animationsEnabled]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: ThemeName) => setThemeState(next),
      animationsEnabled,
      setAnimationsEnabled: (enabled: boolean) =>
        setAnimationsEnabledState(enabled),
    }),
    [theme, animationsEnabled]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
