<template>
  <p>
    <label :for="name">{{ label }}</label>
    <textarea
      :type="type || 'text'"
      :name="name"
      :id="name"
      :value="value"
      :required="required"
      v-on:input="$emit('input', $event.target.value)"
    ></textarea>
  </p>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    type: String,
    value: String,
    required: {
      type: [Boolean, String],
      default () {
        return false
      }
    }
  }
}
</script>
