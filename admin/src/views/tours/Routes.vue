<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season">
      <form @submit.prevent="save" id="tour-form">
        <div v-for="(route, i) in routes" :key="route.id || (i * 13)" class="relative">
          <button type="button" class="remove-circle" @click="removeRoute(i)"></button>
          <f-input v-model="route.name" :name="`route_${route.id}_name`" label="Name" />
          <hr>
        </div>

        <f-button @click="addRoute" class="button--inline">Add Route</f-button>
        <input type="submit" class="button button--blue button--right" value="Save">
      </form>
    </div>
  </div>
</template>

<script>
import FButton from '@/components/FButton'
import FInput from '@/components/FInput'
import TourNav from '@/components/tours/TourNav'
import prepareTour from '@/mixins/prepareTour'

export default {
  data () {
    return {
      tour: null,
      routes: []
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    TourNav,
    FButton,
    FInput
  },

  watch: {
    season () {
      this.fetchSeason()
    }
  },

  computed: {
    season () {
      return Number(this.$route.query.season) || ''
    }
  },

  mixins: [prepareTour],

  created () {
    const tour = this.axios.get(`tours/${this.id}`)
    this.fetchSeason()

    Promise.all([tour])
      .then(([tour]) => {
        this.tour = tour.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-routes/${this.id}/${this.season}`)
          .then((res) => {
            this.routes = res.data
          })
      }
    },

    addRoute () {
      this.routes.push({
        id: '',
        name: '',
        tour_season_id: Number(this.$route.query.season)
      })
    },

    removeRoute (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            this.routes.splice(index, 1)
          }
        })
    },

    save () {
      let routes = []
      if (this.routes.length) {
        routes = this.routes.map(route => {
          const i = {
            name: String(route.name),
            tour_season_id: this.season
          }
          if (route.id) i.id = route.id
          return i
        })
      }

      this.axios.put(`tour-routes/${this.tour.id}/${this.season}`, { routes })
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
