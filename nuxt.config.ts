import vuetify from "vite-plugin-vuetify"

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mqttHost: "",
      mqttPort: "",
      mqttUseSsl: false,
      ambientLightIntensity: 0.2,
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
