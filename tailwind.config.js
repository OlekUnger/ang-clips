/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"], // where to search tailwind classes
  safelist: ['bg-blue-400', 'bg-green-400', 'bg-red-400'],
  theme: {
    extend: {},
    fontFamily: {
      roboto: ["Roboto"] // font- roboto
    }
  },
  plugins: [],
}

