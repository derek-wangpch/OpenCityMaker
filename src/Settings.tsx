import type { Locale } from "./cities/types";
import type { GameController } from "./game/useGame";
import { useTheme, type ThemePreference } from "./theme";
/** One labelled row with a boolean switch on the right. */
function Toggle({
  id,
  label,
  hint,
  on,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <div className="settings-row">
      <span className="settings-label">
        <span id={id}>{label}</span>
        {hint && <small id={`${id}-hint`}>{hint}</small>}
      </span>
      <button
        type="button"
        className="switch"
        role="switch"
        aria-checked={on}
        aria-labelledby={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onClick={onChange}
      >
        <span className="switch-knob" />
      </button>
    </div>
  );
}
/**
 * The preferences body, shared by the desktop dialog and the phone page. Every
 * control writes straight through the game controller, so a change is persisted
 * by the same effect that saves the run.
 */
export function Settings({ game }: { game: GameController }) {
  const {
    t,
    locale,
    setLocale,
    moveMode,
    setMoveMode,
    showLabels,
    toggleLabels,
    weather,
    setWeather,
    reduced,
    setReduced,
  } = game;
  const { preference, choose } = useTheme();
  const themes: [ThemePreference, string][] = [
    ["system", t.themeSystem],
    ["light", t.themeLight],
    ["dark", t.themeDark],
  ];
  return (
    <div className="settings">
      <section className="settings-group">
        <h3>{t.gameplay}</h3>
        <Toggle
          id="setting-step"
          label={t.stepMove}
          hint={t.stepMoveHint}
          on={moveMode === "step"}
          onChange={() => setMoveMode(moveMode === "step" ? "slide" : "step")}
        />
      </section>
      <section className="settings-group">
        <h3>{t.board}</h3>
        <Toggle
          id="setting-numbers"
          label={t.numbers}
          on={showLabels}
          onChange={toggleLabels}
        />
        {/* On or off only. The board toolbar picks an individual state, which
            the changeover moves on from anyway, so offering the six here would
            promise a persistence this has never had. */}
        <Toggle
          id="setting-weather"
          label={t.weather}
          hint={t.weatherHint}
          on={weather !== "off"}
          onChange={() => setWeather(weather === "off" ? "clear" : "off")}
        />
      </section>
      <section className="settings-group">
        <h3>{t.appearance}</h3>
        <div className="settings-row">
          <span className="settings-label">
            <span id="setting-theme">{t.appearance}</span>
          </span>
          <select
            aria-labelledby="setting-theme"
            value={preference}
            onChange={(e) => choose(e.target.value as ThemePreference)}
          >
            {themes.map(([option, name]) => (
              <option key={option} value={option}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="settings-row">
          <span className="settings-label">
            <span id="setting-language">{t.language}</span>
          </span>
          <select
            aria-labelledby="setting-language"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            <option value="en">English</option>
            <option value="zh-CN">简体中文</option>
            <option value="zh-HK">繁體中文</option>
          </select>
        </div>
        <Toggle
          id="setting-motion"
          label={t.reduce}
          on={reduced}
          onChange={() => setReduced((v) => !v)}
        />
      </section>
      <p className="muted settings-note">{t.settingsHint}</p>
    </div>
  );
}
