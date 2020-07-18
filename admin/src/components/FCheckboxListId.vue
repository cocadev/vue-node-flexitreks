<template>
  <div>
    <label :for="name">{{ label }}</label>
    <div class="list-of-checkboxes">
      <label v-for="item in items" :key="item.id">
        <input
          type="checkbox"
          :name="name"
          :id="`${name}_${item.id}`"
          :value="item.id"
          :checked="value.find(i => i === item.id)"
          @change="change(item.id)"
        />
        {{ item.name }}
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
    change (id) {
      const current = this.value.findIndex(item => item === id)
      if (current === -1) {
        this.value.push(this.items.find(item => item.id === id).id)
      } else {
        this.value.splice(current, 1)
      }

      this.$emit('change', this.value)
    }
  }
}
</script>
