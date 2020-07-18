<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center">
      <h4>Booking summary</h4>
      <h1>Please check your holiday details before payment</h1>
      <p>It’s essential we have all the correct details for you, please ensure the details below are correct.</p>
      <p>You are advised to wait for your booking confirmation email before making any ancillary arrangements such as flights and transfers.</p>
    </header>
    <div class="wrap pad-top pad-bottom">
      <div class="booking-review">
        <div
          v-if="booking === false"
          class="center"
        >
          <h2>There seems to be a problem loading your booking.</h2>
          <h3>Need our help?</h3>
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
        <div
          v-else-if="booking !== null"
          class="columns"
        >
          <div>

            <h4>Your personal details</h4>
            <booking-customer :booking="booking" />
            <hr>

            <h4>Tour details</h4>
            <div class="sub-columns">
              <div class="sub-columns__span">
                <strong>Tour</strong>
                <span>{{ meta.name }}</span>
              </div>

              <div>
                <strong>Arrival date</strong>
                <span>{{ arrival }}</span>
              </div>

              <div>
                <strong>Departure date</strong>
                <span>{{ departure }}</span>
              </div>
            </div>
            <hr>

            <h4>Your {{ meta.bike_and_boat ? 'cabins' : 'rooms' }}</h4>
            <booking-rooms
              :rooms="meta.rooms"
              :build="build"
              :boat="meta.bike_and_boat"
            />

          </div>

          <div>
            <h4>Your party details</h4>
            <booking-party
              :booking="booking"
              :meta="meta"
              :dob="dob"
              :ft="ft"
            />
            <hr>

            <footer class="review-right">
              <div v-if="balance === true">
                As this provisional booking commences in less than {{ meta.totals.balance_due }} days, full payment of <strong>£{{ meta.totals.total }}</strong> will be required immediately.
              </div>
              <div v-else-if="balance !== null && meta.totals.deposit">
                <div><strong class="review-deposit">Deposit payable today: <span>{{ cost(meta.totals.deposit) }}</span></strong></div>
                Remaining balance of <strong>{{ cost(meta.totals.total - meta.totals.deposit) }}</strong> is payable by <strong>{{ balance }}</strong>
              </div>

              <label>
                <input
                  v-model="termsCheck"
                  type="checkbox"
                >
                I accept the
                <a
                  href="/terms-conditions"
                  target="_blank"
                >booking conditions</a>
              </label>

              <button
                :disabled="sent || ! termsCheck"
                class="button button--grey button--wide"
                @click="book"
              >{{ sent ? 'Sending you to SagePay' : 'Pay now with SagePay' }}</button>
              <div>
                <br>Please check your booking details carefully, because you'll be unable to edit them once you're at the payment stage.
                <br>
                <br>
                Child reductions are not calculated in online quotes.
                <br>
                <a
                  href="/contact"
                  class="contact"
                  target="_blank">Contact us directly</a> if you are travelling with children.
              </div>
            </footer>

          </div>

          <nuxt-link
            :to="{
              name: 'booking',
              query: {
                tour: meta.slug,
                load: true
              }
            }"
            class="load-booking"
          >Edit booking</nuxt-link>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bookingsMixin from '@/mixins/bookings'
import BookingCustomer from '@/components/bookings/BookingCustomer'
import BookingParty from '@/components/bookings/BookingParty'
import BookingRooms from '@/components/bookings/BookingRooms'
import TelephoneContact from '@/components/global/TelephoneContact'

export default {
  components: {
    BookingCustomer,
    BookingParty,
    BookingRooms,
    TelephoneContact
  },

  mixins: [bookingsMixin],

  data () {
    return {
      sent: false,
      termsCheck: false
    }
  },

  methods: {
    async book () {
      try {
        this.sent = true;
        localStorage.setItem('saved-booking', '')
        localStorage.setItem('saved-booking-meta', '')
        const data = await this.$store.dispatch('book', this.booking)
        window.location.href = data.url;
      } catch (e) {
        this.sent = false;
        this.$router.push({ name: 'booking-failure' })
      }
    }
  },

  head () {
    const title = 'Review your booking'
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

header p:last-child {
  margin-bottom: 0;
}

@include mq(40em) {
  .layout--empty > .wrap {
    margin-top: -60px;
  }
}

.button {
  opacity: 1;

  &[disabled] {
    opacity: 0.2;
    background: $dark;
    cursor: wait;
  }
}

.columns {
  position: relative;
  padding-bottom: 40px;
}

.load-booking {
  color: $orange;
  position: absolute;
  font-size: 15px;
  bottom: 0px;
  right: 0;

  &:hover {
    text-decoration: underline;
  }

  &:before {
    content: '';
    background: transparent url('~/assets/images/orange-arrow.svg') 7px center /auto 60% no-repeat;
    position: absolute;
    transform: scaleX(-1);
    right: 100%;
    width: 25px;
    height: 100%;
    bottom: 0;
  }
}

.booking-review {
  background: $lightest;
  padding: 20px;
  max-width: 1036px;
  margin: 0 auto;

  h4 {
    margin: 0 0 25px;
  }

  label a {
    text-decoration: underline;
  }

  .sub-columns {
    font-size: 14px;

    .sub-columns__heading {
      font-size: 1.05em;
      color: $dark;
    }

    > .person {
      margin-bottom: 40px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    span,
    strong {
      display: block;
    }

    span:last-child {
      margin-bottom: 10px;
    }

    @include mq(50em) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      &__span {
        grid-column: 1 / -1;
      }

      > * {
        padding-right: 10px;
      }

      > .person {
        margin-bottom: 20px;

        &:last-child,
        &:nth-last-child(2) {
          margin-bottom: 0;
        }
      }
    }
  }

  @include mq(40em) {
    padding: 40px;

    .columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 70px;
    }

    .load-booking {
      bottom: -10px;
    }
  }
}

.review-right {
  text-align: right;
  font-size: 14px;

  div {
    margin-bottom: 20px;
  }

  .review-deposit {
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

a.contact {
  color: #F88F2B;
}
</style>
