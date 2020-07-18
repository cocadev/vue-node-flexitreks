<template>
  <restaurant-form v-model="restaurant" />
</template>

<script>
import RestaurantForm from '@/components/forms/RestaurantForm'
export default {
  data () {
    return {
      restaurant: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    RestaurantForm
  },

  created () {
    this.axios.get(`restaurants/${this.id}`)
      .then(res => {
        this.restaurant = res.data
      })
  }
}
</script>
