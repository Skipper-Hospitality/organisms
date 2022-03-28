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
                'day-range-picker': path.resolve(__dirname, "./day-range-picker/day-range-picker.js"), 
            },
            output: {
                assetFileNames: `[name].[ext]`,
                entryFileNames: fn => { 
                    console.log(fn.modules);
                    return `[name].[format].js`
                },
            },
        },
        minify: true,
    },
});
