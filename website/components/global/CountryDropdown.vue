<template>
  <div class="radio-dropdown">
    <button
      :class="{
        active: open || value,
        'filter-button': true
      }"
      type="button"
      @click="open = !open"
    >{{ label }}</button>
    <span
      v-show="open"
      class="overlay"
      @click="open = false"
    />
    <div
      v-show="open"
      class="dropdown checkboxes"
    >
      <label
        v-for="option in options"
        :key="option.id"
      >
        <input
          :name="name"
          :value="option.name"
          :checked="value.includes(option.name)"
          type="checkbox"
          @change="$emit('change', option.name)"
        >{{ option.name }}
      </label>
      <button
        type="button"
        class="reset"
        @click="reset"
      >Reset</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true
    },

    options: {
      type: Array,
      required: true
    },
    
    name: {
      type: String,
      required: true
    },

    value: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      open: false
    }
  },

  methods: {
    reset () {
      this.$store.commit('changeFilter', { type: 'countries', value: [] })
      this.open = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.radio-dropdown {
  position: relative;
}

.reset {
  color: $light-blue;
  font: inherit;
  font-size: 12px;
  padding: 0;
  text-decoration: underline;
  display: inline-block;
  margin-left: 25px;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
}

.overlay {
  position: fixed;
  z-index: 10;
  height: 100vh;
  width: 100vw;
  left: 0;
  top: 0;
}

.filter-button {
  padding: 8px 18px 8px 25px;
  font-family: inherit;
  font-size: 11px;
  margin: 0;
  background: #FFF;
  border-radius: 3px;
  border: 1px solid $filter;
  position: relative;
  box-shadow: none;
  cursor: pointer;
  color: $copy;
  z-index: 20;

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-bottom: 1px solid $light-blue;
    border-right: 1px solid $light-blue;
    position: absolute;
    left: 10px;
    top: 11px;
    transform: rotate(45deg);
    transform-origin: 72% 72%;
    transition: 300ms transform;
  }

  &.active {
    background: $filter;

    &::before {
      transform: rotate(-135deg);
    }
  }

  @include mq(1050px) {
    padding: 10px 22px 10px 29px;
    font-size: 13px;

    &::before {
      left: 13px;
      top: 15px;
    }
  }
}

.dropdown {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 30;
  background: #FFF;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  padding: 19px 23px 15px;
  border-radius: 3px;
  transition: 300ms opacity, 300ms visibility;
  width: 90vw;
  max-width: 344px;
  margin: 12px 0 0;
}

small {
  font-weight: 300;
}
</style>
