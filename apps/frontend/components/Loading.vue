<template>
  <div class="text-center align-middle flex justify-center" :class="maxHeight ? 'min-h-dvh' : ''">
    <span class="loading loading-bars loading-lg"></span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  maxHeight: { type: Boolean, default: true },
});
</script>
