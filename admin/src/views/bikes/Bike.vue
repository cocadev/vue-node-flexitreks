<template>
  <bike-form v-model="bike" />
</template>

<script>
import BikeForm from '@/components/forms/BikeForm'
export default {
  data () {
    return {
      bike: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    BikeForm
  },

  created () {
    this.axios.get(`bikes`)
      .then(res => {
        this.bike = res.data.find(b => b.id === Number(this.id))
        if (this.bike) {
          this.bike.name = this.bike.name.replace(/&amp;/g, '&')
        }
      })
  }
}
</script>
