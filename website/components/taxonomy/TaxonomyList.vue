<template>
  <section class="three-col eq-col">
    <taxonomy-preview
      v-for="taxonomy in taxonomies"
      :key="taxonomy.id"
      :taxonomy="taxonomy"
      :type="type"
    />
  </section>
</template>

<script>
import TaxonomyPreview from './TaxonomyPreview';
export default {
  name: 'TaxonomyList',

  components: {
    TaxonomyPreview
  },

  props: {
    taxonomies: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      default () {
        return 'destination'
      }
    }
  }
}
</script>
