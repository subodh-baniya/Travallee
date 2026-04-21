/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        secondary: "#34495e",
        accent: "#3498db",
        success: "#27ae60",
        danger: "#e74c3c",
        warning: "#f39c12",
        muted: "#7f8c8d",
        dark: "#34495e",
        light: "#ecf0f1",
      },
      fontFamily: {
        playfair: ["'Playfair Display'", "serif"],
        dm: ["'DM Sans'", "sans-serif"],
      },
    },
  },
  plugins: [],
}
