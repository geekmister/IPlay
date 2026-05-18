import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './app.vue',
    './plugins/**/*.{js,ts}',
    './public/js/app.js',
    './.nuxt/ui/**/*.{js,ts}',
    './node_modules/@nuxt/ui/**/*.{js,ts,vue}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1'
      }
    }
  },
  plugins: []
} satisfies Config
