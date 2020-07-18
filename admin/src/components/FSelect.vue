<template>
  <p>
    <label :for="name">{{ label }}</label>
    <select
      :name="name"
      :id="name"
      :value="value"
      :required="required"
      v-on:input="$emit('input', $event.target.value)"
    >
      <slot />
      <option v-if="items" v-for="item in items" :key="item.id" :value="item.id" :selected="value === item.id">{{ item.name }}</option>
    </select>
  </p>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    type: String,
    value: [Number, String, Boolean],
    required: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    items: Array
  }
}
</script>
