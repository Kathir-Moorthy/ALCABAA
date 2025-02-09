/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all JS/TS files in the src directory
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-in-out', // Added slide-in animation
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      colors: {
        lightBg: '#F5F5F5',
        lightText: '#333333',
        lightButton: '#8B6538',
        lightButtonHover: '#6B4A2F',
        darkBg: '#1F1F1F',
        darkText: '#FFFFFF',
        darkButton: '#8B6538',
        darkButtonHover: '#BF8657',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'), // Enable custom scrollbars
    require('tailwind-scrollbar-hide'), // Optionally hide scrollbars
  ],
  variants: {
    scrollbar: ['rounded', 'dark'], // Enable dark mode variant for scrollbars
  },
};
