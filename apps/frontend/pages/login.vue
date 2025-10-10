<script setup>
import { getActivePinia } from "pinia";
getActivePinia()._s.forEach((s) => s.$reset());

const email = ref("");
const password = ref("");
const login = async (e) => {
  e.preventDefault();
  return await useAuth().loginEmailPassword(email.value, password.value);
};
// onMounted(() => {
useAuth().init();
// });
</script>

<template>
  <div class="grid h-screen place-items-center">
    <div class="card card-compact w-96 bg-base-100 shadow-xl p-5 h-96">
      <div class="logo text-center">
        <img src="@/assets/logo.png" class="h-12 w-auto mx-auto" />
        <h2 class="m-0">rachoon</h2>
      </div>

      <div class="card-body prose text-center">
        <div class="divider mb-0">Login to</div>
        <div v-if="useAuth().loading" class="">
          <Loading class="h-6" :maxHeight="false" />
        </div>
        <div v-else>
          <img :src="useAuth().org.logo" v-if="useAuth().org.logo" class="h-6 w-auto mx-auto m-0" />
          <h3 v-else class="mt-0">{{ useAuth().org.name }}</h3>
        </div>

        <form v-on:submit="login">
          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                E-mail
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="email"
              :disabled="useAuth().loadingLogin"
              pattern=".+@.+\..+"
              placeholder="you@example.com"
              v-model="email"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>

          <div>
            <label class="label w-full max-w-xs">
              <span class="label-text">
                Password
                <span class="text-red-700">*</span>
              </span>
            </label>
            <input
              type="password"
              :disabled="useAuth().loadingLogin"
              v-model="password"
              placeholder="**********"
              required
              class="input input-bordered input-sm w-full max-w-xs"
            />
          </div>
          <div class="center">
            <button class="btn btn-neutral btn-sm mt-5" type="submit" :disabled="useAuth().loadingLogin">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
