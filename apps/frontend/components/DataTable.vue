<script setup lang="ts">
type DataTableColumn = {} & {
  field: string;
  label: string;
  class: string;
  width?: string;
};

const props = defineProps({
  columns: { type: Array<DataTableColumn>, required: true },
  rows: { type: Array<any>, required: true },
  sortableFields: { type: Array<String>, default: () => [] },
  showLoadMore: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});

const sortKeys = ref<string[]>([]);
const sorted = ref<any>({});
const emit = defineEmits(["doLoadMore", "sort"]);
const handleSorted = (field: string) => {
  if (!props.sortableFields.includes(field)) return;
  if (!sortKeys.value.includes(field)) {
    sortKeys.value.push(field);
    sorted.value[field] = "asc";
  } else {
    if (sorted.value[field] === "asc") {
      sorted.value[field] = "desc";
    } else {
      sortKeys.value = sortKeys.value.filter((key) => key !== field);
      delete sorted.value[field];
    }
  }
  emit("sort", { ...sorted.value });
};
</script>

<template>
  <div class="relative">
    <div class="absolute bg-base-100 w-full h-full z-10 bg-opacity-50 justify-center backdrop-blur-sm items-center flex" v-if="loading">
      <Loading />
    </div>
    <table class="table table-compact table-sm w-full relative">
      <thead>
        <tr>
          <th
            v-for="column in columns"
            :key="column.field"
            :class="`border-base-200 border-r ${column.class} ${['asc', 'desc'].includes(sorted[column.field]) ? '!bg-base-300' : ''}`"
          >
            <span
              :class="`flex p-0 m-0 w-full justify-between items-center ${sortableFields.includes(column.field) ? 'cursor-pointer' : ''}`"
              @click="handleSorted(column.field)"
            >
              <span>
                {{ column.label }}
              </span>
              <FaIcon
                v-if="sortableFields.includes(column.field)"
                icon="fa-chevron-down"
                :class="`ml-1 cursor-pointer  ${sorted[column.field] === 'asc' ? 'rotate-180 text-success' : sorted[column.field] === 'desc' ? 'text-success' : 'opacity-30'}`"
              />
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.id">
          <td v-for="column in columns" :class="column.class" :width="column.width" :key="column.field">
            <slot :row="row" :name="column.field">
              {{ row[column.field] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mt-10 gap-2 flex justify-center" v-if="showLoadMore">
    <span :class="`loading loading-spinner loading-xs ${loading ? '' : 'opacity-0'}`"></span>
    <button @click="emit('doLoadMore')" class="btn btn-xs btn-neutral inline-block">Load more</button>
  </div>
</template>
