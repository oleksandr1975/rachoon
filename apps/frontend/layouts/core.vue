<script setup lang="ts">
const { isOpen } = useDrawer();
</script>

<template>
  <div class="drawer md:drawer-open">
    <input id="app-drawer" type="checkbox" class="drawer-toggle" v-model="isOpen" />
    <div class="drawer-content md:pl-80">
      <slot />
    </div>
    <div class="drawer-side !fixed">
      <label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="flex flex-col min-h-dvh max-h-dvh h-dvh bg-base-100 w-80 border-r border-base-300">
        <NuxtLink href="/" class="logo my-5 text-center">
          <img src="@/assets/logo.png" class="h-10 w-auto inline-block" />
          <!-- <img -->
          <!--   v-if="useProfile().me.organization.data.logo !== ''" -->
          <!--   :src="useProfile().me.organization.data.logo" -->
          <!--   class="h-8 w-auto inline-block" -->
          <!-- /> -->
        </NuxtLink>
        <div class="divider m-0 p-0"></div>
        <div class="overflow-y-auto">
          <NavigationMain />
          <div class="divider m-0"></div>
          <NavigationSettings />
          <div class="divider m-0"></div>
          <NavigationSecondary />
          <div class="divider m-0"></div>
        </div>
        <div class="mt-auto mb-5 px-5">
          <NuxtLink href="/profile">
            <div class="flex gap-3 justify-between items-center">
              <div class="">
                <span class="text-sm">Profile settings</span>
              </div>
              <div class="avatar placeholder">
                <div class="bg-success text-black rounded-full w-10">
                  <img v-if="useProfile().me.data.avatar !== ''" :src="useProfile().me.data.avatar" />
                  <span v-else>{{ useProfile().me.initials() }}</span>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
