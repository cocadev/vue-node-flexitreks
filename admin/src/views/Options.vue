<template>
  <div>
    <header class="header">
      <h1>Site options</h1>
    </header>
    <form
      v-if="options"
      @submit.prevent="submit"
    >
      <f-editor label="Why Flexitreks" v-model="options.why_flexitreks_content" />
      <f-editor label="Our Service" v-model="options.our_service_content" />
      <f-editor label="Contact" v-model="options.contact_content" />
      <f-review-picker v-model="options.featured_reviews" />
      <div class="tel">
        <f-input label="UK Opening" v-model="options.telephone_uk_opening" />
        <f-input label="UK Clarifier" v-model="options.telephone_uk_clarifier" />
        <f-input label="UK Number" v-model="options.telephone_uk_number" />
      </div>
      <div class="tel">
        <f-input label="US Opening" v-model="options.telephone_us_opening" />
        <f-input label="US Clarifier" v-model="options.telephone_us_clarifier" />
        <f-input label="US Number" v-model="options.telephone_us_number" />
      </div>

      <f-mix-picker
        v-model="options.popular_searches"
        label="Popular Searches"
        @add="options.popular_searches.push($event)"
        @remove="options.popular_searches.splice($event, 1)"
      />

      <input type="submit" class="button button--blue" value="Save">
    </form>
  </div>
</template>

<script>
import FInput from '@/components/FInput'
import FEditor from '@/components/FEditor'
import FReviewPicker from '@/components/FReviewPicker'
import FMixPicker from '@/components/FMixPicker'

export default {
  components: {
    FInput,
    FEditor,
    FReviewPicker,
    FMixPicker
  },

  data () {
    return {
      options: null
    }
  },

  created () {
    this.axios.get('global')
      .then(global => {
        if (!global.data.options.featured_reviews) global.data.options.featured_reviews = []
        else global.data.options.featured_reviews = JSON.parse('[' + global.data.options.featured_reviews + ']')

        if (!global.data.options.popular_searches) global.data.options.popular_searches = []
        this.options = global.data.options
      })
  },

  methods: {
    submit () {
      const options = JSON.parse(JSON.stringify(this.options))
      options.popular_searches = JSON.stringify(options.popular_searches)
      this.axios.post('global', options)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>

<style scoped>
@media (min-width: 40em) {
  .tel {
    display: grid;
    grid-template-columns: 2fr 2fr 3fr;
    grid-gap: 30px;
  }
}
</style>
