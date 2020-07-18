<template>
  <offer-form :value="order" />
</template>

<script>
import OfferForm from '@/components/forms/OfferForm'
export default {
  components: {
    OfferForm
  },

  data () {
    return {
      order: {
        name: '',
        status: 'draft',
        type: 'tour',
        discount: null,
        booking_window_start: null,
        booking_window_end: null,
        start_window_start: null,
        start_window_end: null,
        bike_ids: [],
        tour_ids: [],
        title: '',
        subtitle: '',
        slug: '',
        content: '',
        media_id: null
      }
    }
  }
}
</script>
