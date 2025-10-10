<script setup lang="ts">
useHead({
  title: "rachoon",
});
await useProfile().init();
useApp().shortcuts();
</script>

<template>
  <div v-if="useProfile().loading" class="h-svh items-center flex justify-center"><Loading /></div>
  <div id="app" data-theme="rachoon" v-else>
    <AppConfirm />
    <KBCheatSheet />

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
