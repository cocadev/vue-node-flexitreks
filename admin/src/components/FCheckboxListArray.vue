<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="list-of-checkboxes">
      <label v-for="item in items" :key="item">
        <input
          type="checkbox"
          :name="name"
          :id="`${name}_${item}`"
          :value="item"
          :checked="value && value.find(i => i === item)"
          @change="change(item)"
        />
        {{ item }}
      </label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    value: {
      type: Array,
      default () {
        return []
      }
    },
    items: Array
  },

  methods: {
    change (changed) {
      const value = this.value || []
      const current = value.findIndex(i => i === changed)
      if (current === -1) {
        value.push(this.items.find(i => i === changed))
      } else {
        value.splice(current, 1)
      }

      this.$emit('change', value)
    }
  }
}
</script>
