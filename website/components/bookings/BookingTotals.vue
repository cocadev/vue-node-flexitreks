<template>
  <div class="totals">
    <h4>Your booking summary</h4>
    <hr>
    <h3>{{ tour.name }}</h3>
    <template
      v-if="date"
    >
      <div>{{ format( date.date ) }} for {{ nights }} nights</div>
      <hr>
      <template
        v-if="rooms.find(r => r.price)"
      >
        <table>
          <thead>
            <tr>
              <th>{{ tour.bike_and_boat ? 'Cabins' : 'Rooms' }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="room in rooms"
              v-if="room.price"
              :key="room.id"
            >
              <td>
                {{ build.rooms.find(r => r.id === room.price.room_type_id).name }} - {{ build.accommodation.find(a => a.id === room.price.accommodation_category_id).name }}
                <template v-if="room.price.deck_id !== undefined"> - {{ build.decks.find(d => d.id === room.price.deck_id).name }} deck</template>
              </td>
              <td>{{ cost(room.chargeable * build.rooms.find(r => r.id === room.price.room_type_id).sleeps) }}</td>
            </tr>
          </tbody>
        </table>
        <p
          v-if="soloBookingsDisabled"
          class="no-single-bookings">No single bookings are allowed on this tour</p>
      </template>

      <template v-if="bikes.length">
        <table>
          <thead>
            <tr>
              <th>Bike hire</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="bike in bikes"
              :key="bike.name"
            >
              <td v-html="`${bike.short_name || bike.name} x${bike.quantity}`" />
              <td>{{ cost(bike.cost) }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <template v-if="upgrades.length">
        <table>
          <thead>
            <tr>
              <th>Optional extras</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="upgrade in upgrades"
              :key="upgrade.id"
            >
              <td v-if="upgrade.quantity">{{ upgrade.name }} x{{ upgrade.quantity }}</td>
              <td v-else>{{ upgrade.name }}</td>
              <td>{{ cost(upgrade.total) }}</td>
            </tr>
          </tbody>
        </table>
      </template>

      <div
        v-if="charges"
        class="total-row"
      >
        <table>
          <tr>
            <td>Agreed additional costs</td>
            <td>{{ cost(charges) }}</td>
          </tr>
        </table>
      </div>

      <div
        v-if="reductions"
        class="total-row"
      >
        <table>
          <thead>
            <tr>
              <th>Child reductions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Child reductions are not calculated in online quotes.<br>
                <a
                  href="/contact"
                  class="contact"
                  target="_blank">Contact us directly</a> if you are travelling with children.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="offers"
        class="total-row"
      >
        <table>
          <tr>
            <td>Offers</td>
            <td>- {{ cost(offers) }}</td>
          </tr>
        </table>
      </div>

      <template v-if="total">

        <div class="total-row final-total">
          <table>
            <tr>
              <td><strong>Total</strong></td>
              <td><strong>{{ cost(Math.round(total)) }}</strong></td>
            </tr>
          </table>
        </div>

        <div
          v-if="balance === true"
          class="total-row"
        >
          As this provisional booking commences in less than {{ tour.balance_due }} days, full payment will be required immediately.
        </div>
        <div
          v-else-if="balance !== null && deposit"
          class="total-row deposit"
        >
          <table>
            <tr>
              <td><strong>Deposit payable today:</strong></td>
              <td><strong>{{ cost(deposit) }}</strong></td>
            </tr>
            <tr>
              <td colspan="2">Remaining balance of <strong>{{ cost(total - deposit) }}</strong> is payable by <strong>{{ balance.replace(/\s/g, '&nbsp;') }}</strong></td>
            </tr>
          </table>
        </div>

        <p
          v-if="soloBookingsDisabled"
          class="no-single-bookings">No single bookings are allowed on this tour</p>
        <button

          :disabled="soloBookingsDisabled"
          type="submit"
          class="button button--grey button--wide"
          form="booking"
          @click.prevent="$emit('submit')"
        >Review &amp; book</button>

      </template>

    </template>

  </div>
</template>

<script>
import Thyme from '@trys/thyme'
import currency from '@/mixins/currency'

export default {
  mixins: [currency],

  props: {
    rooms: {
      type: Array,
      required: true
    },
    date: {
      type: [Object, String],
      required: true
    },
    nights: {
      type: [Number, String],
      required: true
    },
    bikes: {
      type: Array,
      default() {
        return []
      }
    },
    balance: {
      type: [String, Boolean],
      default () {
        return null
      }
    },
    upgrades: {
      type: Array,
      default () {
        return []
      }
    },
    reductions: {
      type: Boolean,
      default () {
        return false
      }
    },
    offers: {
      type: Number,
      default () {
        return 0
      }
    },
    total: {
      type: Number,
      default () {
        return 0
      }
    },
    deposit: {
      type: Number,
      default () {
        return 0
      }
    },
    charges: {
      type: Number,
      default () {
        return 0
      }
    }
  },

  computed: {
    tour() {
      return this.$store.state.tour
    },

    build () {
      return this.$store.state.build
    },

    soloBookingsDisabled () {
      if (this.tour.solo_cyclists_allowed) return false
      if (! this.tour.solo_cyclists_allowed && this.rooms.length == 1) return true
      return false
    }
  },

  methods: {
    format (d) {
      const date = new Thyme(d)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.totals {
  font-size: 0.875em;

  h3 {
    font-size: 1.142em;
    margin-bottom: 0.625em;
  }

  thead th {
    padding-bottom: 0;
    padding-top: 0;
  }

  hr {
    margin: 20px 0 14px;
  }

  table {
    width: 100%;
    text-align: left;
    table-layout: auto;
    margin-bottom: 0;

    & + table {
      margin-top: 4px;
    }
  }

  td {
    padding: 2px 0;
  }

  td:last-child:not(:first-child) {
    text-align: right;
  }
}

.final-total {
  color: $dark;
}

.deposit tr:first-child > * {
  padding-bottom: 8px;
}

.no-single-bookings {
  color: red;
  font-weight: bold;
}

button:disabled,
button[disabled]{
  background-color: #cccccc;
  color: #666666;
  cursor: default;
}

a.contact {
  color: #F88F2B;
}

</style>
