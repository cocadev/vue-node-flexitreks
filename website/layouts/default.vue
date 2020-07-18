<template>
  <div>
    <f-header />
    <div :class="`layout--${layout}`">
      <nuxt />
    </div>
    <f-footer />
  </div>
</template>

<script>
import FHeader from '../components/global/Header';
import FFooter from '../components/global/Footer';

export default {
  components: {
    FHeader,
    FFooter
  },

  computed: {
    layout () {
      const routes = {
        'tours-slug': 'tour',
        'destinations-slug': 'blue',
        'regions-slug': 'blue',
        'shortlist': 'blue',
        'index': 'empty',
        'booking': 'empty',
        'booking-review': 'empty'
      }
      return routes[this.$route.name] || 'default'
    }
  }
}
</script>
