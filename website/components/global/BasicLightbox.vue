<template>
  <div
    :class="{
      'basic-lightbox': true,
      'basic-lightbox--open': open,
      'basic-lightbox--mini': mini
    }"
  >
    <span
      class="basic-lightbox__bg"
      @click="$emit('close')"
    />
    <div class="basic-lightbox__container">
      <button
        type="button"
        class="basic-lightbox__close"
        @click="$emit('close')"
      >Close</button>
      <div class="basic-lightbox__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    open: {
      type: Boolean,
      default () {
        return false
      }
    },

    mini: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  mounted () {
    window.addEventListener('keydown', this.testClose)
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.testClose)
  },

  methods: {
    testClose (e) {
      if (e.keyCode === 27) this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.basic-lightbox {
  position: fixed;
  z-index: 500;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  // opacity: 0;
  // visibility: hidden;
  transition: 500ms opacity, 500ms visibility;

  &--open {
    opacity: 1;
    visibility: visible;
  }

  &__container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: calc(100% - 30px);
    max-width: 1100px;
    max-height: calc(100% - 60px);
  }

  &--mini &__container {
    max-width: 400px;
  }

  &__content {
    background: $lightest;
    padding: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    overflow: scroll;
  }

  &--mini &__content {
    background: #FFF;
    padding: 20px;
    border-radius: 3px;
  }

  &__bg {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    cursor: pointer;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }

  &__close {
    width: 30px;
    height: 30px;
    position: absolute;
    top: -35px;
    right: 0;
    background: transparent;
    cursor: pointer;
    box-shadow: none;
    border: none;
    padding: 0;
    white-space: nowrap;
    text-indent: 200%;
    overflow: hidden;

    @include mq(800px) {
        right: -30px;
        top: -30px;
    }

    &:after,
    &:before {
      content: '';
      position: absolute;
      width: 20px;
      height: 1px;
      background: #FFF;
      transform: translate3d(-50%, -50%, 0) rotate(45deg);
      left: 50%;
      top: 50%;
    }

    &:before {
      height: 20px;
      width: 1px;
    }
  }

  &--mini &__close {
    width: 20px;
    height: 20px;
    top: -10px;
    right: -10px;
    border: 1px solid;
    border-radius: 100%;
    background: $orange;
    color: #fff;

    &:after {
      width: 14px;
    }

    &:before {
      height: 14px;
    }
  }
}
</style>
