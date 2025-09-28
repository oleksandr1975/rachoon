<script setup>
const fees = useSettings().settings.reminders.fees;
</script>
<template>
  <FormSection title="Reminder fees" description="Set the default fees for your reminders.">
    <table class="table table-compact table-zebra w-full m-0">
      <thead>
        <tr>
          <th>Title</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, i) in fees" :key="i">
          <td>
            <div class="form-control">
              <input type="text" placeholder="title" v-model="f.title" class="input input-bordered input-sm" />
            </div>
          </td>
          <td>
            <div class="input-group">
              <input
                type="number"
                placeholder="0"
                v-model="f.value"
                v-maska="{
                  mask: '#*.##',
                  preprocessor: (val) => {
                    return position.valueType === 'percent' ? useFormat.max100(val) : val;
                  },
                }"
                class="input input-bordered input-sm w-full"
              />
              <select class="select select-bordered select-sm bg-base-300" v-model="f.valueType">
                <option selected value="percent">%</option>
                <option value="fixed">
                  {{ useCountries.currencies.find((c) => c.cc === useProfile().me.organization.settings.general.currency).symbol }}
                </option>
              </select>
            </div>
          </td>
          <td class="text-right">
            <button class="btn btn-square btn-sm mr-2" @click="useSettings().settings.removeFee(i)">
              <FaIcon icon="fa-trash-can" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center mt-5">
      <button class="btn btn-xs btn-info btn-outline gap-1" @click="useSettings().settings.addFee()">
        <FaIcon icon="fa-add mr-5" />
        Add fee
      </button>
    </div>
  </FormSection>
</template>
