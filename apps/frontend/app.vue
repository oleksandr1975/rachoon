<script setup lang="ts">
useHead({
  title: "rachoon",
});
await useProfile().init();

window.addEventListener("keyup", (e) => {
  if (e.key === "Escape") {
  }
});
</script>

<template>
  <div v-if="useProfile().loading === true">Loading</div>
  <div id="app" data-theme="rachoon" v-else>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped lang="scss">
#app {
  @apply bg-base-200;
}
</style>
