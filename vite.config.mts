import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

export default () => {
  return defineConfig({
    plugins: [
      react(),
      checker({
        eslint: {
          lintCommand: "eslint .",
          useFlatConfig: true,
        },
        typescript: true,
      }),
    ],
    assetsInclude: ["**/*.MD"],
    build: {
      outDir: "build",
    },
  });
};
