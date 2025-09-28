<template>
  <FormSection title="Invoice" description="Configure your invoice settings.">
    <div class="grid grid-cols-2">
      <div class="">
        <label class="label w-full max-w-xs">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Invoice"
          v-model="useSettings().settings.invoices.title"
          required
          class="input input-bordered input-sm w-full max-w-xs"
        />
      </div>

      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">Due in</span>
        </label>
        <label class="input-group">
          <input
            type="text"
            placeholder="10"
            v-maska="'#*'"
            v-model="useSettings().settings.invoices.dueDays"
            required
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <span class="text-sm text-info">days</span>
        </label>
      </div>
    </div>

    <SettingsFormat entity="invoices" />
  </FormSection>

  <FormSection title="Offers" description="Confiigure your offer settings.">
    <div class="grid grid-cols-2">
      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Offer"
          v-model="useSettings().settings.offers.title"
          required
          class="input input-bordered input-sm w-full max-w-xs"
        />
      </div>

      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">Due in</span>
        </label>
        <label class="input-group">
          <input
            type="text"
            placeholder="10"
            v-maska="'#*'"
            v-model="useSettings().settings.offers.dueDays"
            required
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <span class="text-sm text-info">days</span>
        </label>
      </div>
    </div>
    <SettingsFormat entity="offers" />
  </FormSection>

  <FormSection title="Reminders" description="Confiigure your reminder settings.">
    <div class="grid grid-cols-2">
      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">Title</span>
        </label>
        <input
          type="text"
          placeholder="Offer"
          v-model="useSettings().settings.reminders.title"
          required
          class="input input-bordered input-sm w-full max-w-xs"
        />
      </div>

      <div>
        <label class="label w-full max-w-xs">
          <span class="label-text">Due in</span>
        </label>
        <label class="input-group">
          <input
            type="text"
            placeholder="10"
            v-maska="'#*'"
            v-model="useSettings().settings.reminders.dueDays"
            required
            class="input input-bordered input-sm w-full max-w-xs"
          />
          <span class="text-sm text-info">days</span>
        </label>
      </div>
    </div>
    <SettingsFormat entity="reminders" />
  </FormSection>

  <SettingsReminderFees />
</template>
