/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bg-header': '#2c2c3b',
        secondary: '#5e5e79',
        primary: '#404051',
        'shadow-primary': '0 1px 5px rgba(0,0,0,0.65)',
      },
    },
  },
  plugins: [],
};
