<template>
  <p class="group">
    <label :for="id">{{ label }}</label>
    <textarea
      :id="id"
      :value="value"
      :required="!!required"
      :type="type"
      @input="$emit('input', $event.target.value)"
    />
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
    },
    type: {
      type: String,
      default () {
        return 'text'
      }
    }
  }
}
</script>
