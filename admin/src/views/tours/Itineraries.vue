<template>
  <div v-if="tour">
    <tour-nav :tour="tour" />
    <form @submit.prevent="save" id="tour-form">
      <div class="itinerary-snippet-container">
        <f-editor name="itinerary_snippet" label="Itinerary Snippet" v-model="meta.itinerary_snippet" />
      </div>
      <f-itinerary v-model="itineraries" @removeItinerary="removeItinerary" />
      <f-button @click="addItinerary">Add Itinerary</f-button>
    </form>
  </div>
</template>

<script>
import FItinerary from '@/components/FItinerary'
import FEditor from '@/components/FEditor'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import prepareTour from '@/mixins/prepareTour'
const scratchDiv = document.createElement('div')
export default {
  data () {
    return {
      meta: {},
      itineraries: [],
      tour: null
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    FItinerary,
    TourNav,
    FButton,
    FEditor
  },

  mixins: [prepareTour],

  created () {
    const itinerariesPromise = this.axios.get(`tours/${this.id}/itineraries`)
    const tourPromise = this.axios.get(`tours/${this.id}`)
    const metaPromise = this.axios.get(`tours/${this.id}/meta`)

    Promise.all([itinerariesPromise, tourPromise, metaPromise])
      .then(([ itineraries, tour, meta ]) => {
        this.itineraries = this.sanitize(itineraries.data)
        this.tour = tour.data

        this.itineraries.filter(i => i.media).forEach(itinerary => {
          this.$store.commit('addImages', [itinerary.media])
        })

        this.meta = meta.data
      })
  },

  methods: {
    save () {
      let data = []
      if (this.itineraries.length) {
        data = this.itineraries.map(itinerary => {
          const i = {
            title: itinerary.title,
            content: itinerary.content,
            day: itinerary.day,
            type: itinerary.type,
            media_id: itinerary.media_id || null
          }
          if (itinerary.id) i.id = itinerary.id
          return i
        })
      }

      this.axios.put(`tours/${this.id}/itineraries`, data)
        .then(({ data }) => {
          this.$toasted.success('Saved Itineraries')
          this.itineraries = this.sanitize(data)
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))

      this.saveMeta()
    },

    saveMeta () {
      const data = this.prepareTour(this.tour)

      data.meta = Object.keys(this.meta).map(key => {
        return {
          key,
          value: this.meta[key]
        }
      })

      this.axios.put(`tours/${this.tour.id}`, data)
        .then(() => this.$toasted.success('Saved Snippet'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    addItinerary () {
      this.itineraries.push({
        title: '',
        content: '',
        day: null,
        type: 'public',
        media_id: null
      })
    },

    removeItinerary (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            this.itineraries.splice(index, 1)
          }
        })
    },

    sanitize (arr, key = 'title') {
      return arr.map(i => {
        i[key] = this.toPlainText(i[key])
        return i
      })
    },

    toPlainText (text) {
      scratchDiv.innerHTML = text
      return scratchDiv.textContent
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.itinerary-snippet-container {
  position: relative;

  @media (min-width: 40em) {
    padding-bottom: 25px;
    margin-bottom: 45px;
    border-bottom: 1px solid $line;
  }
}
</style>
