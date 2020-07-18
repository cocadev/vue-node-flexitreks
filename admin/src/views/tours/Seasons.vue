<template>
  <div v-if="tour">
    <tour-nav :tour="tour" />
    <form @submit.prevent="save" id="tour-form">
      <div v-for="(season, i) in tour.allSeasons" :key="season.id || (i * 13)" class="season">
        <f-select v-model="season.season_id" :name="`season_${season.id}_id`" label="Season">
          <option value="">Pick a season</option>
          <option v-for="b in allSeasons" :key="b.name" :value="b.id">{{ b.name }}</option>
        </f-select>
        <f-input v-model="season.deposit" :name="`season_${season.id}_deposit`" label="Deposit" />
        <f-select v-model="season.markup_model_id" :name="`season_${season.id}_markup_model_id`" label="Model">
          <option v-for="model in seasonModels[`season_${season.season_id}`]" :key="model.id" :value="model.id">{{ model.name }}</option>
        </f-select>
        <f-select v-model="season.currency_id" :name="`season_${season.id}_currency_id`" label="Currency">
          <option v-for="currency in currencies" :key="currency.id" :value="currency.id">{{ currency.name }}</option>
        </f-select>
        <label><input type="checkbox" v-model="season.live"> Live</label>
        <hr>
      </div>

      <f-button @click="addSeason" class="button--inline">Add Season</f-button>
      <input type="submit" class="button button--blue button--right" value="Save">
    </form>
  </div>
</template>

<script>
import FButton from '@/components/FButton'
import FSelect from '@/components/FSelect'
import FInput from '@/components/FInput'
import TourNav from '@/components/tours/TourNav'
import prepareTour from '@/mixins/prepareTour'
import getSeasonModels from '@/mixins/getSeasonModels'

export default {
  data () {
    return {
      tour: null,
      allSeasons: [],
      models: [],
      currencies: [],
      seasonModels: {}
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
    FSelect,
    FInput
  },

  mixins: [prepareTour, getSeasonModels],

  created () {
    const tour = this.axios.get(`tours/${this.id}`)
    const seasons = this.axios.get('seasons')
    const currencies = this.axios.get('currencies')
    const models = this.axios.get('models')

    Promise.all([tour, seasons, currencies, models])
      .then(([tour, seasons, currencies, models]) => {
        this.tour = tour.data
        this.allSeasons = seasons.data
        this.currencies = currencies.data
        this.models = models.data
        this.seasonModels = this.getSeasonModels(this.models)
      })
  },

  methods: {
    addSeason () {
      this.tour.allSeasons.push({
        id: '',
        live: false,
        season_id: ''
      })
    },

    save () {
      const data = this.prepareTour(this.tour)

      let seasons = []
      if (this.tour.allSeasons.length) {
        seasons = this.tour.allSeasons.map(season => {
          const i = {
            season_id: Number(season.season_id),
            live: Boolean(season.live),
            deposit: Number(season.deposit) || null,
            markup_model_id: Number(season.markup_model_id) || null,
            currency_id: Number(season.currency_id) || null
          }
          if (season.id) i.id = season.id
          return i
        })
      }
      data.seasons = seasons

      this.axios.put(`tours/${this.tour.id}`, data)
        .then(res => {
          this.axios.get(`tours/${this.id}`)
            .then((tour) => {
              this.$toasted.success('Saved')
              this.tour = tour.data
            })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>

<style lang="scss" scoped>
.season {
  position: relative;

  @media (min-width: 700px) {
    display: grid;
    grid-gap: 15px;
    grid-template-columns: repeat(4, 1fr) 100px;

    hr {
      grid-column: 1 / -1;
      margin: 0 0 30px;
    }

    p {
      margin: 0;
    }

    & > label {
      padding-top: 40px;
    }
  }

}
</style>
