<script setup>
const props = defineProps({
  example: String,
});
const loading = ref(false);
let images = ref([]);
onMounted(async () => {
  load();
});
async function load() {
  loading.value = true;
  images.value = props.example ? await useExample().preview(props.example) : await useDocument().preview();
  loading.value = false;
}
</script>

<template>
  <Loading v-if="loading" />

  <div v-else class="carousel">
    <div v-for="(image, i) in images" class="carousel-item w-full text-center justify-center" :id="`item${i}`" :key="i">
      <a :href="image" target="_blank"><img :src="image" class="rounded-md inline shadow-xl" /></a>
    </div>
  </div>
  <div class="flex justify-center w-full py-2 gap-2">
    <a v-for="(_, i) in images" :href="`#item${i}`" class="btn btn-xs">{{ i + 1 }}</a>
  </div>
</template>

<style scoped>
img {
  width: 300px;
  height: auto;
}
</style>
