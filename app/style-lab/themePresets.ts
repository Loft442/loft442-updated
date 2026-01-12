export type ThemeTokens = {
  bg: string;
  text: string;
  panel: string;
  border: string;
  accent: string;
  muted: string;
  shadow: string;
  radius: string;
  glow: string;
};

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  tokens: ThemeTokens;
};

export const themePresets: ThemePreset[] = [
  {
    id: "midnight-luxe",
    name: "Midnight Luxe",
    description: "Dark, high-contrast styling with subtle glow accents.",
    tokens: {
      bg: "#0b0f16",
      panel: "#111827",
      border: "rgba(248, 250, 252, 0.12)",
      accent: "#f5b769",
      text: "#f8fafc",
      muted: "#9aa4b2",
      shadow: "0 24px 60px rgba(8, 10, 16, 0.6)",
      radius: "18px",
      glow: "rgba(245, 183, 105, 0.35)",
    },
  },
  {
    id: "warm-editorial",
    name: "Warm Editorial",
    description: "Warm off-black palette with softer edges and serif energy.",
    tokens: {
      bg: "#15110e",
      panel: "#1f1915",
      border: "rgba(214, 167, 108, 0.25)",
      accent: "#d6a76c",
      text: "#f7f2ea",
      muted: "#c7b9a8",
      shadow: "0 22px 50px rgba(9, 7, 6, 0.55)",
      radius: "16px",
      glow: "rgba(214, 167, 108, 0.3)",
    },
  },
  {
    id: "clean-minimal",
    name: "Clean Minimal",
    description: "Bright, minimal surfaces with crisp borders and subtle depth.",
    tokens: {
      bg: "#f8f7f4",
      panel: "#ffffff",
      border: "rgba(17, 24, 39, 0.15)",
      accent: "#2563eb",
      text: "#111827",
      muted: "#6b7280",
      shadow: "0 16px 35px rgba(17, 24, 39, 0.12)",
      radius: "12px",
      glow: "rgba(37, 99, 235, 0.2)",
    },
  },
];
