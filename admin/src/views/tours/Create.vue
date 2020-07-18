<template>
  <div v-if="tour">
    <header class="header">
      <h1>Create a tour</h1>
      <button type="submit" class="button" form="tour-form">Create</button>
    </header>

    <form @submit.prevent="save" id="tour-form" class="tour-form">

      <div>
        <f-input name="name" label="Name" v-model="tour.name" />
        <f-input name="slug" label="Slug" v-model="tour.slug" />
        <f-input name="tour_code" label="Tour code" v-model="tour.tour_code" />
        <f-input name="name_short" label="Short name" v-model="tour.name_short" />
        <f-editor name="content" label="Content" v-model="tour.content" />

        <hr>
        <h2>Operator details</h2>
        <f-select name="operator" label="Operator" v-model="tour.operator_id">
          <option value="">Select an operator</option>
          <option v-for="operator in operators" :key="operator.id" :value="operator.id">{{ operator.name }}</option>
        </f-select>
        <f-input name="name_operator" label="Name for operator" v-model="tour.name_operator" />

        <hr>
        <h2>Preview details</h2>
        <f-editor name="excerpt" label="Excerpt" v-model="tour.excerpt" />
        <f-editor name="highlights" label="Highlights" v-model="tour.highlights" />

      </div>

      <aside>
        <div class="tour-form__secondary">
          <f-select name="status" label="Status" v-model="tour.status">
            <option v-for="option in status" :key="option.id" :value="option.id">{{ option.name }}</option>
          </f-select>

          <media-picker v-model="tour.media_id" />

          <f-checkbox-list-array label="Difficulty" v-model="tour.difficulty" :items="difficulties" @change="checkboxChange('difficulty', $event)" />

          <f-checkbox-list-array label="Nights" v-model="tour.nights" :items="nights" @change="checkboxChange('nights', $event)" />

          <f-select name="guidance" label="Guidance" v-model="tour.guidance">
            <option v-for="option in guidance" :key="option.id" :value="option.id">{{ option.name }}</option>
          </f-select>

          <f-select name="bike_and_boat" label="Bike and Boat" v-model="tour.bike_and_boat">
            <option :value="false">No</option>
            <option :value="true">Yes</option>
          </f-select>

          <f-input name="length" label="Tour length" v-model="tour.length" />
          <f-input name="months" label="Months" v-model="tour.months" />

          <gallery-picker
            :value="tour.gallery_id"
            :gallery="tour.gallery"
            @change="tour.gallery_id = $event"
            @changeGallery="tour.gallery = $event"
          />

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
      tour: {
        name: '',
        slug: '',
        tour_code: '',
        name_short: '',
        excerpt: '',
        operator_id: null,
        media_id: null,
        gallery_id: null,
        content: '',
        highlights: '',
        name_operator: '',
        status: 'draft',
        length: '',
        months: '',
        difficulty: null,
        guidance: null,
        bike_and_boat: null,
        nights: null
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

  computed: mapState({
    operators: 'operators',
    destinations: 'destinations',
    regions: 'regions'
  }),

  methods: {
    async save () {
      const data = this.prepareTour(this.tour)

      if (this.tour.gallery_id) {
        try {
          await this.axios.put(`galleries/${this.tour.gallery_id}`, {
            media: this.tour.gallery
          })
        } catch (e) {}
      }

      this.axios.post('tours', data)
        .then((res) => {
          this.$toasted.success('Created')
          this.$router.push({ name: 'tour', params: { id: res.data.id } })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    checkboxChange (key, value) {
      this.tour[key] = value
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
