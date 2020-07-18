<template>
  <button class="button" :type="type || 'button'" @click="$emit('click')"><slot /></button>
</template>

<script>
export default {
  props: {
    type: String
  }
}
</script>
