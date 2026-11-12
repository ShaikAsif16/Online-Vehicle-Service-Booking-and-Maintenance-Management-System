/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#0a0c10',
          900: '#0f1218',
          850: '#141820',
          800: '#1a1f2c',
          750: '#212738',
          700: '#2a3144',
          600: '#3d465e',
        },
        automotive: {
          orange: '#ff6200',
          amber: '#f97316',
          darkOrange: '#ea580c',
          glow: 'rgba(255, 98, 0, 0.25)',
          slate: '#2c3342',
          metallic: '#64748b'
        }
      },
      boxShadow: {
        'automotive': '0 4px 20px -2px rgba(0, 0, 0, 0.7), 0 0 15px -3px rgba(255, 98, 0, 0.15)',
        'automotive-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 25px -4px rgba(255, 98, 0, 0.25)',
        'glow-orange': '0 0 20px rgba(255, 98, 0, 0.4)'
      }
    },
  },
  plugins: [],
}
