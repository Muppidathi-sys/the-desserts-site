/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EDC20E',
          dark: '#D4AE0C',
          light: '#FFD52E'
        },
        secondary: {
          DEFAULT: '#1A1A1A',
          light: '#666666'
        },
        success: {
          DEFAULT: '#22C55E',
          light: '#BBF7D0'
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FEF3C7'
        },
        info: {
          DEFAULT: '#3B82F6',
          light: '#DBEAFE'
        }
      },
      borderRadius: {
        'xl': '1rem'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)'
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 