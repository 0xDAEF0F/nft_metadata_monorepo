/** @type {import('tailwindcss').config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', 'node_modules/flowbite-react/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('flowbite/plugin')],
}
