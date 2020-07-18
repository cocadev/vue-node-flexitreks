<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season">
      <div class="clear">
        <form @submit.prevent="save" id="tour-form">
          <input type="submit" class="button button--blue button--right" value="Save">
          <div class="spacer"></div>
          <tour-specifications
            :value="specifications"
            @addSpecification="addSpecification"
            @removeSpecification="removeSpecification"
          />
          <input type="submit" class="button button--blue button--right" value="Save">
        </form>
      </div>
      <copy-from @change="copyFromSeason" pageType="specifications" />
    </div>
  </div>
</template>

<script>
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import TourSpecifications from '@/components/tours/TourSpecifications'
import CopyFrom from '@/components/tours/CopyFrom'

export default {
  data () {
    return {
      tour: null,
      specifications: [],
      removedSpecifications: [],
      rooms: [],
      decks: []
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    TourNav,
    TourSpecifications,
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
    }
  },

  created () {
    this.fetchSeason()

    const tour = this.axios.get(`tours/${this.id}`)

    Promise.all([tour])
      .then(([tour]) => {
        this.tour = tour.data
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-specifications/${this.id}/${this.season}`)
          .then((res) => {
            this.specifications = res.data
          })
      }
    },

    addSpecification (specification = '') {
      this.specifications.push({
        id: '',
        tour_season_id: this.season,
        price_includes: '',
        price_excludes: ''
      })
    },

    removeSpecification (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.specifications[index]) return
            if (this.specifications[index].id) this.removedSpecifications.push(this.specifications[index].id)
            this.specifications.splice(index, 1)
          }
        })
    },

    copyFromSeason ({ season_id, tour_id }) {
      this.axios.get(`tour-specifications/${tour_id}/${season_id}`)
        .then((res) => {
          res.data
            .forEach(specification => {
              specification.id = ''
              delete specification.createdAt
              this.specifications.push(specification)
            })
        })
    },

    save () {
      this.removedSpecifications.forEach(id => {
        this.axios.delete(`tour-specifications/${this.tour.id}/${this.season}/${id}`)
          .then(() => {
            this.$toasted.success(`Deleted specification ${id}`)
            this.removedSpecifications.splice(this.removedSpecifications.indexOf(id), 1)
          })
          .catch(e => this.$store.dispatch('error', e.response.data.error))
      })

      this.specifications.forEach(specification => {
        if (!specification.id) {
          this.axios.post(`tour-specifications/${this.tour.id}/${this.season}`, specification)
            .then(res => {
              specification.id = res.data.id
              this.$toasted.success(`Created specification ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        } else {
          this.axios.put(`tour-specifications/${this.tour.id}/${this.season}/${specification.id}`, specification)
            .then(res => {
              this.$toasted.success(`Updated specification ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        }
      })
    }
  }
}
</script>

<style>
.spacer {
  clear: both;
}
</style>
