/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { 950: '#060A14', 900: '#0A101D', 800: '#0F1829', 700: '#162238', 600: '#1F2F4A' },
        char: { 900: '#0D1017', 800: '#141821' },
        nova: { cyan: '#22D3EE', violet: '#8B5CF6', mint: '#34D399' },
      },
    },
  },
  plugins: [],
};
