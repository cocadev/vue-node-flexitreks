<template>
  <div
    v-if="!tour.nights || !tour.prices || !tour.categories"
    class="not-bookable"
  >
    <nuxt-link
      :to="{ name: 'destinations' }"
      class="orange-link"
    >Explore our destinations</nuxt-link>
  </div>
  <div
    v-else
    class="wrap booking-page"
  >
    <div class="primary">
      <header class="booking-header">
        <h4>Book your Cycling Holiday</h4>
        <h1>Before you start</h1>
        <p>We’re going to need to know some information about your party, make sure you have the following details to hand:</p>
        <ul>
          <li>Height <small>(we need this to get the right bike)</small></li>
          <li>Date of Birth</li>
          <li>Dietary requirements</li>
        </ul>
      </header>

      <aside
        v-if="tour && date && total && nights"
        class="tertiary"
      >
        <h3>{{ tour.name }}</h3>
        <div>{{ format( date.date ) }} for {{ nights }} nights <strong>Total: {{ cost(total) }}</strong></div>
      </aside>

      <main>
        <form
          id="booking"
          class="booking form-style"
          method="POST"
          novalidate
          @submit.prevent="validateAndBook"
        >
          <div v-show="errors.length">
            <header class="booking-header errors">
              <h3 class="errors">There are some errors highlighted below.</h3>
              <ul>
                <li
                  v-for="error in errors"
                  :key="error"
                >{{ error | formatErrorMsg }} is invalid</li>
              </ul>
            </header>
          </div>

          <fieldset>
            <legend>Your details</legend>
            <booking-select
              id="details_title"
              v-model="booking.customer.title"
              label="Title"
              required="true"
              @change="bookerTitleChanged"
            >
              <option value="" />
              <option
                v-for="t in ['Mrs', 'Mr', 'Miss', 'Ms', 'Dr', 'Prof.', 'Rev.']"
                :key="t"
                :value="t"
              >{{ t }}</option>
            </booking-select>
            <booking-input
              id="details_first_name"
              v-model="booking.customer.first_name"
              label="First name"
              @change="bookerFirstNameChanged"
            />
            <booking-input
              id="details_last_name"
              v-model="booking.customer.last_name"
              label="Last name"
              @change="bookerLastNameChanged"
            />
            <booking-input
              id="details_email"
              v-model="booking.customer.email_address"
              label="Email address"
              type="email"
            />
            <booking-country-picker
              id="details_country"
              v-model="booking.customer.country"
              required="true"
            />
            <booking-input
              id="details_telephone_number"
              v-model="booking.customer.telephone_number"
              label="Daytime telephone No."
              type="tel"
              required="true"
            />
            <booking-input
              id="details_alternative_telephone_number"
              v-model="booking.customer.alternative_telephone_number"
              label="Evening telephone No."
              type="tel"
              placeholder="Optional"
            />
            <template v-if="booking.customer.country === 'GB' && !manually">
              <booking-input
                id="details_line_1"
                v-model="booking.customer.address_line_1"
                label="House name / Number"
                required="true"
              />
              <booking-input
                id="details_postcode"
                v-model="booking.customer.postcode"
                label="Postcode"
                required="true"
              />
              <div class="space">
                <button
                  type="button"
                  class="button button--grey button--large"
                  @click="findAddress"
                >Find address</button>

                <p><br><small>Or <u
                  class="manually"
                  @click="manually = true"
                >Complete address manually</u></small></p>
              </div>
            </template>
            <template v-else>
              <booking-input
                id="details_line_1"
                v-model="booking.customer.address_line_1"
                label="Address Line 1"
                required="true"
              />
              <booking-input
                id="details_line_2"
                v-model="booking.customer.address_line_2"
                label="Address Line 2"
                placeholder="Optional"
              />
              <booking-input
                id="details_town"
                v-model="booking.customer.town"
                label="Town"
                required="true"
              />
              <booking-input
                id="details_county"
                v-model="booking.customer.county"
                label="County / State"
                required="true"
              />
              <booking-input
                id="details_postcode"
                v-model="booking.customer.postcode"
                label="Postcode"
                required="true"
              />
            </template>
          </fieldset>

          <fieldset v-if="!tour">
            Pick a tour
          </fieldset>
          <fieldset v-else>
            <legend>Tour details</legend>
            <div class="space">
              <h4>{{ tour.name }}</h4>
            </div>
            <tour-date-picker
              ref="tourDatePicker"
              :tour="tour"
              :default-start-date="$route.query.date || ''"
              @dateChange="dateChange"
              @filtersChanged="filtersChanged"
              @pricesChanged="pricesChanged"
            />
            <div
              v-if="date"
              class="group"
            >
              <label for="room_picker">{{ tour.bike_and_boat ? 'Cabin' : 'Room' }} type</label>
              <div class="room-pickers">
                <room-picker
                  v-for="price in prices"
                  :key="price.id"
                  :price="price"
                  :rooms="booking.rooms"
                  @changeRoom="changeRoom"
                />
                <div v-if="holding.length && roomChange === false">
                  <br>
                  <strong>
                    <small>
                      You've removed rooms from your booking. Don't worry - any guest details you've already entered have been saved and will be reallocated to other rooms if you need them again.
                    </small>
                  </strong>
                </div>
              </div>
            </div>
          </fieldset>

          <fieldset v-if="date && _rooms.length">
            <legend>Your party{{ booking.party && booking.party.length ? ` of ${booking.party.length}` : '' }}</legend>
            <div
              v-for="(room, i) in _rooms"
              :key="room.id"
              class="room"
            >
              <header class="room-header">Room {{ i + 1 }}</header>
              <div
                v-for="(person, j) in booking.party.filter(p => p.booking_room_id === room.room_id)"
                :key="person.id"
                class="person"
              >
                <div class="space">
                  <h4 class="person-counter">Person </h4>
                  <div class="room-label">
                    <strong>Room {{ i + 1 }}</strong>
                    {{ build.rooms.find(r => r.id === room.price.room_type_id).name }} -
                    {{ build.accommodation.find(a => a.id === room.price.accommodation_category_id).name }}
                    <template v-if="room.price.deck_id !== undefined"> - {{ build.decks.find(d => d.id === room.price.deck_id).name }} deck</template>
                  </div>
                </div>

                <booking-select
                  :id="`person_${j}_${i}_title`"
                  v-model="person.title"
                  label="Title"
                  required="true"
                >
                  <option value="" />
                  <option
                    v-for="t in ['Mrs', 'Mr', 'Miss', 'Ms', 'Dr', 'Prof.', 'Rev.']"
                    :key="t"
                    :value="t"
                  >{{ t }}</option>
                </booking-select>

                <booking-input
                  :id="`person_${j}_${i}_first_name`"
                  v-model="person.first_name"
                  label="First name"
                />

                <booking-input
                  :id="`person_${j}_${i}_last_name`"
                  v-model="person.last_name"
                  label="Last name"
                />

                <booking-date-of-birth
                  :id="`person_${j}_${i}_date_of_birth`"
                  v-model="person.date_of_birth"
                />

                <booking-height
                  :id="`person_${j}_${i}_height`"
                  v-model="person.height"
                  :country="booking.customer.country"
                  :required="!! person.tour_bike_id"
                  label="Height"
                />

                <booking-select
                  :id="`person_${j}_${i}_tour_bike`"
                  v-model="person.tour_bike_id"
                  label="Bike"
                >
                  <option value="">No bike hire required</option>
                  <option
                    v-for="tourBike in tourSeasonBikes"
                    :key="tourBike.id"
                    :value="tourBike.id"
                    v-html="`${tourBike.name} - ${cost(tourBike.cost)}`"
                  />
                </booking-select>

                <booking-input
                  :id="`person_${j}_${i}_diet`"
                  v-model="person.dietary"
                  label="Dietary Requirements"
                  placeholder="None"
                />

                <booking-party-extras
                  :id="`person_${j}_${i}_extras`"
                  :value="person.extras"
                  :extras="tourPartyExtras"
                  :pax="pax"
                  :accommodation_category_id="room.price.accommodation_category_id"
                  :boat_id="filters.boat.value"
                  :season_id="selectedYear.season_id"
                  :guided="filters.guided.value"
                  @add="person.extras.push($event)"
                  @remove="person.extras.splice($event, 1)"
                />

              </div>

              <booking-room-extras
                :id="`room_${i}_extras`"
                :value="room.extras"
                :extras="tourSeasonRoomExtras"
                :room="room"
                :date="date"
                :parent-departure="departure"
                :parentroom="room.price.room_type_id"
                :parentaccom="room.price.accommodation_category_id"
                @changeExtraQuantity="changeExtraQuantity"
                @changeExtraRoomType="changeExtraRoomType"
              >
                <div
                  slot="before"
                  class="space"
                >
                  <h4>Extra nights</h4>
                  <div class="room-label">
                    <strong>Room {{ i + 1 }}</strong>
                    {{ build.rooms.find(r => r.id === room.price.room_type_id).name }} -
                    {{ build.accommodation.find(a => a.id === room.price.accommodation_category_id).name }}
                  </div>
                </div>
              </booking-room-extras>

            </div>
          </fieldset>

          <fieldset v-if="date && _rooms.length">
            <legend />
            <booking-textarea
              id="comments"
              v-model="booking.comments"
              label="Comments/questions"
            />
          </fieldset>

        </form>

        <aside
          v-if="loadingPopup"
          class="previous"
        >
          <span
            class="previous__bg"
            @click="removeLocalBooking"
          />
          <div class="previous__content">
            <h4>Pick up where you left off</h4>
            <h3>It looks like you started a booking a little while back, would you like to carry on?</h3>
            <button
              type="button"
              class="button button--lgrey"
              @click="removeLocalBooking"
            >No thanks</button>
            <button
              type="button"
              class="button button--proceed"
              @click="loadBooking('')"
            >Yes please</button>
          </div>
        </aside>

      </main>

    </div>

    <aside class="secondary">
      <booking-totals
        v-if="tour"
        :date="date"
        :rooms="_rooms"
        :nights="nights"
        :bikes="bikes"
        :upgrades="upgrades"
        :reductions="reductions.hasReductions"
        :offers="offers"
        :charges="booking.charges"
        :balance="balanceDate"
        :deposit="deposit"
        :total="total"
        @submit="validateAndBook"
      />
    </aside>

  </div>
</template>

<script>
import Vue from 'vue'
import TourDatePicker from '@/components/tours/TourDatePicker'
import RoomPicker from '@/components/global/RoomPicker'
import BookingInput from '@/components/bookings/BookingInput'
import BookingSelect from '@/components/bookings/BookingSelect'
import BookingTextarea from '@/components/bookings/BookingTextarea'
import BookingCountryPicker from '@/components/bookings/BookingCountryPicker'
import BookingDateOfBirth from '@/components/bookings/BookingDateOfBirth'
import BookingHeight from '@/components/bookings/BookingHeight'
import BookingPartyExtras from '@/components/bookings/BookingPartyExtras'
import BookingRoomExtras from '@/components/bookings/BookingRoomExtras'
import BookingTotals from '@/components/bookings/BookingTotals'
import { AgeAtDate } from '@/plugins/age'
import Thyme from '@trys/thyme'
import currency from '@/mixins/currency'
import getDates from '@/mixins/getDates'

export default {
  async asyncData({ query, store, redirect }) {
    if (!query.tour) return redirect(302, { name: 'booking-pick' })

    try {
      await Promise.all([
        store.dispatch('getDetailedTour', query.tour),
        store.dispatch('getBuild')
      ])

      if (!store.state.tour) throw new Error('Not found')
    } catch (e) {
      return redirect(302, { name: 'booking-pick' })
    }

  },

  components: {
    TourDatePicker,
    RoomPicker,
    BookingInput,
    BookingSelect,
    BookingTextarea,
    BookingCountryPicker,
    BookingDateOfBirth,
    BookingHeight,
    BookingPartyExtras,
    BookingRoomExtras,
    BookingTotals
  },

  filters: {
    formatErrorMsg (errMsg) {
      let formattedErr = errMsg.replace('details_', '')
        .replace(/_/g, ' ')
      return formattedErr.charAt(0).toUpperCase() + formattedErr.slice(1);
    }
  },

  mixins: [currency, getDates],

  data () {
    return {
      date: '',
      prices: [],
      filters: {},
      holding: [],
      manually: false,
      // autoRooms: false,
      loadingPopup: false,
      roomChange: null,
      booking: {
        customer: {
          title: '',
          first_name: '',
          last_name: '',
          email_address: '',
          country: 'GB',
          telephone_number: '',
          alternative_telephone_number: '',
          address_line_1: '',
          address_line_2: '',
          town: '',
          county: '',
          postcode: ''
        },
        rooms: [],
        party: [],
        comments: '',
        charges: 0
      },
      selectedYear: {}
    }
  },

  computed: {
    tour() {
      return this.$store.state.tour
    },

    build () {
      return this.$store.state.build
    },

    errors () {
      return this.$store.state.form_errors
    },

    pax () {
      return this._rooms.reduce((t, r) => r.price ? t + this.build.rooms.find(room => room.id === r.price.room_type_id).sleeps : t, 0)
    },

    nights () {
      return this.filters.nights && this.filters.nights.value ? this.filters.nights.value : (this.tour && this.tour.nights ? this.tour.nights[0] : 0)
    },

    departure () {
      if (!this.date) return ''
      const date = new Thyme(this.date.date)
      date.add(this.nights)
      return date.raw
    },

    tourSeasonBikes () {
      const currSelectedYear = this.selectedYear
      return this.tour.bikes.filter(bike => {
        let season_filter = bike.tour_season_id == currSelectedYear.season_id,
            nights_filter = true
        if (this.filters.nights.value >= 0) {
          nights_filter = (bike.nights == this.filters.nights.value || bike.nights == 0)
        }
        return season_filter && nights_filter
      })
    },

    tourPartyExtras () {
      const currSelectedYear = this.selectedYear
      return this.tour.party_extras.filter(extra => {
        let season_filter = extra.tour_season_id == currSelectedYear.season_id,
            nights_filter = true
        if (this.filters.nights.value >= 0) {
          nights_filter = (extra.nights == this.filters.nights.value || extra.nights == 0)
        }
        return season_filter && nights_filter
      })
    },

    tourSeasonRoomExtras () {
      const currSelectedYear = this.selectedYear
      return this.tour.room_extras.filter(room => {
        return room.tour_season_id == currSelectedYear.season_id
      })
    },

    _rooms () {
      return this.booking.rooms.map(booking_room => {
        let thisPrice = this.tour.prices.find(p => p.id === booking_room.tour_price_id)
        return {
          room_id: booking_room.room_id,
          tour_price_id: booking_room.tour_price_id,
          price: thisPrice,
          chargeable: thisPrice.cost,
          extras: booking_room.extras.map(e => {
            let cost = 0
            let arrival = null
            let departure = null
            const extra = this.tour.room_extras.find(extra => extra.id === e.tour_room_extra_id)
            if (!extra) return

            let d = new Thyme(e.post ? this.departure : this.date.date)
            e.post ? d.add() : d.remove()
            const sleeps = this.build.rooms.find(r => r.id === e.room_type_id).sleeps || 1
            const subCost = (this.calculateExtraCost(d.toString(), extra.variations, e) * sleeps)
            if (subCost) {
              cost = subCost * e.quantity
            }

            if (!e.post) arrival = d
            else departure = d

            return {
              tour_room_extra_id: e.tour_room_extra_id,
              quantity: e.quantity,
              accommodation_category_id: e.accommodation_category_id,
              room_type_id: e.room_type_id,
              post: e.post,
              arrival,
              departure,
              cost,
              name: extra.name
            }
          })
        };
      })
    },

    balanceDate () {
      if (this.date) {
        const date = new Thyme(this.date.date)
        date.remove(this.tour.balance_due)
        return new Thyme() > date ? true : date.format()
      } else {
        return null
      }
    },

    deposit () {
      if (this.booking.rooms.length === 0) return 0
      const tour_season_id = this._rooms[0].price.tour_season_id
      const season = this.tour.seasons.find(s => s.id === tour_season_id)
      return season ? season.deposit * this.booking.party.length : 0
    },

    bikes () {
      if (!this.booking.party.length) return []
      const tour_bikes = this.booking.party.reduce((current, person) => {
        if (!person.tour_bike_id) return current
        if (!current[person.tour_bike_id]) current[person.tour_bike_id] = 0
        current[person.tour_bike_id]++
        return current
      }, {})

      return Object.keys(tour_bikes).map(id => {
        const bike = this.tour.bikes.find(b => b.id === Number(id))
        if (!bike) return null
        return {
          id: id,
          quantity: tour_bikes[id],
          name: bike.name,
          short_name: bike.short_name,
          cost: bike.cost * tour_bikes[id]
        }
      }).filter(a => a)
    },

    upgrades () {
      const upgrades = []
      if (!this.booking.party.length) return upgrades
      if (!this.booking.rooms.length) return upgrades
      this.booking.party
        .filter(p => p.extras.length)
        .forEach(person => {
          person.extras.forEach(party_extra => {
            const id = party_extra.tour_party_extra_variation_id
            const extra = this.tour.party_extras.find(e => e.variations.find(v => v.id === id))
            if (!extra) return

            const variation = extra.variations.find(v => v.id === id);
            const cost = variation.cost;

            const current = upgrades.find(u => u.id === extra.id)
            if (current) current.total += cost
            else upgrades.push({
              name: extra.name,
              total: cost,
              tour_party_extra_variation_id: id,
              id: extra.id
            })
          })
        })

      this._rooms
        .filter(r => r.extras.length)
        .forEach(room => {
          room.extras.forEach(extra => {
            if (!extra) return
            const current = upgrades.find(u => u.id === extra.tour_room_extra_id)
            let name = extra.name
            if (name.indexOf('in') === -1) name = name.replace('night ', 'night in ')

            if (current) current.total += extra.cost
            if (current) current.quantity += extra.quantity
            else upgrades.push({
              name,
              total: extra.cost,
              quantity: extra.quantity,
              id: extra.tour_room_extra_id
            })
          })
        })

      return upgrades
    },

    reductions () {
      /*
      So...
      If we have reductions
      Map the party.date_of_birth and group them into rooms
      Pass them over each input rule to see if we have a match,
      Count them up and check it exceeds the quantity
      If so, pass it over the output, only applying to those who match the min/max rules
      Input rule: { min: 18, quantity: 2 }
      Output rule: { min: 6, max: 13, percent: 50 }
      */
      let total = 0
      let persons_idx = []
      let hasReductions = false
      if (!this.tour.reductions || !this.tour.reductions.length || !this.date) return total
      const start = new Date(this.date.date)
      const rooms = this.booking.party.reduce((current, person, idx) => {
        if (!current[person.booking_room_id]) current[person.booking_room_id] = []
        const dateSplit = person.date_of_birth.split('-')
        let age
        if (dateSplit.length === 3 && person.date_of_birth.length === 10) {
          age = new AgeAtDate(new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, dateSplit[2]), start).age
        } else {
          age = ''
        }
        current[person.booking_room_id].push({idx, age})
        return current
      }, {})
      if (!Object.keys(rooms).length) return total
      /*
      Loop the rooms, then the reductions
      Track a inputMatches flag and set it to true if there is no input or
      there in an input and we hit the criteria of min, max and quantity
      */
      Object.keys(rooms).forEach(booking_room_id => {
        const persons = rooms[booking_room_id]
        let output_count = 0
        const room = this._rooms.find(r => r.room_id === Number(booking_room_id) && r.price)
        if (room) {
          // Set cost, which may change if there's reductions
          room.chargeable = room.price.cost

          this.tour.reductions.filter(reduction => {
            let roomTypeFilter = true,
                deckFilter = true
            if (reduction.room_type_id && room.price.room_type_id) {
              roomTypeFilter = reduction.room_type_id === room.price.room_type_id
            }
            if (reduction.deck_id && room.price.deck_id) {
              deckFilter = reduction.deck_id === room.price.deck_id
            }
            return roomTypeFilter && deckFilter
          }).forEach(reduction => {
            let inputMatches = false
            // Check this reduction is for the same season as the room being booked
            if (room.price.tour_season_id == reduction.tour_season_id) {
              if (!reduction.input_min && !reduction.input_max) {
                inputMatches = true
              } else {
                let quantityMatch = 0
                persons.forEach(person => {
                  if (!person.age) return
                  let internalMatch = 0
                  if (!reduction.input_min) internalMatch++
                  else if (person.age >= reduction.input_min) internalMatch++
                  if (!reduction.input_max) internalMatch++
                  else if (person.age <= reduction.input_max) internalMatch++
                  if (internalMatch === 2) quantityMatch++
                })
                if (quantityMatch >= reduction.input_quantity) inputMatches = true
              }
            }

            /*
            If the inputMatches, work through the outputs to find matches
            */
            if (inputMatches) {
              persons.forEach(person => {
                if (!person.age) return
                let internalMatch = 0
                if (!reduction.output_min) internalMatch++
                else if (person.age >= reduction.output_min) internalMatch++
                if (!reduction.output_max) internalMatch++
                else if (person.age <= reduction.output_max) internalMatch++
                if (internalMatch !== 2) return
                if (reduction.output_quantity && output_count >= reduction.output_quantity) return

                // Get room price to base the discount from
                let cost = room.price.cost
                this.prices.forEach(p => {
                  if (p.accommodation_category_id && p.room_type_id && reduction.child_calc_accommodation && reduction.child_calc_room ) {
                    if ((p.accommodation_category_id == reduction.child_calc_accommodation) &&  (p.room_type_id == reduction.child_calc_room) ) {
                      cost = p.cost
                    }
                  }
                })

                // NOTE: Removed reduction calculation logic by request
                // if (reduction.percent) total += cost / 100 * reduction.percent
                // else if (reduction.cost) total += cost - reduction.cost
                persons_idx.push(person.idx)
                hasReductions = true
                output_count++
                // Set room price, based on discount room set in reductions
                // NOTE: Removed reduction calculation logic by request
                // room.chargeable = cost
              })
            }
          })
        }
      })

      return {total, persons_idx, hasReductions}
    },

    offers () {
      let total = 0

      const now = new Date();
      const start = new Date(this.date.date);

      this.tour.offers.forEach(offer => {
        if (!offer) return;

        if (offer.booking_window_start || offer.booking_window_end) {
          if (offer.booking_window_start && offer.booking_window_start > now) return false;
          if (offer.booking_window_end && offer.booking_window_end < now) return false;
        }

        if (offer.start_window_start || offer.start_window_end) {
          if (offer.start_window_start && offer.start_window_start > start) return false;
          if (offer.start_window_end && offer.start_window_end < start) return false;
        }

        if (offer.bike_ids && offer.bike_ids.length) {
          total += this.calculate_bike_offer(offer, this.booking.party, this.tour.bikes);
        } else {
          total += this.calculate_party_offer(offer, this.booking, start);
        }
      });

      return total
    },

    total () {
      let cost = 0
      let reductionTotal = this.reductions.total // Get reductions first to update the chargeable room cost

      this._rooms.forEach(room => cost += (room.chargeable * this.build.rooms.find(r => r.id === room.price.room_type_id).sleeps))

      this.bikes.forEach(upgrade => cost += upgrade.cost)

      this.upgrades.forEach(upgrade => cost += upgrade.total)

      cost -= reductionTotal

      cost -= this.offers

      cost += this.booking.charges || 0

      return cost
    }
  },

  mounted () {
    if (this.$route.query) {

      [
        { key: 'nights', type: Number },
        { key: 'boat', type: Number },
        { key: 'guided', type: Boolean },
        { key: 'from', type: String }
      ].forEach(f => {
        let value = this.$route.query[f.key]
        if (value) {
          value = f.key === 'guided' && typeof value === 'string' ? value === 'true' : f.type(value)
          this.filters[f.key].value = value
          this.$refs.tourDatePicker.setFilter(f.key, value)
        }
      })

      if (this.$route.query.extras) {
        const n = Number(this.$route.query.extras)
        if (n > 0) {
          this.booking.charges = n
        }
      }
    }

    let current = localStorage.getItem('saved-booking')
    if (current) {
      const booking = JSON.parse(current)
      current = ''
      if (booking.tour_id === this.tour.id) {
        const now = new Date().getTime()
        if (now - booking.now < 86400000 || this.$route.query.load) {
          this.loadBooking(booking)
          } else {
          this.loadingPopup = true
        }
      }
    }

  },

  methods: {
    loadBooking(booking) {
      // this.autoRooms = true
      if (!booking) {
        booking = JSON.parse(localStorage.getItem('saved-booking'))
        this.loadingPopup = false
      }

      if (booking.filters) {
        [
          { key: 'nights', type: Number },
          { key: 'boat', type: Number },
          { key: 'guided', type: Boolean },
          { key: 'from', type: String },
        ].forEach(f => {
          const value = booking.filters[f.key]
          if (value) {
            this.filters[f.key].value = f.type(value)
            this.$refs.tourDatePicker.setFilter(f.key, f.type(value))
          }
        })
      }

      this.$refs.tourDatePicker.setRaw(booking.holiday_start_date)
      this.booking = booking

      if (!this.booking.charges && this.$route.query.extras) {
        const n = Number(this.$route.query.extras)
        if (n > 0) {
          this.booking.charges = n
        }
      }
    },

    removeLocalBooking() {
      this.loadingPopup = false
      localStorage.removeItem('saved-booking')
      localStorage.removeItem('saved-booking-meta')
    },

    findAddress () {
      if (this.booking.customer.address_line_1 && this.booking.customer.postcode) {
        try {
          fetch(`https://api.getAddress.io/find/${this.booking.customer.postcode}/${this.booking.customer.address_line_1}?api-key=m3wEHf-1bEKbCm0pi44RyQ21057`)
            .then(response => response.json())
            .then(({addresses}) => {
              if (addresses && addresses.length) {
                const address = addresses[0]
                const splitAddress = address.split(', ')
                this.booking.customer.address_line_1 = splitAddress[0]
                this.booking.customer.address_line_2 = splitAddress[1]
                this.booking.customer.town = splitAddress[4] || splitAddress[5]
                this.booking.customer.county = splitAddress[6]
              }

              this.manually = true
            })
        } catch(e) {
          this.manually = true
        }
      }
    },

    bookerTitleChanged () {
      if (this.booking.party.length && !this.booking.party[0].title) this.booking.party[0].title = this.booking.customer.title
    },

    bookerFirstNameChanged () {
      if (this.booking.party.length && !this.booking.party[0].first_name) this.booking.party[0].first_name = this.booking.customer.first_name
    },

    bookerLastNameChanged () {
      if (this.booking.party.length && !this.booking.party[0].last_name) this.booking.party[0].last_name = this.booking.customer.last_name
    },

    dateChange (date) {
      if (date) {
        let newDate = new Date(date.date).getFullYear()
        this.selectedYear.year = newDate
        let thisSeasonData = this.tour.allSeasons.filter(function (season) {
          return newDate == season.name
        });
        if (thisSeasonData.length) {
          Vue.set(this.selectedYear, 'season_id', thisSeasonData[0].id)
        }
      }
      this.date = date
    },

    pricesChanged (prices) {
      this.prices = prices
    },

    filtersChanged (filters) {
      this.filters = filters
    },

    changeRoom ({ dir, tour_price_id }) {
      if (dir === 1) {
        const newKey = this.booking.rooms.length ? Math.max(...this.booking.rooms.map(r => r.room_id)) + 1 : 1

        this.booking.rooms.push({
          room_id: newKey,
          tour_price_id,
          extras: []
        })

        const tour_price = this._rooms[this._rooms.length - 1].price;
        const size = this.build.rooms.find(r => r.id === tour_price.room_type_id).sleeps
        for (let i = 1; i < size + 1; i++) {
          let person
          if (this.holding.length) {
            person = this.holding.shift()
            person.booking_room_id = newKey
          } else if (i === 1 && newKey === 1) {
            // First person of first room defaults to customer (if no holding data)
            person = Object.assign({}, this.personTemplate(newKey), this.booking.customer)
          } else {
            person = this.personTemplate(newKey)
          }
          this.booking.party.push(person)
        }

      } else {
        const current = this.booking.rooms.filter(r => r.tour_price_id === tour_price_id)
        if (!current) return
        const removalIndex = this.booking.rooms.findIndex(r => r.room_id === current[current.length - 1].room_id)
        this.copyPartyIntoHolding(this.booking.rooms[removalIndex].room_id)
        this.booking.rooms.splice(removalIndex, 1)
        this.booking.party = this.booking.party.filter(person => this.booking.rooms.find(r => r.room_id === person.booking_room_id))

        if (this.roomChange === null && this.holding.length) this.roomChange = false
        else if (this.roomChange === false) this.roomChange = true
      }
    },

    copyPartyIntoHolding (booking_room_id) {
      this.booking.party.forEach(person => {
        if (person.booking_room_id !== booking_room_id) return
        if (!person.title || !person.first_name || !person.last_name) return

        this.holding.push({ ...person, booking_room_id: null })
      })
    },

    personTemplate (booking_room_id = '') {
      return {
        title: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        height: '',
        tour_bike_id: null,
        booking_room_id,
        dietary: '',
        extras: []
      }
    },

    changeExtraQuantity (room_id, tour_room_extra_id, isPost, dir, room_type = {}) {
      const room = this.booking.rooms.find(r => r.room_id === room_id)
      if (!room) return

      let index = room.extras.findIndex(e => e.tour_room_extra_id === tour_room_extra_id && e.post === isPost)
      let extra = room.extras[index]

      if (extra) {
        extra.quantity += dir
        if (extra.quantity === 0) room.extras.splice(index, 1)
      } else {
        if (dir === -1) return
        room.extras.push({
          tour_room_extra_id,
          quantity: 1,
          accommodation_category_id: room_type.accommodation_category_id || null,
          room_type_id: room_type.room_type_id || null,
          post: isPost
        })
      }
    },

    changeExtraRoomType (room_id, tour_room_extra_id, isPost, room_type) {
      const room = this.booking.rooms.find(r => r.room_id === room_id)
      if (!room) return

      let index = room.extras.findIndex(e => e.tour_room_extra_id === tour_room_extra_id && e.post === isPost)
      if (!index === -1) return

      room.extras[index].accommodation_category_id = room_type.accommodation_category_id
      room.extras[index].room_type_id = room_type.room_type_id
      room.extras[index].cost = room_type.cost
    },

    calculateExtraCost (date, variations, room_type) {
      let cost = 0
      const contenders = variations.filter(variation => {
        const dates = this.getExtraVariationDates(variation);
        if (!dates.contains(date)) return false;
        if (variation.room_type_id !== room_type.room_type_id) return false
        if (variation.accommodation_category_id !== room_type.accommodation_category_id) return false

        return true;
      });

      if (!contenders.length) return 0

      contenders.sort((a, b) => a.cost - b.cost)

      return contenders[0].cost
    },

    findErrors () {
      setTimeout(() => {
        const el = document.querySelector('form .error')
        if (el) {
          const pos = el.getBoundingClientRect()
          const headerOffset = Number(window.getComputedStyle(document.body).paddingTop.replace('px', ''))
          const change = headerOffset - pos.top + 20
          if (change === 0) return

          const newTop = window.pageYOffset - change;
          window.scrollTo.length ? window.scrollTo({
            top: newTop,
            behavior: 'smooth'
          }) : window.scrollTo(0, newTop)
        }
      }, 100)
    },

    saveBookingToLocalStorage () {
      const booking = JSON.stringify(this.prepareBooking())
      localStorage.setItem('saved-booking', booking)
    },

    async validateAndBook(event) {
      this.saveBookingToLocalStorage()

      const errors = []
      if (!this.booking.customer.title) errors.push('details_title')
      if (!this.booking.customer.first_name) errors.push('details_first_name')
      if (!this.booking.customer.last_name) errors.push('details_last_name')
      if (!this.booking.customer.email_address) errors.push('details_email')
      if (!/.+\@.+\..+/.test(this.booking.customer.email_address)) errors.push('details_email')
      if (!this.booking.customer.telephone_number) errors.push('details_telephone_number')
      if (!this.booking.customer.country) errors.push('details_country')
      if (!this.booking.customer.address_line_1) errors.push('details_line_1')
      if (!this.booking.customer.postcode) errors.push('details_postcode')

      if (!this.booking.customer.town || !this.booking.customer.county) {
        this.manually = true
        if (!this.booking.customer.town) errors.push('details_town')
        if (!this.booking.customer.county) errors.push('details_county')
      }

      if (!this.date) errors.push('date')
      if (!this._rooms.length) errors.push('room')

      this._rooms.forEach((room, i) => {
        this.booking.party
        .filter(p => p.booking_room_id === room.room_id)
        .forEach((person, j) => {
          if (!person.title) errors.push(`person_${j}_${i}_title`)
          if (!person.first_name) errors.push(`person_${j}_${i}_first_name`)
          if (!person.last_name) errors.push(`person_${j}_${i}_last_name`)
          if (!person.date_of_birth) errors.push(`person_${j}_${i}_date_of_birth`)
          if (!person.height && person.tour_bike_id) errors.push(`person_${j}_${i}_height`)
        })
      })

      this.$store.commit('addFormErrors', errors)

      if (!errors.length) {
        try {
          const totals = await this.$store.dispatch('checkBooking', this.prepareBooking())
          const party_extras = this.booking.party
            .filter(p => p.extras.length)
            .reduce((extras, person) => {
              person.extras.forEach(extra => {
                const e = this.tour.party_extras.find(e => e.variations.find(v => v.id === extra.tour_party_extra_variation_id))
                if (e) extras[extra.tour_party_extra_variation_id] = e.name
              })

              return extras
            }, {})

          const bikes = this.booking.party
            .filter(p => p.tour_bike_id)
            .map(p => {
              return this.tour.bikes.find(b => Number(b.id) === Number(p.tour_bike_id))
            })
            .filter(x => x)

          const meta = {
            rooms: this._rooms,
            name: this.tour.name,
            slug: this.tour.slug,
            bike_and_boat: this.tour.bike_and_boat,
            nights: this.nights,
            bikes,
            party_extras,
            totals
          }

          localStorage.setItem('saved-booking-meta', JSON.stringify(meta))
          this.$router.push({ name: 'booking-review' })
        } catch(e) {
          console.error(e)

          if (e.response && e.response.data && e.response.data) {
            const api_errors = e.response.data.error || {}
            const new_errors = []
            if (api_errors['customer.title']) new_errors.push('details_title')
            if (api_errors['customer.first_name']) new_errors.push('details_first_name')
            if (api_errors['customer.last_name']) new_errors.push('details_last_name')
            if (api_errors['customer.email_address']) new_errors.push('details_email')
            if (api_errors['customer.telephone_number']) new_errors.push('details_telephone_number')
            if (api_errors['customer.country']) new_errors.push('details_country')
            if (api_errors['customer.address_line_1']) new_errors.push('details_line_1')
            if (api_errors['customer.postcode']) new_errors.push('details_postcode')

            if (api_errors['customer.town'] || api_errors['customer.county']) {
              this.manually = true
              if (api_errors['customer.town']) new_errors.push('details_town')
              if (api_errors['customer.county']) new_errors.push('details_county')
            }

            Object.keys(api_errors).forEach(key => {
              if (key.indexOf('[') !== -1) {
                const splitOne = key.split('].')
                if (splitOne.length === 2) {
                  const [type, index] = splitOne[0].split('[')
                  const key = splitOne[1]
                  const keys = {
                    tour_bike_id: 'bike'
                  }

                  if (type === 'party') {
                    new_errors.push(`person_${index}_${this._rooms.findIndex(r => r.id === this.booking.party[index].booking_room_id)}_${keys[key] || key}`)
                  }
                }
              }
            })

            this.$store.commit('addFormErrors', new_errors)
            if (new_errors.length) {
              this.findErrors()
            }
          }

        }
      } else {
        this.findErrors()
      }

    },

    prepareBooking () {

      const data = {
        tour_id: this.tour.id,
        tour_season_id: this._rooms[0].price.tour_season_id,
        holiday_start_date: this.date.date,
        customer: this.booking.customer,
        comments: this.booking.comments,
        rooms: this.booking.rooms,
        _rooms: this._rooms,
        party: this.booking.party,
        charges: this.booking.charges,
        now: new Date().getTime()
      }

      data.filters = {}
      if (this.filters) {
        if (this.filters.boat && this.filters.boat.value !== '') data.filters.boat = Number(this.filters.boat.value)
        if (this.filters.from && this.filters.from.value !== '') data.filters.from = Number(this.filters.from.value)
        if (this.filters.guided && this.filters.guided.value !== '') data.filters.guided = this.filters.guided.value
        if (this.filters.nights && this.filters.nights.value !== '') data.filters.nights = Number(this.filters.nights.value)
      }

      return data
    },

    calculate_bike_offer(offer, party, bikes) {
      const group_size = offer.type === '2for1bikes' ? 2 : 1;
      let subtotal = 0;

      let valid_bikes = bikes.filter(b => offer.bike_ids.includes(b.bike_id));
      const group = party
        .filter(p => p.tour_bike_id && valid_bikes.find(b => b.id == p.tour_bike_id))
        .reduce((c, p) => {
          c[p.tour_bike_id] = (c[p.tour_bike_id] || 0) + 1;
          return c;
        }, {});

      Object.keys(group).forEach(tour_bike_id => {
        const qualified = Math.floor(group[tour_bike_id] / group_size);
        if (qualified) subtotal += (qualified * bikes.find(b => b.id === Number(tour_bike_id)).cost);
      });

      return subtotal;
    },

    calculate_party_offer(offer, booking, start) {
      let subtotal = 0;
      booking.party.forEach((person, idx) => {
        const dateSplit = person.date_of_birth.split('-');
        let age = 0;
        if (dateSplit.length === 3 && person.date_of_birth.length === 10) {
          age = new AgeAtDate(new Date(dateSplit[0], parseInt(dateSplit[1]) - 1, dateSplit[2]), start).age;
        }

        if (this.reductions.persons_idx && this.reductions.persons_idx.indexOf(idx) === -1)subtotal += offer.discount;
      });

      return subtotal;
    },

    format (d) {
      const date = new Thyme(d)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }
  },

  head () {
    return {
      title: 'Booking'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

h1 {
  margin-bottom: 25px;
}

.booking-page {
  padding: 30px 20px;

  @include mq(40em) {
    margin-top: -60px;
  }
}

form.booking {
  min-height: 1330px;
}

.room-label {
  background: $lightest;
  font-size: 0.875em;
  margin: 18px 0 20px;

  strong {
    background: #E3EBEE;
    display: inline-block;
    padding: 10px 14px;
    min-width: 27%;
    margin-right: 10px;
  }
}

.person {
  margin-bottom: 42px;
}

.room {
  counter-increment: list-counter;

  & + .room {
    margin-top: 80px;
  }

  &-header {
    display: grid;
    grid-template-columns: minmax(20px, 1fr) auto minmax(20px, 1fr);
    align-items: center;
    text-align: center;
    grid-gap: 20px;
    width: 100%;
    font-weight: 500;
    margin: 0 0 60px;
  }

  &-header:before,
  &-header:after {
    content: '';
    border-top: 1px solid $line;
  }

  &:first-of-type .room-header {
    display: none;
  }
}

.person:not(:first-of-type) {
  counter-increment: list-counter;
}

.person-counter {
  &:after {
    content: counter(list-counter);
  }
}

.manually {
  cursor: pointer;
  color: $orange;
}

.primary {
  margin: 0 0 30px;
}

.secondary {
  padding: 30px;
  background: $lightest;
}

.tertiary {
  background: $lightest;
  padding: 15px 20px;
  position: sticky;
  margin: 0 -20px;
  top: 55px;
  font-size: 14px;
  z-index: 10;

  h3 {
    margin-bottom: 0;
  }

  strong {
    float: right;
    color: $dark;
  }

  @include mq(30em) {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 20px;
  }

  @include mq(40em) {
    top: 79px;
  }
}

.booking-header ul {
  background: $lightest;
  padding: 20px 30px;
  font-weight: 700;
  font-size: 14px;
  margin: 35px 0 60px;

  small {
    font-size: 0.787em;
    font-weight: 400;
  }
}

.previous {
  position: fixed;
  z-index: 100;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  text-align: center;

  &__bg {
    background: rgba(0, 0, 0, 0.6);
    position: absolute;
    height: 100%;
    width: 100%;
    cursor: pointer;
    left: 0;
    top: 0;
  }

  &__content {
    position: absolute;
    background: $lightest;
    width: calc(100% - 40px);
    max-width: 400px;
    padding: 30px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}

.not-bookable {
  padding: 40px 20px 80px;
  text-align: center;
}

.errors {
  color: #e82828;
  margin: 20px 0 -30px;
}

@media screen and (min-width: 45em) {
  .booking-page {
    padding: 60px 20px;
  }

  .booking-header ul {
    padding: 25px 60px;

    li + li {
      margin-top: 10px;
    }
  }
}

@include mq(60em) {
  .primary {
    width: 65%;
    max-width: 736px;
    float: left;
  }

  .secondary {
    position: sticky;
    top: 100px;
    float: right;
    max-width: 407px;
    width: calc(35% - 30px);
    padding: 36px 37px;
  }

  .tertiary {
    display: none;
  }
}

@include mq(60em) {
    .booking-header ul {
      padding-left: 110px;
    }
}
</style>
