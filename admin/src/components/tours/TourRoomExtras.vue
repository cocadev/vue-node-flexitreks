<template>
  <div class="tour-extras js-pgt">
    <div v-for="(extra, i) in value" :key="extra.id || (i * 13)" class="room-extra-group">
      <header>
        <f-input v-model="extra.name" :name="`extra_${extra.id}_name`" label="Name" />
        <p>
          <label><input type="checkbox" v-model="extra.pre" @change="checkPrePost(extra, 'pre')"> Pre</label>
          <label><input type="checkbox" v-model="extra.post" @change="checkPrePost(extra, 'post')"> Post</label>
        </p>
        <button type="button" class="button-subtle button-subtle--right" @click="$emit('removeExtra', i)">Remove Extra</button>
      </header>
      <div class="extra__variations">
        <TourRoomExtraVariation
          v-for="(price, j) in extra.variations"
          :key="price.id || `variation_${extra.id || i * 13}_${j * 13}`"
          :price="price"
          :ac="ac"
          :rooms="rooms"
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
    <copy-from @change="copyFromSeason" pageType="extra nights" />

  </div>
</template>

<script>
import FInput from '../FInput'
import FSelect from '../FSelect'
import CopyFrom from './CopyFrom'
import TourRoomExtraVariation from './TourRoomExtraVariation'

export default {
  props: {
    value: Array,
    ac: Array,
    rooms: Array,
    seasonData: Object
  },

  components: {
    FInput,
    FSelect,
    CopyFrom,
    TourRoomExtraVariation
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
    copyFromSeason ({ season_id, tour_id }) {
      this.axios.get(`tour-extras/${tour_id}/${season_id}/room`)
        .then((res) => {
          this.$emit('addExtras', res.data)
        })
    },

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
    },

    checkPrePost (extra, type) {
      if (!extra.pre && !extra.post) extra[type] = true
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.room-extra-group {
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
    display: grid;
    grid-template-columns: 1fr 1fr 120px;
    grid-gap: 20px;
    align-items: center;

    [for] {
      display: none;
    }

    label {
      display: inline-block;
      margin: 0 20px 0 0;
    }

    p {
      margin: 0;
    }
  }

  .daypicker {
    grid-column: span 2;

    div {
      display: flex;
      padding-top: 12px;

      label + label {
        margin-left: 15px;
      }
    }
  }

  .room-extra-variation {
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
</style>
