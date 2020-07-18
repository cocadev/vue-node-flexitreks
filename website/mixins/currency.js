export default {
  methods: {
    cost(n) {
      return n.toLocaleString('en', {
        style: 'currency',
        currency: 'GBP',
        currencyDisplay: 'symbol',
        minimumFractionDigits: 0
      })
    }
  }
}
