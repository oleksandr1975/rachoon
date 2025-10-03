<script setup lang="ts">
import cronstrue from "cronstrue";
import { isLastDayOfMonth, getDaysInMonth } from "date-fns";

const controller = () => useDocument();
const pattern = ref("");
const patternString = computed(() => {
  try {
    return cronstrue.toString(controller().recurring.cron, { use24HourTimeFormat: true });
  } catch (e) {
    return "";
  }
});

const custom = computed(() => controller().recurring.cron);

const predefinedPatterns = computed(() => {
  const date = controller().recurring.startDate;
  let day = `${date.getDate()}`;
  if (date.getDate() > 28 && getDaysInMonth(date) > 28) {
    day = `L-${getDaysInMonth(date) - date.getDate() + 1}`;
  }
  if (isLastDayOfMonth(date)) {
    day = "L";
  }
  return {
    weekly: `0 0 * * ${controller().recurring.startDate.getDay()}`, // every week on Sunday
    monthly: `0 0 ${day} * *`, // every month on the 1st
    yearly: `0 0 ${controller().recurring.startDate.getDate()} ${controller().recurring.startDate.getMonth()} *`, // every year on January 1st
  };
});

watch([pattern, () => controller().recurring.cron.toString()], () => {
  if (controller().recurring.cron !== "") {
    pattern.value = controller().recurring.cron;
  } else {
    controller().recurring.cron = pattern.value;
  }
});

watch(
  () => controller().recurring.startDate.toString(),
  () => {
    controller().recurring.cron = predefinedPatterns.value.monthly;
  },
);

watch(
  () => controller().recurring.active,
  () => {
    if (!controller().isNew()) {
      return;
    }
    if (controller().recurring.active) {
      controller().item!.recurringInvoice = controller().recurring;
    } else {
      controller().item!.recurringInvoice = null;
    }
  },
);

const emit = defineEmits(["close"]);
</script>

<template>
  <div class="flex gap-4">
    <div>
      <label class="label">Start</label>
      <DatePicker v-model="controller().recurring.startDate" class="max-w-32" />
    </div>

    <div class="form-control">
      <label class="label">Repeat every</label>
      <select class="select select-bordered select-sm bg-base-300" v-model="controller().recurring.cron">
        <option :value="predefinedPatterns.weekly">Week</option>
        <option :value="predefinedPatterns.monthly">Month</option>
        <option :value="predefinedPatterns.yearly">Year</option>
        <option :value="custom">Custom</option>
      </select>
    </div>
    <div class="flex-grow"></div>
    <div>
      <label class="label">Active</label>
      <input type="checkbox" class="toggle toggle-success toggle-sm mt-1" v-model="controller().recurring.active" />
    </div>
  </div>
  <div class="form-control my-3">
    <label class="label">
      <span>Cron pattern.</span>
    </label>
    <input
      type="text"
      placeholder="* * * * *"
      class="input input-bordered input-sm bg-base-300 w-48"
      v-model="controller().recurring.cron"
    />
    <span>
      <small>
        <a class="link m-0 p-0" href="https://crontab.guru/examples.html" target="_blank">See cron examples</a>
        <br />
        Note: You can only run crons on a daily schedule at minimum.
      </small>
    </span>
  </div>
  <div class="divider"></div>
  <div class="flex justify-between">
    <div>
      <small v-if="controller().recurring.active && patternString !== ''">
        Will start on {{ controller().recurring.startDate.toLocaleDateString() }} and repeat {{ patternString }}
      </small>
    </div>
    <button class="btn btn-sm btn-neutral" @click="emit('close')">OK</button>
  </div>
</template>
