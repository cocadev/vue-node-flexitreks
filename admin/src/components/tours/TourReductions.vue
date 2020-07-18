<template>
  <div class="tour-reductions">
    <div v-for="(reduction, i) in value" :key="reduction.id || (i * 13)" class="reduction">
      <div class="reduction__grid reduction__grid--four">
        <f-input v-model="reduction.order" :name="`reduction_${reduction.id}_order`" label="Order" type="number"/>
        <f-input v-model="reduction.percent" :name="`reduction_${reduction.id}_percent`" type="number" label="Percent reduction" />
        <f-input v-model="reduction.cost" :name="`reduction_${reduction.id}_cost`" type="number" label="Amount reduction" />

        <f-select v-model="reduction.room_type_id" :name="`reduction_${reduction.id}_room`" label="Room">
          <option value="">Pick a Room</option>
          <option v-for="r in rooms" :key="r.name" :value="r.id">{{ r.name }}</option>
        </f-select>
        <f-select v-model="reduction.deck_id" :name="`reduction_${reduction.id}_deck`" label="Deck">
          <option value="">Pick a Deck</option>
          <option v-for="r in decks" :key="r.name" :value="r.id">{{ r.name }}</option>
        </f-select>
      </div>

      <div class="reduction__grid reduction__grid--three">
        <h3 style="grid-column: span 3; margin: 0 0 -15px;">Apply reduction to:</h3>
        <f-input v-model="reduction.output_quantity" :name="`reduction_${reduction.id}_output_quantity`" type="number" label="Min pax" />
        <f-input v-model="reduction.output_min" :name="`reduction_${reduction.id}_output_min`" type="number" label="Age from" />
        <f-input v-model="reduction.output_max" :name="`reduction_${reduction.id}_output_max`" type="number" label="Age to" />
      </div>

      <div class="reduction__grid reduction__grid--three">
        <h3 style="grid-column: span 3; margin: 0 0 -15px;">If sharing with:</h3>
        <f-input v-model="reduction.input_quantity" :name="`reduction_${reduction.id}_input_quantity`" type="number" label="Pax." />
        <f-input v-model="reduction.input_min" :name="`reduction_${reduction.id}_input_min`" type="number" label="Age from" />
        <f-input v-model="reduction.input_max" :name="`reduction_${reduction.id}_input_max`" type="number" label="Age to" />
      </div>

      <div class="reduction__grid reduction__grid--three">
        <h3 style="grid-column: span 3; margin: 0 0 -15px;">Child reductions:</h3>
        <f-select v-model="reduction.child_calc_room" :name="`reduction_${reduction.id}_child_calc_room`" label="Calculation Room">
          <option value="">Pick a Room</option>
          <option v-for="r in rooms" :key="r.name" :value="r.id">{{ r.name }}</option>
        </f-select>

        <f-select v-model="reduction.child_calc_accommodation" :name="`reduction_${reduction.id}_child_calc_accommodation`" label="Calculation Accomodation">
          <option value="">Pick a Category</option>
          <option v-for="a in ac" :key="a.name" :value="a.id">{{ a.name }}</option>
        </f-select>
      </div>

      <div><button type="button" class="button-subtle button-subtle--push button-subtle--right" @click="$emit('removeReduction', i)">Remove Reduction</button></div>
    </div>
    <button type="button" class="button-subtle" @click="$emit('addReduction')">Add Reduction</button>
  </div>
</template>

<script>
import FInput from '../FInput'
import FSelect from '../FSelect'

export default {
  props: {
    value: Array,
    rooms: Array,
    decks: Array,
    ac: Array
  },

  components: {
    FInput,
    FSelect
  },

  data () {
    return {
      freeChildren: {
        id: '',
        percent: 100,
        cost: null,
        input_min: null,
        input_max: null,
        input_quantity: null,
        output_min: null,
        output_max: 5,
        output_quantity: null,
        room_type_id: null,
        deck_id: null,
        child_calc_room: null,
        child_calc_accommodation: null
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../assets/scss/settings.scss';

.reduction {
  padding-bottom: 50px;
  margin-bottom: 50px;
  border-bottom: 1px solid $line;

  @media (min-width: 700px) {
    display: grid;
    grid-gap: 20px;

    p,
    p input,
    p select {
      margin: 0;
    }

    &__grid {
      display: grid;
      grid-gap: 30px;

      &--three {
        grid-template-columns: repeat(3, 1fr);
      }

      &--four {
        grid-template-columns: repeat(5, 1fr);
      }
    }
  }
}
</style>
