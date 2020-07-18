<template>
  <div class="wrap pad-top pad-bottom">
    <h4>Regions</h4>
    <h1>Get inspired by our {{ regions.length }} regions</h1>
    <taxonomy-list
      :taxonomies="regions"
      type="region"
    />
  </div>
</template>

<script>
import TaxonomyList from '@/components/taxonomy/TaxonomyList'
export default {
  async asyncData({ store }) {
    const regions = await store.dispatch('getRegions')
    return {
      regions
    }
  },

  components: {
    TaxonomyList
  },

  head () {
    const title = 'Regions'
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
