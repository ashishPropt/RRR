/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a2e3b',
          dark: '#111f29',
          light: '#243d4d',
        },
        accent: {
          DEFAULT: '#4ab5c4',
          dark: '#2e8fa0',
          light: '#7fd0db',
        },
        gold: '#c9a84c',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
