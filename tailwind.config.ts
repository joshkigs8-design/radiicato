import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        radiicato: {
          black: "#0A0A0A",
          charcoal: "#18181B",
          surface: "#F4F4F5",
          border: "#E4E4E7",
          silver: "#71717A",
          "silver-muted": "#A1A1AA",
          white: "#FFFFFF",
          cream: "#FAFAF9",
          olive: {
            DEFAULT: "#4D5936",
            dark: "#384227",
            light: "#627045",
            muted: "#444E30",
            subtle: "#F4F6F0",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Cabinet Grotesk", "Syne", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
        widest: "0.2em",
        mega: "0.3em",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "marquee": "marquee 25s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

