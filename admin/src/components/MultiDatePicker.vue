<template>
<!-- Multi-date-picker -->
  <div>
    <label>{{ label }}</label>
    <div v-click-outside="closePanel">
      <div class="selected-date" @click="panelShow = true">
        <div class="values-wrapper" v-if="multi">
          <input type="text" class="sel-values" v-for="(item, idx) in specificDates" :key="idx" :value="format(item)" @input="changeDate($event, idx)"/>
        </div>
        <input type="text" class="sel-value" v-else :value="selected ? format(selected) : ''" @input="changeDate">
      </div>
      <transition name="smooth">
        <div class="pick-panel" v-show="panelShow">
          <div class="dp-header">
            <div class="btn btn-link last-month" @click="changeMonth(-1)"></div>
            <div class="btn btn-link sele-month">
              {{[ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ][seleMonth]}}
            </div>
            <div class="btn btn-link sele-year">
              {{seleYear}}
            </div>
            <div class="btn btn-link next-month" @click="changeMonth(1)"></div>
          </div>
          <div class="days-of-week">
            <div class="cal-container">
              <div class="cal-item" v-for="day in daysOfWeek" :key="day">{{ day }}</div>
          </div>
          </div>
          <div class="dp-body">
            <div class="cal-container">
              <div
                class="cal-item"
                @click="toggleSelect(item)"
                v-for="(item,index) in renderCalendar" :key="index"
                :class="[item.iscur? 'cal-enable' : 'cal-disable', selectIndex(item) >= 0  ? 'cal-select' : '']"
              >
                {{item.label}}
              </div>
            </div>
          </div>
          <div class="dp-footer" v-show="multi">
            <div class="btn btn-cancel" @click="cancelSelect">{{display.cancel}}</div>
            <div class="btn btn-ok" @click="submitSelect(selected)">{{display.ok}}</div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Thyme from '@trys/thyme'

export default {
  name: 'mDatePicker',
  data () {
    return {
      panelShow: false,
      seleDate: new Thyme(),
      seleYear: new Thyme().getFullYear(),
      seleMonth: new Thyme().getMonth(),
      daysOfWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    }
  },
  props: {
    label: String,
    multi: {
      type: Boolean,
      default: true
    },
    value: {
      type: [Array, String, Date, Object],
      default () {
        return []
      }
    },
    disp: {
      type: Array,
      default: function () {
        return ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Year', 'Month', 'Cancel', 'Ok']
      }
    },
    defaultDate: {
      type: [String, Object],
      default: new Thyme().raw
    }
  },
  computed: {
    renderCalendar: function () {
      let firDay = 0 - (new Date(this.seleYear, this.seleMonth, 1).getDay())
      let res = []
      const double = digit => digit <= 9 ? '0' + digit : digit
      const firstDate = new Date(this.seleYear, this.seleMonth, firDay)
      const dateString = `${firstDate.getFullYear()}-${double(firstDate.getMonth() + 1)}-${double(firstDate.getDate())}`
      const d = new Thyme(dateString)

      for (let i = firDay, index = 0; index < 42; i++, index++) {
        let day = new Thyme(d.add())
        let calObj = {
          label: day.getDate(),
          date: day,
          iscur: day.getMonth() === this.seleMonth
        }
        res.push(calObj)
      }
      return res
    },
    selected: function () {
      return this.value
    },
    specificDates: function () {
      // Order specific dates
      let currValue = Object.keys(this.value).map(i => this.value[i])
      return currValue.sort(function (a, b) {
        var da = new Date(a.raw).getTime()
        var db = new Date(b.raw).getTime()
        return da < db ? -1 : da > db ? 1 : 0
      })
    },
    display: function () {
      var d = this.disp
      return {
        days: d.slice(0, 7),
        year: d[7],
        month: d[8],
        cancel: d[9],
        ok: d[10]
      }
    }
  },
  methods: {
    closePanel () {
      this.panelShow = false
    },
    format (date) {
      if (date instanceof Thyme) {
        const doubler = d => d <= 9 ? '0' + d : d
        return `${doubler(date.getDate())}/${doubler(date.getMonth() + 1)}/${date.getFullYear()}`
      } else if (typeof date === 'string') {
        return this.format(new Thyme(date))
      } else {
        return date
      }
    },
    selectIndex: function (item) {
      if (!this.multi || !this.selected) {
        return -1
      }
      for (let i = 0; i < this.selected.length; i++) {
        let selItem = !this.selected[i].raw ? new Thyme(this.selected[i]) : this.selected[i]
        if (selItem.equals(item.date)) {
          return i
        }
      }
      return -1
    },
    cancelSelect: function () {
      if (this.multi) {
        this.selected.splice(0, this.selected.length)
      } else {
        this.selected = null
      }
      this.panelShow = false
    },
    toggleSelect: function (item) {
      if (!this.multi) {
        this.submitSelect(item.date)
      } else {
        let index = this.selectIndex(item)
        if (index < 0) {
          this.selected.push(item.date)
        } else {
          this.selected.splice(index, 1)
        }
      }
    },
    submitSelect: function (value) {
      this.$emit('input', value)
      this.panelShow = false
    },
    changeMonth (num) {
      if (this.seleMonth + num > 11) {
        this.seleMonth = 0
        this.seleYear++
      } else if (this.seleMonth + num < 0) {
        this.seleMonth = 11
        this.seleYear--
      } else {
        this.seleMonth += num
      }
    },
    setSeleDate (value) {
      this.seleDate = !value.raw ? new Thyme(value) : value
      this.seleYear = this.seleDate.getFullYear()
      this.seleMonth = this.seleDate.getMonth()
    },
    formatAndValidate (date) {
      let dateArr = date.split('/')
      let validate = dateArr.map(item => {
        return item.length
      })
      if (validate.join('-') === '2-2-4') {
        return dateArr.reverse().join('-')
      } else {
        return ''
      }
    },
    changeDate (e, specific_idx) {
      let newDate = this.formatAndValidate(e.target.value)
      if (!newDate) return
      let newThymeDate = new Thyme(newDate)
      if (!this.multi) {
        this.$emit('input', newThymeDate.raw)
        this.setSeleDate(newDate)
      } else {
        let selected_idx = this.selectIndex({ date: this.specificDates[specific_idx] })
        if (this.selected.filter(date => date.raw === newDate).length > 0) return
        this.$set(this.selected, selected_idx, newThymeDate)
        this.setSeleDate(newDate)
      }
    }
  },
  mounted () {
    if (typeof this.value === 'string' && this.value) this.setSeleDate(this.value)
    if (Array.isArray(this.value) && this.value.length) this.setSeleDate(this.value[0])
    if (((typeof this.value === 'string' && !this.value) || (Array.isArray(this.value) && !this.value.length)) && this.defaultDate) {
      this.setSeleDate(this.defaultDate)
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/settings.scss';

.dp-mask{
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
}
.selected-date{
  cursor: pointer;
  min-height: 28px;
  padding: 3px 10px;
  border-radius: 3px;
  border: 1px solid $line;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  min-height: 46.5px;
}
.pick-panel{
  width: 280px;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #48576a;
  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 6px #ccc;
  background: #fff;
  border-radius: 2px;
  line-height: 20px;
  margin: 5px 0;
  z-index: 10;
}

.last-month:before{content: "<"}
.next-month:before{content: ">"}
.btn{cursor: pointer; padding: 3px; margin: 0 8px;}

.btn-link:hover{
  color: #61C3FF
}
.dp-header{
  display: flex;
}
.dp-footer{
  width: 90%;
  display: flex;
  justify-content: flex-end;
  padding: 8px;
  margin: 8px;
  border-top: 1px solid #daa
}

.cal-container{
  width: calc(7*34px);
  display: flex;
  flex-wrap: wrap
}

.cal-item{
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1px;
}
.cal-enable{
  cursor: pointer;
}
.cal-enable:hover{
  background-color: #E4E8F1;
}
.cal-disable{
  color: #d4d8d1;
  cursor: default
}
.cal-select{
  background-color: #61C3FF
}

.btn-ok{
  color: #61C3FF;
  /* font-weight: bold; */
  font-size: 1rem;
}

.values-wrapper {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}

input.sel-values{
  flex: 0 1 auto;
  border: 0;
  max-width: 76px;
  text-align: center;
  box-shadow: none;
  background-color: rgba(32,160,255,.1);
  border-color: rgba(32,160,255,.2);
  color: #20a0ff;
  height: 24px;
  line-height: 24px;
  box-sizing: border-box;
  font-size: 12px;
  margin: 3px!important;
  padding: 0 5px;
  border-radius: 3px;
}

input.sel-value {
  border: 0;
  box-shadow: none;
  padding: 0;
  margin: 0!important;
  width: 100%;
  height: 100%;
  min-height: 38px;
  font-size: 14px;
}

.smooth-enter-active {
  transition: all .5s ease-in-out;
}
.smooth-leave-active {
  transition: all .5s ease-in-out;
}
.smooth-enter, .smooth-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
