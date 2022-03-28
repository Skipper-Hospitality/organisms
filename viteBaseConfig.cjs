import path from "path"

export function getBaseViteConfig(dirname, override) {
    const isExternal = (id) => !id.startsWith(".") && !path.isAbsolute(id)

    return {
        build: {
            lib: {
                entry: path.resolve(dirname, "src/index.js"),
                formats: ["es"],
            },
            rollupOptions: {
                external: isExternal,
            },
        },
        ...override,
    }
}