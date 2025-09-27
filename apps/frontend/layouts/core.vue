<template>
  <div>
    <div class="flex">
      <div class="w-80 bg-base-100 p-5 border-r-base-300 border-r fixed">
        <div class="min-h-dvh flex flex-col">
          <NuxtLink href="/" class="logo">
            <img
              v-if="useProfile().me.organization.data.logo !== ''"
              :src="useProfile().me.organization.data.logo"
              class="h-8 w-auto inline-block"
            />
            <div class="divider m-0"></div>
          </NuxtLink>
          <NavigationMain />
          <div class="divider m-0"></div>
          <NavigationSettings />
          <div class="divider m-0"></div>
          <NavigationTemplates />
          <div class="divider m-0"></div>
          <div class="flex-grow"></div>

          <div class="flex flex-col justify-end">
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

          <!-- <div class="divider"></div> -->
          <!-- <div class="text-center opacity-30"> -->
          <!--   <img src="@/assets/logo.png" class="h-12 w-auto inline-block" /> -->
          <!--   <div class="text-xs mt-2">Rachoon Version {{ useRuntimeConfig().public.appVersion }}</div> -->
          <!-- </div> -->
        </div>
      </div>
      <div class="w-full min-h-dvh pl-80"><slot /></div>
    </div>
  </div>
</template>
