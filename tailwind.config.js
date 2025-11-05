module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#050506",
          surface: "#0C0D10",
          surfaceSoft: "#14161A",
          text: "#F5F6F7",
          muted: "#9EA3AE",
          accent: "#F2EDE0",
          accentSoft: "rgba(242, 237, 224, 0.12)",
          signal: "#F2503A"
        }
      },
      fontFamily: {
        display: ["EngraversOldEnglish", "ui-sans-serif", "system-ui"],
        sans: ["Inter", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: []
};
