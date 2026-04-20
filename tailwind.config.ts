import type { Config } from "tailwindcss";

const config: Config = {
  // Check these paths carefully!
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(auth)/**/*.{js,ts,jsx,tsx,mdx}",
  
  ],
  theme: {
    extend: {
      colors: {
        sky: "#2FA8CC",      // Primary
        deepBlue: "#1F4E79",  // Secondary
        saffron: "#FF6B00",   // Accent
        prestige: "#C9A227",  // Gold
        surface: "#E8F6FA",   // Background
      },
    },
  },
  plugins: [],
};
export default config;