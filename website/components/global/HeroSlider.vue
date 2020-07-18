<template>
  <no-ssr>
    <div
      :class="'small' == options.type ? 'slider slider-small' : 'slider'"
    >
      <siema
        v-if="options.count > 1"
        ref="siema"
        :options="options"
        class="siema"
        @init="init"
      >
        <slot />
      </siema>
      <slot v-if="options.count == 1"/>
      <img
        v-if="pages > 1"
        src="~/assets/images/right.png"
        alt="Next slide"
        class="icon-arrow-left"
        @click="next"
      >
      <img
        v-if="pages > 1"
        src="~/assets/images/right.png"
        alt="Next slide"
        class="icon-arrow-right"
        @click="prev"
      >
      <div
        v-if="pages > 1"
        class="dots"
      >
        <button
          v-for="(page, index) in (1, pages)"
          :key="page"
          :class="current == index ? 'button' : 'button2'"
          @click="goTo(page)"
        />
      </div>
    </div>
  </no-ssr>
</template>

<script>
export default {
  props: {
    options: {
      type: Object,
      default () {
        return {
          loop: true,
          duration: 500
        };
      }
    }
  },

  data() {
    return {
      perPage: 1,
      pages: 1,
      current: 0
    }
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },

  methods: {
    init () {
      setTimeout(() => {
        const siema = this.$refs.siema.siema
        siema.selector.removeEventListener('mousemove', siema.mousemoveHandler);
        siema.selector.addEventListener('mousemove', (e) => {
          if (siema.pointerDown) siema.drag.preventClick = true;
          siema.mousemoveHandler.call(siema, e)
          this.goDots()
        });

        window.addEventListener('resize', this.resize)
        this.resize()
      }, 1)
    },

    resize () {
      this.perPage = this.$refs.siema.siema.perPage
      this.pages = Math.ceil(this.$refs.siema.siema.innerElements.length / this.perPage)
      this.goDots()
    },

    next () {
      this.$refs.siema.next(this.perPage)
      this.goDots()
    },

    prev () {
      this.$refs.siema.prev(this.perPage)
      this.goDots()
    },

    goTo (page) {
      this.$refs.siema.goTo((page - 1) * this.perPage)
      this.goDots()
    },

    goDots(){
      this.current = Math.floor(this.$refs.siema.siema.currentSlide/this.perPage)
      if(this.current < 0 ) {
        this.current = this.pages - 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';
.slider {
  position: relative;
  button {
    cursor: pointer;
    -webkit-appearance: none;
    -webkit-tap-highlight-color: transparent;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
  }

  .dots {
    text-align: center;
    font-size: 0;
    margin-top: -70px;
    margin-bottom: 44px;
  }
  .button {
      width: 26px;
      height: 26px;
      text-indent: 200%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      margin: 0px;

      &:before {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 20%;
        background: #fff;
        left: 5px;
        top: 5px;
      }
  }
  .button2 {
      width: 26px;
      height: 26px;
      text-indent: 200%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;

      &:before {
        content: '';
        width: 20px;
        height: 20px;
        position: absolute;
        border-radius: 20%;
        border: 1px solid white;
        left: 5px;
        top: 5px;
      }
  }
  .icon-arrow-left {
    width: 40px;
    height: 40px;
    position: absolute;
    right: 15px;
    bottom: 43%;
    cursor: pointer;

    @include mq(40em, 'true') {
      width: 30px;
      height: 30px;
    }
  }
  .icon-arrow-right {
    width: 40px;
    height: 40px;
    position: absolute;
    left: 15px;
    bottom: 43%;
    cursor: pointer;
    transform: rotate(180deg);

    @include mq(40em, 'true') {
      width: 30px;
      height: 30px;
    }
  }

  &.slider-small {
    .dots {
      margin-top: 0;
      margin-bottom: 0;
      position: absolute;
      margin-left: 50%;
      transform: translateX(-50%);
      bottom: 100px;
    }

    .icon-arrow-left,
    .icon-arrow-right {
      bottom: 50%;
    }
  }
}
</style>
