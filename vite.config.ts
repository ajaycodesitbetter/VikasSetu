// The TanStack Start Vite preset configures TanStack Start, React, Tailwind CSS,
// Nitro build targets, path aliases, and environment injection.
// Additional config can be passed via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
