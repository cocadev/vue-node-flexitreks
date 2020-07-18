<template>
  <div v-if="tour">
    <tour-nav :tour="tour" :save="false" />
    <div v-if="season">
      <div class="clear">
        <form @submit.prevent="save" id="tour-form">
          <input type="submit" class="button button--blue button--right" value="Save">
          <div class="spacer"></div>
          <tour-reductions
            :value="reductions"
            :rooms="rooms"
            :decks="decks"
            :ac="ac"
            @addReduction="addReduction"
            @removeReduction="removeReduction"
          />
          <input type="submit" class="button button--blue button--right" value="Save">
        </form>
      </div>
      <copy-from @change="copyFromSeason" pageType="reductions" />
    </div>
  </div>
</template>

<script>
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import TourReductions from '@/components/tours/TourReductions'
import CopyFrom from '@/components/tours/CopyFrom'

export default {
  data () {
    return {
      tour: null,
      reductions: [],
      removedReductions: [],
      rooms: [],
      decks: [],
      ac: []
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    TourNav,
    TourReductions,
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
    const rooms = this.axios.get('room-types')
    const decks = this.axios.get('decks')
    const ac = this.axios.get('accommodation-categories')

    Promise.all([tour, rooms, decks, ac])
      .then(([tour, rooms, decks, ac]) => {
        this.tour = tour.data
        this.decks = decks.data
        this.ac = ac.data
        let roomsIds = [...new Set(this.tour.prices.map(item => {
          if (item.room_type_id) return item.room_type_id
        }))]
        this.rooms = rooms.data.filter(item => {
          return roomsIds.indexOf(item.id) > -1
        })
      })
  },

  methods: {
    fetchSeason () {
      if (this.season) {
        this.axios.get(`tour-reductions/${this.id}/${this.season}`)
          .then((res) => {
            this.reductions = res.data
          })
      }
    },

    addReduction (reduction = '') {
      if (reduction) {
        reduction.tour_season_id = this.season
        this.reductions.push(reduction)
      } else {
        if (this.reductions.length - 1 >= 0) {
          const last_idx = this.reductions.length - 1
          const new_item = JSON.parse(JSON.stringify(this.reductions[last_idx]))
          new_item.id = ''
          this.reductions.push(new_item)
        } else {
          this.reductions.push({
            id: '',
            percent: null,
            cost: null,
            input_min: null,
            input_max: null,
            input_quantity: null,
            output_min: null,
            output_max: null,
            output_quantity: null,
            room_type_id: null,
            deck_id: null,
            child_calc_room: null,
            child_calc_accommodation: null,
            tour_season_id: this.season
          })
        }
      }
    },

    removeReduction (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.reductions[index]) return
            if (this.reductions[index].id) this.removedReductions.push(this.reductions[index].id)
            this.reductions.splice(index, 1)
          }
        })
    },

    copyFromSeason ({ season_id, tour_id }) {
      this.axios.get(`tour-reductions/${tour_id}/${season_id}`)
        .then((res) => {
          res.data
            .forEach(reduction => {
              reduction.id = ''
              delete reduction.createdAt
              this.reductions.push(reduction)
            })
        })
    },

    save () {
      this.removedReductions.forEach(id => {
        this.axios.delete(`tour-reductions/${this.tour.id}/${this.season}/${id}`)
          .then(() => {
            this.$toasted.success(`Deleted reduction ${id}`)
            this.removedReductions.splice(this.removedReductions.indexOf(id), 1)
          })
          .catch(e => this.$store.dispatch('error', e.response.data.error))
      })

      this.reductions.forEach(reduction => {
        ['percent', 'cost', 'input_min', 'input_max', 'input_quantity', 'output_min', 'output_max', 'output_quantity']
          .forEach(key => {
            if (reduction[key] === '' || isNaN(reduction[key])) reduction[key] = null
          })

        if (!reduction.id) {
          this.axios.post(`tour-reductions/${this.tour.id}/${this.season}`, reduction)
            .then(res => {
              reduction.id = res.data.id
              this.$toasted.success(`Created reduction ${res.data.id}`)
            })
            .catch(e => this.$store.dispatch('error', e.response.data.error))
        } else {
          this.axios.put(`tour-reductions/${this.tour.id}/${this.season}/${reduction.id}`, reduction)
            .then(res => {
              this.$toasted.success(`Updated reduction ${res.data.id}`)
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
  height: 20px;
}
</style>
