/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ["light", "dark", "cupcake","dracula","valentine"],
  },
  plugins: [require("daisyui")],
};
