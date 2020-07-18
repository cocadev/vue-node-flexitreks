<template>
  <p
    :class="{
      group: true,
      error
    }"
  >
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :value="value"
      :required="!!required"
      :type="type"
      :placeholder="placeholder"
      @input="$emit('input', $event.target.value)"
      @change="$emit('change', $event.target.value)"
    >
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
    placeholder: {
      type: [String, Number],
      default: ''
    },
    required: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    type: {
      type: String,
      default () {
        return 'text'
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
