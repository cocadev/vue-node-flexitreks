<template>
  <div v-if="booking">
    <booking-nav :booking="booking" />
    <div
      v-for="snapshot in booking.snapshots"
      :key="snapshot.id"
    >
      <h2>Snapshot #{{ snapshot.id }} - {{ new Date(snapshot.createdAt).toLocaleDateString('en-GB') }} {{ new Date(snapshot.createdAt).toLocaleTimeString('en-GB') }}</h2>
      <pre>{{ snapshot.snapshot }}</pre>
      <hr>
    </div>
  </div>
</template>

<script>
import BookingNav from '@/components/BookingNav'

export default {
  data () {
    return {
      booking: null
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    BookingNav
  },

  created () {
    this.axios.get(`bookings/${this.id}/snapshot`)
      .then(res => {
        this.booking = res.data
      })
  }
}
</script>
