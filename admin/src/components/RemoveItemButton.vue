<template>
  <button class="remove-item" @click="showAlert">Delete</button>
</template>

<script>
export default {
  name: 'remove-item-button',

  props: {
    id: Number,
    value: Array,
    apiUrl: String
  },

  methods: {
    removeItem () {
      this.axios.delete(`${this.apiUrl}/${this.id}`)
        .then(res => {
          this.$emit('input', this.value.filter(item => item.id !== this.id))
        }).catch(e => {
          this.$store.dispatch('error', e.response.data.error)
        })
    },
    showAlert () {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this!', options)
        .then(res => {
          if (res.ok) {
            this.removeItem()
          }
        })
    }
  }
}
</script>

<style scoped>
.remove-item {
  border: 0;
  background: transparent;
  box-shadow: none;
  color: #586678;
  font-weight: 400;
  cursor: pointer;
}
</style>
