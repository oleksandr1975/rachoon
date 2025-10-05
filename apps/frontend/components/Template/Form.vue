<script setup lang="ts">
const controller = () => useTemplate();
controller().form();

import { VAceEditor } from "vue3-ace-editor";
import "ace-builds/src-noconflict/mode-nunjucks";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-dracula";

const variables = {
  format: {
    currency: "use format.currency(value) to format numbers to locale",
    date: "use format.date(value) to format dates to locale",
  },
  t: "Use t(string) to translate strings to locale",
  object: useExample().invoice,
  organization: useProfile().me.organization,
  user: useProfile().me,
};
const vars = ref(JSON.stringify(variables, null, 2));
</script>

<template>
  <Loading v-if="controller().loading" />
  <form @submit="controller().save" v-else>
    <div>
      <FormHeader title="Template Editor" icon="fa-palette">
        <template #buttons>
          <Preview :templateId="useRoute().params['id'] as string" example="invoice" />

          <button type="button" @click="controller().duplicate(controller().item.id)" class="btn btn-sm btn-ghost btn-circle">
            <FaIcon icon="fa-solid fa-copy" />
          </button>
          <label v-if="!controller().item.isGlobal" type="button" class="btn btn-sm btn-ghost text-error" @click="controller().delete()">
            <FaIcon icon="fa-solid fa-close" />
            Delete
          </label>
          <button v-if="!controller().item.isGlobal" type="submit" class="btn btn-sm btn-neutral">
            <FaIcon icon="fa-solid fa-save" />
            {{ controller().item.id === "" ? "Create Template" : "Save" }}
          </button>
        </template>
      </FormHeader>

      <ul v-if="controller().hasErrors" class="border-2 border-warning rounded p-5 mt-5 mb-10">
        <li v-for="e in controller().item.errors()" class="text-warning">
          {{ e }}
        </li>
      </ul>

      <FormSection title="Template Name" description="Give your template a unique name.">
        <div>
          <label class="label w-full max-w-xs">
            <span class="label-text">
              Title
              <span class="text-error">*</span>
            </span>
          </label>
          <input
            type="text"
            v-model="controller().item.title"
            placeholder="Template name"
            required
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <div class="form-control w-24 mt-3">
            <label class="cursor-pointer label">
              <input type="checkbox" v-model="controller().item.default" class="checkbox checkbox-xs" />
              <span class="label-text">Default</span>
            </label>
          </div>
        </div>
      </FormSection>
      <FormSection title="Colors" description="Customize the colors for your template.">
        <div class="grid grid-cols-2 gap-2">
          <TemplateInputColor color="primary" />
          <TemplateInputColor color="secondary" />
          <TemplateInputColor color="border" />
          <TemplateInputColor color="bodyText" />
          <TemplateInputColor color="headerText" />
          <TemplateInputColor color="footerText" />
          <TemplateInputColor color="headerBackground" />
          <TemplateInputColor color="footerBackground" />
          <TemplateInputColor color="tableEvenBackground" />
          <TemplateInputColor color="tableOddBackground" />
        </div>
      </FormSection>
      <FormSection title="Custom Text before table" description="Add custom text before the item table">
        <Editor v-model="controller().item.data.texts.beforeTable" placeholder="Custom text before table" />
      </FormSection>
      <FormSection title="Custom Text after table" description="Add custom text after the item table">
        <Editor v-model="controller().item.data.texts.afterTable" placeholder="Custom text after table" />
      </FormSection>
      <div class="flex gap-3 px-10 mb-14 mt-5 w-full">
        <Editor class="w-1/4 h-72" v-model="controller().item.data.columns.first" title="Column First" placeholder="Text of first column" />
        <Editor
          class="w-1/4 h-72"
          v-model="controller().item.data.columns.second"
          title="Column Second"
          placeholder="Text of second column"
        />
        <Editor class="w-1/4 h-72" v-model="controller().item.data.columns.third" title="Column Third" placeholder="Text of third column" />
        <Editor
          class="w-1/4 h-72"
          v-model="controller().item.data.columns.fourth"
          title="Column Fourth"
          placeholder="Text of fourth column"
        />
      </div>
      <div class="divider"></div>

      <FormSection title="Custom HTML" description="Customize the HTML structure of your template.">
        <v-ace-editor v-model:value="controller().item.html" lang="nunjucks" theme="dracula" style="height: 800px" />
      </FormSection>
      <FormSection title="Variables" description="Available variables for your templates.">
        <v-ace-editor :readonly="true" v-model:value="vars" lang="json" theme="dracula" style="height: 800px" />
      </FormSection>
    </div>
  </form>
</template>

<style>
.ace-dracula {
  @apply bg-base-300;
}
.ace_gutter {
  @apply bg-base-200 !important;
}
</style>
