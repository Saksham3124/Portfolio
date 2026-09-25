import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#060913",
        foreground: "#f1f5f9",
        navy: {
          950: "#030712",
          900: "#0a0f1d",
          850: "#0f172a",
          800: "#131d38",
          700: "#1e293b",
        },
        cyber: {
          cyan: "#06b6d4",
          blue: "#3b82f6",
          indigo: "#6366f1",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(circle at 50% 20%, rgba(99, 102, 241, 0.15), transparent 50%), radial-gradient(circle at 80% 40%, rgba(6, 182, 212, 0.12), transparent 40%)",
        "card-glow": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "border-glow": "borderGlow 3s ease infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        borderGlow: {
          "0%, 100%": { borderColor: "rgba(6, 182, 212, 0.3)" },
          "50%": { borderColor: "rgba(99, 102, 241, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
