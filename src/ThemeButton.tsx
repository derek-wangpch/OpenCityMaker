import { Monitor, Moon, Sun } from "lucide-react";
import type { Messages } from "./i18n";
import { useTheme } from "./theme";

export function ThemeButton({ t }: { t: Messages }) {
  const { preference, cycle } = useTheme();
  const names = {
      system: t.themeSystem,
      light: t.themeLight,
      dark: t.themeDark,
    },
    label = `${t.appearance}: ${names[preference]}`;
  const Icon =
    preference === "system" ? Monitor : preference === "light" ? Sun : Moon;

  return (
    <button
      className="icon-button theme-button"
      type="button"
      title={label}
      aria-label={label}
      data-theme-preference={preference}
      onClick={cycle}
    >
      <Icon size={19} />
    </button>
  );
}
