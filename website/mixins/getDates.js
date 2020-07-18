import Thyme from '@trys/thyme'

export default {
  methods: {
    getExtraVariationDates(variation) {
      let specific_dates = variation.specific_dates || []
      let restricted_days = variation.restricted_days || []
      let restricted_dates = new Thyme().range(variation.restricted_dates || [])
      let dates = []

      if (specific_dates.length) {
        dates = specific_dates.map(d => new Thyme(d))
      } else {
        dates = new Thyme(variation.start).till(variation.end).filter(d => {
          return !restricted_days.includes(d.getDay()) && !restricted_dates.contains(d)
        })
      }

      return new Thyme().range(dates)
    }
  }
}
