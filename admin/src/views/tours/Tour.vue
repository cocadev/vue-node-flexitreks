<template>
  <div v-if="tour">
    <tour-nav :tour="tour" />

    <form @submit.prevent="save" id="tour-form" class="tour-form">

      <div>
        <f-input name="name" label="Name" v-model="tour.name" />
        <f-input name="slug" label="Slug" v-model="tour.slug" />
        <f-input name="tour_code" label="Tour code" v-model="tour.tour_code" />
        <f-input name="name_short" label="Short name" v-model="tour.name_short" />
        <f-input name="start_point" label="Start point" v-model="tour.start_point" />
        <f-input name="finish_point" label="Finish point" v-model="tour.finish_point" />
        <f-input name="arrival_days" label="Arrival days" v-model="tour.arrival_days" />
        <f-editor name="content" label="Content" v-model="tour.content" />

        <hr>
        <h2>Operator details</h2>
        <f-select name="operator" label="Operator" v-model="tour.operator_id">
          <option value="">Select an operator</option>
          <option v-for="operator in operators" :key="operator.id" :value="operator.id">{{ operator.name }}</option>
        </f-select>
        <f-input name="name_operator" label="Tour name for operator" v-model="tour.name_operator" />

        <hr>
        <h2>Preview details</h2>
        <f-editor name="excerpt" label="Excerpt" v-model="tour.excerpt" />
        <f-editor name="highlights" label="Highlights" v-model="tour.highlights" />

        <hr>
        <h2>Categorisation</h2>
        <f-checkbox-list label="Destinations" v-model="tour.destinations" :items="destinations" @change="checkboxChange('destinations', $event)" />
        <f-checkbox-list label="Regions" v-model="tour.regions" :items="regions" @change="checkboxChange('regions', $event)" />
        <f-checkbox-list label="Related Tours" v-model="tour.related" :items="tours" @change="checkboxChange('related_tours', $event)" />
      </div>

      <aside>
        <div class="tour-form__secondary">
          <f-select name="status" label="Status" v-model="tour.status">
            <option v-for="option in status" :key="option.id" :value="option.id">{{ option.name }}</option>
          </f-select>

          <label>Overview Image</label>
          <media-picker v-model="tour.media_id" />

          <label>Hero Image</label>
          <media-picker v-model="tour.hero_id" />

          <label>Gallery Images</label>
          <gallery-picker
            :value="tour.gallery_id"
            :gallery="tour.gallery"
            @change="tour.gallery_id = $event"
            @changeGallery="tour.gallery = $event"
          />

          <f-checkbox-list-array label="Difficulty" v-model="tour.difficulty" :items="difficulties" @change="checkboxChange('difficulty', $event)" />

          <f-checkbox-list-array label="Nights" v-model="tour.nights" :items="nights" @change="checkboxChange('nights', $event)" />

          <f-select name="guidance" label="Guidance" v-model="tour.guidance">
            <option v-for="option in guidance" :key="option.id" :value="option.id">{{ option.name }}</option>
          </f-select>

          <f-select name="bike_and_boat" label="Bike and Boat" v-model="tour.bike_and_boat">
            <option :value="false">No</option>
            <option :value="true">Yes</option>
          </f-select>

          <f-select name="solo_cyclists_allowed" label="Solo Cyclists Allowed?" v-model="tour.solo_cyclists_allowed">
            <option :value="true">Yes</option>
            <option :value="false">No</option>
          </f-select>

          <f-input name="length" label="Tour length" v-model="tour.length" />
          <f-input name="balance_due" label="Balance Due (number of days)" v-model="tour.balance_due" />
          <f-input name="months" label="Months" v-model="tour.months" />

        </div>
      </aside>

    </form>
  </div>
</template>

<script>
import TourNav from '@/components/tours/TourNav'
import MetaBox from '@/components/MetaBox'
import FInput from '@/components/FInput'
import FSelect from '@/components/FSelect'
import FTextarea from '@/components/FTextarea'
import FEditor from '@/components/FEditor'
import FCheckboxList from '@/components/FCheckboxList'
import FCheckboxListArray from '@/components/FCheckboxListArray'
import MediaPicker from '@/components/MediaPicker'
import GalleryPicker from '@/components/GalleryPicker'
import prepareTour from '@/mixins/prepareTour'

import { mapState } from 'vuex'
export default {
  data () {
    return {
      tour: null,
      changeFlags: {
        destinations: {
          status: false,
          key: 'destination_id'
        },
        regions: {
          status: false,
          key: 'region_id'
        },
        hotels: {
          status: false,
          key: 'hotel_id'
        },
        restaurants: {
          status: false,
          key: 'restaurant_id'
        },
        related_tours: {
          status: true,
          key: 'id'
        }
      },
      difficulties: ['Easy', 'Leisurely', 'Moderate', 'Challenging'],
      nights: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      guidance: [
        {
          id: 0,
          name: 'Self Guided'
        },
        {
          id: 1,
          name: 'Guided'
        },
        {
          id: 2,
          name: 'Self Guided/Guided'
        }
      ],
      status: [
        {
          id: 'draft',
          name: 'Draft'
        },
        {
          id: 'live',
          name: 'Live'
        }
      ],
      solo_cyclists_allowed: [
        {
          id: 0,
          name: 'Yes'
        },
        {
          id: 1,
          name: 'No'
        }
      ]
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    TourNav,
    MetaBox,
    FInput,
    FSelect,
    FEditor,
    FTextarea,
    FCheckboxList,
    FCheckboxListArray,
    MediaPicker,
    GalleryPicker
  },

  mixins: [prepareTour],

  created () {
    this.fetchData()
  },

  computed: mapState({
    operators: 'operators',
    destinations: 'destinations',
    regions: 'regions',
    hotels: 'hotels',
    restaurants: 'restaurants',
    tours: 'tours'
  }),

  methods: {
    async fetchData () {
      const tour = await this.axios.get(`tours/${this.id}`)
      const hotels = this.axios.get(`tours/${tour.data.id}/hotels`)
      const restaurants = this.axios.get(`tours/${tour.data.id}/restaurants`)

      Promise.all([hotels, restaurants])
        .then(([tourHotels, tourRestaurants]) => {
          const gallery = tour.data.gallery || []

          this.tour = tour.data
          this.tour.gallery = gallery.map(x => x.id)
          this.tour.hotels = tourHotels.data
          this.tour.restaurants = tourRestaurants.data

          if (this.tour.image) this.$store.commit('addImages', [ this.tour.image ])
          if (this.tour.hero) this.$store.commit('addImages', [ this.tour.hero ])
          if (this.tour.gallery && this.tour.gallery.length) this.$store.commit('addImages', gallery)

          // Fix slash encoding issue - might need to look into something global when saving, but could break a lot of things :)
          if (this.tour.start_point) this.tour.start_point = this.fixSlashes(this.tour.start_point)
          if (this.tour.finish_point) this.tour.finish_point = this.fixSlashes(this.tour.finish_point)
        })
    },

    async save () {
      const data = this.prepareTour(this.tour)
      const changes = Object.keys(this.changeFlags).filter(key => !!this.changeFlags[key].status)
      if (changes.length) {
        changes.forEach(key => {
          if (this.tour[key]) {
            data[key] = this.tour[key].map(item => {
              const response = {}
              if (item) {
                response[this.changeFlags[key].key] = item.id
                return response
              }
            })
          }
        })
      }
      if (data.related_tours) {
        data.related_tours = data.related_tours.map(function (item) {
          if (item && item.id) {
            return item.id
          }
        })
      }

      if (this.tour.gallery_id) {
        try {
          await this.axios.put(`galleries/${this.tour.gallery_id}`, {
            media: this.tour.gallery
          })
        } catch (e) {}
      }

      this.axios.put(`tours/${this.tour.id}`, data)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    checkboxChange (key, value) {
      if (this.changeFlags[key]) this.changeFlags[key].status = true
      this.tour[key] = value
    },

    fixSlashes (val) {
      return val.replace(/&#x2F;/g, '/')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/scss/settings.scss';

.tour-form {
  display: grid;

  @media (min-width: 900px) {
    grid-template-columns: 2fr 1fr;
    grid-gap: 40px;
  }
}

.tour-form__secondary {
  border: 1px solid $line;
  padding: 20px;
  margin-top: 29px;
}

hr {
  margin: 60px 0;
}
</style>
