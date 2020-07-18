<template>
  <div class="wrap pad-top pad-bottom">
    <h4>Categories</h4>
    <h1>Get inspired by our {{ categories.length }} categories</h1>
    <taxonomy-list
      :taxonomies="categories"
      type="category"
    />
  </div>
</template>

<script>
import TaxonomyList from '@/components/taxonomy/TaxonomyList'
export default {
  async asyncData({ store }) {
    await store.dispatch('getCategories')
  },

  components: {
    TaxonomyList
  },

  computed: {
    categories () {
      return this.$store.state.categories
    }
  },

  head () {
    const title = 'Our Categories'
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
