<template>
  <boat-form v-model="boat" />
</template>

<script>
import BoatForm from '@/components/forms/BoatForm'
export default {
  data () {
    return {
      boat: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    BoatForm
  },

  created () {
    this.axios.get(`boats`)
      .then(res => {
        this.boat = res.data.find(b => b.id === Number(this.id))
        if (this.boat) {
          this.boat.name = this.boat.name.replace(/&amp;/g, '&')
        }
      })
  }
}
</script>
