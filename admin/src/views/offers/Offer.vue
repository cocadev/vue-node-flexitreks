<template>
  <offer-form v-model="offer" />
</template>

<script>
import OfferForm from '@/components/forms/OfferForm'
import Thyme from '@trys/thyme'

export default {
  data () {
    return {
      offer: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    OfferForm
  },

  created () {
    this.axios.get(`offers/${this.id}`)
      .then(res => {
        this.offer = res.data
        if (this.offer.booking_window_start) this.offer.booking_window_start = new Thyme(this.offer.booking_window_start)
        if (this.offer.booking_window_end) this.offer.booking_window_end = new Thyme(this.offer.booking_window_end)
        if (this.offer.start_window_start) this.offer.start_window_start = new Thyme(this.offer.start_window_start)
        if (this.offer.start_window_end) this.offer.start_window_end = new Thyme(this.offer.start_window_end)
        if (!this.offer.bike_ids) this.offer.bike_ids = []
        if (!this.offer.tour_ids) this.offer.tour_ids = []
      })
  }
}
</script>
