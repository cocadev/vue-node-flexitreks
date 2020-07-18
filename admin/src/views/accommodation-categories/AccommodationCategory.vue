<template>
  <accommodation-category-form v-model="accommodationCategory" />
</template>

<script>
import AccommodationCategoryForm from '@/components/forms/AccommodationCategoryForm'
export default {
  data () {
    return {
      accommodationCategory: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    AccommodationCategoryForm
  },

  created () {
    this.axios.get(`accommodation-categories`)
      .then(res => {
        this.accommodationCategory = res.data.find(b => b.id === Number(this.id))
      })
  }
}
</script>
