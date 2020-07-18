<template>
  <div>
    <header class="header">
      <h1>Payments</h1>
      <router-link class="button" :to="{ name: 'payment-create' }">New</router-link>
    </header>

    <list-table :data="payments">
      <template slot="thead">
        <th>ID</th>
        <th>Date</th>
        <th>Amount</th>
        <th>Status</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'payment', params: { id: props.instance.id } }">
            {{ props.instance.tx_code }}
          </router-link>
        </td>
        <td>{{ props.instance.date }}</td>
        <td>£{{ props.instance.amount }}</td>
        <td><span :class="`payment-status payment-status--${props.instance.status}`">{{ props.instance.status }}</span></td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
import Thyme from '@trys/thyme'

export default {
  data () {
    return {
      payments: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get('payments')
      .then(res => {
        this.payments = res.data.map(payment => {
          const date = new Thyme(payment.createdAt)
          payment.date = date.format()
          return payment
        })
      })
  }
}
</script>
