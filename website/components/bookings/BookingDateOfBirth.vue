<template>
  <div
    :class="{
      group: true,
      error
    }"
  >
    <label>Date of Birth</label>
    <div class="date-input">
      <select
        :id="`${id}_day`"
        v-model="day"
        required
      >
        <option value="">Day</option>
        <option
          v-for="i in 31"
          :key="i"
        >{{ i }}</option>
      </select>
      <select
        :id="`${id}_month`"
        v-model="month"
        required
      >
        <option value="">Month</option>
        <option
          v-for="(month, i) in months"
          :key="month"
          :value="i"
        >{{ month }}</option>
      </select>
      <select
        :id="`${id}_year`"
        v-model="year"
        required
      >
        <option value="">Year</option>
        <option
          v-for="year in years"
          :key="year"
        >{{ year }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },

  data () {
    const dateValue = typeof this.value === 'string' && this.value.split('-');

    return {
      day: dateValue && dateValue[2] || '',
      month: dateValue && dateValue[1] && dateValue[1] - 1 || '',
      year: dateValue && dateValue[0] || '',
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      years: []
    }
  },

  computed: {
    error () {
      return !!this.$store.state.form_errors.find(e => e === this.id)
    }
  },

  watch: {
    day () { this.calculateDate() },
    month () { this.calculateDate() },
    year () { this.calculateDate() }
  },

  created () {
    const today = new Date().getFullYear()
    const years = []
    for (var i = today; i >= today - 110; i--) years.push(i)
    this.years = years
  },

  methods: {
    calculateDate () {
      let d = ''
      if (!this.day || this.month === '' || !this.year) d = ''
      else d = `${this.year}-${this.doubler(this.month + 1)}-${this.doubler(this.day)}`
      this.$emit('input', d)
      this.$emit('change', d)
    },
    doubler (digit) {
      return digit <= 9 ? '0' + digit : digit
    }
  }
}
</script>

<style scoped>
  .date-input {
    width: 100%;
    display: grid;
    grid-template-columns: 100px 1fr 100px;
    grid-gap: 10px;
  }

  .date-input select {
    font-size: 16px;
  }
</style>
