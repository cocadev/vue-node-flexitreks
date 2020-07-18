<template>
  <no-ssr>
    <div class="slider">
      <siema
        ref="siema"
        :options="options"
        class="siema"
        @init="init"
      >
        <slot />
      </siema>
      <button
        v-if="pages > 1"
        type="button"
        class="next"
        @click="next"
      >
        <img
          src="~/assets/images/arrow.svg"
          alt="Next slide"
        >
      </button>
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
        const siema = this.$refs.siema.siema;

        siema.selector.removeEventListener('mousemove', siema.mousemoveHandler);
        siema.selector.addEventListener('mousemove', (e) => {
          if (siema.pointerDown) siema.drag.preventClick = true;
          siema.mousemoveHandler.call(siema, e)
          this.goDots()
        });

        siema.selector.removeEventListener('touchend', siema.mousemoveHandler);
        siema.selector.addEventListener('touchend', (e) => {
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
      this.pages = Math.ceil(this.$refs.siema.siema.innerElements.length)
      this.goDots()
    },

    next () {
      this.$refs.siema.next(1)
      this.goDots()
    },

    goTo (page) {
      this.$refs.siema.goTo(page - 1)
      this.goDots()
    },

    goDots(){
      this.current = this.$refs.siema.siema.currentSlide
      if(this.current < 0 ) {
        this.current = this.current + this.$refs.siema.siema.innerElements.length
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
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

  button.next {
    position: absolute;
    right: 15px;
    bottom: -5px;
  }

  .dots {
    text-align: center;
    font-size: 0;
    padding-top: 40px;
  }
  .button {
      width: 20px;
      height: 20px;
      text-indent: 200%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;
      margin: 0px;

      &:before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        border-radius: 50%;
        background: $light-blue;
        left: 5px;
        top: 5px;
      }
  }
  .button2 {
      width: 20px;
      height: 20px;
      text-indent: 200%;
      white-space: nowrap;
      overflow: hidden;
      position: relative;

      &:before {
        content: '';
        width: 10px;
        height: 10px;
        position: absolute;
        border-radius: 50%;
        background: #ccf0fc;
        left: 5px;
        top: 5px;
      }
  }
}
</style>
