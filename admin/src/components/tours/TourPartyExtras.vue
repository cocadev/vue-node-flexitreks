<template>
  <div class="tour-extras js-pgt">
    <div v-for="(extra, i) in value" :key="extra.id || (i * 13)" class="party-extra-group">
      <header>
        <f-input v-model="extra.name" :name="`extra_${extra.id}_name`" label="Name" />
        <f-select v-model="extra.guidance" :name="`extra_${extra.id}_guidance`" label="Guidance" class="guidance">
          <option :value="0">Self-Guided</option>
          <option :value="1">Guided</option>
          <option :value="2">Self Guided/Guided</option>
        </f-select>

        <f-select v-model="extra.boat_id" :name="`extra_${extra.id}_boat_id`" label="Boat" class="boat-select">
          <option value="0">Pick a boat</option>
          <option v-for="b in boats" :key="b.name" :value="b.id">{{ b.name }}</option>
        </f-select>

        <div class="supp-nights">
          <label>Nights <small>(optional)</small></label>
          <input v-model="extra.nights" :name="`extra_${extra.id}_nights`" type="number" />
        </div>

        <f-input v-model="extra.order" :name="`extra_${extra.id}_order`" label="Order" type="number" class="order" />

        <button type="button" class="button-subtle button-subtle--right" @click="$emit('removeExtra', i)">Remove Extra</button>
      </header>
      <div class="extra__variations">
        <TourPartyExtraVariation
          v-for="(price, j) in extra.variations"
          :key="price.id || `variation_${extra.id || i * 13}_${j * 13}`"
          :price="price"
          :ac="ac"
          :bikes="bikes"
          :seasonData="seasonData"
          :prices="prices"
          @removePrice="$emit('removeVariation', { cat: i, variation: j })"
          @update="update"
        />
        <div>
          <button type="button" class="button-subtle" @click="$emit('addVariation', i)">Add variation</button>
        </div>
      </div>
    </div>
    <button type="button" class="button-subtle" @click="$emit('addExtra')">Add Extra</button>
  </div>
</template>

<script>
import FInput from '../FInput'
import FSelect from '../FSelect'
import TourPartyExtraVariation from './TourPartyExtraVariation'

export default {
  props: {
    value: Array,
    ac: Array,
    bikes: Array,
    boats: Array,
    seasonData: Object
  },

  components: {
    FInput,
    FSelect,
    TourPartyExtraVariation
  },

  computed: {
    prices () {
      const prices = []
      this.value.forEach(c => {
        c.variations.forEach(p => prices.push(p))
      })
      return prices
    }
  },

  methods: {
    update ([ id, value, key ]) {
      let catIndex = -1
      let priceIndex = -1
      this.value.forEach((cat, i) => {
        const index = cat.variations.findIndex(p => p.id === id)
        if (index !== -1) {
          priceIndex = index
          catIndex = i
        }
      })

      if (priceIndex === -1 || catIndex === -1) return

      this.value[catIndex].variations[priceIndex][key] = Number(value.target.value)
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.extra__variations {
  padding: 20px;

  td {
    padding: 8px;

    input,
    select {
      font-size: 14px;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-left: 5px;
    }

    select {
      background-position: right 0.25rem center;
      background-size: 10px;
      padding-right: 18px;
      min-width: 60px;
    }

    .remove-circle {
      top: 18px;
    }
  }
}

.party-extra-group {
  border: 1px solid $light;
  margin-bottom: 60px;

  input,
  select,
  p {
    margin: 0;
  }

  header {
    background: $light;
    padding: 20px;
    display: flex;
    align-items: center;

    p {
      width: 40%;
    }

    p.order {
      width: 100px;
      margin-left: 15px;
    }

    p.guidance, p.boat-select {
      width: 150px;
      margin-left: 15px;
    }

    .button-subtle {
      margin-right: 0;
      margin-top: 20px;
      margin-left: 15px;
    }
  }

  .party-extra-variation {
    &__primary {
      position: relative;
      display: grid;
      grid-gap: 20px;
      grid-template-columns: repeat(4, 1fr);
      margin-bottom: 20px;
    }

    & + * {
      margin-top: 30px;
      border-top: 1px solid $light;
      padding-top: 30px;
    }
  }
}

.supp-nights {
  width: 150px;
  margin-left: 15px;
}
</style>
