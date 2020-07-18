<template>
  <aside class="secondary">
    <div class="secondary__pricing">
      <tour-meta
        :tour="tour"
        :tour-page="true" />

      <FeefoRating
        v-if="tour.rating"
        :score="Number(tour.rating)"
        style="cursor: pointer;"
        @click="$emit('viewReviews')"
      />

      <nuxt-link
        v-if="tour.destinations.length"
        :to="{ name: 'contact', query: { destination: tour.destinations[0].slug, tour: String(tour.id) } }"
        class="button button--full button--translucent booking-button"
      >Enquire<span> about this tour</span></nuxt-link>

      <nuxt-link
        :to="{ name: 'booking', query }"
        class="button button--full button--dark booking-button"
      >Book<span> this tour</span></nuxt-link>

      <button
        class="button--reset check-prices"
        @click="closed = !closed"
      >Check arrival dates &amp; prices</button>

      <div
        v-if="tour.prices"
        :class="{ closed }"
      >

        <hr>

        <h4>Check arrival dates &amp; prices</h4>
        <tour-date-picker
          :tour="tour"
          @filtersChanged="filtersChanged"
          @dateChange="dateChange"
        >
          <template slot-scope="data">
            <div
              v-if="data.prices.length"
              class="prices"
            >
              <table>
                <thead>
                  <tr>
                    <th>Package</th>
                    <th class="n">Per person</th>
                  </tr>
                </thead>
                <tbody
                  v-for="group in groupPrices(data.prices)"
                  :key="group.id"
                >
                  <tr>
                    <th colspan="2">{{ group.deck ? `${group.name} (${group.deck} deck)` : group.name }}</th>
                  </tr>

                  <tr
                    v-for="price in group.prices"
                    :key="price.id"
                  >
                    <td>{{ price.name }}</td>
                    <td class="n">{{ cost(price.cost) }}</td>
                  </tr>
                </tbody>
              </table>

              <table v-if="tour.bikes.length">
                <thead>
                  <tr>
                    <th colspan="2">Bike hire</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="bike in tourSeasonBikes"
                    :key="bike.id"
                  >
                    <td v-html="bike.name" />
                    <td class="n">{{ cost(bike.cost) }}</td>
                  </tr>
                </tbody>
              </table>

              <div
                v-if="tourSeasonRoomExtras.length || tourSeasonPartyExtras.length"
                class="extras"
              >
                <table class="border-top border-bottom">
                  <tbody>
                    <tr @click="extrasVisible = !extrasVisible">
                      <td>Optional extras</td>
                      <td class="n">
                        <f-plus :active="extrasVisible"/>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  v-show="extrasVisible"
                  class="border-bottom"
                >
                  <tbody v-if="tourSeasonRoomExtras.length">
                    <tr
                      v-for="extra in tourSeasonRoomExtras"
                      :key="extra.id"
                    >
                      <td v-html="extra.name" />
                      <td class="n"><small v-if="extra.variations.length > 1">From </small>{{ cost(Math.min(...extra.variations.map(v => v.cost))) }}</td>
                    </tr>
                  </tbody>
                  <tbody v-if="tourSeasonPartyExtras.length">
                    <tr
                      v-for="extra in tourSeasonPartyExtras"
                      :key="extra.id"
                    >
                      <td v-html="extra.name" />
                      <td class="n"><small v-if="extra.variations.length > 1">From </small>{{ cost(Math.min(...extra.variations.map(v => v.cost))) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p v-if="data.balanceDate === true">
                As this holiday commences within {{ data.balanceDue }} days, full payment will be required at the time of booking.
              </p>
              <table
                v-else-if="data.balanceDate !== null"
                class="border-bottom"
              >
                <tbody>
                  <tr>
                    <td><strong>Deposit payable today</strong></td>
                    <td class="n"><strong>{{ cost(tour.seasons.find(s => s.id === data.prices[0].tour_season_id).deposit) }}</strong></td>
                  </tr>
                </tbody>
              </table>
              <br>

              <nuxt-link
                v-if="tour.destinations.length"
                :to="{ name: 'contact', query: { destination: tour.destinations[0].slug, tour: String(tour.id) } }"
                class="button button--full button--translucent booking-button"
              >Enquire<span> about this tour</span></nuxt-link>

              <nuxt-link
                :to="{ name: 'booking', query }"
                class="button button--full button--dark booking-button"
              >Book<span> this tour</span></nuxt-link>

              <br>
              <br>

              <tour-toggle
                v-if="tourSpecification.price_includes"
                :default="true"
                label="Package includes"
              >
                <div v-html="tourSpecification.price_includes" />
              </tour-toggle>

              <tour-toggle
                v-if="tourSpecification.price_excludes"
                label="Package excludes"
              >
                <div v-html="tourSpecification.price_excludes" />
              </tour-toggle>

              <tour-toggle
                v-if="tour.routes && tour.routes.length"
                label="Routes"
              >
                <ul>
                  <li
                    v-for="r in tour.routes"
                    :key="r.id"
                  >{{ r.name }}</li>
                </ul>
              </tour-toggle>

              <tour-toggle
                v-if="childReductions.length"
                label="Child reductions"
              >
                <ul>
                  <li
                    v-for="(r, idx) in childReductions"
                    :key="idx"
                  >{{ r }}</li>
                </ul>
              </tour-toggle>

              <br v-if="tourSpecification.price_includes || tourSpecification.price_excludes || tour.routes && tour.routes.length || childReductions.length">

              <a
                :href="`mailto:?subject=${tour.name} | Flexitreks&body=https://www.flexitreks.com/tours/${tour.slug}`"
                class="button button--translucent button--large button--image"
              ><img
                src="~/assets/images/envelope.svg"
                alt=""
              > Email this tour</a>

            </div>
          </template>
        </tour-date-picker>

      </div>
    </div>
    <div
      :class="{
        'secondary__cta': true,
        closed
      }"
    >
      <h4>Still have questions?</h4>
      <h3>Speak to one of our team…</h3>
      <a href="tel:+44 (0) 1273 410 550">+44 (0) 1273 410 550 &nbsp;<small>Open until 7pm</small></a>
    </div>
  </aside>
</template>

<script>
import TourMeta from './TourMeta'
import TourDatePicker from '@/components/tours/TourDatePicker'
import FPlus from '@/components/global/Plus'
import FeefoRating from '@/components/global/FeefoRating'
import TourToggle from '@/components/tours/TourToggle'
import currency from '@/mixins/currency'
import Vue from 'vue'

export default {
  components: {
    TourMeta,
    TourDatePicker,
    TourToggle,
    FPlus,
    FeefoRating
  },

  mixins: [currency],

  props: {
    tour: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      extrasVisible: false,
      localFilters: {},
      localDate: {},
      closed: true,
      selectedYear: {},
      childReductions: []
    }
  },

  computed: {
    build () {
      return this.$store.state.build
    },

    query () {
      const query = { tour: this.tour.slug }
      if (this.localFilters) {
        if (this.localFilters.boat) query.boat = this.localFilters.boat
        if (this.localFilters.guided !== '') query.guided = this.localFilters.guided
        if (this.localFilters.from) query.from = this.localFilters.from
        if (this.localFilters.nights) query.nights = this.localFilters.nights
      }

      if (this.localDate) query.date = this.localDate

      return query
    },

    tourSpecification () {
      let spec = this.filterBySeason(this.selectedYear.season_id, 'specifications')
      if (spec && spec.length > 0) {
        spec = spec[0]
      } else {
        spec = {}
      }
      return spec
    },

    tourSeasonBikes () {
      let seasonBikes = this.filterBySeason(this.selectedYear.season_id, 'bikes')
      return this.filterByNights(seasonBikes)
    },

    tourSeasonRoomExtras () {
      return this.filterBySeason(this.selectedYear.season_id, 'room_extras')
    },

    tourSeasonPartyExtras () {
      let seasonPartyExtras = this.filterBySeason(this.selectedYear.season_id, 'party_extras')
      return this.filterByNights(seasonPartyExtras)
    }
  },

  methods: {
    groupPrices (prices) {
      const groups = []

      prices.forEach(price => {
        price.name = this.build.rooms.find(r => r.id === price.room_type_id).name

        let accom_id = price.accommodation_category_id
        let group_id = accom_id
        if (price.deck_id) group_id += `-${price.deck_id}`

        let group = groups.find(g => g.id === group_id)
        if (! group) {
         groups.push(group = {
            id: group_id,
            name: this.build.accommodation.find(a => a.id === accom_id).name,
            deck: price.deck_id ? this.build.decks.find(d => d.id === price.deck_id).name : '',
            prices: []
          })
        }

        group.prices.push(price)
      })

      return groups
    },

    filterBySeason (season_id, key) {
      return this.tour[key].filter(item => item.tour_season_id == season_id)
    },

    filterByNights (items) {
      return items.filter(item => (0 === item.nights || this.localFilters.nights === item.nights ))
    },

    filtersChanged (filters) {
      this.localFilters = Object.keys(filters).reduce((current, key) => {
        if (filters[key].value !== '') current[key] = filters[key].value
        return current
      }, {})
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
        this.childReductions = [...new Set(this.tour.reductions.filter(r => r.tour_season_id == this.selectedYear.season_id).map(r => this.reduction(r)))]
      }
      this.localDate = date.date
    },

    reduction (r) {
      const saving = r.percent ? (r.percent === 100 ? 'Free' : (r.percent + '%')) : ('£' + r.cost)
      const { output_min: min, output_max: max, output_quantity: q } = r
      const output_quantity = q ? (q === 1 ? 'a child' : (q + ' children')) : 'children'
      const output_qualifier = !min ? ('up to ' + max) : (max ? `${min}-${max}` : 'over ' + min)
      let input = ''

      if (r.input_min || r.input_max) {
        input += ' sharing with '

        const quantity = r.input_quantity || 1
        const suffix = + quantity === 1 ? '' : 's'
        input += (quantity === 1 ? 'an' : quantity) + ' '

        if (r.input_min >= 13 && !r.input_max) {
          input += 'adult' + suffix
        } else {
          if (!r.input_min) {
            input += 'under ' + r.input_max + ' year old' + suffix
          } else {
            if (r.input_max) input += `${r.input_min}-${r.input_max} year old${suffix}`
            else input += 'over ' + r.input_min + ' year old' + suffix
          }
        }

      }

      return `${saving} for ${output_quantity} ${output_qualifier} years${input}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.secondary {
  background: $lightest;

  hr {
    border-color: #B8C5CA;
    margin: 10px 0 30px;
  }

  &__pricing {
    padding: 20px 15px;

    @include mq(40em) {
      padding: 25px 20px;
    }
  }

  &__cta {
    background: #E3EBEE;
    padding: 20px;

    h4 {
      margin-bottom: 16px;
    }

    h3 {
      margin-bottom: 5px;
    }

    small {
      font-size: 14px;
    }
  }

  @include mq(60em) {
    &__pricing,
    &__cta {
      padding: 30px 35px;
    }
  }
}

.tour-meta,
.feefo-rating {
  margin: 0 0 25px;
}

.check-prices {
  margin-top: 10px;
  color: $orange;
  text-decoration: underline;
  outline: none;

  @include mq(55em) {
    display: none;
  }
}

@include mq(55em, 'true') {
  .booking-button {
    width: calc(50% - 8px);
    padding: 10px 15px 11px;

    & + .button {
      margin-left: 15px;
    }

    span {
      display: none;
    }
  }

  .closed {
    display: none;
  }
}

.prices {
  padding-top: 15px;
  padding-bottom: 0;

  p {
    font-size: 14px;
  }
}

.border-top tbody tr:first-child > * {
  border-top: 1px solid $line;
  padding-top: 14px;
}

.border-bottom tbody tr:last-child > * {
  border-bottom: 1px solid $line;
  padding-bottom: 14px;
}

.extras table:first-child td {
  position: relative;
  cursor: pointer;
}

</style>
