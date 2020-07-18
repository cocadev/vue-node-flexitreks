<template>
  <hotel-form v-model="hotel" />
</template>

<script>
import HotelForm from '@/components/forms/HotelForm'
export default {
  data () {
    return {
      hotel: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    HotelForm
  },

  created () {
    this.axios.get(`hotels/${this.id}`)
      .then(res => {
        this.hotel = res.data
      })
  }
}
</script>
