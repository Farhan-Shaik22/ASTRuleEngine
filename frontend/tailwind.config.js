/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        'myFont': ['title'],
      },
      fontSize:{
        sm: '1rem',
        med: '1.15rem',
        base: '1.5rem',
        lg:'2rem',
        xl: '2.5rem',
        '2xl': '3rem',
        '3xl': '3.5rem',
        '4xl': '4rem',
        '5xl': '4.5rem',
        '6xl':'5rem',
        '7xl':'6rem',
        '8xl':'8rem',
        '9xl':'10rem',
        '10xl':'12rem',
        '11xl':'14rem',
        '12xl':'16rem',
        '13xl':'18rem',
      }
    },
  },
  plugins: [],
};