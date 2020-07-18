<template>
  <div>
    <nav class="page-nav">
      <router-link :to="{ name: 'tour', params: { id: tour.id } }">Overview</router-link>
      <router-link :to="{ name: 'tour-details', params: { id: tour.id } }">Details</router-link>
      <router-link :to="{ name: 'itineraries', params: { id: tour.id }, query }">Itinerary</router-link>
      <router-link :to="{ name: 'tour-documentation', params: { id: tour.id }, query }">Documentation</router-link>
      <router-link :to="{ name: 'tour-seasons', params: { id: tour.id }, query }">Seasons</router-link>
      <router-link :to="{ name: 'tour-bikes', params: { id: tour.id }, query }">Bikes</router-link>
      <router-link :to="{ name: 'tour-routes', params: { id: tour.id }, query }">Routes</router-link>
      <router-link :to="{ name: 'tour-pricing', params: { id: tour.id }, query }">Pricing</router-link>
      <router-link :to="{ name: 'tour-party-extras', params: { id: tour.id }, query }">Supplements</router-link>
      <router-link :to="{ name: 'tour-room-extras', params: { id: tour.id }, query }">Extra nights</router-link>
      <router-link :to="{ name: 'tour-reductions', params: { id: tour.id }, query }">Reductions</router-link>
      <router-link :to="{ name: 'tour-specifications', params: { id: tour.id }, query }">Specifications</router-link>
      <router-link :to="{ name: 'tour-data-export', params: { id: tour.id }, query }">Data Export</router-link>
      <a :href="`https://flexitreks.netlify.com/tours/${tour.slug}/`" target="_blank">View</a>
    </nav>
    <header class="header">
      <h1>{{ tour.name_short || tour.name }} ({{ tour.tour_code }})</h1>
      <input v-if="save !== false" type="submit" value="Save" class="button button--blue" form="tour-form">
      <select v-if="save === false" class="season-picker" @change="changeSeason" :value="$route.query.season">
        <option value="">Pick a season</option>
        <option
          v-for="season in tour.allSeasons"
          :key="season.id"
          :value="season.id"
        >
          {{ season.name }}
        </option>
      </select>
    </header>
  </div>
</template>

<script>
export default {
  props: {
    tour: {
      type: Object,
      required: true
    },
    save: {
      type: Boolean,
      default () {
        return true
      }
    }
  },

  methods: {
    changeSeason (event) {
      this.$router.push({ name: this.$route.name, params: { id: this.tour.id }, query: { season: event.target.value } })
    }
  },

  computed: {
    query () {
      if (!this.$route.query || !this.$route.query.season) return ''
      return { season: this.$route.query.season }
    }
  }
}
</script>

<style scoped>
.season-picker {
  width: auto;
  margin: 0;
}
</style>
