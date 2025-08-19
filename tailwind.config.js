const {theme} = require('@sanity/demo/tailwind')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './sanity/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    ...theme,
    extend: {
      colors: {
        blue: '#1B2730',
      },
    },
    // Overriding fontFamily to use @next/font loaded families
    fontFamily: {
      sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], // Archivo
      serif: ['var(--font-serif)', 'Georgia', 'serif'], // PT Serif
      mono: ['var(--font-mono)', 'ui-monospace', 'monospace'], // IBM Plex Mono
      display: ['var(--font-display)', 'var(--font-sans)'], // Antonio
    },
  },
  safelist: [
    {pattern: /^(p|pt|pb|py)-(0|2|3|4|5|6|8|10|12|16|20)$/},
    {pattern: /^sm:(p|pt|pb|py)-(8|10|20)$/},
  ],
  plugins: [require('@tailwindcss/typography')],
}
