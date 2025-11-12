/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        canaria: {
          yellow: "#FFDF00",
          green: "#009739",
          dark: "#0B3D2E"
        }
      },
      fontFamily: {
        sans: ["'Noto Sans JP'", "'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        header: "0 8px 24px rgba(11, 61, 46, 0.15)"
      }
    }
  },
  plugins: []
};
