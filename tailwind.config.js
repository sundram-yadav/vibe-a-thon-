/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: '#FF6B00',
        'saffron-light': '#FF9A3C',
        'saffron-dark': '#CC5500',
        'deep-amber': '#B8500A',
        'plant-dark': '#0A0A0A',
        'plant-steel': '#1A1A2E',
        'pipe-gray': '#2D3748',
        'chalk': '#F5F0E8',
      },
      fontFamily: {
        chalk: ['Caveat', 'cursive'],
        display: ['"Special Elite"', 'cursive'],
        mono: ['"Share Tech Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
