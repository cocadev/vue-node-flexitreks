<template>
  <div class="datepicker-container">
    <select
      :value="value"
      :disabled="isDisabled"
      @input="$emit('input', $event.target.value)"
    >
      <option value="">{{ !dates.length ? 'No dates with selected options' : 'Arrival date' }}</option>
      <option
        v-for="arrival in dates"
        :key="arrival.date.toString()"
        :value="JSON.stringify(arrival)"
      >{{ arrival.date.format() }}</option>
    </select>
    <span
      v-show="!isDisabled"
      :class="{
        cover: true,
        open
      }"
      @click="open = !open"
    />
    <small
      v-if="$route.name === 'booking'"
      class="extra-night-label"
    >Exclusive of any extra nights</small>
    <div
      v-show="open && !isDisabled"
      ref="datepicker"
      class="datepicker"
    >
      <nav>
        <div
          v-for="(months, year) in years"
          :key="`nav${year}`"
        >
          <strong @click="scrollTo(year)">{{ year }}</strong>
          <small
            v-for="(dates, month) in months"
            :key="`nav${year}${month}`"
            @click="scrollTo(year, month)"
          >{{ month_names[month].substring(0, 3) }}</small>
        </div>
      </nav>

      <div
        ref="datepickerMonths"
        class="months"
      >
        <div
          v-for="(months, year) in years"
          :key="year"
          :id="`picker_${year}`"
          class="year"
        >
          <div
            v-for="(dates, month) in months"
            :key="`${year}${month}`"
            :id="`picker_${year}${month}`"
            class="month"
          >
            <h4>{{ month_names[month] }} {{ year }}</h4>
            <header class="days">
              <span>Mo</span>
              <span>Tu</span>
              <span>We</span>
              <span>Th</span>
              <span>Fr</span>
              <span>Sa</span>
              <span>Su</span>
            </header>
            <template v-for="(date, index) in dates">
              <span
                :key="date.toString()"
                :class="{
                  invalid: !times.contains(date),
                  active: date.equals(time)
                }"
                @click="change(date)"
              >
                <i>{{ date.getDate() }}</i>
              </span>

              <template
                v-if="(index === dates.length - 1) && (daysInMonth(year, month) - date.getDate() > 0)"
              >
                <!-- Final month rmeaining dates -->
                <template
                  v-for="lastIndex in (daysInMonth(year, month) - date.getDate())"
                >
                  <span
                    :key="lastIndex"
                    class="invalid"
                  >
                    <i>{{ spacerDate(year, month, (lastIndex + date.getDate())) }}</i>
                  </span>
                  <br
                    v-if="!spacerDay(year, month, (lastIndex + date.getDate()))"
                    :key="`br_spacer_${lastIndex}`"
                  >
                </template>
              </template>

              <br
                v-if="!date.getDay()"
                :key="`br_${date.toString()}`"
              >
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Thyme from '@trys/thyme'
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    dates: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      open: false,
      month_names: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ]
    }
  },

  computed: {
    times () {
      return new Thyme().range(this.dates.map(d => d.date))
    },

    time () {
      return this.value ? new Thyme(JSON.parse(this.value).date) : ''
    },

    years () {
      if (!this.dates.length) return []
      return this.getDates(this.dates[0].date, this.dates[this.dates.length - 1].date).reduce((c, date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        if (!c[year]) c[year] = {}
        if (!c[year][month]) c[year][month] = []
        c[year][month].push(date)

        return c
      }, {})
    },

    isDisabled () {
      return !(!this.disabled && this.dates.length)
    }
  },

  watch: {
    open () {
      if (this.open) {
        setTimeout(() => {
          if (!this.$refs.datepicker) return
          const position = this.$refs.datepicker.getBoundingClientRect()
          const headerOffset = Number(window.getComputedStyle(document.body).paddingTop.replace('px', ''))
          const change = headerOffset - position.top + 20
          if (change === 0) return

          const newTop = window.pageYOffset - change;
          window.scrollTo.length ? window.scrollTo({
            top: newTop,
            behavior: 'smooth'
          }) : window.scrollTo(0, newTop)
        }, 100)
      }
    }
  },

  methods: {
    format (date) {
      return date.toString()
    },

    getDates (start, end) {
      return new Thyme(start).till(end)
    },

    daysInMonth (year, month) {
      // Total days in month can be got from 0 day of following month
      return new Date(year, parseInt(month) + 1, 0).getDate();
    },

    spacerDay (year, month, day) {
      return new Date(year, parseInt(month), parseInt(day)).getDay();
    },

    spacerDate (year, month, day) {
      return new Date(year, parseInt(month), parseInt(day)).getDate();
    },

    change (d) {
      const found = this.dates.find(date => d.equals(date.date))
      if (!found) return
      this.$emit('input', JSON.stringify(found))
      setTimeout(() => {
        this.open = false
      }, 150);
    },

    scrollTo(year, month) {
        this.$refs.datepickerMonths.scrollTop = document.querySelector(`#picker_${year}${month || ''}`).offsetTop - 40
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.datepicker-container {
  position: relative;
}

select {
  margin: 0;
  background: #FFF;
  font-size: 16px;
  padding-top: 14px;
  padding-bottom: 12px;
}

.cover {
  position: absolute;
  background: url('~/assets/images/calendar.svg') right 16px center no-repeat;
  height: 100%;
  width: 100%;
  cursor: pointer;
  left: 0;
  top: 0;

  &:after {
    position: fixed;
    content: '';
    z-index: 5;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    cursor: default;
    opacity: 0;
    visibility: hidden;
  }

  &.open:after {
    opacity: 1;
    visibility: visible;
  }
}

.extra-night-label {
  font-weight: 300;
  font-size: 11px;
  position: absolute;
  margin: 5px 0 0;
  top: 100%;
}

.datepicker {
  position: absolute;
  background: #FFF;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 100%;
  top: 100%;
  margin-top: 5px;
  font-weight: 500;
  max-height: calc(100vh - 85px);
  overflow: hidden;

  @include mq(40em) {
      min-height: 400px;
      max-height: calc(100vh - 180px);
  }
}

nav {
  display: none;
}

h4 {
  text-align: center;
}

.months {
  overflow: scroll;
  height: 100%;
  min-height: 400px;
  max-height: calc(100vh - 180px);
}

.month {
  text-align: right;
  font-size: 0;
  margin: 0 auto 20px;
  width: 260px;
  max-width: 100%;
  padding: 5px;

  br:last-of-type ~ * {
    float: left;
  }

  span {
    width: 14.285%;
    display: inline-block;
    font-size: 13px;
    text-align: center;
    position: relative;
    cursor: pointer;
  }

  > span {
    color: $orange;
  }

  .spacer {
    cursor: default;
    color: #C5CAD0;
    opacity: 0.5;
  }

  .invalid {
    text-decoration: line-through;
    cursor: not-allowed;
    color: #C5CAD0;

    &:after {
      content: '';
      background: #C5CAD0;
      position: absolute;
      width: 18px;
      left: 50%;
      height: 1px;
      transform: translateX(-50%) translateY(-50%);
      top: 50%;
    }
  }

  .active i {
    background-color: #F88F2B;
    color: #FFF;
  }

  i {
    width: 25px;
    height: 25px;
    display: block;
    font-style: normal;
    border-radius: 100%;
    padding-top: 2px;
    margin: 3px auto 2px;
  }

  &:after {
    content: '';
    display: table;
    clear: both;
  }

  .days {
    background: #F0F0F0;
    width: 100%;
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    padding: 5px 0;
    margin: 0 0 5px;

    span {
      font-size: 12px;
    }
  }
}

@include mq(400px) {
  .month {
    width: 308px;

    span {
      font-size: 15px;
    }

    i {
      padding-top: 6px;
      width: 35px;
      height: 35px;
    }
  }
}

@include mq(650px, 879px) {
  .year {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
    padding: 20px;

    .month {
      width: 100%;
      margin-bottom: 0;
    }
  }
}

@include mq(55em) {
  .datepicker {
    width: 440px;
    margin: 0 20px 0 0;
    right: 100%;
    top: -100px;
    padding: 40px 20px 20px 110px;
  }

  .cover.open {
    &:before {
      content: '';
      right: 100%;
      top: 15px;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 8px 0 8px 8px;
      border-color: transparent transparent transparent #ffffff;
      position: absolute;
      margin-right: 12px;
      z-index: 50;
    }
  }

  nav {
    display: block;
    position: absolute;
    border-right: 1px solid #F0F0F0;
    height: 100%;
    width: 80px;
    left: 0;
    top: 0;
    font-size: 11px;
    text-align: center;

    div {
      border-bottom: 1px solid #F0F0F0;
    }

    strong,
    small {
      display: block;
      padding: 7px 5px;
      cursor: pointer;
    }

    strong {
      background: #E3E3E3;
    }

    small {
      font-size: 1em;
      font-weight: 300;

      & + small {
        border-top: 1px solid #F0F0F0;
      }
    }
  }

  .months {
    max-height: calc(100vh - 220px);
  }
}
</style>
