<script setup lang="ts">
const controller = () => useClient();

onMounted(() => {
  controller().list();
  controller().watchSearch();
});

const columns = [
  { label: "# Number", field: "number", class: "", width: "180" },
  { label: "Name", field: "name", class: "" },
  { label: "Offers", field: "offers", class: "" },
  { label: "Invoices", field: "pendingInvoices", class: "" },
  { label: "Reminders", field: "reminders", class: "" },
  { label: "", field: "actions", class: "text-right" },
];
</script>

<template>
  <Loading v-if="controller().loading" />
  <div v-else>
    <FormHeader title="Clients" icon="fa-user-tie" :divider="false" showSearch v-model="controller().search">
      <template #buttons>
        <NuxtLink class="btn btn-sm btn-neutral gap-2 no-underline" href="/clients/new">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New client
        </NuxtLink>
      </template>
    </FormHeader>
    <div class="text-center mt-20" v-if="controller().items.length === 0">
      <div class="prose">
        <FaIcon icon="fa-users" class="text-5xl" />
        <h1 class="mt-5">No clients</h1>
        <p>
          It appears you have
          <strong>no clients</strong>
          created. Go ahead and
          <NuxtLink href="/clients/new">create one</NuxtLink>
          .
        </p>
      </div>
    </div>
    <DataTable
      :columns="columns"
      :rows="useClient().items"
      :sortableFields="['number', 'name']"
      :showLoadMore="controller().hasMore()"
      @doLoadMore="controller().doLoadMore()"
      @sort="(sort) => controller().sort(sort)"
      :loading="controller().refresh || controller().loadMore"
    >
      <template #number="{ row }">
        <NuxtLink :href="`/clients/${row.id}`" class="link">
          {{ row.number }}
        </NuxtLink>
        <br />
        <small class="opacity-50">last modified {{ useFormat.date(row.updatedAt) }}</small>
      </template>

      <template #name="{ row }">
        {{ row.name }}
        <br />
        <small class="opacity-50">{{ row.data.info.vat }}</small>
      </template>

      <template #offers="{ row }">
        <NuxtLink :to="`/offers/client/${row.id}`">{{ row.totalOffers }} Offers</NuxtLink>
        <br />
        <span v-if="row.pendingOffers > 0" class="text-error text-opacity-50">{{ row.pendingOffers }}</span>
        &nbsp;
      </template>

      <template #pendingInvoices="{ row }">
        <NuxtLink :to="`/invoices/client/${row.id}`">{{ row.totalInvoices }} Invoices</NuxtLink>
        <br />
        <small v-if="row.pendingInvoices > 0" class="text-error text-opacity-50">pending {{ row.pendingInvoices }}</small>
        &nbsp;
      </template>

      <template #reminders="{ row }">
        <NuxtLink :to="`/reminders/client/${row.id}`">{{ row.totalReminders }} Reminders</NuxtLink>
      </template>

      <template #actions="{ row }">
        <ContextMenu>
          <li>
            <NuxtLink :href="`/clients/${row.id}`">
              <FaIcon icon="fa-regular fa-edit" />
              Edit Client
            </NuxtLink>
          </li>

          <li class="mt-2 p-0 disabled">
            <div class="divider m-0 p-0"></div>
          </li>

          <li>
            <label @click="controller().delete(row.id)" class="text-error">
              <FaIcon icon="fa-solid fa-close" />
              Delete
            </label>
          </li>
        </ContextMenu>
      </template>
    </DataTable>
  </div>
</template>
