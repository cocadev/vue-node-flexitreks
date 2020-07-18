<template>
  <div class="tour-date-picker">

    <div
      v-for="(filter, key) in filters"
      v-if="filter.options.length"
      :key="key"
      class="group"
    >
      <label
        :for="key"
        :class="{ 'screen-reader-only': $route.name !== 'booking' }"
      >{{ filter.placeholder }}</label>
      <select
        :id="key"
        :key="key"
        :value="filter.value"
        :disabled="!enabledFilters.includes(key)"
        @change="updateFilter(key, $event.target.value)"
      >
        <option value="">{{ filter.placeholder }}</option>
        <option
          v-for="f in filter.reducedOptions"
          :key="f.value"
          :value="f.value"
        >{{ f.name }}</option>
      </select>
    </div>


    <div
      :class="{
        space: true,
        error
      }"
    >
      <label
        :class="{ 'screen-reader-only': $route.name !== 'booking' }"
        for="startDate"
      >Arrival date</label>

      <f-datepicker
        :value="rawStartDate"
        :dates="arrivalDates"
        :disabled="arrivalDatesDisabled"
        @input="rawStartDate = $event"
      />

      <slot
        :prices="prices"
        :startDate="startDate"
        :balanceDue="balanceDue"
        :balanceDate="balanceDate"
      />
    </div>

  </div>
</template>

<script>
import Thyme from '@trys/thyme'
import FDatepicker from '../global/DatePicker'
export default {
  components: {
    FDatepicker
  },

  props: {
    tour:  {
      type: Object,
      required: true
    },

    defaultStartDate: {
      type: String,
      default () {
        return ''
      }
    }
  },

  data () {
    return {
      rawStartDate: '',
      balanceDue: 70,
      filters: {
        guided: {
          placeholder: 'Guided or Self Guided?',
          rule: n => n ? 'Guided' : 'Self Guided',
          options: [],
          reducedOptions: [],
          type: Boolean,
          value: ''
        },
        nights: {
          placeholder: 'For how long?',
          rule: n => `${n} nights`,
          options: [],
          reducedOptions: [],
          type: Number,
          value: ''
        },
        boat: {
          placeholder: 'Choose a boat',
          rule: n => this.boatNames ? this.boatNames[n] : n,
          options: [],
          reducedOptions: [],
          type: Number,
          value: ''
        },
        from: {
          placeholder: 'Which start point?',
          rule: n => n,
          options: [],
          reducedOptions: [],
          type: String,
          value: ''
        }
      }

    }
  },

  computed: {
    prices () {
      const prices = !this.startDate ? [] : this.tour.prices.filter(p => this.startDate.keys.includes(p.category))
      this.$emit('pricesChanged', prices)
      return prices
    },

    error () {
      return !!this.$store.state.form_errors.find(e => e === 'date')
    },

    boatNames () {
      if (!this.tour.boats) return null
      const names = {}
      this.tour.boats.forEach(b => {
        names[b.id] = b.name
      })
      return names
    },

    arrivalDates () {
      let dates = []
      this.tour.categories.forEach(category => {
        const key = Number(category.id)

        /*
        Loop the filters and check to see if any provide a false match to the
        current category settings, if so, get out of here.
        */
        const noMatchCategories = Object.keys(this.filters).filter(filter => {
          if (this.filters[filter].value === '') return false
          const catFilter = filter === 'boat' ? 'boat_id' : filter
          return category[catFilter] !== this.filters[filter].value
        });
        if (noMatchCategories.length) return

        const allDates = this.getDates(category)

        /*
        Get the time of allDates (as you can't compare date objects directly)
        Loop the restricted_dates and see if there's a match in allDates
        If so, delete it from the allDates array
        */
        if (category.restricted_dates) {
          category.restricted_dates.forEach(date => {
            const pos = allDates.contains(new Thyme(date))
            if (pos !== -1) {
              allDates.splice(pos, 1)
            }
          })
        }

        /*
        Loop the dates and check to see if we've already noted it,
        if so, update the keys array, if not, create the object
        */
        allDates.map(date => {
          const current = dates.findIndex(d => date.equals(d.date))
          if (current !== -1) {
            dates[current].keys.push(key)
          } else {
            dates.push({ date, keys: [key] })
          }
        })
      })

      dates.sort((a, b) => a.date.toString().split('-').join('') - b.date.toString().split('-').join(''))

      return dates
    },

    startDate () {
      const date = this.rawStartDate ? JSON.parse(this.rawStartDate) : ''
      this.$emit('dateChange', date)
      return date
    },

    balanceDate () {
      if (this.startDate) {
        const date = new Thyme(this.startDate.date)
        date.add(0 - this.balanceDue)
        const now = new Thyme()
        if (now > date) {
          return true
        } else {
          return date.format()
        }
      } else {
        return null
      }
    },

    arrivalDatesDisabled () {
      return !!Object.keys(this.filters).filter(key => {
        return this.filters[key].options.length && this.filters[key].value === ''
      }).length
    },

    enabledFilters () {
      const enabled = []

      if (this.filters.guided.options.length) enabled.push('guided')
      if (this.filters.nights.options.length && (!this.filters.guided.options.length || this.filters.guided.value !== '')) enabled.push('nights')
      if (this.filters.boat.options.length && (!this.filters.nights.options.length || this.filters.nights.value !== '')) enabled.push('boat')
      if (this.filters.from.options.length && (!this.filters.boat.options.length || this.filters.boat.value !== '')) enabled.push('from')

      return enabled
    }
  },

  mounted () {
    if (this.tour.balance_due) this.balanceDue = this.tour.balance_due

    /*
    Loop the categories, then the filters, creating a list of all unique
    possible values. Use the state->filters[key]->rule to show the name
    and use the raw value as the value
    */
    let firstFilterEnabled = false
    this.tour.categories.forEach(cat => {
      Object.keys(this.filters).forEach(key => {
        const catKey = key === 'boat' ? 'boat_id' : key
        if (cat[catKey] === undefined) return
        const filter = cat[catKey]
        if (this.filters[key].options.findIndex(a => a.value === filter) === -1) {
          this.filters[key].options.push({ name: this.filters[key].rule(filter), value: filter })
        }
      })
    })

    this.reduceFilters()

    if (this.defaultStartDate) {
      setTimeout(() => {
        this.setRaw(this.defaultStartDate);
      }, 10)
    }

  },

  methods: {
    setRaw(date) {
      const found = this.arrivalDates.find(d => d.date.equals(date))
      this.rawStartDate = found ? JSON.stringify(found) : ''
    },

    setFilter(key, value) {
      this.filters[key].value = value
    },

    getDates ({ start, end, restricted_days = [], specific_dates = [] }) {
      const today = new Thyme()
      if (specific_dates.length) {
        return new Thyme().range(new Thyme()
          .range(specific_dates)
          .filter(d => d >= today)
        )
      }

      return new Thyme().range(
        new Thyme(start)
          .till(end)
          .filter(d => {
            return d >= today && !restricted_days.includes(d.getDay())
          })
      )
    },

    updateFilter (key, value) {
      /* Assign the new value before we do anything else */
      const filter = this.filters[key]
      const type = filter.type
      filter.value = value === '' ? '' : (key === 'guided' ? value === 'true' : type(value))

      this.reduceFilters(key, value)
    },

    categoryMatchesFilters (category, filters) {
      /*
      Either find a category that has all filters or remove any category as
      soon as it doesn't have a match. If all filters 'don't not match', we
      have a match
      */
      return !filters.some(([key, value]) => {
        const catKey = key === 'boat' ? 'boat_id' : key
        return category[catKey] === undefined || category[catKey] !== value
      })
    },

    reduceFilters (key = '', value = '') {
      /* Helpers */
      const keysInUse = Object.keys(this.filters).filter(k => this.filters[k].options.length > 0)
      let filterSeen = false

      /*
      Grab the current state, ready to loop through all future possibilities
      */
      const currentState = Object.entries(keysInUse.reduce((current, k) => {
        if (this.filters[k].value !== '') current[k] = this.filters[k].value
        return current
      }, {}))

      keysInUse.forEach(filterKey => {
        /*
        If we're working with the current key, or we haven't seen the current key
        yet, stop the loop
        */
        const f = this.filters[filterKey]
        if (key) {
          if (filterKey === key) {
            filterSeen = true
            return
          } else if (!filterSeen) return

          if (value !== '') value = f.value
        }

        f.reducedOptions = f.options.filter(option => {
          const currentFilterIndex = currentState.findIndex(([k]) => k === filterKey)
          let state
          if (currentFilterIndex !== -1) {
            state = [...currentState]
            state[currentFilterIndex][1] = option.value
          } else {
            state = currentState.concat([[filterKey, option.value]])
          }
          return this.tour.categories.some(cat => {
            return this.categoryMatchesFilters(cat, state)
          })
        })

        if (f.value === '' && f.reducedOptions.length === 1) f.value = f.reducedOptions[0].value
      })

      this.$emit('filtersChanged', this.filters)

      if (this.startDate) {
        setTimeout(() => {
          this.setRaw(this.startDate.date)
        }, 10)
      }

    }
  }
}


</script>

<style lang="scss" scoped>
.tour-date-picker {
  padding-top: 11px;

  select {
    font-size: 16px;
    margin: 0 0 10px;
    padding-bottom: 14px;
    padding-top: 14px;
  }
}
</style>
