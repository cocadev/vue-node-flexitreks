<template>
  <div
    :class="{
      group: true,
      error
    }"
  >
    <label :for="id">{{ label }} ({{ imperial ? 'ft/in' : 'cm' }})</label>
    <div class="height-picker">
      <template v-if="!imperial">
        <input
          :id="id"
          :value="value"
          :required="required"
          placeholder="Centimeters"
          type="number"
          min="1"
          max="272"
          step="1"
          @input="input"
        >
      </template>
      <template v-else>
        <input
          :id="id"
          :value="feet"
          :required="required"
          placeholder="Feet"
          type="number"
          min="1"
          max="12"
          step="1"
          @input="inputFeet"
        >
        <input
          :value="inches"
          placeholder="Inches"
          type="number"
          min="0"
          max="11"
          step="1"
          @input="inputInches"
        >
      </template>
    </div>
    <button
      type="button"
      @click="imperial = !imperial"
    >{{ imperial ? 'Metric' : 'Imperial' }}</button>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      default: ''
    },
    unit: {
      type: String,
      default: 'imperial'
    },
    country: {
      type: String,
      default: 'GB'
    },
    required: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      imperial: this.unit === 'imperial'
    }
  },

  computed: {
    rawFeet () {
      const n = this.value || 0
      if (this.value === '') return ''
      return (n * 0.393700) / 12
    },

    feet () {
      const raw = this.rawFeet
      if (raw === '') return ''
      const feet = Math.floor(raw)
      const inches = Math.round((raw - feet) * 12)
      return feet + (inches === 12 ? 1 : 0)
    },

    inches () {
      const raw = this.rawFeet
      if (raw === '') return ''
      const feet = Math.floor(raw)
      const inches = Math.round((raw - this.feet) * 12)
      return inches === 12 ? 0 : inches
    },

    error () {
      return !!this.$store.state.form_errors.find(e => e === this.id)
    }
  },

  mounted () {
    if (this.country === 'GB') this.unit = 'imperial'
  },

  methods: {
    input (event) {
      let n = parseInt(event.target.value)
      if (isNaN(n)) n = ''
      if (n < 1) n = ''
      if (n >= 272) n = 272
      this.$emit('input', n)
    },

    inputFeet (event) {
      let n = parseInt(event.target.value)
      if (isNaN(n)) n = ''
      if (n < 1) n = ''
      if (n >= 12) n = 12

      if (n !== '') {
        const inches = this.inches + n * 12
        this.$emit('input', Math.round(inches * 2.54))
      }
    },

    inputInches (event) {
      let n = parseInt(event.target.value)
      if (isNaN(n)) n = ''
      if (n < 1) n = ''
      if (n >= 12) n = 11

      if (n !== '') {
        const inches = (this.feet * 12) + (n || 0)
        this.$emit('input', Math.round(inches * 2.54))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.height-picker {
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);

  input:first-child:last-child {
    grid-column: span 2;
  }
}

.group {
  position: relative;
}

button {
  margin: 0;
  background: none;
  box-shadow: none;
  border: none;
  border-bottom: 1px solid $orange;
  padding: 0;
  font: inherit;
  font-size: 14px;
  color: $orange;
  cursor: pointer;

  @include mq(66em) {
    margin-left: 15px;
    transform: translateY(-50%);
    position: absolute;
    left: 100%;
    top: 50%;
  }
}

::-webkit-input-placeholder {
  font-size: 1em;
}
::-moz-placeholder {
  font-size: 1em;
}
:-ms-input-placeholder {
  font-size: 1em;
}
:-moz-placeholder {
  font-size: 1em;
}
</style>

