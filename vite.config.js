import { defineConfig } from "vite";

export default defineConfig ({
    base:"/2d-game-portfolio/",
    build: {
        minify:"terser",
    },
});