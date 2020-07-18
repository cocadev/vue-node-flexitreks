<template>
  <footer class="back-to-top wrap">
    <a
      class="orange-link orange-link--arrow orange-link--arrow-up"
      href="#"
      @click="scrollTo"
    >Back to top</a>
  </footer>
</template>

<script>
export default {
  methods: {
    scrollTo (event) {
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' }) 
        event.preventDefault()
      } catch (e) {}
    }
  }
}
</script>


<style lang="scss" scoped>
.back-to-top {
  padding-bottom: 40px;
  text-align: right;
}

.orange-link {
  margin-right: 25px;
  font-size: 16px;
}
</style>
