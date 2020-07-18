<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season && seasonData">
      <div v-if="!seasonData.model">
        <router-link :to="{ name: 'tour-seasons', params: { id: tour.id }, query }">Click here to add a pricing model for this season</router-link>
      </div>
      <div v-else>
        <find-and-replace :markupType="markupType" :rates="seasonData.model.rates" @adjustCommission="adjustCommission" @submit="findAndReplace" @adjustPrices="adjustPrices" />
        <form @submit.prevent="save" id="tour-form">
          <input type="submit" class="button button--blue button--right save-btn-top" value="Save">
          <div class="spacer"></div>
          <tour-room-extras
            :value="extras"
            :ac="ac"
            :rooms="rooms"
            :seasonData="seasonData"
            @addVariation="addVariation"
            @removeVariation="removeVariation"
            @addExtra="addExtra"
            @removeExtra="removeExtra"
            @addExtras="addExtras"
          />
          <input type="submit" class="button button--blue button--right" value="Save">
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FindAndReplace from '@/components/FindAndReplace'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import TourRoomExtras from '@/components/tours/TourRoomExtras'
import Thyme from '@trys/thyme'

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
    TourRoomExtras,
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

  created () {
    this.fetchSeason()

    const tour = this.axios.get(`tours/${this.id}`)
    const ac = this.axios.get('accommodation-categories')
    const rooms = this.axios.get('room-types')

    Promise.all([tour, ac, rooms])
      .then(([tour, ac, rooms]) => {
        this.tour = tour.data
        this.ac = ac.data
        this.rooms = rooms.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-extras/${this.id}/${this.season}/room`)
          .then((res) => {
            this.extras = res.data.map(this.formatExtra)
          })

        this.seasonData = null
        this.axios.get(`tour-seasons/${this.id}/${this.season}`)
          .then((res) => {
            this.seasonData = res.data
          })
      }
    },

    formatExtra (extra) {
      extra.variations.forEach(variation => {
        if (variation.restricted_dates === null) variation.restricted_dates = []
        if (variation.restricted_days === null) variation.restricted_days = []
        if (variation.specific_dates === null) variation.specific_dates = []

        variation.restricted_dates = variation.restricted_dates.map(d => new Thyme(d))
        variation.specific_dates = variation.specific_dates.map(d => new Thyme(d))

        if (variation.start) variation.start = new Thyme(variation.start).toString()
        if (variation.end) variation.end = new Thyme(variation.end).toString()
      })

      return extra
    },

    addExtras (extras) {
      extras
        .map(this.formatExtra)
        .forEach(extra => {
          extra.id = ''
          delete extra.createdAt
          extra.variations.forEach(v => {
            delete v.id
            delete v.createdAt
          })

          this.extras.push(extra)
        })
    },

    addExtra () {
      const extra = {
        id: '',
        name: '',
        pre: true,
        post: true,
        variations: [],
        tour_season_id: this.season
      }

      this.axios.post(`tour-extras/${this.tour.id}/${this.season}/room`, extra)
        .then(res => {
          this.$toasted.success(`Created extra ${res.data.id}`)
          return this.axios.get(`tour-extras/${this.tour.id}/${this.season}/room/${res.data.id}`)
        })
        .then(res => {
          this.extras.push(this.formatExtra(res.data))
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

      const prev = this.extras[index].variations.length ? this.extras[index].variations[this.extras[index].variations.length - 1] : {}
      const today = new Thyme().raw

      const start = prev.start || today
      const end = prev.end || today
      const accommodation_category_id = prev.accommodation_category_id || null
      let markup_rate_id = prev.markup_rate_id || null
      let restricted_days = []
      if (prev.restricted_days && prev.restricted_days.length) restricted_days = [...prev.restricted_days]

      let room_type_id = Number(prev.room_type_id) || null
      if (room_type_id < 5) room_type_id++
      if (room_type_id === null) room_type_id = 1

      let formula = null
      let gross = null
      let net = null
      let adjustment = 0
      let non_com = 0
      let cost = 0

      if (room_type_id === 2) {
        formula = prev.formula || ''
        gross = prev.gross || ''
        net = prev.net || null
        adjustment = prev.adjustment || 0
        non_com = prev.non_com || 0
        cost = prev.cost || null
      }

      const variation = {
        cost,
        accommodation_category_id,
        room_type_id,
        start,
        end,
        specific_dates: [],
        restricted_dates: [],
        restricted_days,
        formula,
        gross,
        non_com,
        net,
        markup_rate_id,
        adjustment
      }

      const holding_extra = { ...extra }
      holding_extra.variations = [variation]

      this.axios.post(`tour-extras/${this.tour.id}/${this.season}/room/${extra.id}`, holding_extra)
        .then(res => {
          res.data.variations.forEach(price => {
            if (extra.variations.find(x => x.id === price.id)) return
            extra.variations.push(price)
            this.formatExtra(extra)
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

    save () {
      this.removedExtras.forEach(id => {
        this.axios.delete(`tour-extras/${this.tour.id}/${this.season}/room/${id}`)
          .then(() => {
            this.$toasted.success(`Deleted extra ${id}`)
            this.removedExtras.splice(this.removedExtras.indexOf(id), 1)
          })
          .catch(e => this.$store.dispatch('error', e.response.data.error))
      })

      this.extras.forEach(extra => {
        extra.variations.forEach(variation => {
          if (variation.specific_dates === null) variation.specific_dates = []
          if (variation.restricted_dates === null) variation.restricted_dates = []
          if (variation.restricted_days === null) variation.restricted_days = []
        })

        if (!extra.id) {
          this.axios.post(`tour-extras/${this.tour.id}/${this.season}/room`, extra)
            .then(res => {
              extra.id = res.data.id
              this.$toasted.success(`Created extra ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        } else {
          this.axios.put(`tour-extras/${this.tour.id}/${this.season}/room/${extra.id}`, extra)
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
