/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-soft": "#F1F5F9",

        primary: "#2563EB",
        "primary-soft": "#DBEAFE",

        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",

        text: "#0F172A",
        "text-muted": "#64748B",

        border: "#E2E8F0",

        /* DARK MODE */
        darkbg: "#020617",
        darksurface: "#0F172A",
        darkborder: "#334155",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      borderRadius: {
        xl2: "1rem",
        xl3: "1.5rem",
      },

      transitionDuration: {
        200: "200ms",
      },
    },
  },

  plugins: [],
};
