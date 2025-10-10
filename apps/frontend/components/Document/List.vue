<script setup lang="ts">
import { Document } from "~~/models/document";
import * as datefns from "date-fns";

const props = defineProps({
  clientId: { type: String, default: "" },
  list: { type: Array as () => Document[], default: null },
  showHeader: { type: Boolean, default: true },
});

const controller = () => useDocument();
if (props.clientId && props.clientId !== "") {
  controller().listForClient(props.clientId);
} else {
  if (!props.list) {
    controller().list();
  } else {
    controller().items = props.list;
  }
}
controller().watchSearch();
const icons = { offers: "fa-file-contract", invoices: "fa-file-invoice", reminders: "fa-file-lines" };

const getStatusClass = (row: Document): string => {
  if (row.overdue) return "error";
  if (row.status === "accepted") return "info";
  if (row.status === "paid") return "success";
  if (row.invoices.length > 0) {
    const sum = row.invoices.reduce((p, c) => (p += c.data.net), 0);
    return sum >= row.data.net ? "success" : "warning";
  }

  return "";
};

const getStatusIcon = (row: Document): string => {
  if (row.invoices.length > 0) {
    return "fa solid fa-check";
  }
  return row.status == "pending" ? "fa-regular fa-clock" : "fa-solid fa-check";
};

const getStatusTooltip = (row: Document): string => {
  if (row.overdue) return "Overdue";
  if (row.status === "accepted") return "Accepted";
  if (row.status === "paid") return "Paid";
  if (row.invoices.length > 0) {
    const sum = row.invoices.reduce((p, c) => (p += c.data.net), 0);
    return sum >= row.data.net ? "Fully invoiced" : `${useFormat.toCurrency(sum)} invoiced`;
  }
  return row.status == "pending" ? "Pending" : "Sent";
};

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
      v-if="$props.showHeader"
      :title="controller().type(true)"
      :icon="icons[controller().type() as string]"
      :divider="false"
      showSearch
      v-model="controller().search"
    >
      <template #buttons>
        <NuxtLink
          class="btn btn-new btn-sm gap-2 no-underline"
          :href="`/${controller().type()}/new`"
          v-if="controller().type() !== 'reminders'"
        >
          <FaIcon icon="fa-solid fa-plus-circle " />
          New
          {{ controller().singularType() }}
        </NuxtLink>
      </template>
    </FormHeader>

    <DataTable
      :columns="columns"
      :rows="list || controller().items"
      :sortableFields="['number', 'data.dueDate', 'data.net', 'data.total', 'status']"
      :loading="controller().refresh"
      @doLoadMore="controller().doLoadMore()"
      :showLoadMore="controller().hasMore()"
      @sort="(sort) => controller().sort(sort)"
    >
      <template #number="{ row }">
        <div class="indicator">
          <span class="indicator-item badge badge-xs badge-error" v-if="row.totalReminders > 0">{{ row.totalReminders }}</span>
          <NuxtLink :href="'/' + controller().type() + '/' + row.id" class="link">
            {{ row.number }}
          </NuxtLink>
        </div>
        <br />
        <small class="opacity-50">last modified {{ useFormat.date(row.updatedAt) }}</small>
      </template>
      <template #recurring="{ row }">
        <span :class="`iconbadge ${row.isRecurring ? 'warning' : ''}`" v-if="row.isRecurring || row.isFromRecurring">
          <NuxtLink :href="`/invoices/${row.recurringId}`" v-if="row.isFromRecurring">
            <FaIcon icon="fa-solid fa-repeat" />
          </NuxtLink>
          <FaIcon icon="fa-solid fa-repeat" v-else />
        </span>
        <span v-if="row.offer?.id !== ''" class="iconbadge">
          <NuxtLink :href="`/offers/${row.offer?.id}`">
            <FaIcon icon="fa-solid fa-file-export" />
          </NuxtLink>
        </span>
      </template>
      <template #client="{ row }">
        {{ row.client.name }}
        <br />
        <small class="opacity-50">{{ row.client.number }}</small>
      </template>
      <template #status="{ row }">
        <div class="tooltip" :data-tip="getStatusTooltip(row)">
          <span class="iconbadge" :class="getStatusClass(row)" @click="controller().setStatus(row)">
            <FaIcon :icon="getStatusIcon(row)" />
          </span>
        </div>
      </template>
      <template #data.dueDate="{ row }">
        <span :class="row.status === 'pending' && datefns.isPast(row.data.dueDate) ? 'text-rose-500' : ''">
          {{ useFormat.date(row.data.dueDate) }}
        </span>
      </template>
      <template #data.net="{ row }">
        {{ useFormat.toCurrency(row.data.net) }}
      </template>
      <template #data.total="{ row }">
        <div class="tooltip" :data-tip="`taxes ${useFormat.toCurrency(row.data.total - row.data.net)}`">
          <span>{{ useFormat.toCurrency(row.data.total) }}</span>
        </div>
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
            <label @click="controller().download(row)">
              <FaIcon icon="fa-regular fa-file-pdf" />
              Download PDF
            </label>
          </li>

          <li v-if="row.type === 'invoice'">
            <NuxtLink :href="`/reminders/new?invoice=${row.id}`">
              <FaIcon icon="fa-solid fa-bullhorn" />
              Create Reminder
            </NuxtLink>
          </li>

          <li>
            <label @click="controller().duplicate(row.id)" v-if="row.type !== 'reminder'">
              <FaIcon icon="fa-regular fa-copy" />
              Duplicate {{ controller().singularType(true) }}
            </label>
          </li>

          <li v-if="row.type === 'offer' && row.invoices.reduce((p, c) => (p += c.data.net), 0) < row.data.net">
            <NuxtLink :to="`/invoices/new?offer=${row.id}`">
              <FaIcon icon="fa-solid fa-file-export" />
              Create Invoice
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
</template>

<style lang="scss" scoped>
.modal-box {
  max-height: 800px;
}
</style>
