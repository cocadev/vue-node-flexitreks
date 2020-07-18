<template>
  <div v-if="enquiry">
    <header class="header">
      <h1>Enquiry</h1>
    </header>
    <dl>
      <dt>Date:</dt><dd>{{ enquiry.date }}</dd>
      <dt>Customer:</dt><dd>{{ enquiry.name }}</dd>
      <dt>Email:</dt><dd>{{ enquiry.email }}</dd>
      <dt>Telephone:</dt><dd>{{ enquiry.telephone }}</dd>
      <dt>Message:</dt><dd>{{ enquiry.message }}</dd>
    </dl>
    <div v-if="enquiry.destinations && enquiry.destinations.length">
      <h4>Destinations</h4>
      <ul v-if="enquiry.destinations.length">
        <li
          v-for="destination in enquiry.destinations"
          :key="destination.id"
        >
          <router-link :to="{ name: 'destination', params: { id: destination.slug } }">
            <u>{{ destination.name }}</u>
          </router-link>
        </li>
      </ul>
    </div>
    <div v-if="enquiry.destinations && enquiry.destinations.length">
      <h4>Tours</h4>
      <ul v-if="enquiry.tours.length">
        <li
          v-for="tour in enquiry.tours"
          :key="tour.id"
        >
          <router-link :to="{ name: 'tour', params: { id: tour.id } }">
            <u>{{ tour.name }}</u>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Thyme from '@trys/thyme'

export default {
  data () {
    return {
      enquiry: {}
    }
  },

  props: {
    id: {
      type: [String]
    }
  },

  created () {
    this.axios.get(`enquiries/${this.id}`)
      .then(res => {
        this.enquiry = res.data
        const date = new Thyme(this.enquiry.createdAt)
        this.enquiry.date = date.format()
      })
  }
}
</script>
