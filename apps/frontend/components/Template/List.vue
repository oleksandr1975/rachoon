<script setup lang="ts">
import type { Template } from "~/models/template";
const controller = () => useTemplate();
controller().list();

const isDefault = (t: Template) => {
  const orgHasDefaultTemplate = controller().items.filter((t) => !t.isGlobal && t.default).length > 0;
  return (t.isGlobal && t.default && !orgHasDefaultTemplate) || (!t.isGlobal && t.default);
};
</script>

<template>
  <Loading v-if="controller().loading" />
  <div v-else>
    <FormHeader title="Templates" icon="fa-palette">
      <template #buttons>
        <NuxtLink class="btn btn-sm btn-neutral gap-2 no-underline" href="/templates/new">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New template
        </NuxtLink>
      </template>
    </FormHeader>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 px-10 mt-5">
      <div
        :class="`${isDefault(t) ? 'bg-base-300' : 'bg-base-100'} shadow-lg min-h-60 py-5 rounded-md shadow-lg`"
        v-for="t in controller().items"
        :key="t.id"
      >
        <NuxtLink :to="`/templates/${t.id}`">
          <div class="text-center">
            <div><img :src="t.thumbnail" class="w-32 inline-block rounded-md" /></div>
            <div class="text-xs mt-2">
              {{ t.title }}
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
