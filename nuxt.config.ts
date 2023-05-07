import vuetify from "vite-plugin-vuetify"

export default defineNuxtConfig({
  modules: ["@vite-pwa/nuxt"],
  app: {
    head: {
      title: "MQTThree",
    },
  },
  pwa: {
    manifest: {
      name: "MQTThree",
      short_name: "MQTThree",
      description: "MQTT + Three.js",
      theme_color: "#444444",
      start_url: "",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
  },
  serverHandlers: [
    { route: "/express/**", handler: "~/customServer/index.ts" },
  ],
  runtimeConfig: {
    public: {
      mqttHost: "",
      mqttPort: "",
      mqttUseSsl: false,
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  hooks: {
    "vite:extendConfig": (config) => {
      config.plugins!.push(vuetify())
    },
  },
  vite: {
    ssr: {
      noExternal: ["vuetify"],
    },
    define: {
      "process.env.DEBUG": false,
    },
  },
  css: ["@/assets/main.scss", "@mdi/font/css/materialdesignicons.min.css"],
})
