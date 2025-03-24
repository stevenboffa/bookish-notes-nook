
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      'import.meta.env.VITE_USE_STAGING': JSON.stringify(env.VITE_USE_STAGING || 'false'),
      'import.meta.env.VITE_SUPABASE_STAGING_URL': JSON.stringify(env.VITE_SUPABASE_STAGING_URL || ''),
      'import.meta.env.VITE_SUPABASE_STAGING_KEY': JSON.stringify(env.VITE_SUPABASE_STAGING_KEY || '')
    }
  };
});
