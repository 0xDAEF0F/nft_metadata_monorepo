module.exports = {
  ...require('../../.prettierrc.js'),
  semi: false,
  tabWidth: 2,
  bracketSpacing: true,
  jsxSingleQuote: true,
  plugins: [require('prettier-plugin-tailwindcss')],
}
