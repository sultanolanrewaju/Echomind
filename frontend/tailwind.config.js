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
          blue: "#0084FF",
          lightPink: "#F8ECEE",
          canvas: "#E5E5E5",
        },
      },
    },
  },
  plugins: [],
}