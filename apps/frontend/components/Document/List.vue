<script setup lang="ts">
import { Document } from "~~/models/document";
import * as datefns from "date-fns";

definePageMeta({
  layout: "core",
});
const props = defineProps({
  clientId: { type: String, default: "" },
  list: { type: Array as () => Document[], default: null },
});

const controller = () => useDocument();
if (props.clientId && props.clientId !== "") {
  controller().listForClient(props.clientId);
} else {
  controller().list();
}
controller().watchSearch();
const icons = { offers: "fa-file-contract", invoices: "fa-file-invoice", reminders: "fa-file-lines" };

const columns = [
  { label: "# Number", field: "number", class: "", width: "250" },
  { label: "", field: "recurring", class: "text-center", width: "60" },
  { label: "Client", field: "client", class: "", width: "200" },
  { label: "Status", field: "status", class: "text-center", width: "100" },
  { label: "Due Date", field: "data.dueDate", class: "", width: "120" },
  { label: "Net", field: "data.net", class: "", width: "200" },
  { label: "Total", field: "data.total", class: "", width: "200" },
  { label: "", field: "actions", class: "text-right" },
];
</script>

<template>
  <Loading v-if="controller().loading" />

  <div v-else>
    <FormHeader
      :title="controller().type(true)"
      :icon="icons[controller().type() as string]"
      :divider="false"
      showSearch
      v-model="controller().search"
    >
      <template #buttons>
        <NuxtLink
          class="btn btn-sm btn-neutral gap-2 no-underline"
          :href="`/${controller().type()}/new`"
          v-if="controller().type() !== 'reminders'"
        >
          <FaIcon icon="fa-solid fa-plus-circle " />
          New
          {{ controller().singularType() }}
        </NuxtLink>
      </template>
    </FormHeader>

    <div v-if="(!list || list.length === 0) && controller().items.length === 0" class="text-center">
      <div class="divider"></div>
      <div class="prose">
        <FaIcon
          :icon="controller().type() === 'offers' ? 'fa-solid fa-file-invoice' : 'fa-solid fa-file-invoice-dollar'"
          class="text-5xl"
        />
        <h1 class="mt-5">No {{ controller().type() }}</h1>
        <p>
          It appears you have
          <strong>no {{ controller().type() }}</strong>
          created.
        </p>
      </div>
      <div class="mt-10" v-if="controller().type() !== 'reminders'">
        <NuxtLink :href="'/' + controller().type() + '/new'" class="btn btn-neutral btn-sm gap-2">
          <FaIcon icon="fa-solid fa-plus-circle " />
          new {{ controller().singularType() }}
        </NuxtLink>
      </div>
      <div v-else>
        Go to
        <NuxtLink to="/invoices">invoices</NuxtLink>
        and create a reminder for an overdue invoice.
      </div>
    </div>
    <div v-else class="">
      <DataTable
        :columns="columns"
        :rows="list || controller().items"
        :sortableFields="['number', 'data.dueDate', 'data.net', 'data.total', 'status']"
        :loading="controller().refresh || controller().loadMore"
        @doLoadMore="controller().doLoadMore()"
        @sort="(sort) => controller().sort(sort)"
      >
        <template #number="{ row }">
          <NuxtLink :href="'/' + controller().type() + '/' + row.id" class="link">
            {{ row.number }}
          </NuxtLink>
          <br />
          <small class="opacity-50">last modified {{ useFormat.date(row.updatedAt) }}</small>
        </template>
        <template #recurring="{ row }">
          <span
            :class="`btn btn-circle btn-xs ${row.isRecurring ? 'btn-warning' : 'btn-neutral opacity-30'}`"
            v-if="row.isRecurring || row.isFromRecurring"
          >
            <FaIcon icon="fa-solid fa-repeat" />
          </span>
        </template>
        <template #client="{ row }">
          {{ row.client.name }}
          <br />
          <small class="opacity-50">{{ row.client.number }}</small>
          <span v-if="row.offer.id !== ''" class="text-warning">
            <br />
            <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2">
              <NuxtLink :href="`/offers/${row.offer.id}`">
                {{ row.offer.number }} -
                <strong>{{ useFormat.toCurrency(row.offer.data.total) }}</strong>
              </NuxtLink>
            </span>
          </span>
          <span v-if="row.invoices.length > 0" class="text-warning">
            {{ useFormat.toCurrency(row.invoices.reduce((p, c) => (p += c.data.total), 0)) }}
            <br />
            <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2" v-for="inv in row.invoices">
              <NuxtLink :href="`/invoices/${inv.id}`">
                {{ inv.number }}
              </NuxtLink>
            </span>
          </span>
          <span v-else></span>
        </template>
        <template #status="{ row }">
          <span
            class="btn btn-circle btn-xs mr-2"
            :class="row.status === 'pending' ? (row.overdue ? 'btn-error' : 'btn-neutral') : 'btn-success'"
            @click="controller().setStatus(row)"
          >
            <FaIcon :icon="row.status == 'pending' ? 'fa-regular fa-clock' : 'fa-check'" />
          </span>
        </template>
        <template #data.dueDate="{ row }">
          <span :class="row.status === 'pending' && datefns.isPast(row.data.dueDate) ? 'text-error' : ''">
            {{ useFormat.date(row.data.dueDate) }}
          </span>
          <br />
          <span class="badge badge-sm badge-neutral" v-if="row.totalReminders > 0">{{ row.totalReminders }} Reminders</span>
        </template>
        <template #data.net="{ row }">
          {{ useFormat.toCurrency(row.data.net) }}
          <br />
          &nbsp;
        </template>
        <template #data.total="{ row }">
          <span>{{ useFormat.toCurrency(row.data.total) }}</span>
          <br />
          <small class="opacity-50">taxes {{ useFormat.toCurrency(row.data.total - row.data.net) }}</small>
        </template>
        <template #actions="{ row }">
          <ContextMenu>
            <li>
              <NuxtLink :to="`/invoices/${row.id}`">
                <FaIcon icon="fa-regular fa-edit" />
                Edit {{ controller().singularType(true) }}
              </NuxtLink>
            </li>
            <li>
              <label @click="controller().download(i)">
                <FaIcon icon="fa-regular fa-file-pdf" />
                Download PDF
              </label>
            </li>

            <li v-if="row.type === 'offer' && row.invoices.reduce((p, c) => (p += c.data.net), 0) < row.data.net">
              <NuxtLink :to="`/invoices/new?offer=${row.id}`">
                <FaIcon icon="fa-solid fa-money-bill-transfer" />
                Create Invoice
              </NuxtLink>
            </li>

            <li v-if="row.type === 'invoice'">
              <NuxtLink :href="`/reminders/new?invoice=${row.id}`">
                <FaIcon icon="fa-solid fa-bullhorn" />
                Create Reminder
              </NuxtLink>
            </li>

            <li class="mt-2 p-0 disabled">
              <div class="divider m-0 p-0"></div>
            </li>

            <li class="mt-0">
              <label class="text-error" @click="controller().delete(row.id)">
                <FaIcon icon="fa-solid fa-close" />
                Delete
              </label>
            </li>
          </ContextMenu>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-box {
  max-height: 800px;
}
</style>
