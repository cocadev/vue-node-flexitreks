<template functional>
  <p class="tour-code">{{ props.code }}</p>
</template>

<script>
export default {
  props: {
    code: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
.tour-code {
  font-size: 12px;
  color: $grey;
  margin-bottom: 10px;
}
</style>
