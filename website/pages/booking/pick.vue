<template>
  <div class="wrap pad-top pad-bottom pick-a-tour">
    <header class="center pad-bottom">
      <h4>Start the booking process</h4>
      <h1>Please choose a tour</h1>
    </header>
    <tour-picker
      v-model="tours"
      @change="change"
    />
  </div>
</template>

<script>
import TourPicker from '@/components/global/TourPicker'
export default {
  components: {
    TourPicker
  },

  data () {
    return {
      tours: [{
        destination: '',
        tour: ''
      }]
    }
  },

  methods: {
    change (tours) {
      if (tours[0] && tours[0].tour) {
        const tour = this.$store.state.tours.find(x => x.id === Number(tours[0].tour))
        if (tour) this.$router.push({ name: 'booking', query: { tour: tour.slug } })
      }
    }
  },

  head () {
    const title = 'Pick your tour'
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

<style lang="scss">
@import '@/assets/scss/global/settings.scss';

.pick-a-tour .add-tour {
  display: none;
}

.tour-picker-group {
  margin: 0 auto;
  max-width: 500px;
  background: $lightest;
  padding: 30px 20px 10px;
}
</style>
