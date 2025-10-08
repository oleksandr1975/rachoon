// https://nuxt.com/docs/api/configuration/nuxt-config
//
export default defineNuxtConfig({
  css: ["~/assets/style.scss", "@fortawesome/fontawesome-svg-core/styles.css"],
  devtools: { enabled: true },
  ssr: false,
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  runtimeConfig: {
    public: {
      apiURL: process.env.API_URL || "https://api.rachoon.work",
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss"],
  build: {
    transpile: [
      "h3",
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-solid-svg-icons",
      "@fortawesome/free-regular-svg-icons",
      "@vuepic/vue-datepicker",
    ],
  },
});
