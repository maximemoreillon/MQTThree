import vuetify from "vite-plugin-vuetify"

const {
  NUXT_MQTT_HOST,
  NUXT_MQTT_PORT,
  NUXT_MQTT_USERNAME,
  NUXT_MQTT_PASSWORD,
} = process.env

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      mqttHost: NUXT_MQTT_HOST,
      mqttPort: NUXT_MQTT_PORT,
    },
    mqttUsername: NUXT_MQTT_USERNAME,
    mqttPassword: NUXT_MQTT_PASSWORD,
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
