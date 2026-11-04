/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        nude: {
          50: '#FDF8F6',
          100: '#FAEFEC',
          200: '#F5E0D9',
          300: '#EBC9BE',
          400: '#DFB0A2',
          500: '#D4A99A',
          600: '#C49585',
          700: '#B07F6F',
          800: '#9C6C5D',
          900: '#7D5245',
        },
        cream: {
          DEFAULT: '#FBF7F4',
          50: '#FFFDFB',
          100: '#FDF9F5',
          200: '#FBF4ED',
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        serif: ['"Noto Serif SC"', '"STSong"', '"SimSun"', 'serif'],
      },
    },
  },
  plugins: [],
}
