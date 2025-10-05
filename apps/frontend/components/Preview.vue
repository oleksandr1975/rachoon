<script setup lang="ts">
const modal = ref(null);
const open = ref(false);
const loading = ref(false);
let images = ref<string[]>([]);

const props = defineProps({
  example: { type: String, required: false, default: "" },
  templateId: String,
});

async function load() {
  loading.value = true;
  images.value =
    props.example !== "" ? await useExample().preview(props.example, props.templateId as string) : await useDocument().preview();
  loading.value = false;
}

watch(
  () => open.value,
  (o) => {
    if (open.value) {
      load();
    }
  },
);
</script>

<template>
  <label
    class="btn btn-sm btn-ghost btn-circle"
    for="preview-modal"
    @click="
      modal.showModal();
      open = true;
    "
  >
    <FaIcon icon="fa-solid fa-eye" />
  </label>

  <dialog
    ref="modal"
    class="modal"
    @close="
      () => {
        open = false;
      }
    "
  >
    <div class="">
      <Loading v-if="loading" />
      <div class="carousel max-w-full" v-else>
        <div class="carousel-item w-full text-center justify-center" v-for="(image, i) in images" :key="i" :id="`item${i}`">
          <a :href="image" target="_blank"><img :src="image" class="rounded-md inline shadow-xl max-h-[80vh]" /></a>
        </div>
      </div>
      <div class="flex justify-center w-full py-2 gap-2">
        <a v-for="(image, i) in images" :key="i" :href="`#item${i}`" class="btn btn-xs no-underline">{{ i + 1 }}</a>
      </div>
    </div>
  </dialog>
</template>
