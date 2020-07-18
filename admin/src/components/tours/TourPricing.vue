<template>
  <div class="tour-categories js-pgt">
    <div v-for="(group, i) in value" :key="i * 13" class="category-group">
      <div class="related-dates">
        <div class="related-date" v-for="(date, j) in group.relatedCats" :key="date.category_id">
          <m-date-picker v-model="date.start" label="Start" :multi="false" />
          <m-date-picker v-model="date.end" label="End" :multi="false" />
          <button type="button" class="button-subtle" @click="$emit('removeCategories', i, j)">Remove dates</button>
        </div>
        <button type="button" class="button-subtle" @click="$emit('addCategory', i)">Add new dates</button>
      </div>
      <div class="category__fields">
        <f-input v-model="group.nights" :name="`category_${i * 13}_nights`" type="number" label="Nights" />

        <f-select v-model="group.boat_id" :name="`category_${i * 13}_boat_id`" label="Boat">
          <option value="">Pick a boat</option>
          <option v-for="b in boats" :key="b.name" :value="b.id">{{ b.name }}</option>
        </f-select>

        <f-select v-model="group.tour_route_id" :name="`category_${i * 13}_route`" label="Route">
          <option value="">Pick a route</option>
          <option v-for="r in routes" :key="r.name" :value="r.id">{{ r.name }}</option>
        </f-select>

        <f-select v-model="group.guided" :name="`category_${i * 13}_guided`" label="Guidance">
          <option :value="null">Guidance</option>
          <option :value="false">Self-Guided</option>
          <option :value="true">Guided</option>
        </f-select>

        <m-date-picker v-model="group.restricted_dates" label="Restricted Dates" :multi="true" :defaultDate="group.relatedCats[0].start" />
        <m-date-picker v-model="group.specific_dates" label="Specific Dates" :multi="true" :defaultDate="group.relatedCats[0].start" />

        <f-daypicker v-model="group.restricted_days" label="Restricted Days" />
      </div>
      <table class="category__prices">
        <thead>
          <tr>
            <!-- <th>ID</th> -->
            <th>Room</th>
            <th>Accom.</th>
            <th v-if="group.boat_id">Deck</th>
            <th>Gross <small>{{ seasonData.currency.symbol }}</small></th>
            <th>Non-com</th>
            <th>Commission</th>
            <th>Net</th>
            <th>Subtotal</th>
            <th>Adjustment</th>
            <th>Cost</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          <tour-price
            v-for="(price, j) in group.prices"
            :key="price.idx || `price_${i * 13}_${j * 13}`"
            :price="price"
            :boat="!!group.boat_id"
            :decks="decks"
            :ac="ac"
            :rooms="rooms"
            :prices="prices"
            :errorPriceId=errorPriceId
            :seasonData="seasonData"
            @removePrice="$emit('removePrice', { group: i, price: j })"
            @update="update"
            :groupIdx = i
          />
        </tbody>
        <tfoot>
          <tr>
            <td colspan="100%">
              <button type="button" class="button-subtle" @click="$emit('addPrice', i)">Add Price</button>
              <!-- <button type="button" class="button-subtle" @click="$emit('duplicateGroup', i)">Duplicate Group</button> -->
              <button type="button" class="button-subtle button-subtle--right" @click="$emit('removeCategories', i)">Remove Group</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <button type="button" class="button-subtle" @click="$emit('addGroup')">Add Group</button>
  </div>
</template>

<script>
import FInput from '../FInput'
import FSelect from '../FSelect'
import mDatePicker from '../MultiDatePicker'
import FDaypicker from '../FDaypicker'
import TourPrice from './TourPrice'

export default {
  props: {
    value: Array,
    rooms: Array,
    ac: Array,
    boats: Array,
    decks: Array,
    routes: Array,
    seasonData: Object,
    errorPriceId: String
  },

  components: {
    FInput,
    FSelect,
    mDatePicker,
    FDaypicker,
    TourPrice
  },

  computed: {
    prices () {
      const prices = []
      this.value.forEach(c => {
        c.prices.forEach(p => prices.push(p))
      })
      return prices
    }
  },

  methods: {
    update ([ priceIdx, value, key, groupIdx ]) {
      if ((!priceIdx && priceIdx !== 0) || (!groupIdx && groupIdx !== 0)) return
      this.value[groupIdx].prices[priceIdx][key] = Number(value.target.value)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.category-group {
  margin: 0 0 50px;
  border: 1px solid $light;

  .related-dates {
    background: $light;
    padding: 20px;

    .related-date {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .button-subtle {
        margin-top: 26px;
        margin-left: 10px;
        border: transparent;
      }

      &:last-child {
        margin-bottom: -20px;
      }

      &>div:first-child {
        margin-right: 20px;
      }
    }

    .button-subtle {
      color: #586678;
    }

    .selected-date {
      background: #FFF;
    }
  }
}

.category__fields {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 20px;
  background: $light;
  padding: 20px;

  .selected-date {
    background: #FFF;
  }

  input,
  select,
  p {
    margin: 0;
  }

  .daypicker {
    grid-column: span 4;

    div {
      display: flex;
      padding-top: 12px;

      label + label {
        margin-left: 15px;
      }
    }
  }
}

.category__prices {
  padding: 20px;

  input,
  select,
  p{
    margin: 0;
  }

  th,
  td {
    padding: 10px;
  }

  input,
  select {
    margin: 0;
    font-size: 14px;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 5px;
  }

  select {
    background-position: right 0.25rem center;
    background-size: 10px;
    padding-right: 18px;
    min-width: 100px;
  }

  [type="number"] {
    width: 70px;
  }

  .room-select {
    width: 120px;
  }

  [disabled] {
    cursor: not-allowed;
    border-color: transparent;
    background: transparent;
  }

  .remove-circle {
    top: 19px;
    right: 2px;
  }
}

.category__pricing td:last-child {
  position: relative;
  padding-right: 30px;
}

</style>
