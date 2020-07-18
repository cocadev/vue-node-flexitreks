<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season && seasonData">
      <div v-if="!seasonData.model">
        <router-link :to="{ name: 'tour-seasons', params: { id: tour.id }, query }">Click here to add a pricing model for this season</router-link>
      </div>
      <div v-else>
        <form @submit.prevent="save" id="tour-form">
          <input type="submit" class="button button--blue button--right" value="Save">
          <find-and-replace :markupType="markupType" :rates="seasonData.model.rates" @adjustCommission="adjustCommission" @submit="findAndReplace" @adjustPrices="adjustPrices" />
          <f-bikes
            :value="bikes"
            :seasonData="seasonData"
            :boats="boats"
            :allBikes="allBikes"
            @removeBike="removeBike"
          />
          <f-button @click="addBike" class="button--inline">Add Bike</f-button>
          <f-button @click="addDefaultBikes" class="button--inline">Add Default Bikes</f-button>
          <input type="submit" class="button button--blue button--right" value="Save">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FindAndReplace from '@/components/FindAndReplace'
import FBikes from '@/components/tours/TourBikes'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import prepareTour from '@/mixins/prepareTour'

export default {
  data () {
    return {
      tour: null,
      allBikes: [],
      boats: [],
      bikes: [],
      seasonData: null,
      markupType: 'supplement_markup'
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    FindAndReplace,
    TourNav,
    FBikes,
    FButton
  },

  watch: {
    season () {
      this.fetchSeason()
    }
  },

  computed: {
    season () {
      return Number(this.$route.query.season) || ''
    },

    query () {
      if (!this.$route.query || !this.$route.query.season) return ''
      return { season: this.$route.query.season }
    }
  },

  mixins: [prepareTour],

  created () {
    this.fetchSeason()
    const tour = this.axios.get(`tours/${this.id}`)
    const bikes = this.axios.get('bikes')
    const boats = this.axios.get('boats')
    const currencies = this.axios.get('currencies')
    const models = this.axios.get('models')

    Promise.all([tour, bikes, boats, currencies, models])
      .then(([tour, bikes, boats, currencies, models]) => {
        tour.data.bikes = tour.data.bikes.map(b => {
          b.gallery = []
          return b
        })

        this.tour = tour.data
        this.allBikes = bikes.data.map(b => {
          b.name = b.name.replace(/&amp;/g, '&')
          return b
        })
        this.boats = boats.data
        this.currencies = currencies.data
        this.models = models.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.seasonData = null
        this.axios.get(`tour-seasons/${this.id}/${this.season}`)
          .then((res) => {
            this.seasonData = res.data
          })

        this.axios.get(`tour-bikes/${this.id}/${this.season}`)
          .then((res) => {
            res.data.forEach(bike => {
              bike.gallery_id = bike.tour_bike_gallery_id || null
              bike.gallery = bike.gallery || []
            })

            this.bikes = res.data

            this.bikes
              .forEach(bike => {
                if (!bike.gallery_id) return
                this.axios.get(`galleries/${bike.gallery_id}`)
                  .then(gallery => {
                    bike.gallery = gallery.data.map(b => b.id)
                    this.$store.commit('addImages', gallery.data)
                  })
              })
          })
      }
    },

    createBike (bike) {
      this.axios.post(`tour-bikes/${this.tour.id}/${this.season}`, { bikes: [bike] })
        .then(res => {
          res.data.forEach(bike => {
            if (this.bikes.find(x => x.id === bike.id)) return
            this.bikes.push(bike)
          })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    // Adds the first bike ordered in the bikes global list
    addBike () {
      if (this.allBikes.length === 0) return

      this.createBike({
        bike_id: this.allBikes[0].id,
        cost: 0,
        nights: null,
        boat_id: null,
        tour_season_id: Number(this.$route.query.season),
        formula: '',
        gross: 0,
        non_com: 0,
        net: 0,
        adjustment: 0,
        markup_rate_id: null
      })
    },

    removeBike (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            this.bikes.splice(index, 1)
          }
        })
    },

    // Adds the first 2 bikes ordered in the bikes global list
    addDefaultBikes () {
      if (this.allBikes.length < 2) return

      this.createBike({
        bike_id: this.allBikes[0].id,
        cost: 0,
        nights: null,
        boat_id: null,
        tour_season_id: Number(this.$route.query.season),
        formula: '',
        gross: 0,
        non_com: 0,
        net: 0,
        adjustment: 0,
        markup_rate_id: null
      })

      // Should really be listening for a callback from createBike
      var self = this
      setTimeout(function () {
        self.createBike({
          bike_id: self.allBikes[1].id,
          cost: 0,
          nights: null,
          boat_id: null,
          tour_season_id: Number(self.$route.query.season),
          formula: '',
          gross: 0,
          non_com: 0,
          net: 0,
          adjustment: 0,
          markup_rate_id: null
        })
      }, 500)
    },

    findAndReplace ({ find, replace, column }) {
      this.bikes.forEach(price => {
        if (column === 'gross' && price.formula) return
        price[column] = Number(price[column].toString().replace(find, replace))
      })
    },

    adjustPrices (val) {
      this.bikes.forEach(price => {
        price.adjustment += val
      })
    },

    adjustCommission (val) {
      this.bikes.forEach(price => {
        price.markup_rate_id = val
      })
    },

    async save () {
      let bikes = []
      if (this.bikes.length) {
        bikes = this.bikes.map(bike => {
          bike.formula = bike.formula || ''
          return { ...bike }
        })
      }

      await Promise.all(bikes
        .map(bike => {
          if (bike.gallery_id) {
            return this.axios.put(`galleries/${bike.gallery_id}`, { media: bike.gallery })
          } else {
            delete bike.gallery_id
            return Promise.resolve()
          }
        })
      ).catch(console.error)
      bikes.forEach(bike => delete bike.gallery)

      this.axios.put(`tour-bikes/${this.tour.id}/${this.season}`, { bikes })
        .then(res => this.$toasted.success(`Saved`))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
