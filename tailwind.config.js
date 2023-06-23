/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        'open' : ["'Open Sans'", "sans-serif"],
        'raleway' : ["'Raleway'", "sans-serif"],
        'pacifico' : ["'Kaushan Script'", "cursive"]
      },
      colors: {
        cu_yellow : {
          100 : "#f5cb5c"
        },
        gold:{
          600 : "#c39f00"
        }
      }
    },
  },
  plugins: [],
}