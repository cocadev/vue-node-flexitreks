<template>
  <div>
    <header class="header">
      <h1>Bulk pricing editor</h1>
      <button
        type="button"
        :class="{
          'button button--inline': true,
          'button--blue': !!editingMarkup
        }"
        @click="editingMarkup = !editingMarkup"
      >Markup</button>
      <button
        type="button"
        :class="{
          'button button--inline': true,
          'button--blue': !!editingCurrency
        }"
        @click="editingCurrency = !editingCurrency"
      >Currency</button>
      <button
        type="button"
        :class="{
          'button button--inline': true,
          'button--blue': !!showingNotes
        }"
        @click="showingNotes = !showingNotes"
      >Notes</button>
      <select class="pgt-season-picker" @change="changeSeason" :value="$route.query.season">
        <option value="">Pick a season</option>
        <option
          v-for="season in seasons"
          :key="season.id"
          :value="season.id"
        >
          {{ season.name }}
        </option>
      </select>
    </header>

    <admin-notes v-if="showingNotes" />

    <aside v-if="editingMarkup" class="markup-editor">
      <h3>Markup models</h3>
      <markup-editor
        v-for="model in models"
        :key="model.id"
        :model="model"
        @update="updateModel"
        @addRate="addRate"
      />
    </aside>

    <aside v-if="editingCurrency" class="currency-editor">
      <h3>Exchange Rates</h3>
      <currency-editor
        v-for="currency in currencies"
        :key="currency.id"
        :currency="currency"
        :seasons="seasons"
        @update="updateCurrency"
      />
    </aside>

    <header class="tour-codes">
      <ul>
        <li
          v-for="tour in orderedTours"
          :key="tour.id"
        >
          <router-link :to="{ name: 'pgt', query: { tour_id: tour.id, season: $route.query.season } }">{{ tour.tour_code }}</router-link>
        </li>
      </ul>
    </header>

    <div v-if="season && seasonData">
      <table class="pgt pgt-table" v-if="seasonData.model && seasonData.currency">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Gross ({{ currency ? currency.symbol : '' }})</th>
            <th>Non-com</th>
            <th>Commission</th>
            <th>Net ({{ currency ? currency.symbol : '' }})</th>
            <th>Subtotal</th>
            <th>Adjustment</th>
            <th>Cost</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody
          v-for="category in season.categories"
          :key="category.id"
        >
          <tr>
            <th colspan="10">{{ categoryTitle(category) }}</th>
          </tr>
          <tour-price
            v-for="price in category.prices"
            :key="`${tour.id}_${price.id}`"
            :price="price"
            :seasonData="seasonData"
          />
        </tbody>

      </table>
    </div>
  </div>
</template>

<script>
import TourPrice from '../../components/pgt/tour-price'
import MarkupEditor from '../../components/pgt/markup-editor'
import CurrencyEditor from '../../components/pgt/currency-editor'
import AdminNotes from '../../components/pgt/notes'
import ScaryButton from '../../components/ScaryButton'
import Thyme from '@trys/thyme'

export default {
  components: {
    TourPrice,
    ScaryButton,
    MarkupEditor,
    CurrencyEditor,
    AdminNotes
  },

  data () {
    return {
      tours: [],
      editingMarkup: false,
      editingCurrency: false,
      showingNotes: false,
      currencies: [],
      models: [],
      tourTrigger: false,
      seasons: [],
      boats: [],
      seasonData: null
    }
  },

  watch: {
    $route (r1, r2) {
      this.fetchPrices()
      if (r1.query.season !== r2.query.season) this.fetchModels()
    }
  },

  computed: {
    model () {
      if (!this.season) return null
      return this.models.find(m => m.id === this.season.model_id)
    },

    currency () {
      if (!this.season) return null
      return this.currencies.find(m => m.id === this.season.currency_id)
    },

    tour () {
      const id = Number(this.$route.query.tour_id)
      if (!id) return null

      return this.tours.find(t => t.id === Number(this.$route.query.tour_id))
    },

    season () {
      if (!this.tour) return null
      const season_id = Number(this.$route.query.season)
      const season = this.tour.seasons.find(s => s.season_id === season_id)
      if (!season || !season.fetched) return null

      return season
    },

    prices () {
      if (!this.season) return []
      const prices = []
      this.season.categories.forEach(c => {
        c.prices.forEach(p => prices.push(p))
      })
      return prices
    },

    orderedTours: function () {
      const allTours = this.tours
      return allTours.sort(function (a, b) {
        return a['tour_code'].localeCompare(b['tour_code'])
      })
    }
  },

  mounted () {
    this.$store.dispatch('getRoomTypes')
    this.$store.dispatch('getAccommodationCategories')
    this.$store.dispatch('getDecks')

    this.axios.get('boats')
      .then(res => {
        this.boats = res.data
      })

    this.axios.get('currencies')
      .then(res => {
        this.currencies = res.data
      })

    this.fetchModels()

    this.axios.get('seasons')
      .then(res => {
        this.seasons = res.data

        this.axios.get('tours/all')
          .then(res => {
            res.data.forEach(t => {
              t.seasons = this.seasons.map(s => {
                return {
                  season_id: s.id,
                  categories: [],
                  bikes: [],
                  fetched: false,
                  currency_id: 1,
                  model_id: 1
                }
              })
            })
            this.tours = res.data
            this.fetchPrices()
          })
      })
  },

  methods: {
    update ([ id, value, key ]) {
      const tour_id = Number(this.$route.query.tour_id)
      const season_id = Number(this.$route.query.season)
      if (!tour_id || !season_id) return

      const tourIndex = this.tours.findIndex(t => t.id === tour_id)
      if (tourIndex === -1) return null

      const seasonIndex = this.tours[tourIndex].seasons.findIndex(s => s.season_id === season_id)
      if (seasonIndex === -1) return

      const categories = this.tours[tourIndex].seasons[seasonIndex].categories
      let priceIndex = -1
      let catIndex = -1

      categories.forEach((cat, i) => {
        const index = cat.prices.findIndex(p => p.id === id)
        if (index !== -1) {
          priceIndex = index
          catIndex = i
        }
      })

      if (priceIndex === -1 || catIndex === -1) return

      this.tours[tourIndex].seasons[seasonIndex].categories[catIndex].prices[priceIndex][key] = Number(value.target.value)
    },

    updateModel ([ model_id, id, value, key ]) {
      const model = this.models.find(m => m.id === model_id)
      if (!model) return

      const rate = model.rates.find(r => r.id === id)
      if (!rate) return

      rate[key] = Number(value.target.value)

      if (this.seasonData.markup_model_id === model.id) {
        const season_rate = this.seasonData.model.rates.find(r => r.id === id)
        season_rate[key] = rate[key]
      }
    },

    addRate (id) {
      const model = this.models.find(m => m.id === id)
      if (!model) return

      const holding_model = { ...model }
      holding_model.rates = [{
        commission: 0,
        markup: 0,
        supplement_markup: 0
      }]

      this.axios.post(`models/${model.season_id}/${model.id}`, holding_model)
        .then(res => {
          res.data.rates.forEach(rate => {
            if (model.rates.find(r => r.id === rate.id)) return
            model.rates.push(rate)

            if (this.seasonData.markup_model_id === model.id) this.seasonData.model.rates.push(rate)
          })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    updateCurrency ([ currency_id, season_id, value, key ]) {
      const currency = this.currencies.find(m => m.id === currency_id)
      if (!currency) return

      let rate = currency.rates.find(r => r.season_id === season_id)
      if (!rate) {
        rate = { season_id, rate: value }
        currency.rates.push(rate)
      }

      rate[key] = Number(value.target.value)

      if (this.seasonData.season_id === season_id) {
        this.seasonData.currency[key] = rate[key]
      }
    },

    fetchModels () {
      const season_id = Number(this.$route.query.season)
      if (!season_id) return
      this.axios.get(`models/${season_id}`)
        .then(res => {
          this.models = res.data
        })
    },

    fetchPrices () {
      const id = Number(this.$route.query.tour_id)
      const season_id = Number(this.$route.query.season)
      if (!id || !season_id || !this.tour) return

      const season = this.tour.seasons.find(s => s.season_id === season_id)
      if (!season) return

      this.axios.get(`tours/${id}`)
        .then(res => {
          const index = this.tours.findIndex(t => t.id === id)
          if (index === -1) return

          this.tours[index].allSeasons = res.data.allSeasons
          const tour_season = res.data.allSeasons.find(x => x.season_id === Number(this.$route.query.season))
          if (!tour_season) return

          this.seasonData = null
          this.axios.get(`tour-seasons/${id}/${tour_season.id}`)
            .then((res) => {
              if (res.data.model) {
                const localModel = this.models.find(m => m.id === res.data.markup_model_id)
                if (localModel) {
                  res.data.model.rates.forEach(rate => {
                    const localRate = localModel.rates.find(r => r.id === rate.id)
                    if (!localRate) return

                    rate.commission = localRate.commission
                    rate.markup = localRate.markup
                    rate.supplement_markup = localRate.supplement_markup
                  })
                }
              }

              this.seasonData = res.data
            })

          this.axios.get(`tour-pricing/${res.data.id}/${tour_season.id}`)
            .then((res) => {
              season.categories = res.data.map(this.formatCategory)
              season.fetched = true
            })

          season.bikes = res.data.bikes
        })
        .catch(console.error)
    },

    changeSeason (event) {
      this.$router.push({ name: 'pgt', query: { season: event.target.value, tour_id: this.$route.query.tour_id } })
    },

    formatCategory (cat) {
      if (cat.restricted_dates === null) cat.restricted_dates = []
      if (cat.restricted_days === null) cat.restricted_days = []
      if (cat.specific_dates === null) cat.specific_dates = []

      cat.restricted_dates = cat.restricted_dates.map(d => new Thyme(d))
      cat.specific_dates = cat.specific_dates.map(d => new Thyme(d))

      if (cat.start) cat.start = new Thyme(cat.start)
      if (cat.end) cat.end = new Thyme(cat.end)

      cat.prices.forEach(price => {
        if (price.category) delete price.category

        if (!price.gross) price.gross = price.cost
        if (!price.formula) price.formula = ''
        if (!price.non_com) price.non_com = 0
        if (!price.markup_rate_id) price.markup_rate_id = 15
        if (!price.adjustment) price.adjustment = 0
      })

      return cat
    },

    categoryTitle (cat) {
      let title = ''

      if (cat.boat_id) {
        const boat = this.boats.find(x => x.id === cat.boat_id)
        if (boat) title += boat.name + ': '
      }

      if (cat.specific_dates.length) return title + cat.specific_dates.map(this.formatDate).join(', ')

      if (cat.start) title += this.formatDate(cat.start)
      if (cat.end && !cat.start.equals(cat.end)) title += ` - ${this.formatDate(cat.end)}`

      if (cat.restricted_dates.length) title += ` (not ${cat.restricted_dates.map(this.formatDate).join(', ')})`

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      if (cat.restricted_days.length) title += ` - ${[0, 1, 2, 3, 4, 5, 6].filter(k => !cat.restricted_days.includes(k)).map(d => days[d]).join(', ')} arrivals`

      if (cat.nights) title += ` - ${cat.nights} nights`

      return title
    },

    formatDate (date) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return date.getDate() + ' ' + months[date.getMonth()]
    },

    saveTour (tour_id, season_id) {
      const tour = this.tours.find(t => t.id === tour_id)
      if (!tour) return
      const season = tour.seasons.find(s => s.season_id === season_id)
      const tour_season = tour.allSeasons.find(x => x.season_id === season_id)
      if (!season || !tour_season || !season.categories.length) return

      season.categories.forEach(cat => {
        if (cat.guided === '') cat.guided = null
        if (cat.specific_dates === null) cat.specific_dates = []
        if (cat.restricted_dates === null) cat.restricted_dates = []
        if (cat.restricted_days === null) cat.restricted_days = []

        console.log(cat.prices)

        // if (cat.id) {
        //   this.axios.put(`tour-pricing/${tour_id}/${tour_season.id}/${cat.id}`, cat)
        //     .then(res => {
        //       this.$toasted.success(`Updated category ${res.data.id}`)
        //     })
        //     .catch(e => this.$store.dispatch('error', e.response.data.error))
        // }
      })

      // console.table(season)
      // console.table(tour_season)
    }

  }
}
</script>
<style>
.pgt {
  margin-bottom: 50vh;
}

.pgt-adjustments {
  margin-left: auto;
}

.pgt-adjustments > * {
  width: auto;
}

.pgt-adjustments input {
  width: 120px;
}

.tour-codes {
  width: calc(100vw - 80px);
  overflow: scroll;
  border-bottom: 1px solid #CCC;
  margin: 0 0 25px;
}

@media (min-width: 1400px) {
  .tour-codes {
    width: 1322px;
  }
}

.tour-codes ul {
  white-space: nowrap;
  margin: 0 0 25px;
  padding: 0;
}

.tour-codes li {
  margin: 0 3px 0 0;
  list-style: none;
  padding: 0;
  display: inline-block;
}

.tour-codes a {
  padding: 7px 15px;
  display: block;
  font-weight: 600;
  font-size: 12px;
  background: #eaeaef;
}

.tour-codes .router-link-exact-active {
  background: #cacdda;
}

.pgt-season-picker {
  width: auto;
  margin: 0;
}

.pgt thead th {
  position: sticky;
  z-index: 10;
  top: 0;
}

.pgt tbody {
  border: 1px solid #F2F2F2;
}

.pgt tbody tr th {
  border: none;
}

.markup-editor,
.currency-editor {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #CCC;
  max-width: 600px;
}

.pgt-table input,
.pgt-table select {
  margin: 0;
  font-size: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 5px;
}

.pgt-inner-table {
  display: table;
  table-layout: fixed;
  width: 250px;
}

.pgt-inner-table > * {
  display: table-row;
}

.pgt-inner-table > * > * {
  display: table-cell;
  padding: 5px;
}

.pgt-inner-table > * > *:first-child {
  width: 60%;
}

/* Tour Price */
.pgt .non-com,
.pgt .adjustment {
  width: 60px;
}

.pgt-commission {
  background-position: right 0.75rem center;
  padding-right: 26px;
  width: 115px;
}

.route-pgt .main-nav {
  display: none;
}

.route-pgt .container {
  grid-template-columns: 1fr;
}

.pgt-id {
  font-weight: 700;
  cursor: pointer;
}

</style>
