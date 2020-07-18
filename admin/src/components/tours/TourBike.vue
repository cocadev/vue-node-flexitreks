<template>
  <div class="bike">
    <div class="bike__primary">
      <div>
        <label>Order</label>
        <input v-model="price.order" :name="`bike_${price.id}_order`" type="number" />
      </div>
      <div>
        <label>Bike</label>
        <select v-model="price.bike_id" :name="`bike_${price.id}_id`" label="Bike">
          <option value="">Pick a bike</option>
          <option v-for="b in allBikes" :key="b.name" :value="b.id">{{ b.name }}</option>
        </select>
      </div>
      <div>
        <label>Nights (optional)</label>
        <input v-model="price.nights" :name="`bike_${price.id}_nights`" type="number" />
      </div>
      <div>
        <label>Gallery</label>
        <gallery-picker
          :value="price.gallery_id"
          :gallery="price.gallery"
          @change="price.gallery_id = $event"
          @changeGallery="price.gallery = $event"
        />
      </div>
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
            <button type="button" class="remove-circle" @click="$emit('removePrice')"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import pricing from '../../mixins/pricing'
import GalleryPicker from '../GalleryPicker'

export default {
  components: {
    GalleryPicker
  },

  props: {
    allBikes: Array,
    boats: Array
  },

  mixins: [pricing],

  data () {
    return {
      markupType: 'supplement_markup'
    }
  }
}
</script>
