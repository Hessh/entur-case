/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'layout': '20% 60% 20%',
      },
      colors: {
        "primary-blue": "#05426a",
        "accent-blue": "#092130",
        "primary-gray": "#f4f7fd",
        "title": "#12263a",
        "text": "#3c4c5b",
      },
      minHeight: {
        'full-header': 'calc(100vh - 4rem - 3.25rem)',
      },
      borderRadius: {
        radius: '4px'
      },
      boxShadow: {
        box: '#00000010 0px 2px 10px;'
      }
    },
  },
  plugins: [],
}
