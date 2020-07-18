<template>
  <div class="wrap pad-top pad-bottom offers">
    <header class="center">
      <h4>{{ offer.subtitle }}</h4>
      <h1>{{ offer.title }}</h1>
      <div v-html="offer.content" />
    </header>
    <div
      :class="{
        'four-col': count >= 12,
        'three-col': count >= 9 && count < 12,
        'two-col': count < 9
      }"
    >
      <taxonomy-simple-preview
        v-for="taxonomy in offer.destinations"
        :key="taxonomy.slug"
        :taxonomy="taxonomy"
        type="destination"
        offer
      />
    </div>
  </div>
</template>

<script>
import TaxonomySimplePreview from '~/components/taxonomy/TaxonomySimplePreview'
export default {
  async asyncData ({ route, store }, callback) {
    try {
      const offer = await store.dispatch('getOffer', { slug: route.params.slug })
      if (!offer.destinations || !offer.destinations.length) throw new Error('Offer not found')
      callback(null, { offer })
    } catch(e) {
      callback({ statusCode: 404, message: 'Offer not found' })
    }
  },

  components: {
    TaxonomySimplePreview
  },

  computed: {
    count () {
      return this.offer.destinations.length || 0
    }
  },

  head () {
    const title = this.offer.title
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

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.offers header {
  margin-bottom: 65px;
}

.offers header p {
  margin-right: auto;
  margin-left: auto;
  max-width: 966px;
}

h1 {
  margin-bottom: 25px;
}

.two-col {
  max-width: 845px;
  margin-left: auto;
  margin-right: auto;
}
</style>
