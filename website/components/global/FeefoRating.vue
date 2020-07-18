<template>
  <div
    class="feefo-rating"
    @click="$emit('click')"
  >
    <img
      src="/images/feefo.svg"
      alt="Feefo"
    >
    <f-stars :score="score" />
  </div>
</template>

<script>
import FStars from './FStars'

export default {
  name: 'FeefoRating',

  components: {
    FStars
  },

  props: {
    score: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  display: inline-block;
  vertical-align: middle;
  margin-right: 14px;
  position: relative;
  top: -3px;
}
</style>
