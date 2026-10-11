/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FFD600",
          yellowHover: "#FFE033",
          yellowDark: "#C7A700",
          bg: "#09090b",
          card: "#121215",
          cardHover: "#18181c",
          border: "#27272a",
          input: "#18181b",
          textMuted: "#a1a1aa"
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Rajdhani', 'sans-serif']
      },
      boxShadow: {
        'yellow-glow': '0 0 20px rgba(255, 214, 0, 0.3)',
        'yellow-glow-lg': '0 0 35px rgba(255, 214, 0, 0.45)',
        'cyber': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 10px rgba(255, 214, 0, 0.15)'
      }
    },
  },
  plugins: [],
}
