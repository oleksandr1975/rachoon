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

const modal = ref(false);
const offer = ref(new Document());
const controller = () => useDocument();
if (props.clientId && props.clientId !== "") {
  controller().listForClient(props.clientId);
} else {
  controller().list();
}
</script>

<template>
  <Loading v-if="controller().loading" />

  <div v-else>
    <FormHeader
      :title="controller().type(true)"
      :icon="controller().type() === 'offers' ? 'fa-file-invoice' : 'fa-file-invoice-dollar'"
      :divider="false"
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

    <div v-if="modal">
      <input type="checkbox" id="offerToInvoice-modal" class="modal-toggle" />
      <label for="offerToInvoice-modal" class="modal cursor-pointer">
        <label class="modal-box relative">
          <DocumentToInvoice :offer="offer" />
        </label>
      </label>
    </div>
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
      <table class="table table-compact w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>#</th>
            <th>Client</th>
            <th>
              {{ controller().type() === "invoices" ? "Offer" : "Invoiced" }}
            </th>
            <th width="50"></th>
            <th>Due Date</th>
            <th>Net</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover" v-for="i in list || controller().items" :key="i.id">
            <td width="200">
              <NuxtLink :href="'/' + (controller().type() || type) + '/' + i.id" class="link">
                {{ i.number }}
              </NuxtLink>
              <br />
              <small class="opacity-50">last modified {{ useFormat.date(i.updatedAt) }}</small>
            </td>
            <td>
              {{ i.client.name }}
              <br />
              <small class="opacity-50">{{ i.client.number }}</small>
            </td>
            <td>
              <span v-if="i.offer.id !== ''" class="text-warning">
                {{ useFormat.toCurrency(i.offer.data.total) }}
                <br />
                <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2">
                  <NuxtLink :href="`/offers/${i.offer.id}`">
                    {{ i.offer.number }}
                  </NuxtLink>
                </span>
              </span>
              <span v-if="i.invoices.length > 0" class="text-warning">
                {{ useFormat.toCurrency(i.invoices.reduce((p, c) => (p += c.data.total), 0)) }}
                <br />
                <span class="badge badge-xs badge-outline badge-warning opacity-30 py-2 mr-2" v-for="inv in i.invoices">
                  <NuxtLink :href="`/invoices/${inv.id}`">
                    {{ inv.number }}
                  </NuxtLink>
                </span>
              </span>
              <span v-else></span>
            </td>
            <td class="text-center">
              <span
                class="btn btn-circle btn-xs mr-2"
                :class="i.status === 'pending' ? (i.overdue ? 'btn-error' : 'btn-neutral') : 'btn-success'"
                @click="controller().setStatus(i)"
              >
                <FaIcon :icon="i.status == 'pending' ? 'fa-regular fa-clock' : 'fa-check'" />
              </span>
            </td>

            <td width="200">
              <span :class="i.status === 'pending' && datefns.isPast(i.data.dueDate) ? 'text-error' : ''">
                {{ useFormat.date(i.data.dueDate) }}
              </span>
              <br />
              <span class="badge badge-sm badge-neutral" v-if="i.totalReminders > 0">{{ i.totalReminders }} Reminders</span>
            </td>

            <td width="200">
              {{ useFormat.toCurrency(i.data.net) }}
              <br />
              &nbsp;
            </td>
            <td width="200">
              <span>{{ useFormat.toCurrency(i.data.total) }}</span>
              <br />
              <small class="opacity-50">taxes {{ useFormat.toCurrency(i.data.total - i.data.net) }}</small>
            </td>
            <td width="50" class="text-right">
              <ContextMenu>
                <li>
                  <NuxtLink href="/#" @click="controller().download(i)">
                    <FaIcon icon="fa-regular fa-file-pdf" />
                    Download PDF
                  </NuxtLink>
                </li>
                <li v-if="i.type === 'offer' && i.invoices.reduce((p, c) => (p += c.data.net), 0) < i.data.net">
                  <NuxtLink href="#">
                    <label for="offerToInvoice-modal">
                      <FaIcon icon="fa-solid fa-file-invoice-dollar" />
                      Create Invoice
                    </label>
                  </NuxtLink>
                </li>
              </ContextMenu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="mt-10 gap-2 flex justify-center" v-if="controller().hasMore()">
    <span :class="`loading loading-spinner loading-xs ${controller().loading ? '' : 'opacity-0'}`"></span>
    <button @click="controller().doLoadMore()" class="btn btn-xs btn-neutral inline-block">Load more</button>
  </div>
</template>

<style lang="scss" scoped>
.modal-box {
  max-height: 800px;
}
</style>
