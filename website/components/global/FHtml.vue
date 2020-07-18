<template>
  <div 
    class="html" 
    v-html="data"
  />
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: ''
    },
  },
}
</script>

<style lang="scss" >
  .html {
    h1, 
    h2, 
    h3, 
    h4{
      color: #fff;
    }
  }

</style>
