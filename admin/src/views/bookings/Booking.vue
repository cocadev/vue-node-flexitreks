<template>
  <div v-if="booking">
    <booking-nav :booking="booking" />

    <dl>
      <dt>Summary:</dt> <dd>{{ operator_rooms}}, {{ operator_bikes }}, {{ operator_extras }}</dd>
      <dt>Booked:</dt> <dd>{{ formatDate(booking.createdAt, true) }}</dd>
      <dt>Arrival date:</dt> <dd>{{ formatDate(booking.holiday_start_date) }}</dd>
      <dt>Tour:</dt> <dd>{{ booking.tour.name }}</dd>
      <dt>Tour code:</dt> <dd>{{ booking.tour.tour_code }}</dd>
      <dt>Bike &amp; boat:</dt> <dd>{{ booking.tour.bike_and_boat ? 'True' : 'False' }}</dd>
      <dt>Status:</dt> <dd><span :class="`payment-status payment-status--${booking.status}`">{{ booking.status.replace('payment-', '') }}</span></dd>
      <dt>Operator:</dt> <dd>{{ operator }}</dd>
    </dl>

    <h3 v-if="summary">Variant: {{ summary }}</h3>

    <h3>Totals</h3>
    <dl>
      <dt>Customer cost:</dt> <dd>£{{ booking.total_cost }}</dd>
      <dt v-if="booking.net_at_booking">Net cost:</dt> <dd v-if="booking.net_at_booking">{{ currency }}{{ booking.net_at_booking }}</dd>
      <dt v-if="booking.rate_at_booking">Exchange rate:</dt> <dd v-if="booking.rate_at_booking">{{ booking.rate_at_booking }}</dd>
      <dt>&nbsp;</dt> <dd>&nbsp;</dd>
      <dt>Rooms:</dt> <dd>£{{ booking.total_rooms }}</dd>
      <dt>Bikes:</dt> <dd>£{{ booking.total_bikes }}</dd>
      <dt>Room extras:</dt> <dd>£{{ booking.total_room_extras }}</dd>
      <dt>Party extras:</dt> <dd>£{{ booking.total_party_extras }}</dd>
      <dt>Reductions:</dt> <dd>£{{ booking.total_reductions }}</dd>
      <dt>Offers:</dt> <dd>£{{ booking.total_offers }}</dd>
      <dt>Charges:</dt> <dd>£{{ booking.total_charges }}</dd>
      <dt>Deposit:</dt> <dd>£{{ booking.total_deposit }}</dd>
      <dt>Total at booking:</dt> <dd>£{{ booking.total_at_booking }}</dd>
      <dt>&nbsp;</dt> <dd>&nbsp;</dd>
      <dt>Paid so far:</dt> <dd>£{{ paid }}</dd>
      <dt>Outstanding:</dt> <dd>£{{ booking.total_cost - paid }}</dd>
      <dt>Balance due:</dt> <dd>{{ balance }}</dd>
    </dl>

    <hr>

    <h2>Customer</h2>

    <dl>
      <dt>Name:</dt> <dd>{{ booking.customer.title }} {{ booking.customer.first_name }} {{ booking.customer.last_name }}</dd>
      <dt>Email:</dt> <dd><a :href="`mailto:${booking.customer.email_address}?subject=Booking Reference: ${booking.booking_reference}`">{{ booking.customer.email_address }}</a></dd>
      <dt>Telephone:</dt> <dd>{{ booking.customer.telephone_number }}</dd>
      <dt>Telephone 2:</dt> <dd>{{ booking.customer.alternative_telephone_number }}</dd>
      <dt v-if="booking.customer.address_line_1">Address:</dt> <dd v-if="booking.customer.address_line_1">
        {{ booking.customer.address_line_1 }}<br>
        {{ booking.customer.address_line_2 }}<br v-if="booking.customer.address_line_2">
        {{ booking.customer.town }}<br>
        {{ booking.customer.county }}<br>
        {{ booking.customer.postcode }}<br>
        {{ booking.customer.country }}<br>
      </dd>
      <dt v-if="booking.comments">Comments:</dt> <dd v-if="booking.comments">
        {{ booking.comments }}
      </dd>
    </dl>
    <hr>

    <h2>Rooms</h2>

    <div v-for="(room, i) in booking.rooms" :key="'room_' + room.id">
      <dl>
        <dt>Room #{{ i + 1 }}</dt>
        <dd>{{ room.name }} - {{ room.category }}</dd>

        <template
          v-for="person in booking.party.filter(b => b.booking_room_id === room.id)"
        >
          <dt :key="'person_' + person.id">Name:</dt> <dd :key="'person_name_' + person.id">{{ person.title }} {{ person.first_name }} {{ person.last_name }}</dd>
        </template>
      </dl>
      <template v-if="room.extras.length">
        <h3>Extras for room #{{ i + 1 }}</h3>
        <dl
          v-for="extra in room.extras"
          :key="'extra_' + extra.id"
        >
          <dt>Name:</dt> <dd>{{ extra.post ? 'Post holiday' : 'Pre holiday' }} - {{ extra.name }}</dd>
          <dt>Cost:</dt> <dd>£{{ extra.cost }}</dd>
          <dt>Nights:</dt> <dd>{{ extra.quantity }}</dd>
          <dt>Type:</dt> <dd>{{ extra.room_name }} - {{ extra.category }}</dd>
        </dl>
        <br>
      </template>
    </div>

    <hr>

    <h2>Party: {{ booking.party.length }} {{ booking.party.length === 1 ? 'person' : 'people' }}</h2>

    <div v-for="person in booking.party" :key="'party_person_' + person.id">
      <h3>{{ person.title }} {{ person.first_name }} {{ person.last_name }}</h3>
      <dl>
        <dt>DoB:</dt> <dd>{{ formatDate(person.date_of_birth) }}</dd>
        <dt>Height:</dt> <dd>{{ person.height }}cm</dd>
        <template v-if="person.dietary_requirements"><dt>Diet:</dt> <dd>{{ person.dietary_requirements }}</dd></template>
        <dt>Bike:</dt> <dd v-html="person.tour_bike ? person.tour_bike.name : 'n/a'"></dd>
        <dt>Dietary Req.</dt> <dd>{{ person.dietary_requirements || 'None' }}</dd>
      </dl>
      <template v-if="person.extras.length">
        <h3>Extras for {{ person.first_name }} {{ person.last_name }}</h3>
        <dl
          v-for="extra in person.extras"
          :key="'extra_' + extra.id"
        >
          <dt>Name:</dt> <dd>{{ extra.name }}</dd>
          <dt>Cost:</dt> <dd>£{{ extra.cost }}</dd>
        </dl>
        <br>
      </template>
    </div>

    <hr>

    <h2>Payments</h2>

    <template
      v-for="payment in booking.payments"
    >
      <div :key="payment.id">
        <h3>Payment {{ payment.tx_code }} - <span :class="`payment-status payment-status--${payment.status}`">{{ payment.status }}</span></h3>
        <dl>
          <dt>Full Date:</dt><dd>{{ payment.createdAt }}</dd>
          <dt>Amount:</dt><dd>£{{ payment.amount }}</dd>
          <dt>Sagepay Ref:</dt><dd>{{ payment.sagepay_reference }}</dd>
          <dt v-if="payment.comment">Comment</dt><dd v-if="payment.comment">{{ payment.comment }}</dd>
        </dl>
        <hr>
      </div>
    </template>

    <hr>

    <h2>Operator template</h2>

    <pre style="max-width: 100%; white-space: pre-line;">
Dear {{ operator }},

Please find below the details of a new booking from Flexitreks. I would be very grateful if you could confirm this new booking at your earliest convenience.

Tour Name: {{ booking.tour.name_operator || booking.tour.name }}
Variant: {{ summary }}
Arrival Date: {{ formatDate(booking.arrival) }}
Lead name: {{ booking.customer.last_name }}
Pax: {{ booking.party.length }}
Accommodation: {{ operator_rooms }}
Bikes: {{ operator_bikes }}
Extras: {{ operator_extras }}

Customer details:
{{ operator_party }}
    </pre>

  </div>
</template>

<script>
import MetaBox from '@/components/MetaBox'
import BookingNav from '@/components/BookingNav'
import Thyme from '@trys/thyme'

export default {
  data () {
    return {
      booking: null,
      boats: [],
      operators: [],
      currencies: []
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    MetaBox,
    BookingNav
  },

  created () {
    this.fetchData()
  },

  computed: {
    summary () {
      let summary = []
      if (this.booking.filter_guided) summary.push('Guided')
      if (this.booking.filter_nights) summary.push(this.booking.filter_nights + ' nights')
      if (this.booking.filter_boat && this.boats.find(b => b.id === this.booking.filter_boat)) summary.push(this.boats.find(b => b.id === this.booking.filter_boat).name)

      return summary.join(', ')
    },

    operator_rooms () {
      const rooms = {}
      const allRooms = []

      this.booking.rooms.forEach(p => {
        if (!rooms[p.id]) rooms[p.id] = { name: p.name, category: p.category, count: 1 }
        else rooms[p.id].count++
      })

      Object.keys(rooms).forEach(key => allRooms.push(`${rooms[key].count}x ${rooms[key].name} (${rooms[key].category})`))

      return allRooms.length ? allRooms.join(', ') : 'No rooms required'
    },

    operator_bikes () {
      const bikes = {}
      const allBikes = []

      this.booking.party.forEach(p => {
        if (!p.tour_bike_id) return
        if (!bikes[p.tour_bike_id]) bikes[p.tour_bike_id] = { name: p.tour_bike.short_name, count: 1 }
        else bikes[p.tour_bike_id].count++
      })

      Object.keys(bikes).forEach(key => allBikes.push(`${bikes[key].count}x ${bikes[key].name}`))

      return allBikes.length ? allBikes.join(', ') : 'No bikes required'
    },

    operator_extras () {
      const room_extras = []
      const party_extras = []
      const extras = []

      this.booking.rooms.forEach(room => {
        if (!room.extras.length) return
        room_extras.push(...room.extras)
      })

      this.booking.party.forEach(p => {
        if (!p.extras.length) return
        party_extras.push(...p.extras)
      })

      if (!room_extras.length && !party_extras.length) return 'No extras required'

      room_extras.forEach(extra => extras.push(`${extra.quantity} extra ${extra.post ? 'post' : 'pre'} tour night`))

      const reduced_party_extras = party_extras.reduce((c, e) => {
        if (!c[e.tour_party_extra_variation_id]) c[e.tour_party_extra_variation_id] = { name: e.name, count: 1 }
        else c[e.tour_party_extra_variation_id].count++
        return c
      }, {})
      Object.keys(reduced_party_extras).forEach(key => extras.push(`${reduced_party_extras[key].count}x ${reduced_party_extras[key].name}`))

      return extras.join(', ')
    },

    operator_party () {
      return this.booking.party.map(p => {
        return `${p.title} ${p.first_name} ${p.last_name} ${this.formatDate(p.date_of_birth)} – ${p.height}cm – ${p.dietary_requirements || 'no dietary requirements'}`
      }).join('\n')
    },

    operator () {
      const operator = this.operators.find(o => o.id === this.booking.tour.operator_id)
      return operator ? operator.name : 'Sir/Madam'
    },

    currency () {
      if (!this.currencies.length || !this.booking) return ''
      const currency = this.currencies.find(x => x.id === this.booking.currency_id)
      return currency ? currency.symbol : ''
    },

    paid () {
      return this.booking.payments
        .filter(x => x.status === 'completed')
        .reduce((c, p) => c + p.amount, 0)
    },

    balance () {
      const date = new Thyme(this.booking.arrival)
      date.remove(this.booking.tour.balance_due)
      return date.format()
    }
  },

  methods: {
    fetchData () {
      this.axios.get('boats')
        .then(res => {
          this.boats = res.data
        })

      this.axios.get('operators')
        .then(res => {
          this.operators = res.data
        })

      this.axios.get(`bookings/${this.id}`)
        .then(res => {
          this.booking = res.data
          console.log(this.booking)
        })

      this.axios.get('currencies')
        .then(res => {
          this.currencies = res.data
        })
    },

    formatDate (d, time = false) {
      const date = new Date(d)
      let dateString = `${date.getDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]} ${date.getFullYear()}`
      if (!time) return dateString

      const double = digit => digit <= 9 ? '0' + digit : digit
      dateString += ` ${double(date.getHours())}:${double(date.getMinutes())}`
      return dateString
    }
  }
}
</script>
