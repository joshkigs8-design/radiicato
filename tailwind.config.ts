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
          ink: "#0A0A0A",
          "ink-muted": "#71717A",
          "ink-faint": "#A1A1AA",
          line: "#E4E4E7",
          "line-faint": "#F4F4F5",
          surface: "#FAFAFA",
          "surface-alt": "#F4F4F5",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.06em",
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.2em",
        mega: "0.3em",
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 15vw, 12rem)", { lineHeight: "0.88", letterSpacing: "-0.06em" }],
        "display-lg": ["clamp(2.5rem, 10vw, 8rem)", { lineHeight: "0.88", letterSpacing: "-0.06em" }],
        "display-md": ["clamp(2rem, 6vw, 5rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
        "display-sm": ["clamp(1.5rem, 4vw, 3rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 0.6s ease forwards",
        "marquee": "marquee 30s linear infinite",
        "marquee-fast": "marquee 15s linear infinite",
        "clip-reveal": "clip-reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
      },
      keyframes: {
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "clip-reveal": {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0 0 0)" },
        },
        "scale-in": {
          from: { transform: "scale(0.97)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
