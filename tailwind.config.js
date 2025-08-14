const {theme} = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...theme,
    // Overriding fontFamily to use @next/font loaded families
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // Archivo
      serif: ['var(--font-serif)', 'Georgia', 'serif'], // PT Serif
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'], // IBM Plex Mono
      display: ['var(--font-display)', 'var(--font-sans)'], // Antonio
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
