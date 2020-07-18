<template functional>
  <i
    :class="{
      active: props.active,
      plus: true
    }"
  />
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
@import '@/assets/scss/global/settings.scss';

i {
  position: absolute;
  right: 12px;
  top: 50%;
  width: 11px;
  height: 11px;
  cursor: pointer;
  transform: translateY(-50%);
}

i::before,
i::after {
  content: '';
  position: absolute;
  background: $orange;
  transform: translate3d(-50%, -50%, 0);
  width: 100%;
  height: 2px;
  left: 50%;
  top: 50%;
}

i::after {
  width: 2px;
  height: 100%;
  transition: 300ms opacity;
}

.active::after {
  opacity: 0;
}
</style>
