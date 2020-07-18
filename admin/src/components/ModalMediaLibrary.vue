<template>
  <div v-if="isOpen" class="media-picker">
    <span class="media-picker__bg" @click="$emit('close')" />
    <div class="media-picker__content">
      <span class="media-picker__close" @click="$emit('close')" />
      <div class="media-picker__container">
        <media-container
        :value="value"
        @input="$emit('input', $event)"
        :isPicker="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MediaContainer from '@/components/MediaContainer'

export default {
  name: 'ModalMediaLibrary',

  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array]
    }
  },

  components: {
    MediaContainer
  }
}
</script>

<style lang="scss">
.media-picker {
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 100;
  left: 0;
  top: 0;

  &-field {
    max-width: 300px;
  }

  &__bg {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    cursor: pointer;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }

  &__content {
    background: #FFF;
    border-radius: 5px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: calc(100% - 40px);
    max-width: 1032px;
    max-height: calc(100vh - 40px);
  }

  &__container {
    overflow: hidden;
  }

  &__close {
    transform: rotate(-45deg);
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    height: 30px;
    width: 30px;
    background: #D5DDE2;
    border-radius: 50%;
    position: absolute;
    right: -15px;
    top: -15px;
    cursor: pointer;

    &:before,
    &:after {
      content: '';
      width: 1px;
      height: 9px;
      position: absolute;
      background: #586678;
      transform: translate3d(-50%, -50%, 0);
      left: 50%;
      top: 50%;
    }

    &:after {
      height: 1px;
      width: 9px;
    }
  }

  .media-list {
    height: 600px;
    max-height: calc(100vh - 80px);
    overflow: auto;
  }

  .uploader {
    padding: 30px;
  }
}
</style>
