<template>
  <div>
    <div v-for="(specification, i) in value" :key="specification.id || (i * 13)" class="specification">
      <f-editor v-model="specification.price_includes" :name="`specification_${specification.id}_price_includes`" type="number" label="Price Includes" />
      <f-editor v-model="specification.price_excludes" :name="`specification_${specification.id}_price_excludes`" type="number" label="Price Excludes" />
      <button type="button" class="button-subtle button-subtle--right" @click="$emit('removeSpecification', i)">Remove Specification</button>
      <br>
    </div>
    <button type="button" class="button-subtle" @click="$emit('addSpecification')">Add Specification</button>
  </div>
</template>

<script>
import FEditor from '../FEditor'

export default {
  props: {
    value: Array,
    rooms: Array,
    decks: Array
  },

  components: {
    FEditor
  }
}
</script>
