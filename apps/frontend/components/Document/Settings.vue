<script setup lang="ts">
const controller = () => useDocument();
const emit = defineEmits(["close"]);
</script>

<template>
  <div>
    <label class="label">Use Template</label>
    <select class="select select-bordered select-sm bg-base-300 max-w-56" v-model="controller().item.templateId">
      <option value="null" key="default">Default Template</option>
      <option v-for="u in controller().templates" :value="u.id" :key="u.title">
        {{ u.title }}
      </option>
    </select>
  </div>
  <label class="label mt-5">Text before table</label>
  <Editor
    v-model="controller().item.data.headingText"
    placeholder="Add a text that will be shown before the table ..."
    class="bg-transparent"
  />

  <label class="label mt-5">Text after table</label>
  <Editor
    v-model="controller().item.data.footerText"
    placeholder="Add a text that will be shown after the table ..."
    class="bg-transparent"
  />
  <div class="divider"></div>
  <form method="dialog" class="text-right">
    <button class="btn btn-sm btn-neutral" @click="emit('close')">OK</button>
  </form>
</template>
