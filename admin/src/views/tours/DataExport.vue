<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season">
      <form @submit.prevent="exportPricingData" id="tour-form">
        <input type="submit" class="button button--blue" value="Download pricing data">
      </form>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
import TourNav from '@/components/tours/TourNav'
import Thyme from '@trys/thyme'

export default {
  props: {
    id: {
      type: [String, Number]
    }
  },

  data () {
    return {
      tour: null,
      tableTitles: [
        'Tour Code', 'Tour Name', 'Model', 'Currency', 'Start', 'End', 'Nights', 'Boat',
        'Route', 'Guidance', 'Room', 'Accom', 'Gross', 'Non-com', 'Commission', 'Net',
        'Subtotal', 'Adjustment', 'Cost', 'Profit'
      ],
      categories: [],
      seasonData: null,
      rooms: [],
      ac: [],
      boats: [],
      currencies: []
    }
  },

  components: {
    TourNav
  },

  computed: {
    season () {
      return Number(this.$route.query.season) || ''
    }
  },

  watch: {
    season () {
      this.fetchSeason()
    }
  },

  created () {
    this.fetchSeason()

    const tour = this.axios.get(`tours/${this.id}`)
    const rooms = this.axios.get('room-types')
    const ac = this.axios.get('accommodation-categories')
    const boats = this.axios.get('boats')
    const currencies = this.axios.get('currencies')

    Promise.all([tour, rooms, ac, boats, currencies])
      .then(([tour, rooms, ac, boats, currencies]) => {
        this.tour = tour.data
        this.rooms = rooms.data
        this.ac = ac.data
        this.boats = boats.data
        this.currencies = currencies.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-pricing/${this.id}/${this.season}`)
          .then((res) => {
            this.categories = res.data
          })
        this.seasonData = null
        this.axios.get(`tour-seasons/${this.id}/${this.season}`)
          .then((res) => {
            this.seasonData = res.data
          })
      }
    },

    exportPricingData () {
      let season = this.tour.allSeasons.filter(s => s.id === this.season)[0]
      let exportData = [
        ['Season', season.name]
      ]
      this.currencies.map(cur => {
        let curRate = cur.rates.filter(c => c.season_id === season.season_id)
        if (curRate.length) {
          exportData.push([cur.name, cur.rates.filter(c => c.season_id === season.season_id)[0].rate])
        }
      })
      exportData.push(
        [],
        this.tableTitles
      )
      this.categories.map(cat => {
        let relatedFields = {}
        relatedFields['boat_name'] = cat.boat_id ? this.boats.filter(b => cat.boat_id === b.id)[0].name : ''
        relatedFields['route_name'] = cat.tour_route_id ? this.tour.routes.filter(r => cat.tour_route_id === r.id)[0].name : ''
        relatedFields['guidance'] = ''
        if (cat.guided === true) {
          relatedFields['guidance'] = 'Guided'
        }
        if (cat.guided === false) {
          relatedFields['guidance'] = 'Self-Guided'
        }
        cat.prices.map(price => {
          relatedFields['room_name'] = price.room_type_id ? this.rooms.filter(r => price.room_type_id === r.id)[0].name : ''
          relatedFields['accom_name'] = price.accommodation_category_id ? this.ac.filter(ac => price.accommodation_category_id === ac.id)[0].name : ''
          let rate = price.markup_rate_id ? this.seasonData.model.rates.filter(r => price.markup_rate_id === r.id)[0] : ''
          relatedFields['commission'] = rate ? rate.commission + '% - ' + rate.markup : ''
          relatedFields['subtotal'] = rate ? (Math.ceil(price.net / this.seasonData.currency.rate * rate['markup']) || 0) : 0
          relatedFields['profit'] = Math.round(price.cost - price.net / this.seasonData.currency.rate)
          let exportPrice = [
            this.tour.tour_code,
            this.tour.name,
            this.seasonData.model.name,
            this.seasonData.currency.name,
            this.formatDate(cat.start),
            this.formatDate(cat.end),
            cat.nights,
            relatedFields['boat_name'],
            relatedFields['route_name'],
            relatedFields['guidance'],
            relatedFields['room_name'],
            relatedFields['accom_name'],
            price.gross,
            price.non_com,
            relatedFields['commission'],
            price.net,
            relatedFields['subtotal'],
            price.adjustment,
            price.cost,
            relatedFields['profit']
          ]
          exportData.push(exportPrice)
        })
      })
      const ws = XLSX.utils.aoa_to_sheet(exportData)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Data')
      XLSX.writeFile(wb, this.tour.name + ' pricing data.xlsx')
    },

    formatDate (date) {
      date = new Thyme(date)
      return [date.getMonth() + 1, date.getDate(), date.getFullYear()].join('/')
    }
  }
}
</script>
