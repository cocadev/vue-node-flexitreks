<template>
  <article>
    <nuxt-link :to="url">
      <img
        :src="taxonomy.image ? `${taxonomy.image.url}${$store.state.sizes.taxonomy}` : ''"
        :alt="taxonomy.image ? taxonomy.image.alt : ''"
      >
    </nuxt-link>
    <h3>
      <nuxt-link :to="url">{{ taxonomy.name }}</nuxt-link>
      <small v-if="taxonomy.tour_count"> ({{ taxonomy.tour_count }} tour{{ taxonomy.tour_count === 1 ? '' : 's' }})</small>
    </h3>
    <div
      class="small-content"
      v-html="taxonomy.description"
    />
    <footer>
      <f-button-link :to="url">View tours in {{ taxonomy.name }}</f-button-link>
      <nuxt-link
        v-if="taxonomy.explore"
        :to="{ name: 'explore-slug', params: { slug: taxonomy.explore.slug } }"
        class="orange-link"
      >Explore {{ taxonomy.name }}</nuxt-link>
    </footer>
  </article>
</template>

<script>
import FButtonLink from '../global/button-link';
export default {
  name: 'TaxonomyPreview',

  components: {
    FButtonLink
  },

  props: {
    taxonomy: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      // url: { name: `/categories/${this.taxonomy.slug}`, params: { slug: this.taxonomy.slug } }
      url: { 
        name: this.type == 'destination' ? `${this.type}s-slug` : `categories-slug`, 
        params: {
          slug: this.taxonomy.slug
        } 
      }
    }
  }
}
</script>

<style lang="scss" scoped>
article {
  display: flex;
  flex-direction: column;
}

img {
  margin: 0 0 23px;
}

footer {
  margin-top: auto;

  .button {
    margin: 15px 20px 30px 0;
  }
}
</style>
