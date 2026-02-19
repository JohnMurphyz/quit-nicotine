/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito_400Regular'],
        'sans-medium': ['Nunito_500Medium'],
        'sans-semibold': ['Nunito_600SemiBold'],
        'sans-bold': ['Nunito_700Bold'],
        'sans-extrabold': ['Nunito_800ExtraBold'],
      },
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        cream: {
          50: '#faf8f5',
          100: '#f5f0eb',
          200: '#ede5db',
        },
        dark: {
          600: '#3a3580',
          700: '#252260',
          800: '#1a1745',
          900: '#0f0d2e',
        },
        warm: {
          50: '#faf7f4',
          100: '#f5efe8',
          200: '#ebe1d4',
          300: '#d4c4b0',
          400: '#b09a82',
          500: '#8c7a66',
          600: '#6b5d4e',
          700: '#4a3f33',
          800: '#362d23',
          900: '#2a2118',
        },
      },
    },
  },
  plugins: [],
};
