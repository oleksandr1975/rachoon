<script setup lang="ts">
definePageMeta({
  layout: "core",
});
const route = useRoute();
const menu = route.params.menu as string;

function save(e: any) {
  e.preventDefault();
  useSettings().save();
}
</script>

<template>
  <form @submit="save">
    <FormHeader title="Settings" description="Manage your application settings" icon="fa-solid fa-gear">
      <template #buttons>
        <button type="submit" class="btn btn-sm btn-neutral">
          <FaIcon icon="fa-solid fa-save " />
          Save
        </button>
      </template>
      >
    </FormHeader>
    <div class="flex gap-2"></div>
    <SettingsOrganization v-if="menu === 'organization'" />
    <SettingsLocale v-if="menu === 'locale'" />
    <SettingsTaxes v-if="menu === 'taxes'" />
    <SettingsUnits v-if="menu === 'units'" />
    <SettingsDocuments v-if="menu === 'documents'" />
    <SettingsClients v-if="menu === 'clients'" />
  </form>
</template>
