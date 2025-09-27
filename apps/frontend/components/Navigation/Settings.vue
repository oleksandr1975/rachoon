<template>
  <ul class="menu">
    <li>
      <details :open="useRoute().fullPath.includes('/settings')">
        <summary>
          <NuxtLink href="/settings/organization" :class="useRoute().fullPath.includes('/settings') ? 'active' : ''">
            <FaIcon icon="fa-solid fa-gear" />
            Settings
          </NuxtLink>
        </summary>
        <ul class="menu gap-1">
          <li>
            <NuxtLink href="/settings/organization" :class="useRoute().fullPath.includes('/organization') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-building" />
              Organization
            </NuxtLink>
          </li>
          <li>
            <NuxtLink href="/settings/locale" :class="useRoute().fullPath.includes('/locale') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-globe-europe" />
              Locale
            </NuxtLink>
          </li>

          <li>
            <NuxtLink href="/settings/taxes" :class="useRoute().fullPath.includes('/taxes') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-coins" />
              Taxes
            </NuxtLink>
          </li>

          <li>
            <NuxtLink href="/settings/units" :class="useRoute().fullPath.includes('/units') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-scale-balanced" />
              Units
            </NuxtLink>
          </li>
          <li>
            <NuxtLink href="/settings/clients" :class="useRoute().fullPath.includes('/formats') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-user" />
              Clients
            </NuxtLink>
          </li>

          <li>
            <NuxtLink href="/settings/invoices-offers" :class="useRoute().fullPath.includes('/formats') ? 'active' : ''">
              <FaIcon icon="fa-solid fa-file-invoice" />
              Invoices & Offers
            </NuxtLink>
          </li>
        </ul>
      </details>
    </li>
  </ul>
</template>
