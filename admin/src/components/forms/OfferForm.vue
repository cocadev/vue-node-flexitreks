<template>
  <form class="form form-build form-build--auto" @submit.prevent="save">
    <header class="header">
      <h1>{{ Object.keys(this.value).length ? 'Edit' : 'Create' }} Offer</h1>
    </header>
    <div>
      <f-input name="name" label="Name" v-model="value.name" required="true" />

      <f-select name="status" label="Status" v-model="value.status">
        <option value="live">Live</option>
        <option value="draft">Draft</option>
      </f-select>

      <f-input name="title" label="Title" v-model="value.title" required="true" />
      <f-input name="subtitle" label="Subtitle" v-model="value.subtitle" required="true" />
      <f-input name="slug" label="Slug" v-model="value.slug" required="true" />

      <f-select name="type" label="Type" v-model="value.type" required="true">
        <option value="tour">Tour Discount</option>
        <option value="2for1bikes">2 for 1 bikes</option>
        <option value="freebikes">Free bikes</option>
      </f-select>

      <f-input name="discount" label="Discount" type="number" v-model="value.discount" />

      <f-checkbox-list-id label="Bikes" v-model="value.bike_ids" :items="bikes" @change="value.bike_ids = $event" />

      <m-date-picker v-model="value.booking_window_start" label="Booking window start" :multi="false" />
      <m-date-picker v-model="value.booking_window_end" label="Booking window end" :multi="false" />
      <m-date-picker v-model="value.start_window_start" label="Holiday window start" :multi="false" />
      <m-date-picker v-model="value.start_window_end" label="Holiday window end" :multi="false" />

      <f-editor name="content" label="Content" v-model="value.content" />

      <f-tour-picker v-model="value.tour_ids" />

      <media-picker v-model="value.media_id" />

    </div>
    <footer>
      <input type="submit" value="Save" class="button button--blue">
    </footer>
  </form>
</template>

<script>
import FInput from '@/components/FInput'
import FEditor from '@/components/FEditor'
import FSelect from '@/components/FSelect'
import FTourPicker from '@/components/FTourPicker'
import FCheckboxListId from '@/components/FCheckboxListId'
import MediaPicker from '@/components/MediaPicker'
import mDatePicker from '@/components/MultiDatePicker'

export default {
  props: {
    value: Object
  },

  data () {
    return {
      bikes: []
    }
  },

  computed: {
    tour_ids () {
      return this.value.tour_ids || []
    }
  },

  components: {
    FInput,
    FSelect,
    FTourPicker,
    FCheckboxListId,
    mDatePicker,
    FEditor,
    MediaPicker
  },

  created () {
    Promise.all([
      this.axios.get('bikes')
    ])
      .then(res => {
        this.bikes = res[0].data
      })
  },

  methods: {
    save () {
      const isEdit = !!this.value.id
      this.axios[isEdit ? 'put' : 'post'](`offers/${isEdit ? this.value.id : ''}`, this.value)
        .then(() => {
          this.$toasted.success('Saved')
          this.$router.push({ name: 'offers' })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
