<script setup lang="ts">
useInvoiceOrOffer().form();

const modal = ref(false);

watch(
  // fixes the problem where old,new values are the same
  [
    computed(() => JSON.stringify(useInvoiceOrOffer().invoiceOrOffer.data.positions)),
    computed(() => JSON.stringify(useInvoiceOrOffer().invoiceOrOffer.data.discountsCharges)),
    computed(() => JSON.stringify(useInvoiceOrOffer().invoiceOrOffer.data.taxOption)),
    computed(() => JSON.stringify(useInvoiceOrOffer().invoiceOrOffer.data.date)),
    computed(() => JSON.stringify(useInvoiceOrOffer().invoiceOrOffer.data.dueDate)),
  ],
  () => {
    useInvoiceOrOffer().updated();
  },
);

definePageMeta({
  layout: "core",
});

async function save() {
  await useInvoiceOrOffer().save();
}

function preview() {
  modal.value = true;
}
</script>
<template>
  <Loading v-if="useInvoiceOrOffer().loading" />

  <div v-else>
    <FormHeader :title="useInvoiceOrOffer().title" icon="fa-file-invoice-dollar">
      <template #buttons>
        <select class="select select-bordered select-sm bg-base-300" v-model="useInvoiceOrOffer().invoiceOrOffer.templateId">
          <option value="" key="default">Default Template</option>
          <option v-for="u in useInvoiceOrOffer().templates" :value="u.id" :key="u.title">
            {{ u.title }}
          </option>
        </select>
        <label class="btn btn-sm btn-neutral" for="preview-modal" @click="modal = true">
          <FaIcon icon="fa-solid fa-eye" />
          Preview
        </label>
        <button
          class="btn btn-sm btn-neutral"
          @click="useInvoiceOrOffer().download()"
          v-if="useInvoiceOrOffer().invoiceOrOffer.id !== '' && useInvoiceOrOffer().mustSave <= 1"
        >
          <FaIcon icon="fa-solid fa-file-pdf" />
          Download PDF
        </button>
        <button
          v-if="!useInvoiceOrOffer().invoiceOrOffer.disabled"
          class="btn btn-sm btn-neutral"
          @click="useInvoiceOrOffer().duplicate(useInvoiceOrOffer().invoiceOrOffer.id)"
        >
          <FaIcon icon="fa-solid fa-copy " />
          Duplicate
        </button>

        <button
          class="btn btn-sm btn-error gap-2 btn-outline"
          v-if="useInvoiceOrOffer().invoiceOrOffer.id !== ''"
          @click="useInvoiceOrOffer().del()"
        >
          <FaIcon icon="fa-solid fa-close" />
          Delete
        </button>

        <button class="btn btn-sm btn-neutral" @click="save">
          <FaIcon icon="fa-solid fa-save " />
          Save
        </button>
      </template>
    </FormHeader>
    <div v-if="modal">
      <input type="checkbox" id="preview-modal" class="modal-toggle" />
      <label for="preview-modal" class="modal cursor-pointer" @click.self="modal = false">
        <label class="modal-box relative" for="preview-modal">
          <Preview />
        </label>
      </label>
    </div>

    <ul v-if="useInvoiceOrOffer().hasErrors" class="border-2 border-warning rounded p-5 mt-5 mb-10">
      <li v-for="e in useInvoiceOrOffer().invoiceOrOffer.errors()" class="text-warning">
        {{ e }}
      </li>
    </ul>

    <div class="flex flex-row px-5 mb-5">
      <div class="w-1/3 px-5 py-3 rounded-md bg-base-300">
        <div v-if="useRoute().params['id'] === 'new'">
          <label class="label">
            <span class="label-text">Select a client</span>
          </label>
          <InvoiceOrOfferClientAutoComplete required />
        </div>

        <div class="prose text-sm" v-if="useInvoiceOrOffer().invoiceOrOffer.client">
          <h3 class="m-0 p-0">{{ useInvoiceOrOffer().invoiceOrOffer.client.name }}</h3>
          <p class="m-0 p-0">
            <br />
            {{ useInvoiceOrOffer().invoiceOrOffer.client.data.address.street }}
            <br />
            {{ useInvoiceOrOffer().invoiceOrOffer.client.data.address.zip }}
            {{ useInvoiceOrOffer().invoiceOrOffer.client.data.address.city }}
            <br />
            {{ useInvoiceOrOffer().invoiceOrOffer.client.data.address.country }}
            <br />
          </p>
        </div>
      </div>
      <div class="flex w-1/3"></div>
      <div class="flex w-1/3 flex-row justify-end">
        <div class="">
          <div class="prose">
            <h2 v-if="useInvoiceOrOffer().offerToConvert.id !== ''" class="mt-0 !text-error">
              {{ useRoute().query.option }} of
              {{ useInvoiceOrOffer().offerToConvert.number }}
            </h2>
          </div>
          <label class="label">
            <span class="label-text">
              <FaIcon icon="fa-solid fa-calendar-days" />
              Invoice date:
            </span>
          </label>
          <DatePicker v-model="useInvoiceOrOffer().invoiceOrOffer.data.date" />
          <label class="label">
            <span class="label-text">
              <FaIcon icon="fa-solid fa-calendar-check" />
              Due date:
            </span>
          </label>
          <DatePicker v-model="useInvoiceOrOffer().invoiceOrOffer.data.dueDate" />
        </div>
      </div>
    </div>
    <div class="alert px-5 text-error" v-if="useInvoiceOrOffer().invoiceOrOffer.disabled()">
      <FaIcon icon="fa-solid fa-triangle-exclamation" />
      <p>
        This invoice cannot be modified.
        <span v-if="useInvoiceOrOffer().invoiceOrOffer.convertedFromOffer()">It's been converted from an offer.</span>
      </p>
    </div>
    <InvoiceOrOfferItems />
    <div class="divider p-0 m-0"></div>
    <div class="flex flex-row gap-5 px-10">
      <div class="basis-2/4"></div>
      <div class="basis-1/4">
        <InvoiceOrOfferOptions />
      </div>

      <div class="basis-1/4">
        <InvoiceOrOfferTotals />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.modal-box {
  max-height: 800px;
}
.ghost {
  opacity: 0.5;
  td {
    @apply bg-warning-content #{!important};
  }
}
.sortable-chosen {
  opacity: 0.3;
  td {
    @apply bg-warning-content #{!important};
  }
  .collapse-content {
    display: none;
  }
}
</style>
