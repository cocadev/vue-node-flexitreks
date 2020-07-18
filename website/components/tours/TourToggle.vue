<template>
  <div class="tour-toggle">
    <header @click="open = !open">
      {{ label }}
      <f-plus :active="open" />
    </header>
    <div
      v-show="open"
      class="tour-toggle__content"
    >
      <slot />
    </div>
  </div>
</template>

<script>
import FPlus from '../global/Plus'
export default {
  components: {
    FPlus
  },

  props: {
    label: {
      type: String,
      required: true
    },
    default: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  data () {
    return {
      open: this.default
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/global/settings.scss';

.tour-toggle {
  border-bottom: 1px solid $line;
  border-top: 1px solid $line;
  font-size: 14px;

  & + .tour-toggle {
    margin-top: -1px;
  }

  &__content {
    li {
      margin: 6px 0 0 19px;
    }
  }

  header {
    position: relative;
    cursor: pointer;
    padding: 13px 30px 16px 0;
    user-select: none;
  }
}
</style>
