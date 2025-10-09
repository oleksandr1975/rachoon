<script setup lang="ts">
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
        <NuxtLink class="btn btn-sm btn-neutral gap-2 no-underline" href="/users/new">
          <FaIcon icon="fa-solid fa-plus-circle " />
          New user
        </NuxtLink>
      </template>
    </FormHeader>

    <div class="text-center mt-20" v-if="controller().items.length === 0">
      <div class="prose">
        <FaIcon icon="fa-users" class="text-5xl text-accent" />
        <h1 class="!text-accent mt-5">No Users</h1>
        <p>
          It appears you have
          <strong class="text-accent">no users</strong>
          created. Go ahead and create one.
        </p>
      </div>
      <NuxtLink class="btn btn-sm btn-neutral mt-10 gap-2" href="/users/new">
        <FaIcon icon="fa-solid fa-plus-circle gap-2 " />
        New user
      </NuxtLink>
    </div>

    <div v-else>
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
  </div>
  <div class="mt-10 gap-2 flex justify-center" v-if="controller().hasMore()">
    <span :class="`loading loading-spinner loading-xs ${controller().loading ? '' : 'opacity-0'}`"></span>
    <button @click="controller().doLoadMore()" class="btn btn-xs btn-neutral inline-block">Load more</button>
  </div>
</template>
