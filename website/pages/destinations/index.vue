<template>
  <div class="wrap pad-top pad-bottom">
    <h4>Destinations</h4>
    <h1>Get inspired by our {{ destinations.length }} destinations</h1>
    <taxonomy-list
      :taxonomies="destinations"
      type="destination"
    />
  </div>
</template>

<script>
import TaxonomyList from '@/components/taxonomy/TaxonomyList'
export default {
  async asyncData({ store }) {
    await store.dispatch('getDestinations')
  },

  components: {
    TaxonomyList
  },

  computed: {
    destinations () {
      return this.$store.state.destinations
    }
  },

  head () {
    const title = 'Our Destinations'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  }
}
</script>
