import type { Config } from "tailwindcss";

const defaultTheme = require("tailwindcss/defaultTheme");

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      "euclid-circular-a": ["Euclid Circular A"],
    },
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        xl: "0",
      },
    },
    colors: {
      current: "currentColor",
      transparent: "transparent",
      white: "#FFFFFF",
      black: "#000000",
      
      // Primary brand color - Sage Green
      primary: {
        DEFAULT: "#9CAF88", // Light mode sage green
        dark: "#7A9A7A", // Dark mode accent (muted sage green that works with dark background)
      },
      
      // CTA/Button Green (consistent across modes)
      cta: {
        DEFAULT: "#4CAF8E",
        hover: "#3D9B7A",
      },
      
      // Background colors
      bg: {
        DEFAULT: "#D1D5DB", // Light mode main background (Soft Gray)
        card: "#F9FAFB", // Light mode card/section background
        main: {
          DEFAULT: "#D1D5DB", // Light mode main
          dark: "lab(6% -0.8 1.5)", // Dark mode main background - darker for contrast with cards
        },
        cardDark: "lab(12% -1.5 3)", // Dark mode card/section background - much brighter with subtle green tint for better visibility
        hover: "#E5E7EB", // Light mode hover state
        hoverDark: "lab(14% -1.8 3.5)", // Dark mode hover state - much brighter green-black
      },
      
      // Text colors
      text: {
        primary: {
          DEFAULT: "#1F2933", // Light mode primary text (dark)
          dark: "#E8F0E8", // Dark mode primary text (soft green-tinted white for eye comfort)
        },
        secondary: {
          DEFAULT: "#6B7280", // Light mode secondary text
          dark: "#A8B5A8", // Dark mode secondary text (muted green-gray)
        },
        muted: {
          DEFAULT: "#9CA3AF", // Light mode muted text
          dark: "#7A8A7A", // Dark mode muted text (darker green-gray)
        },
      },
      
      // Border colors
      border: {
        DEFAULT: "#E5E7EB", // Light mode borders
        dark: "lab(14% -1.8 3.5)", // Dark mode borders - much brighter for better visibility
        light: "#F3F4F6", // Lighter borders
      },
      
      // Legacy colors - updated for compatibility
      body: {
        DEFAULT: "#6B7280",
        dark: "#A8B5A8", // Muted green-gray for dark mode
      },
      meta: {
        DEFAULT: "#F9FAFB",
        2: "#6B7280",
        3: "#4B5563",
        4: "#9CA3AF",
        5: "#D1D5DB",
      },
      dark: {
        DEFAULT: "#1F2933",
        2: "#374151",
        3: "#4B5563",
        4: "#6B7280",
        5: "#9CA3AF",
        // Dark mode variants with green-black tint
        "dark-bg": "lab(2.75381% 0 0)", // Base dark background
        "dark-card": "lab(8% -1 2)", // Card background - brighter for visibility
        "dark-hover": "lab(9.5% -1.2 2.5)", // Hover state - brighter
        "dark-border": "lab(9% -1.2 2)", // Border color - brighter for visibility
      },
      gray: {
        DEFAULT: "#D1D5DB",
        1: "#F9FAFB", // Card background light
        2: "#F3F4F6",
        3: "#E5E7EB", // Borders light
        4: "#D1D5DB", // Main bg light
        5: "#9CA3AF",
        6: "#6B7280",
        7: "#374151",
        8: "#1F2937",
      },
      // CTA and accent colors using green
      blue: {
        DEFAULT: "#4CAF8E", // CTA green
        dark: "#3D9B7A",
        light: "#57C39E",
        "light-2": "#6DD4B0",
        "light-3": "#8FE0C5",
        "light-4": "#B1ECD9",
        "light-5": "#D3F7EC",
      },
      red: {
        DEFAULT: "#EF4444",
        dark: "#DC2626",
        light: "#F87171",
        "light-2": "#FCA5A5",
        "light-3": "#FECACA",
        "light-4": "#FEE2E2",
        "light-5": "#FEF2F2",
        "light-6": "#FFF5F5",
      },
      green: {
        DEFAULT: "#4CAF8E",
        dark: "#3D9B7A",
        light: "#57C39E",
        "light-2": "#6DD4B0",
        "light-3": "#8FE0C5",
        "light-4": "#B1ECD9",
        "light-5": "#C2F3D6",
        "light-6": "#DAF8E6",
      },
      yellow: {
        DEFAULT: "#FBBF24",
        dark: "#F59E0B",
        "dark-2": "#D97706",
        light: "#FCD34D",
        "light-1": "#FDE68A",
        "light-2": "#FEF3C7",
        "light-4": "#FFFBEB",
      },
      teal: {
        DEFAULT: "#14B8A6",
        dark: "#0D9488",
      },
      orange: {
        DEFAULT: "#F97316",
        dark: "#EA580C",
      },
    },
    screens: {
      xsm: "375px",
      lsm: "425px",
      "3xl": "2000px",
      ...defaultTheme.screens,
    },
    extend: {
      fontSize: {
        "2xs": ["10px", "17px"],
        "heading-1": ["60px", "72px"],
        "heading-2": ["48px", "64px"],
        "heading-3": ["40px", "48px"],
        "heading-4": ["30px", "38px"],
        "heading-5": ["28px", "40px"],
        "heading-6": ["24px", "30px"],
        "custom-xl": ["20px", "24px"],
        "custom-lg": ["18px", "24px"],
        "custom-sm": ["14px", "22px"],
        "custom-xs": ["12px", "20px"],
        "custom-2xl": ["24px", "34px"],
        "custom-4xl": ["36px", "48px"],
        "custom-1": ["22px", "30px"],
        "custom-2": ["32px", "38px"],
        "custom-3": ["35px", "45px"],
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        7.5: "1.875rem",
        8.5: "2.125rem",
        9.5: "2.375rem",
        10.5: "2.625rem",
        11: "2.75rem",
        11.5: "2.875rem",
        12.5: "3.125rem",
        13: "3.25rem",
        13.5: "3.375rem",
        14: "3.5rem",
        14.5: "3.625rem",
        15: "3.75rem",
        15.5: "3.875rem",
        16: "4rem",
        16.5: "4.125rem",
        17: "4.25rem",
        17.5: "4.375rem",
        18: "4.5rem",
        18.5: "4.625rem",
        19: "4.75rem",
        19.5: "4.875rem",
        21: "5.25rem",
        21.5: "5.375rem",
        22: "5.5rem",
        22.5: "5.625rem",
        24.5: "6.125rem",
        25: "6.25rem",
        25.5: "6.375rem",
        26: "6.5rem",
        27: "6.75rem",
        27.5: "6.875rem",
        29: "7.25rem",
        29.5: "7.375rem",
        30: "7.5rem",
        31: "7.75rem",
        31.5: "7.875rem",
        32.5: "8.125rem",
        33: "8.25rem",
        34: "8.5rem",
        34.5: "8.625rem",
        35: "8.75rem",
        36.5: "9.125rem",
        37: "9.25rem",
        37.5: "9.375rem",
        39: "9.75rem",
        39.5: "9.875rem",
        40: "10rem",
        42.5: "10.625rem",
        45: "11.25rem",
        46: "11.5rem",
        47.5: "11.875rem",
        49: "12.25rem",
        50: "12.5rem",
        51: "12.75rem",
        51.5: "12.875rem",
        52: "13rem",
        52.5: "13.125rem",
        54: "13.5rem",
        54.5: "13.625rem",
        55: "13.75rem",
        55.5: "13.875rem",
        57.5: "14.375rem",
        59: "14.75rem",
        60: "15rem",
        62.5: "15.625rem",
        65: "16.25rem",
        67: "16.75rem",
        67.5: "16.875rem",
        70: "17.5rem",
        72.5: "18.125rem",
        75: "18.75rem",
        90: "22.5rem",
        92.5: "23.125rem",
        94: "23.5rem",
        100: "25rem",
        110: "27.5rem",
        115: "28.75rem",
        122.5: "30.625rem",
        125: "31.25rem",
        127.5: "31.875rem",
        132.5: "33.125rem",
        142.5: "35.625rem",
        150: "37.5rem",
        166.5: "41.625rem",
        171.5: "42.875rem",
        180: "45rem",
        187.5: "46.875rem",
        192.5: "48.125rem",
        203: "50.75rem",
        230: "57.5rem",
      },
      maxWidth: {
        30: "7.5rem",
        40: "10rem",
        50: "12.5rem",
      },
      zIndex: {
        999999: "999999",
        99999: "99999",
        9999: "9999",
        999: "999",
        99: "99",
        1: "1",
      },
      boxShadow: {
        1: "0px 1px 2px 0px rgba(166, 175, 195, 0.25)",
        2: "0px 6px 24px 0px rgba(235, 238, 251, 0.40), 0px 2px 4px 0px rgba(148, 163, 184, 0.05)",
        3: "0px 8px 32px 0px rgba(13, 10, 44, 0.15), 0px 4px 8px 0px rgba(148, 163, 184, 0.08)",
        testimonial:
          "0px 0px 4px 0px rgba(148, 163, 184, 0.10), 0px 6px 12px 0px rgba(224, 227, 238, 0.45)",
        breadcrumb: "0px 1px 0px 0px #E5E7EB, 0px -1px 0px 0px #E5E7EB",
        range:
          "0px 0px 1px 0px rgba(33, 37, 41, 0.08), 0px 2px 2px 0px rgba(33, 37, 41, 0.06)",
        filter: "0px 1px 0px 0px #E5E7EB",
        list: "1px 0px 0px 0px #E5E7EB",
        input: "inset 0 0 0 2px #4CAF8E",
        // Enhanced shadows for better visual appeal
        "hover": "0px 12px 40px 0px rgba(76, 175, 142, 0.15), 0px 4px 12px 0px rgba(76, 175, 142, 0.10)",
        "card": "0px 4px 16px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.04)",
        // Dark mode shadows
        "dark-1": "0px 1px 2px 0px rgba(0, 0, 0, 0.3)",
        "dark-2": "0px 6px 24px 0px rgba(0, 0, 0, 0.5), 0px 2px 4px 0px rgba(0, 0, 0, 0.2)",
        "dark-3": "0px 8px 32px 0px rgba(0, 0, 0, 0.4), 0px 4px 8px 0px rgba(0, 0, 0, 0.25)",
        "dark-hover": "0px 12px 40px 0px rgba(76, 175, 142, 0.25), 0px 4px 12px 0px rgba(76, 175, 142, 0.15)",
      },
      screens: {
        ...defaultTheme.screens,
      },
    },
  },
  plugins: [],
};
export default config;
