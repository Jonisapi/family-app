import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["avatars/*.png", "assets/*.png"],
      manifest: {
        name: "משפחת ספיר - מעקב סוכר",
        short_name: "סוכר משפחתי",
        description: "אפליקציה משפחתית להפחתת סוכר",
        theme_color: "#1a4731",
        background_color: "#faf7f2",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        dir: "rtl",
        lang: "he",
        icons: [
          {
            src: "/avatars/avatar-1.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/avatars/avatar-1.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      "/api": "http://localhost:8787"
    }
  }
})
