<template>
  <div class="room-extra-variation">
    <div class="room-extra-variation__primary">
      <m-date-picker v-model="price.start" label="Start" :multi="false" />
      <m-date-picker v-model="price.end" label="End" :multi="false" />
      <f-select v-model="price.room_type_id" :name="`variation_${price.id}_room_type_id`" label="Room Type">
        <option value="">Pick a room</option>
        <option v-for="r in rooms" :key="r.name" :value="r.id">{{ r.name }}</option>
      </f-select>
      <f-select v-model="price.accommodation_category_id" :name="`variation_${price.id}_ac`" label="Accommodation">
        <option value="">Pick accommodation category</option>
        <option v-for="r in ac" :key="r.name" :value="r.id">{{ r.name }}</option>
      </f-select>
      <m-date-picker v-model="price.restricted_dates" label="Restricted Dates" :multi="true" />
      <m-date-picker v-model="price.specific_dates" label="Specific Dates" :multi="true" />
      <f-daypicker v-model="price.restricted_days" label="Restricted Days" />
      <button type="button" class="remove-circle" @click="$emit('removePrice')" />
    </div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Gross</th>
          <th>Non-com</th>
          <th>Commision</th>
          <th>Net</th>
          <th>Subtotal</th>
          <th>Adjustment</th>
          <th>Cost</th>
          <th>Profit</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="pgt-id">{{ price.id }}</td>
          <gross-price
            :formula="price.formula"
            :value="price.gross"
            :idx="price.id"
            :prices="prices"
            @formula="price.formula = $event"
            @input="$emit('update', [price.id, { target: { value: $event } }, 'gross'])"
          />
          <td>
            <input :value="price.non_com" @input="$emit('update', [price.id, $event, 'non_com'])" type="number" class="non-com">
          </td>
          <td>
            <select :value="price.markup_rate_id" @input="$emit('update', [price.id, $event, 'markup_rate_id'])">
              <option value="">Commission</option>
              <option
                v-for="rate in seasonData.model.rates"
                :key="rate.id"
                :value="rate.id"
              >{{ rate.commission }}% - &times;{{ rate[markupType] }}</option>
            </select>
          </td>
          <td>
            <output>{{ format(price.net) }}</output>
          </td>
          <td>
            <output>{{ format(subtotal) }}</output>
          </td>
          <td>
            <input :value="price.adjustment" @input="$emit('update', [price.id, $event, 'adjustment'])" type="number" class="adjustment">
          </td>
          <td>
            <output><strong>{{ price.cost }}</strong></output>
          </td>
          <td>
            <output>{{ profit }}</output>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import pricing from '../../mixins/pricing'
import FInput from '../FInput'
import FSelect from '../FSelect'
import mDatePicker from '../MultiDatePicker'
import FDaypicker from '../FDaypicker'

export default {
  components: {
    FInput,
    FSelect,
    mDatePicker,
    FDaypicker
  },

  mixins: [pricing],

  props: {
    ac: Array,
    rooms: Array,
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
  }
}
</script>
