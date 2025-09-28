<script setup lang="ts">
const isActive = (path: string) => {
  return useRoute().fullPath.includes(path) && !useRoute().fullPath.includes("settings");
};
</script>

<template>
  <ul class="menu gap-1">
    <li>
      <NuxtLink href="/clients" :class="isActive('/clients') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-user" />
        Clients
      </NuxtLink>
    </li>
    <li>
      <NuxtLink href="/offers" :class="isActive('/offers') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-file-invoice" />
        Offers
      </NuxtLink>
    </li>
    <li>
      <NuxtLink href="/invoices" :class="isActive('/invoices') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-file-invoice-dollar" />
        Invoices
      </NuxtLink>
    </li>
    <li>
      <NuxtLink href="/reminders" :class="isActive('/reminders') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-file-lines" />
        Reminders
      </NuxtLink>
    </li>

    <li>
      <NuxtLink href="/users" :class="isActive('/users') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-user" />
        Users
      </NuxtLink>
    </li>
  </ul>
</template>
