<script setup lang="ts">
useClient().form();
</script>

<template>
  <Loading v-if="useClient().loading" />

  <form @submit="useClient().save">
    <FormHeader :title="useClient().client.name || `${useClient().client.id === null ? 'New' : 'Edit'} Client`" icon="fa-user">
      <template #buttons>
        <button v-if="useClient().client.id !== ''" class="btn btn-sm btn-error gap-2 btn-outline">
          <FaIcon icon="fa-solid fa-close" />
          Delete
        </button>
        <button class="btn btn-sm btn-neutral" type="submit">
          <FaIcon icon="fa-solid fa-save " />
          {{ useClient().client.id === "" ? "Create Client" : "Save" }}
        </button>
      </template>
    </FormHeader>

    <ul v-if="useClient().hasErrors" class="border-2 border-warning rounded p-5 mt-5 mb-10">
      <li v-for="e in useClient().client.errors()" class="text-warning">
        {{ e }}
      </li>
    </ul>

    <FormSection title="Client Information" description="Manage your clients">
      <ClientFormBasic />
    </FormSection>
    <FormSection title="Address" description="Enter the full registered address.">
      <ClientFormAddress />
    </FormSection>
    <FormSection title="Primary Contact" description="Provide main contact person and email address.">
      <ClientFormContact />
    </FormSection>
    <FormSection title="Conditions" description="Specify agreed payment terms and conditions.">
      <ClientFormConditions />
    </FormSection>
  </form>
</template>
