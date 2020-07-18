<template>
  <category-form v-model="category" />
</template>

<script>
import CategoryForm from '@/components/forms/CategoryForm'
export default {
  data () {
    return {
      category: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    CategoryForm
  },

  created () {
    this.axios.get(`categories/${this.id}`)
      .then(res => {
        this.category = res.data
      })
  }
}
</script>
