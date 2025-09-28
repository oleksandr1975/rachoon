<script setup lang="ts">
definePageMeta({
  layout: "core",
});

const clientId = useRoute().params.id as string;
</script>

<template>
  <div>
    <DocumentList :clientId="clientId" />
  </div>
</template>
