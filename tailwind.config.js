/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{html,js}',  // If you have a pages directory
    './js/*.js',
    './index.html', // If you have a single root index.html
    // Add other directories or files where Tailwind classes are used
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  darkMode: 'class', // or 'media' for media query based dark mode
}