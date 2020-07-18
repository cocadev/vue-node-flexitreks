<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center">
      <h4>Booking confirmation</h4>
      <h1>Thank you, your booking is confirmed</h1>
      <p>A confirmation email with your booking details and tour information is on it’s way to you!</p>
    </header>
    <div class="wrap wrap--medium pad-top pad-bottom">
      <div
        v-if="booking === false"
        class="center"
      >
        <h2>There seems to be a problem loading your booking.</h2>
        <h3 v-if="$route.query.booking_reference">This page is only visible for two hours after the booking has been made.<br>If this message appears within that timeframe, please <nuxt-link to="/contact"><u>get in touch</u></nuxt-link>.</h3>
      </div>
      <div
        v-else-if="booking !== null"
        class="booking-success"
      >
        <div>
          <div class="success-image">
            <div>
              <h4 class="inherit">Thanks for choosing Flexitreks</h4>
              <h3 class="inherit">Get in gear for your tour</h3>
            </div>
            <figure :style="`background-image: url(${booking.tour.image.url})`" />
          </div>

          <div class="content content--orange">
            <h3>Some useful links</h3>
            <nuxt-link to="/">Foreign Travel Advice</nuxt-link>
            <nuxt-link to="/">Financial Protection</nuxt-link>
            <nuxt-link to="/">Booking Conditions</nuxt-link>
          </div>
          <br><br>
          <h3>Need our help?</h3>
          <h4 class="inherit">Contact us if you have an issue with our service</h4><br>
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

        <div class="booking-summary">
          <h4>Your booking reference - {{ booking.booking_reference }}</h4>
          <hr>
          <h3>{{ booking.tour.name }}</h3>
          <div class="sub-columns">
            <div><span>Arrive {{ booking.arrival_label }}</span></div>
            <div><span>Depart {{ booking.departure_label }}</span></div>
          </div>
          <hr>
          <booking-customer :booking="booking" />
          <hr>
          <booking-party
            :booking="booking"
            :dob="dob"
            :ft="ft"
          />
          <hr>
          <booking-rooms
            :rooms="booking.rooms"
            :build="build"
            :boat="booking.tour.bike_and_boat"
          />
          <hr>
          <footer class="summary-right">
            <div v-if="!booking.total_deposit">
              <div><strong class="summary-deposit">Total paid <span>{{ cost(booking.total_cost) }}</span></strong></div>
            </div>
            <div v-else>
              <div><strong class="summary-deposit">Total paid <span>{{ cost(booking.total_deposit) }}</span></strong></div>
              Remaining balance of <strong>{{ cost(booking.total_cost - booking.total_deposit) }}</strong> is payable by <strong>{{ balance }}</strong>
            </div>
          </footer>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import BookingCustomer from '@/components/bookings/BookingCustomer'
import BookingParty from '@/components/bookings/BookingParty'
import BookingRooms from '@/components/bookings/BookingRooms'
import TelephoneContact from '@/components/global/TelephoneContact'
import Thyme from '@trys/thyme'
import currency from '@/mixins/currency'

export default {
  components: {
    BookingCustomer,
    BookingParty,
    BookingRooms,
    TelephoneContact
  },

  mixins: [currency],
  
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getBuild')
    ])
  },

  data () {
    return {
      booking: null
    }
  },

  computed: {
    build () {
      return this.$store.state.build
    },

    booking_reference () {
      return this.$route.query.booking_reference || ''
    },

    balance () {
      if (!this.booking) return ''
      let start = new Thyme(this.booking.holiday_start_date)
      start.remove(this.booking.tour.balance_due)
      return start.format()
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

  methods: {
    format (d) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    },

    dob (date) {
      return new Thyme(date).format()
    },

    ft (n) {
      n = Number(n)
      var realFeet = ((n * 0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      return `${feet}ft ${inches}in`;
    }
  },

  head () {
    const title = 'Booking Success!'
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

.success-image {
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  margin: 0 0 50px;
  color: #FFF;
  text-align: center;
  position: relative;
  max-width: 450px;
  
  div {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: linear-gradient(rgba(0, 0, 16, 0.2), rgba(0, 0, 0, 0.6));
  }

  figure {
    height: 0;
    padding-bottom: 66.67%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    background-image: url('https://flexitreks.imgix.net/images/2018/6/13/success-image.jpg?w=900&h=600');
  }
}

.booking-success {
  display: grid;
  grid-gap: 30px;

  @include mq(60em) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 80px;
  }
}

.booking-summary {
  background: $lightest;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  font-size: 14px;

  h3 {
    font-size: 16px;
  }

  @include mq(40em) {
    padding: 40px;
  }
}

.sub-columns {
  span,
  strong {
    display: block;
  }

  span:last-child {
    margin-bottom: 10px;
  }

  @include mq(40em) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    
    &__span {
      grid-column: 1 / -1;
    }
  }
}

.summary-right {
  text-align: right;
  font-size: 14px;

  div {
    margin-bottom: 20px;
  }

  .summary-deposit {
    color: $dark;

    span {
      margin-left: 50px;
    }
  }

  .button {
    max-width: 330px;
    margin-top: 10px;
  }
}

.content {
  line-height: 1.8;

  & > a {
    display: block;
  }
}

@media print {
  font-size: 12pt;

  .booking-summary {
    font-size: inherit;
  }

  hr {
    margin: 10px 0;
  }

  .booking-success > :first-child {
    display: none;
  }

  .sub-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    
    &__span {
      grid-column: 1 / -1;
    }
  }
}
</style>
