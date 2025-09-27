<template>
  <ul class="menu">
    <li>
      <NuxtLink to="/templates" :class="useRoute().fullPath.includes('/templates') ? 'active' : ''">
        <FaIcon icon="fa-solid fa-palette" />
        Templates
      </NuxtLink>
    </li>
  </ul>
</template>
