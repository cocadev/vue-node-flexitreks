<template>
  <div>
    <header class="header">
      <h1>Bookings</h1>
    </header>

    <list-table :data="bookings">
      <template slot="thead">
        <th>Name</th>
        <th>Booking ref.</th>
        <th>Tour / Route</th>
        <th>Status</th>
        <th>Actions</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'booking', params: { id: props.instance.id } }">
            {{ props.instance.title }} {{ props.instance.first_name }} {{ props.instance.last_name }}
          </router-link>
        </td>
        <td>
          <router-link :to="{ name: 'booking', params: { id: props.instance.id } }">
            {{ props.instance.booking_reference }}
          </router-link>
        </td>
        <td>
          <router-link :to="{ name: 'tour', params: { id: props.instance.tour_slug } }">
            {{ props.instance.tour_name }}
          </router-link>
        </td>
        <td><span :class="`payment-status payment-status--${props.instance.status}`">{{ props.instance.status.replace('payment-', '') }}</span></td>
        <td>
          <router-link :to="{ name: 'booking', params: { id: props.instance.id } }">
            View
          </router-link>
          -
          <router-link :to="{ name: 'booking-edit', params: { id: props.instance.id } }">
            Edit
          </router-link>
        </td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
export default {
  data () {
    return {
      bookings: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get('bookings')
      .then(res => {
        this.bookings = res.data
      })
  }
}
</script>
