<template>
  <div v-if="tour">
    <tour-nav :tour="tour" />
    <form @submit.prevent="save" id="tour-form">
      <div>
        <f-editor name="weather" label="Weather" v-model="meta.weather" />

        <div class="accommodation-container">
          <div class="accommodation-info">
            <f-editor name="accommodation" label="Accommodation" v-model="meta.accommodation" />
          </div>
          <aside>
            <div class="accommodation-gallery">
              <div>
                <label>Accommodation gallery</label>
                <gallery-picker
                  :value="tour.accommodation_gallery_id"
                  :gallery="tour.accommodation_gallery"
                  @change="tour.accommodation_gallery_id = $event"
                  @changeGallery="tour.accommodation_gallery = $event"
                />
              </div>
            </div>
          </aside>
        </div>

        <f-editor name="bikes" label="Bikes" v-model="meta.bikes_snippet" />
        <f-editor name="getting_there" label="Getting there" v-model="meta.getting_there" />
        <f-input name="live_map" label="Google Map" v-model="meta.live_map" />
      </div>
    </form>
  </div>
</template>

<script>
import FInput from '@/components/FInput'
import FEditor from '@/components/FEditor'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'
import prepareTour from '@/mixins/prepareTour'
import GalleryPicker from '@/components/GalleryPicker'

export default {
  data () {
    return {
      meta: {},
      tour: null
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
    FInput,
    FEditor,
    GalleryPicker
  },

  mixins: [prepareTour],

  created () {
    const meta = this.axios.get(`tours/${this.id}/meta`)
    const tour = this.axios.get(`tours/${this.id}`)

    Promise.all([meta, tour])
      .then(([ meta, tour ]) => {
        const bikesGallery = tour.data.accommodation_gallery || []

        this.meta = meta.data
        this.tour = tour.data
        console.log(this.tour)

        this.tour.accommodation_gallery = bikesGallery.map(x => x.id)
        if (this.tour.accommodation_gallery && this.tour.accommodation_gallery.length) this.$store.commit('addImages', bikesGallery)
      })
  },

  methods: {
    async save () {
      const data = this.prepareTour(this.tour)

      data.meta = Object.keys(this.meta).map(key => {
        return {
          key,
          value: this.meta[key]
        }
      })

      if (this.tour.accommodation_gallery_id) {
        try {
          await this.axios.put(`galleries/${this.tour.accommodation_gallery_id}`, {
            media: this.tour.accommodation_gallery
          })
        } catch (e) {}
      }

      this.axios.put(`tours/${this.tour.id}`, data)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/settings.scss';

.accommodation-container {
  display: grid;

  @media (min-width: 900px) {
    grid-template-columns: 2fr 1fr;
    grid-gap: 40px;
  }

  .accommodation-gallery {
    border: 1px solid $line;
    padding: 20px;
    margin-top: 29px;
  }
}

hr {
  margin: 60px 0;
}
</style>
