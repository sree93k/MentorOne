const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Adjust this based on your project structure
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react/class-list.json",
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbiteReact],
};
