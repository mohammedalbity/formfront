/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Cairo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'arabic': ['Cairo', 'Noto Sans Arabic', 'Arial', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
