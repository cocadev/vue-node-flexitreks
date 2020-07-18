import Thyme from '@trys/thyme'
import currency from '@/mixins/currency'

export default {
  async asyncData({ store }) {
    await Promise.all([
      store.dispatch('getBuild')
    ])
  },

  mixins: [currency],

  data() {
    return {
      booking: null,
      meta: null
    }
  },

  computed: {
    build() {
      return this.$store.state.build
    },

    arrival() {
      const start = new Thyme(this.booking.holiday_start_date)
      let extra_start = null
      const has_pre_extra = this.meta.rooms.find(r => r.extras.length && r.extras.find(e => e.arrival))
      if (has_pre_extra) extra_start = new Thyme(has_pre_extra.extras.find(e => e.arrival).arrival)

      return extra_start ? extra_start.format() + ' (extra nights)' : start.format()
    },

    departure() {
      const end = new Thyme(this.booking.holiday_start_date)
      end.add(this.meta.nights)

      let extra_departure = null
      const has_post_extra = this.meta.rooms.find(r => r.extras.length && r.extras.find(e => e.departure))
      if (has_post_extra) extra_departure = new Thyme(has_post_extra.extras.find(e => e.departure).departure)

      return extra_departure ? extra_departure.format() + ' (extra nights)' : end.format()
    },

    balance() {
      if (!this.meta) return ''
      const balance = this.meta.totals.balance
      if (balance === true) return balance
      const d = new Thyme(balance)
      return d.format()
    }
  },

  mounted() {
    let booking = localStorage.getItem('saved-booking')
    let meta = localStorage.getItem('saved-booking-meta')
    if (!booking || !meta) {
      this.booking = false
      return
    }

    try {
      booking = JSON.parse(booking)
      meta = JSON.parse(meta)
      this.booking = booking
      this.meta = meta
    } catch (e) {
      this.booking = false
    }

  },

  methods: {
    dob(date) {
      return new Thyme(date).format()
    },

    ft(n) {
      n = Number(n)
      var realFeet = ((n * 0.393700) / 12);
      var feet = Math.floor(realFeet);
      var inches = Math.round((realFeet - feet) * 12);
      return `${feet}ft ${inches}in`;
    }
  }
}