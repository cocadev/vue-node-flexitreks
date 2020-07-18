<template>
  <currency-form v-model="currency" />
</template>

<script>
import CurrencyForm from '@/components/forms/CurrencyForm'
export default {
  data () {
    return {
      currency: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    CurrencyForm
  },

  created () {
    this.axios.get(`currencies/${this.id}`)
      .then(res => {
        this.currency = res.data
      })
  }
}
</script>
