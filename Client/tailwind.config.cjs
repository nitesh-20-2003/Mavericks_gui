/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        greatVibes: ['"Great Vibes"', "serif"], 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["fantasy", "dracula", "retro", "dark"],


    
  },
};
