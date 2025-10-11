<script setup lang="ts">
import { UserRole } from "@repo/common/User";

const controller = () => useUser();
controller().list();
controller().watchSearch();
const columns = [
  { label: "", field: "avatar", class: "", width: "60" },
  { label: "Name", field: "data.fullName", class: "" },
  { label: "Email", field: "email", class: "" },
  { label: "Role", field: "role", class: "" },
  { label: "", field: "actions", class: "text-right" },
];
</script>

<template>
  <Loading v-if="controller().loading" />

  <div v-else>
    <FormHeader title="Users" icon="fa-user" :divider="false" showSearch v-model="controller().search">
      <template #buttons>
        <NuxtLink class="btn btn-new btn-sm btn-neutral gap-2 no-underline" href="/users/new">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New user
        </NuxtLink>
      </template>
    </FormHeader>

    <DataTable
      :columns="columns"
      :rows="controller().items"
      :sortableFields="['email', 'role', 'data.fullName']"
      :showLoadMore="controller().hasMore()"
      @doLoadMore="controller().doLoadMore()"
      @sort="(sort) => controller().sort(sort)"
      :loading="controller().refresh || controller().loadMore"
    >
      <template #avatar="{ row }">
        <div class="avatar placeholder">
          <div class="bg-success text-black rounded-full w-8">
            <img v-if="row.data.avatar !== ''" :src="row.data.avatar" />
            <span v-else>{{ row.initials() }}</span>
          </div>
        </div>
      </template>
      <template #data.fullName="{ row }">
        <NuxtLink :href="`/users/${row.id}`" class="link">
          {{ row.data.fullName }}
        </NuxtLink>
        <br />
        <small class="opacity-50">last modified {{ useFormat.date(row.updatedAt) }}</small>
      </template>
      <template #role="{ row }">
        <span
          :class="`badge badge-sm ${row.role === UserRole.ADMIN ? 'badge-primary' : row.role === UserRole.VIEWER ? 'badge-secondary' : 'badge-accent'}`"
        >
          {{ UserRole[row.role] }}
        </span>
      </template>
      <template #actions="{ row }">
        <ContextMenu>
          <li>
            <NuxtLink :href="`/users/${row.id}`">
              <FaIcon icon="fa-regular fa-edit" />
              Edit User
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
