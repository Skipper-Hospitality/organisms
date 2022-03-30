const path = require("path");
const { defineConfig } = require("vite");

module.exports = defineConfig({
    build: {
        lib: {
            entry: path.resolve(__dirname, "./index.js"),
            formats: ["cjs","es"],
            name: "Organism",
        },
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                'organism': path.resolve(__dirname, "./index.js"),
                'day-range-picker': path.resolve(__dirname, "./day-range-picker/day-range-picker.js"), 
                'accommodation-search-form': path.resolve(__dirname, "./accommodation-search-form/accommodation-search-form.js"),
            },
            output: {
                assetFileNames: `[name].[ext]`,
                entryFileNames: fn => {
                    return `[name].[format].js`
                },
            },
        },
        minify: true,
    },
});
