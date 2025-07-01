const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    // Adjust this based on your project structure
    "./src/**/*.{js,ts,jsx,tsx}",
    ".flowbite-react/class-list.json",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        scroll:
          "scroll var(--animation-duration, 40s) var(--animation-direction, forwards) linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      keyframes: {
        scroll: {
          to: {
            transform: "translate(calc(-50% - 0.5rem))",
          },
        },
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
    },
  },
  plugins: [flowbiteReact],
};
/** @type {import('tailwindcss').Config} */
// module.exports = {
//   darkMode: "class",
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/**/*.{js,ts,jsx,tsx}", // Make sure to include your source directory if different
//   ],
//   theme: {
//     extend: {
//       animation: {
//         "fade-in": "fadeIn 0.3s ease-out forwards",
//         "bounce-in": "bounceIn 0.5s ease-out forwards",
//         "fade-in-down": "fadeInDown 0.4s ease-out forwards",
//         shake: "shake 0.5s cubic-bezier(.36,.07,.19,.97) both",
//       },
//       keyframes: {
//         fadeIn: {
//           from: { opacity: "0", transform: "translateY(-10px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//         bounceIn: {
//           "0%": { transform: "scale(0.3)", opacity: "0" },
//           "50%": { transform: "scale(1.1)", opacity: "1" },
//           "70%": { transform: "scale(0.9)" },
//           "100%": { transform: "scale(1)" },
//         },
//         fadeInDown: {
//           from: { opacity: "0", transform: "translateY(-20px)" },
//           to: { opacity: "1", transform: "translateY(0)" },
//         },
//         shake: {
//           "0%": { transform: "translateX(0)" },
//           "20%": { transform: "translateX(-5px)" },
//           "40%": { transform: "translateX(5px)" },
//           "60%": { transform: "translateX(-5px)" },
//           "80%": { transform: "translateX(5px)" },
//           "100%": { transform: "translateX(0)" },
//         },
//       },
//     },
//   },
//   plugins: [flowbiteReact],
// };
