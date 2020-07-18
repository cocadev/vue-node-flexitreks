<template>
  <div>
    <f-filters />
    <div class="wrap">
      <TourList :tours="tours" />
    </div>
  </div>
</template>

<script>
import TourList from '@/components/tours/TourList.vue';
import FFilters from '@/components/global/Filters';

export default {
  async asyncData({ params, store }) {
    await store.dispatch('getToursForDestination', { slug: params.slug, route: 'regions' })
  },

  components: {
    TourList,
    FFilters
  },

  computed: {
    tours () {
      return this.$store.getters.currentTours
    }
  },

  beforeRouteUpdate (to, from, next) {
    this.$store.commit('resetFilters')
    next()
  },

  mounted () {
    this.$store.commit('resetFilters')
  },

  head () {
    const title = this.$store.state.taxonomy_titles[this.$route.params.slug] || 'Region'
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
