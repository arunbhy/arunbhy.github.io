/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
  ],
  theme: {
    extend: {},
    fontFamily: {
      'display': ["Encode Sans"],
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'selector',
}
