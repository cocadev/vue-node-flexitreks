import GrossPrice from '../components/pgt/gross-price'

export default {
  components: {
    GrossPrice
  },

  props: {
    price: Object,
    seasonData: {
      type: Object,
      required: true
    },
    prices: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      markupType: 'supplement_markup'
    }
  },

  computed: {
    rate () {
      return this.seasonData.model.rates.find(r => r.id === this.price.markup_rate_id)
    },

    commission () {
      return this.rate ? this.rate.commission / 100 : 0
    },

    net () {
      const net = ((this.price.gross - this.price.non_com) - ((this.price.gross - this.price.non_com) * this.commission) + this.price.non_com)
      const netCost = net <= this.price.non_com ? 0 : net
      this.$emit('update', [ this.price.idx || this.price.id, { target: { value: netCost } }, 'net', this.groupIdx ])
      return netCost
    },

    subtotal () {
      return this.rate ? (Math.ceil(this.net / this.seasonData.currency.rate * this.rate[this.markupType]) || 0) : 0
    },

    cost () {
      const cost = this.subtotal + this.price.adjustment || 0
      this.$emit('update', [ this.price.idx || this.price.id, { target: { value: cost } }, 'cost', this.groupIdx ])
      return cost
    },

    profit () {
      return Math.round(this.cost - this.net / this.seasonData.currency.rate)
    }
  },

  methods: {
    format (n) {
      if (!n) return 0
      return n.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  }
}
