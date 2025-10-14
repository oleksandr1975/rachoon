<script setup lang="ts">
const { isOpen } = useDrawer();
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="app-drawer" type="checkbox" class="drawer-toggle" v-model="isOpen" />
    <div class="drawer-content md:pl-80">
      <slot />
    </div>
    <div class="drawer-side !fixed">
      <label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

      <div class="flex flex-col min-h-dvh max-h-dvh h-dvh bg-base-100 w-80 border-r border-base-300">
        <Logo />
        <div class="divider m-0 p-0"></div>
        <div class="overflow-y-auto">
          <NavigationMain />
          <div class="divider m-0"></div>
          <NavigationSettings />
          <div class="divider m-0"></div>
          <NavigationSecondary />
        </div>
        <div class="mt-auto mb-5 px-5">
          <div class="mb-12 text-center opacity-40">
            <label class="text-sm">
              Press
              <kbd class="kbd kbd-sm">?</kbd>
              to see Shortcuts
            </label>
          </div>

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
