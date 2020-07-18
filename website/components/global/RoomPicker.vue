<template>
  <div
    :class="{
      'room-picker': true,
      'room-picker--selected': !!quantity
    }"
  >
    <span class="quantities">
      <button
        :disabled="quantity === 0"
        type="button"
        @click="changeRoom(-1)"
      >
        Remove {{ name }} {{ accommodation }} room
      </button>
      {{ quantity }}
      <button
        type="button"
        @click="changeRoom(1)"
      >
        Add {{ name }} {{ accommodation }} room
      </button>
    </span>
    <span class="label">{{ name }}</span>
    <small>{{ accommodation }}{{ deck }}</small>
    <span class="cost">{{ cost(price.cost) }}pp</span>
  </div>
</template>

<script>
import currency from '@/mixins/currency'

export default {
  mixins: [currency],

  props: {
    price: {
      type: Object,
      required: true
    },
    rooms: {
      type: Array,
      required: true
    }
  },

  computed: {    
    build () {
      return this.$store.state.build
    },
    
    name () {
      return this.build.rooms.find(r => r.id === this.price.room_type_id).name
    },

    accommodation () {
      return this.build.accommodation.find(a => a.id === this.price.accommodation_category_id).name
    },

    deck () {
      return this.price.deck_id ? ` - ${this.build.decks.find(a => a.id === this.price.deck_id).name}` : ''
    },

    quantity () {
      return this.rooms.filter(r => r.tour_price_id === this.price.id).length
    }
  },

  methods: {
    changeRoom(dir) {
      this.$emit('changeRoom', { dir, tour_price_id: this.price.id })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.room-picker {
  font-size: 14px;
  font-weight: 300;
  padding: 15px 0 13px;
  border-bottom: 1px solid $line;
  clear: right;

  &:after {
    content: '';
    clear: both;
    display: table;
  }
}

small {
  font-size: 11px;
}

button {
  width: 20px;
  height: 20px;
  background: $line;
  border-radius: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-indent: 200%;
  display: inline-block;
  padding: 0;
  border: none;
  cursor: pointer;
  position: relative;

  &[disabled] {
    opacity: 0.3;
  }

  &:before,
  &:after {
    content: '';
    width: 1px;
    height: 10px;
    background: $copy;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  &:after {
    transform: translate3d(-50%, -50%, 0) rotate(90deg);
  }
}

.quantities {
  display: inline-block;
  margin-right: 22px;
  width: 68px;
  text-align: center;

  :first-child {
    float: left;

    &:before {
      display: none;
    }
  }

  :last-child {
    float: right;
  }

  &:after {
    content: '';
    clear: both;
    display: table;
  }
}

.label {
  display: inline-block;
  width: 88px;
}

.cost {
  float: right;
}

.room-picker--selected .label,
.room-picker--selected .cost {
  font-weight: 500;
}

</style>
