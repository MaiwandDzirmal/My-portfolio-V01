import type { ChangeEvent } from "react";
import type { ThemeName } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

const THEME_LABELS: Record<ThemeName, string> = {
  kid: "Kid Fun",
  purple: "Royal Purple",
  black: "Midnight",
};

export default function ThemeMenu() {
  const { theme, setTheme } = useTheme();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value as ThemeName;
    setTheme(value);
  };

  return (
    <label className="theme-menu">
      <span className="sr-only">Select theme</span>
      <select value={theme} onChange={handleChange} aria-label="Theme selector">
        {Object.entries(THEME_LABELS).map(([value, label]) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
