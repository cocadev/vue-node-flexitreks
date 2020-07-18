<template>
  <p
    :class="{
      group: true,
      error
    }"
  >
    <label :for="id">{{ label }}</label>
    <select
      :id="id"
      :value="value"
      :required="!!required"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value) && $emit('input', $event.target.value)"
    >
      <slot />
    </select>
  </p>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: [Boolean, String],
      default () {
        return false
      }
    }
  },

  computed: {
    error () {
      return !!this.$store.state.form_errors.find(e => e === this.id)
    }
  }
}
</script>
