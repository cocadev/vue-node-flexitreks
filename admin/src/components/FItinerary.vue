<template>
  <div class="itineraries">
    <div v-for="(itinerary, i) in value" :key="itinerary.id || (i * 13)" class="itinerary">
      <button type="button" class="remove-circle" @click="$emit('removeItinerary', i)"></button>
      <f-input v-model="itinerary.day" type="number" :name="`itinerary_${itinerary.id}_day`" label="Day" />
      <f-input v-model="itinerary.title" :name="`itinerary_${itinerary.id}_title`" label="Title" />
      <f-select :name="`itinerary_${itinerary.id}_type`" label="Type" v-model="itinerary.type">
        <option value="">Select an itinerary type</option>
        <option value="public">Public</option>
        <option value="documentation">Documentation</option>
      </f-select>
      <f-editor :name="`itinerary_${itinerary.id}_content`" label="Content" v-model="itinerary.content" />
      <media-picker v-model="itinerary.media_id" :name="`itinerary_${itinerary.id}_media_id`" label="Media" />

    </div>
  </div>
</template>

<script>
import FInput from './FInput'
import FEditor from './FEditor'
import FSelect from './FSelect'
import MediaPicker from './MediaPicker'

export default {
  props: {
    value: Array
  },

  components: {
    FInput,
    FEditor,
    FSelect,
    MediaPicker
  }
}
</script>

<style lang="scss">
@import '../assets/scss/settings.scss';

.itinerary {
  position: relative;

  @media (min-width: 40em) {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 100px 1fr 200px;
    padding-bottom: 45px;
    margin-bottom: 45px;
    border-bottom: 1px solid $line;

    p,
    textarea,
    select,
    input {
      margin: 0;
    }

    .editor {
      grid-column: span 2;
    }
  }
}
</style>
