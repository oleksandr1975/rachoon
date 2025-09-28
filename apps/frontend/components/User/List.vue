<script setup lang="ts">
const controller = () => useUser();
controller().list();
</script>

<template>
  <Loading v-if="controller().loading" />

  <div v-else>
    <FormHeader title="Users" icon="fa-user" :divider="false">
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
      <div class="">
        <table class="table table-zebra table-compact w-full">
          <thead>
            <tr>
              <th width="60"></th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr class="hover" v-for="u in controller().items" :key="u.id">
              <td>
                <div class="avatar placeholder">
                  <div class="bg-success text-black rounded-full w-8">
                    <img v-if="u.data.avatar !== ''" :src="u.data.avatar" />
                    <span v-else>{{ u.initials() }}</span>
                  </div>
                </div>
              </td>
              <td>
                <NuxtLink :href="`/users/${u.id}`" class="link">
                  {{ u.data.fullName }}
                </NuxtLink>
                <br />
                <small class="opacity-50">last modified {{ useFormat.date(u.updatedAt) }}</small>
              </td>
              <td>{{ u.email }}</td>
              <td>{{ u.role }}</td>
              <td>
                <ContextMenu>
                  <li>
                    <NuxtLink href="/profile" :class="useRoute().fullPath.includes('/profile') ? 'active' : ''">
                      <FaIcon icon="fa-regular fa-edit" />
                      Edit
                    </NuxtLink>
                  </li>

                  <li>
                    <NuxtLink href="/logout" class="text-error">
                      <FaIcon icon="fa-solid fa-trash" />
                      Delete
                    </NuxtLink>
                  </li>
                </ContextMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div class="mt-10 gap-2 flex justify-center" v-if="controller().hasMore()">
    <span :class="`loading loading-spinner loading-xs ${controller().loading ? '' : 'opacity-0'}`"></span>
    <button @click="controller().doLoadMore()" class="btn btn-xs btn-neutral inline-block">Load more</button>
  </div>
</template>
