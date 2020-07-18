<template>
  <p>
    <label :for="name">{{ label }}</label>
    <input
      :type="type || domProps.type || 'text'"
      :name="name"
      :id="name"
      :value="value"
      :required="required"
      :placeholder="placeholder"
      v-on:input="$emit('input', $event.target.value)"
      v-bind="domProps"
      :disabled="disabled"
    />
  </p>
</template>

<script>
export default {
  props: {
    name: String,
    label: String,
    type: String,
    placeholder: String,
    value: [String, Number],
    disabled: Boolean,
    required: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    domProps: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
