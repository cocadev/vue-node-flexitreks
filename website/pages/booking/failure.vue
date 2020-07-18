<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center">
      <h4>Booking failed</h4>
      <h1>There seems to be an issue</h1>
      <p>Sorry, your payment failed. No charges were made, please <nuxt-link to="/contact">contact us</nuxt-link> to resolve this problem.</p>
      <p v-if="booking">Please quote reference number: <strong>{{ booking.booking_reference }}</strong></p>
    </header>
    <div class="failure wrap pad-top pad-bottom clear">
      <div>
        <h3>Need our help?</h3>
        <h4 class="failure__call">Call us now</h4><br>
        <telephone-contact
          :opening="$store.state.global.options.telephone_uk_opening"
          :clarifier="$store.state.global.options.telephone_uk_clarifier"
          :number="$store.state.global.options.telephone_uk_number"
        />
        <telephone-contact
          :opening="$store.state.global.options.telephone_us_opening"
          :clarifier="$store.state.global.options.telephone_us_clarifier"
          :number="$store.state.global.options.telephone_us_number"
        />
      </div>
      <figure>
        <animated-bike />
      </figure>
    </div>
  </div>
</template>

<script>
import TelephoneContact from '@/components/global/TelephoneContact'
import AnimatedBike from '@/components/global/AnimatedBike'
export default {
  components: {
    TelephoneContact,
    AnimatedBike
  },

  data () {
    return {
      booking: null
    }
  },

  async mounted () {
    try {
      const { data } = await this.$axios.get(`bookings/reference/${this.$route.query.booking_reference}`)
      this.booking = data
    } catch(e) {
      this.booking = false
    }
  },

  head () {
    const title = 'There was a problem'
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
.failure {
  max-width: 761px;

  &__call {
    color: inherit;
  }

  .animated-bike {
    margin: 30px 0 0;
  }

  @media (min-width: 600px) {
    display: flex;
    justify-content: flex-start;
    width: 100%;

    > :last-child {
      margin-left: auto;
    }
  }
}
</style>

