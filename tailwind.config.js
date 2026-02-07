/** @type {import('tailwindcss').Config} */
export default {
  // Ativa o Dark Mode via classe (usado no WorkspaceLayout)
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // O rosa principal do seu SaaS
        primary: {
          DEFAULT: '#E940AA',
          dark: '#5D2C99',
          light: 'rgba(233, 64, 170, 0.1)'
        },
        // Mapeamento das variáveis que definimos no index.css
        bg: {
          app: 'var(--bg-app)',
          surface: 'var(--surface)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        border: 'var(--border-color)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}