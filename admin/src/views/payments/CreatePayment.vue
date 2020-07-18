<template>
  <div>
    <header class="header">
      <h1>Record a payment</h1>
    </header>

    <form @submit="save" method="POST">
      <f-input label="Amount" name="amount" type="number" required />
      <f-input label="Transaction Code (optional)" name="tx_code" />
      <f-input label="SagePay Reference (optional)" name="sagepay_reference" />
      <f-select label="Booking" name="booking_id" required>
        <option value="">Pick a booking</option>
        <option
          v-for="booking in bookings"
          :key="booking.id"
          :value="booking.id"
        >{{ booking.booking_reference }} - {{ booking.tour_name }}</option>
      </f-select>

      <p>
        <label for="status">Status</label>
        <select name="status" id="status" required>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="aborted">Aborted</option>
        </select>
      </p>
      <input type="submit" class="button" value="Save">
    </form>
  </div>
</template>

<script>
import FInput from '../../components/FInput'
import FSelect from '../../components/FSelect'

export default {
  components: {
    FInput,
    FSelect
  },

  data () {
    return {
      bookings: []
    }
  },

  mounted () {
    this.axios.get('bookings')
      .then(res => {
        this.bookings = res.data
      })
  },

  methods: {
    save (e) {
      e.preventDefault()
      const { amount, booking_id, tx_code, sagepay_reference, status } = e.target
      this.axios.post('payments/booking', {
        amount: amount.value,
        booking_id: booking_id.value,
        tx_code: tx_code.value,
        sagepay_reference: sagepay_reference.value,
        status: status.value
      })
        .then(res => {
          this.$router.push({ name: 'payment', params: { id: String(res.data.id) } })
        })
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
