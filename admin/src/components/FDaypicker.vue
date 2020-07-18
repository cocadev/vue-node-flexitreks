<template>
  <div class="daypicker">
    <label>{{ label }}</label>
    <div>
      <label v-for="(day, i) in days" :key="day">
        <input
          type="checkbox"
          :value="i"
          :checked="value && value.includes(i)"
          @change="change(i)"
        />
        {{ day }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      days: [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    }
  },

  methods: {
    change (index) {
      const value = this.value || []
      const current = value.indexOf(index)
      if (current === -1) {
        value.push(index)
      } else {
        value.splice(current, 1)
      }

      this.$emit('input', value)
    }
  }
}
</script>
