<template>
  <div>
    <nav class="page-nav">
      <router-link :to="{ name: 'booking', params: { id: booking.id } }">Overview</router-link>
      <router-link :to="{ name: 'booking-edit', params: { id: booking.id } }">Edit</router-link>
      <router-link :to="{ name: 'booking-snapshot', params: { id: booking.id } }">Snapshots</router-link>
      <a :href="`/bookings/${booking.id}/documentation`" target="_blank">Tour documents</a>
    </nav>
    <header class="header">
      <h1>Booking #{{ booking.booking_reference }} - <router-link :to="{ name: 'tour', params: { id: booking.tour.id } }">{{ booking.tour.name_short || booking.tour.name }}</router-link></h1>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    booking: Object
  }
}
</script>
