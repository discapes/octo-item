import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import replace from "@rollup/plugin-replace";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    replace({
      "process.env.DEV": (!!process.env.DEV).toString(),
      preventAssignment: true
    }),
  ],
});
