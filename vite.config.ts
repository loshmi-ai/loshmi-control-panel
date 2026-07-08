import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@src": "/src",
    },
  },
  plugins: [
    cloudflare({
      viteEnvironment: {
        // This selects React Router's SSR Vite environment; it is config, not
        // the Worker name. The Cloudflare plugin API shape is misleading here.
        name: "ssr",
      },
    }),
    tailwindcss(),
    reactRouter(),
  ],
});
