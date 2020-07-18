<template>
  <div v-if="booking">
    <booking-nav :booking="booking" />

    <booking-form :booking="booking" :bikes="bikes" @submit="save" />
  </div>
</template>

<script>
import BookingNav from '@/components/BookingNav'
import BookingForm from '@/components/forms/BookingForm'

export default {
  data () {
    return {
      booking: null,
      bikes: []
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    BookingNav,
    BookingForm
  },

  created () {
    this.axios.get(`bookings/${this.id}`)
      .then(res => {
        this.booking = res.data
      })
      .then(() => {
        return this.axios.get(`tours/${this.booking.tour_id}/${this.booking.tour_season_id}/bikes`)
      })
      .then(res => {
        this.bikes = res.data
      })
  },

  methods: {
    save () {
      const data = this.booking
      const filters = [data.filter_boat, data.filter_from, data.filter_guided, data.filter_nights].filter(f => f !== null)
      data.filters = {}

      if (filters.length) {
        if (data.filter_boat) data.filters.boat = data.filter_boat
        if (data.filter_from) data.filters.from = data.filter_from
        if (data.filter_guided) data.filters.guided = data.filter_guided
        if (data.filter_nights) data.filters.nights = data.filter_nights
      }

      data.party.forEach(person => {
        person.booking_room_id = person.booking_room_id
        if (!person.tour_bike_id && person.tour_bike_id !== undefined) person.tour_bike_id = null
      })

      data.rooms.forEach(room => {
        room.room_id = room.id
        if (room.extras && !room.extras.length) delete room.extras
      })

      this.axios.put(`bookings/${this.booking.id}`, data)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
