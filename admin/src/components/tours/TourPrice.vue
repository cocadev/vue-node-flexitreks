<template>
  <tr :class="['category__pricing', {'error': isError}]">
    <!-- <td class="pgt-id">{{ price.id }}</td> -->
    <td>
      <select class="room-select room" v-model="price.room_type_id" :name="`price_${price.idx}_room`">
        <option value="">Pick a Room</option>
        <option v-for="r in rooms" :key="r.name" :value="r.id">{{ r.name }}</option>
      </select>
    </td>
    <td>
      <select class="room-select" v-model="price.accommodation_category_id" :name="`price_${price.idx}_ac`">
        <option value="">Pick category</option>
        <option v-for="r in ac" :key="r.name" :value="r.id">{{ r.name }}</option>
      </select>
    </td>
    <td v-if="boat">
      <select v-model="price.deck_id" :name="`price_${price.idx}_deck`">
        <option value="">Pick a Deck</option>
        <option v-for="r in decks" :key="r.name" :value="r.id">{{ r.name }}</option>
      </select>
    </td>
    <gross-price
      :formula="price.formula"
      :value="price.gross"
      :idx="price.idx"
      :prices="prices"
      @formula="price.formula = $event"
      @input="$emit('update', [price.idx, { target: { value: $event } }, 'gross', groupIdx])"
    />
    <td>
      <input :value="price.non_com" @input="$emit('update', [price.idx, $event, 'non_com', groupIdx])" type="number" class="non-com">
    </td>
    <td>
      <select :value="price.markup_rate_id" @input="$emit('update', [price.idx, $event, 'markup_rate_id', groupIdx])">
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
      <input :value="price.adjustment" @input="$emit('update', [price.idx, $event, 'adjustment', groupIdx])" type="number" class="adjustment">
    </td>
    <td>
      <output><strong>{{ price.cost }}</strong></output>
    </td>
    <td>
      <output>{{ profit }}</output>
      <button type="button" class="remove-circle" @click="$emit('removePrice')"/>
    </td>
  </tr>
</template>

<script>
import pricing from '../../mixins/pricing'

export default {
  props: {
    boat: Boolean,
    decks: Array,
    ac: Array,
    rooms: Array,
    errorPriceId: String,
    groupIdx: Number
  },

  mixins: [pricing],

  data () {
    return {
      markupType: 'markup'
    }
  },
  computed: {
    isError () {
      return this.errorPriceId && this.price.ids.length ? Object.values(this.price.ids).indexOf((this.errorPriceId) * 1) > -1 : false
    }
  }
}
</script>

<style scoped>
.error td{
  background-color: #ff9b9b;
}
</style>
