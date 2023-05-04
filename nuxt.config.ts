import vuetify from "vite-plugin-vuetify"

export default defineNuxtConfig({
  modules: ["@vite-pwa/nuxt"],
  pwa: {},
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
