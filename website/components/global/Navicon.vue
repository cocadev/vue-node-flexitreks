<template>
  <button
    :class="{ active, navicon: true }"
    type="button"
    @click="$emit('click')"
  ><span/><span/><span/> Menu</button>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default () {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
button {
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  text-indent: 200%;
  background: transparent;
  outline: none;
  position: absolute;
  overflow: hidden;
  cursor: pointer;
  height: 42px;
  width: 60px;
  border: none;
  right: 0;
  top: 6px;

  span {
    width: 20px;
    height: 2px;
    background: #FFF;
    border-radius: 3px;
    position: absolute;
    right: 20px;

    &:nth-child(1),
    &:nth-child(3) {
      transform-origin: 100% 0;
      transition: 300ms transform;
      top: 15px;
    }

    &:nth-child(2) {
      top: 21px;
      transition: 300ms opacity;
    }

    &:nth-child(3) {
      top: 27px;
    }
  }

  &.active span {
    &:nth-child(1) {
      transform: translateX(-1px) translateY(-1px) rotate(-45deg);
    }

    &:nth-child(2) {
      opacity: 0;
    }

    &:nth-child(3) {
      transform: translateX(1px) translateY(1px) rotate(45deg);
      top: 27px;
    }
  }
}
</style>
