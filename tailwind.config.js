module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,.tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: "#0f172a" },
        teal: { 400: "#2dd4bf", 500: "#0ea5a4", 600: "#0d9488" },
        sky: { 400: "#38bdf8" },
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    },
  },
  plugins: [],
}
