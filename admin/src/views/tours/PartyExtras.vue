<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season && seasonData">
      <div v-if="!seasonData.model">
        <router-link :to="{ name: 'tour-seasons', params: { id: tour.id }, query }">Click here to add a pricing model for this season</router-link>
      </div>
      <div v-else>
        <div class="clear">
          <find-and-replace :markupType="markupType" :rates="seasonData.model.rates" @adjustCommission="adjustCommission" @submit="findAndReplace" @adjustPrices="adjustPrices" />
          <form @submit.prevent="save" id="tour-form">
            <input type="submit" class="button button--blue button--right save-btn-top" value="Save">
            <div class="spacer"></div>
            <tour-party-extras
              :value="extras"
              :ac="ac"
              :bikes="bikes"
              :boats="boats"
              :seasonData="seasonData"
              @addVariation="addVariation"
              @removeVariation="removeVariation"
              @addExtra="addExtra"
              @removeExtra="removeExtra"
            />
            <input type="submit" class="button button--blue button--right" value="Save">
          </form>
        </div>
        <copy-from @change="copyFromSeason" pageType="supplements" />
      </div>
    </div>
  </div>
</template>

<script>
import FindAndReplace from '@/components/FindAndReplace'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import TourPartyExtras from '@/components/tours/TourPartyExtras'
import CopyFrom from '@/components/tours/CopyFrom'

export default {
  data () {
    return {
      tour: null,
      extras: [],
      ac: [],
      bikes: [],
      removedExtras: [],
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
    TourPartyExtras,
    FButton,
    CopyFrom
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

  created () {
    this.fetchSeason()

    const tour = this.axios.get(`tours/${this.id}`)
    const ac = this.axios.get('accommodation-categories')
    const bikes = this.axios.get('bikes')
    const boats = this.axios.get('boats')

    Promise.all([tour, ac, bikes, boats])
      .then(([tour, ac, bikes, boats]) => {
        this.tour = tour.data
        this.ac = ac.data
        this.bikes = bikes.data
        this.boats = boats.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-extras/${this.id}/${this.season}/party`)
          .then((res) => {
            this.extras = res.data
          })

        this.seasonData = null
        this.axios.get(`tour-seasons/${this.id}/${this.season}`)
          .then((res) => {
            this.seasonData = res.data
          })
      }
    },

    addExtra () {
      const extra = {
        name: null,
        variations: [{
          cost: 0,
          bike_id: null,
          accommodation_category_id: null,
          min_pax: null,
          max_pax: null,
          formula: '',
          gross: 0,
          non_com: 0,
          net: 0,
          markup_rate_id: null,
          adjustment: 0
        }],
        tour_season_id: this.season,
        order: 0
      }

      this.axios.post(`tour-extras/${this.tour.id}/${this.season}/party`, extra)
        .then(res => {
          this.$toasted.success(`Created extra ${res.data.id}`)
          return this.axios.get(`tour-extras/${this.tour.id}/${this.season}/party/${res.data.id}`)
        })
        .then(res => {
          this.extras.push(res.data)
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    removeExtra (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.extras[index]) return
            if (this.extras[index].id) this.removedExtras.push(this.extras[index].id)
            this.extras.splice(index, 1)
          }
        })
    },

    addVariation (index) {
      if (!this.extras[index]) return
      const extra = this.extras[index]

      const variation = {
        cost: 0,
        bike_id: null,
        accommodation_category_id: null,
        min_pax: null,
        max_pax: null,
        formula: '',
        gross: 0,
        non_com: 0,
        net: 0,
        markup_rate_id: null,
        adjustment: 0
      }

      const holding_extra = { ...extra }
      holding_extra.variations = [variation]

      this.axios.post(`tour-extras/${this.tour.id}/${this.season}/party/${extra.id}`, holding_extra)
        .then(res => {
          res.data.variations.forEach(price => {
            if (extra.variations.find(x => x.id === price.id)) return
            extra.variations.push(price)
          })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    removeVariation ({ cat, variation }) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.extras[cat]) return
            this.extras[cat].variations.splice(variation, 1)
          }
        })
    },

    findAndReplace ({ find, replace, column }) {
      this.extras.forEach(cat => {
        cat.variations.forEach(price => {
          if (column === 'gross' && price.formula) return
          price[column] = Number(price[column].toString().replace(find, replace))
        })
      })
    },

    adjustPrices (val) {
      this.extras.forEach(cat => {
        cat.variations.forEach(price => {
          price.adjustment += val
        })
      })
    },

    adjustCommission (val) {
      this.extras.forEach(cat => {
        cat.variations.forEach(price => {
          price.markup_rate_id = val
        })
      })
    },

    copyFromSeason ({ season_id, tour_id }) {
      this.axios.get(`tour-extras/${tour_id}/${season_id}/party`)
        .then((res) => {
          res.data
            .forEach(extra => {
              extra.id = ''
              delete extra.createdAt
              extra.variations.forEach(v => {
                delete v.id
                delete v.createdAt
              })

              this.extras.push(extra)
            })
        })
    },

    save () {
      this.removedExtras.forEach(id => {
        this.axios.delete(`tour-extras/${this.tour.id}/${this.season}/party/${id}`)
          .then(() => {
            this.$toasted.success(`Deleted extra ${id}`)
            this.removedExtras.splice(this.removedExtras.indexOf(id), 1)
          })
          .catch(e => this.$store.dispatch('error', e.response.data.error))
      })

      this.extras.forEach(extra => {
        extra.variations.forEach(v => {
          if (isNaN(v.min_pax)) v.min_pax = null
          if (isNaN(v.max_pax)) v.max_pax = null
        })

        if (!extra.id) {
          this.axios.post(`tour-extras/${this.tour.id}/${this.season}/party`, extra)
            .then(res => {
              extra.id = res.data.id
              this.$toasted.success(`Created extra ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        } else {
          this.axios.put(`tour-extras/${this.tour.id}/${this.season}/party/${extra.id}`, extra)
            .then(res => {
              this.$toasted.success(`Updated extra ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        }
      })
    }
  }
}
</script>

<style>
.save-btn-top {
  position: relative;
  top: -65px;
}
.spacer {
  clear: both;
}
</style>
