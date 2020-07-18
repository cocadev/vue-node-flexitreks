<template functional>
  <figure
    :style="{
      'background-image': `url(${props.image + parent.$store.state.sizes.hero})`
    }"
    :class="{
      hero: true,
      'hero--gradient': props.gradient === 'full',
      'hero--part': props.gradient === 'part',
    }"
  >
    <slot />
  </figure>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      default () {
        return ''
      }
    },
    gradient: {
      type: String,
      default () {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.hero {
  background-size: cover;
  background-position: center;
  background-color: $lightest;
  background-repeat: no-repeat;
  position: relative;
  height: 150px;

  .home & {
    height: 450px;
  }

  @include mq(22em) {
    height: 200px;
  }

  @include mq(30em) {
    height: 250px;

    .home & {
      height: 500px;
    }
  }

  @include mq(40em) {
    height: 350px;

    .home & {
      height: 480px;
    }
  }

  @include mq(50em) {
    .home & {
      height: 550px;
    }
  }

  @include mq(65em) {
    height: 400px;

    .home & {
      height: 595px;
    }
  }

  @include mq(75em) {
    height: 535px;
  }

  &--gradient:before {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.65));
  }

  &--part:before {
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
  }

  &--gradient:before,
  &--part:before {
    position: absolute;
    content: '';
    height: 100%;
    bottom: 0;
    width: 100%;
    left: 0;
  }

  &--part::before {
    height: 30%;
  }
}



</style>
