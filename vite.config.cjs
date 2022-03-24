const path = require('path')
const { defineConfig } = require('vite')
const css_filename = 'style.css'

module.exports = defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'day-range-picker/day-range-picker.js'),
      name: 'day-range-picker',
      fileName: (format) => `day-range-picker.${format}.js`,
      minify: true
    },
    minify: true
  },
})