<template>
  <div class="wrap pad-top pad-bottom">
    <header class="center">
      <h4>Payments</h4>
      <h1>Make a payment</h1>
      <p>Please fill in the form below to make a payment towards your cycling holiday.</p>
    </header>
    <div class="wrap wrap--thin pad-top pad-bottom">
      <form
        class="form-style"
        @submit.prevent="submit"
      >
        <f-input
          id="payment_booking_reference"
          v-model="booking_reference"
          type="text"
          label="Booking Reference"
          required="true"
        />
        <f-input
          id="payment_amount"
          v-model="amount"
          type="number"
          min="0"
          label="Payment Amount (£)"
          required="true"
        />
        <f-textarea
          id="payment_comment"
          v-model="comment"
          label="Comments (optional)"
        />
        <p class="group">
          <button
            :disabled="sent"
            type="submit"
            class="button"
          >{{ sent ? 'Sending you to SagePay' : 'Make payment via SagePay' }}</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
import FInput from '@/components/bookings/BookingInput'
import FTextarea from '@/components/bookings/BookingTextarea'

export default {
  components: {
    FInput,
    FTextarea
  },

  data () {
    return {
      booking_reference: null,
      amount: null,
      comment: null,
      sent: false
    }
  },

  methods: {
    async submit () {
      try {
        this.sent = true;
        const { data } = await this.$axios.post('payments', {
          booking_reference: this.booking_reference,
          amount: this.amount,
          comment: this.comment
        })
        window.location.href = data.url;
      } catch (e) {
        this.sent = false;
        this.$router.push({ name: 'payments-failure' })
      }
    }
  },

  head () {
    const title = 'Payments'
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

.button {
  opacity: 1;

  &[disabled] {
    opacity: 0.2;
    background: $dark;
    cursor: wait;
  }
}
</style>
