import type { ChangeEvent } from "react";
import type { ThemeName } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";

const THEME_DESCRIPTIONS: Record<ThemeName, string> = {
  kid: "Rainbow fun with bright gradients and playful animations.",
  purple: "Royal purple gradients with a calm, elegant vibe.",
  black: "Midnight mode with golden accents and a sleek feel.",
};

export default function SettingsPage() {
  const { theme, setTheme, animationsEnabled, setAnimationsEnabled } =
    useTheme();

  const handleThemeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value as ThemeName;
    setTheme(value);
  };

  return (
    <div className="page">
      <section className="page-hero">
        <h1>Settings</h1>
        <p>Customize how the site looks and feels.</p>
      </section>

      <div className="settings-grid">
        <section className="card">
          <h2>Theme Colors</h2>
          <p>Pick the vibe that matches your mood.</p>
          <div className="theme-options">
            {(Object.keys(THEME_DESCRIPTIONS) as ThemeName[]).map(
              (themeName) => (
                <label
                  key={themeName}
                  className={`theme-option ${
                    theme === themeName ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={themeName}
                    checked={theme === themeName}
                    onChange={handleThemeChange}
                  />
                  <span className="title">
                    {themeName === "kid"
                      ? "Kid Fun"
                      : themeName === "purple"
                      ? "Royal Purple"
                      : "Midnight"}
                  </span>
                  <span className="description">
                    {THEME_DESCRIPTIONS[themeName]}
                  </span>
                </label>
              )
            )}
          </div>
        </section>

        <section className="card">
          <h2>Animations</h2>
          <p>Turn automatic animations on or off across the site.</p>
          <label className="switch">
            <input
              type="checkbox"
              checked={animationsEnabled}
              onChange={(event) => setAnimationsEnabled(event.target.checked)}
            />
            <span className="slider" />
            <span className="switch-label">
              {animationsEnabled ? "Animations enabled" : "Animations disabled"}
            </span>
          </label>
          <small className="hint">
            Disabling animations helps with focus or motion sensitivity.
          </small>
        </section>
      </div>
    </div>
  );
}
