<template>
  <div
    v-if="available_extras.length"
    class="group clear"
  >
    <label>Extras</label>
    <div>
      <div
        v-for="extra in available_extras"
        :key="extra.extra.id"
        class="extra-picker checkboxes"
      >
        <label>
          <input
            :checked="extra.checked"
            type="checkbox"
            @change="toggle(extra.variation)"
          > 
          {{ extra.extra.name }}
          <span class="cost">+ {{ cost(extra.cost) }}</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import currency from '@/mixins/currency'

export default {
  mixins: [currency],

  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    pax: {
      type: Number,
      default () {
        return 0
      }
    },
    extras: {
      type: Array,
      default () {
        return []
      }
    },
    accommodation_category_id: {
      type: Number,
      default () {
        return 0
      }
    },
    boat_id: {
      type: [String, Number],
      default: ''
    },
    season_id: {
      type: [String, Number],
      default: ''
    },
    guided: {
      type: [String, Boolean],
      default: ''
    }
  },

  computed: {
    available_extras () {
      return this.extras
      .filter(extra => {
        let guided_filter = true,
            season_filter = true,
            boat_filter = true,
            variations_filter = extra.variations.length > 0

        if ((this.guided || this.guided === false) && extra.guidance !== 2) {
          guided_filter = extra.guidance == this.guided
        }
        if (this.boat_id > 0 && extra.boat_id !== 0) {
          boat_filter = extra.boat_id === this.boat_id
        }
        if (this.season_id > 0) {
          season_filter = extra.tour_season_id === this.season_id
        }

        return guided_filter && season_filter && boat_filter && variations_filter
      })
      .map(extra => {
        let cost = 0
        const variations = extra.variations
        .filter(variation => {
          // TODO Check against bikes
          return variation.accommodation_category_id === this.accommodation_category_id
        })
        .sort((a, b) => a.cost - b.cost)

        if (!variations.length) return null
        const variation = variations[0]

        return {
          extra,
          variation,
          checked: !!this.value.find(c => c.tour_party_extra_variation_id === variation.id),
          cost: variation.cost
        }
      })
      .filter(a => a)
    }
  },

  methods: {
    toggle (variation) {
      const index = this.value.findIndex(x => x.tour_party_extra_variation_id === variation.id)
      if (index === -1) this.$emit('add', { tour_party_extra_variation_id: variation.id })
      else this.$emit('remove', index)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.extra-picker {
  padding: 15px 0 13px;
  border-bottom: 1px solid $line;
  clear: right;

  label {
    font-size: 14px;
    font-weight: 300;
    margin: 0;
  }
}

.cost {
  float: right;
}
</style>

