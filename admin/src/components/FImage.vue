<template>
  <img :src="`${image.url}${$store.state.sizes[size]}`" :alt="image.alt" />
</template>

<script>
export default {
  props: {
    image: {
      type: Object
    },
    size: {
      type: String,
      default: 'thumbnail'
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  background: #E3E3E3;
  font-size: 12px;
  font-weight: 600;
  color: #7e8a99;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
