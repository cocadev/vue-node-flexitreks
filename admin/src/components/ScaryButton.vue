<template>
  <button
    type="button"
    :class="{
      button: true,
      certain: this.clicked === 1
    }"
    @click="click"
  >{{ text }}</button>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      default () {
        return 'Save'
      }
    }
  },

  data () {
    return {
      clicked: 0
    }
  },

  computed: {
    text () {
      return [this.message, 'Are you sure?', 'Saving'][this.clicked]
    }
  },

  methods: {
    click () {
      this.clicked++
      if (this.clicked === 2) {
        this.$emit('click')
        setTimeout(() => {
          this.clicked = 0
        }, 2000)
      } else {
        setTimeout(() => {
          this.clicked = 0
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.certain {
  background: #f13a3a;
}
</style>
