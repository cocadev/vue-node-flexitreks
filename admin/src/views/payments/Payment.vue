<template>
  <div v-if="payment">
    <header class="header">
      <h1>Payment {{ payment.tx_code }}</h1>
      <span :class="`payment-status payment-status--${payment.status}`">{{ payment.status }}</span>
    </header>
    <dl>
      <dt>Full Date:</dt><dd>{{ payment.date }}</dd>
      <dt>Amount:</dt><dd>£{{ payment.amount }}</dd>
      <dt>Sagepay Ref:</dt><dd>{{ payment.sagepay_reference }}</dd>
      <dt v-if="payment.comment">Comment:</dt><dd v-if="payment.comment">{{ payment.comment }}</dd>
    </dl>
  </div>
</template>

<script>
import Thyme from '@trys/thyme'

export default {
  data () {
    return {
      payment: {}
    }
  },

  props: {
    id: {
      type: [String]
    }
  },

  created () {
    this.axios.get(`payments/${this.id}`)
      .then(res => {
        this.payment = res.data
        const date = new Thyme(this.payment.createdAt)
        this.payment.date = date.format()
      })
  }
}
</script>
