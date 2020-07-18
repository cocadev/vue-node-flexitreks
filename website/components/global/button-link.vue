<template>
  <nuxt-link
    :to="to"
    class="button"
  >
    <slot />
  </nuxt-link>
</template>

<script>
export default {
  props: {
    to: {
      type: [Object, String],
      default () {
        return ''
      }
    }
  }
}
</script>
