<template>
  <div>
    <div
      v-for="(group, i) in value"
      :key="i"
      class="tour-picker-group"
    >
      <f-select
        :id="`tour_picker_${i}_destination`"
        v-model="group.destination"
        label="Destination"
        @change="destinationChange(i)"
      >
        <option value="">Pick a destination</option>
        <option
          v-for="destination in destinations"
          :key="destination.id"
          :value="destination.slug"
        >{{ destination.name }}</option>
      </f-select>

      <f-select
        :id="`tour_picker_${i}_tour`"
        v-model="group.tour"
        label="Tour"
        @change="tourChange(i)"
      >
        <option value="">Pick a tour</option>
        <option
          v-for="tour_id in (destinationTours[group.destination] || [])"
          :key="tour_id"
          :value="tour_id"
        >{{ $store.state.tours.find(x => x.id === tour_id).name }}</option>
      </f-select>
      <button
        v-if="i !== 0"
        type="button"
        class="button button--small remove"
        @click="$emit('removeTour', i)"
      >Remove this tour</button>
    </div>
    <div class="group">
      <button
        :disabled="value.length >= 3"
        type="button"
        class="button button--small add-tour"
        @click="$emit('addTour')"
      >Add another tour</button>
    </div>
  </div>
</template>

<script>
import FSelect from '@/components/bookings/BookingSelect'

export default {
  components: {
    FSelect
  },
  props: {
    value: {
      type: Array,
      default () {
        return [{
          destination: '',
          tour: ''
        }]
      }
    }
  },
  computed: {
    destinations () {
      return this.$store.state.global.destinations
    },
    destinationTours () {
      return this.$store.state.destinationTours
    }
  },
  methods: {
    destinationChange (i) {
      const row = this.value[i]
      if (row.destination === '') {
        row.tour = ''
        return
      }
      this.$store.dispatch('getToursForDestination', { slug: row.destination })
    },
    tourChange (i) {
      this.$emit('change', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.tour-picker-group {
  max-width: 624px;
}

.tour-picker-group + .tour-picker-group {
  margin-top: 30px;
  padding-top: 40px;
}

.tour-picker-group:first-child + .tour-picker-group {
  margin-top: 0;
}

.remove {
  margin-right: 0;
  float: right;
}

.add-tour {
  background: #DFDFDF;
  color: #777;

  &[disabled] {
    opacity: 0.2;
  }
}

@media (min-width: 600px) {
  .remove {
    margin: -15px 0 0;
  }

  .add-tour {
    position: relative;
    top: -15px;
    margin-bottom: -15px;
  }
}


</style>

