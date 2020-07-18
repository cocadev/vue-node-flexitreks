<template>
  <div
    :class="{
      lightbox: true
    }"
  >
    <span
      class="lightbox__bg"
      @click="$emit('close')"
    />
    <div class="lightbox__container">
      <div class="lightbox__image">
        <button
          type="button"
          class="lightbox__prev"
          @click="traverse(-1)"
        >Prev</button>
        <siema
          ref="image"
          :current.sync="current"
        >
          <div
            v-for="(src, i) in images"
            :key="i"
            :class="{ 'lightbox__image--caption': src.caption }"
          >
            <img
              :data-src="`${src.url}?w=1000`"
              :alt="src.alt"
              class="lazy"
              src=""
            >
            <span
              v-if="src.caption"
              class="lightbox__caption"
            >{{ src.caption }}</span>
          </div>
        </siema>
        <button
          type="button"
          class="lightbox__next"
          @click="traverse(1)"
        >Next</button>
        <span
          class="lightbox__close"
          @click="$emit('close')"
        />
      </div>
      <div class="lightbox__images">
        <siema
          ref="thumbnails"
          :options="{
            perPage: {
              200: 4,
              400: 5,
              500: 6,
              600: 7,
              700: 8,
              800: 9,
              900: 10
            }
          }"
        >
          <img
            v-for="(src, i) in images"
            :key="i"
            :src="`${src.url}?fit=crop&w=300&h=300`"
            :class="{ current: i === current }"
            @click="goto(i)"
          >
        </siema>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      current: 0,
      lazy: null
    }
  },

  watch: {
    current (index) {
      this.$refs.thumbnails.goTo(index)
      this.$refs.image.goTo(index)
      this.lazyload()
    }
  },

  created () {
    window.addEventListener('keydown', this.key)

    const LazyLoad = require('vanilla-lazyload')

    this.lazy = new LazyLoad({
      elements_selector: '.lazy'
    })

    this.lazyload();
  },

  beforeDestroy () {
    window.removeEventListener('keydown', this.key)
    this.lazy.destroy()
  },

  methods: {
    traverse (dir) {
      let index = this.current

      if (dir === -1) {
        index--
        if (index < 0) index = this.images.length - 1
      } else {
        index++
        if (index === this.images.length) index = 0
      }

      this.current = index
    },

    goto (index) {
      this.current = index
    },

    key (event) {
      if (event.keyCode === 27) this.$emit('close')
      if (event.keyCode === 39) this.traverse(1)
      if (event.keyCode === 37) this.traverse(-1)
    },

    lazyload () {
      setTimeout(() => {
        this.lazy.update()
        if (this.lazy._elements && this.lazy._elements.length) {
          this.lazy.load(this.lazy._elements[0])
        }
      }, 200)
    }
  }
}
</script>

<style>
.lightbox {
  position: fixed;
  z-index: 100;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  text-align: center;
}

.lightbox__bg {
  background: rgba(0, 0, 0, 0.9);
  position: absolute;
  height: 100%;
  width: 100%;
  cursor: pointer;
  left: 0;
  top: 0;
}

.lightbox__container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 20px 0 calc(calc((100vh - 60px) * 0.15) + 40px);
}

.lightbox__caption {
  display: block;
  margin: 5px 0 0;
  color: rgba(255, 255, 255, 0.95);
}

.lightbox__image {
  pointer-events: none;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 1120px;
  margin-left: auto;
  margin-right: auto;
}

.lightbox__image img {
  max-width: 90%;
	max-height: calc((100vh - 60px) * 0.85);
  position: relative;
  z-index: 1;
  display: inline-block;
  pointer-events: all;
}

.lightbox__image--caption img {
  max-height: calc((100vh - 100px) * 0.85);
}

.lightbox__image > button {
  pointer-events: auto;
}

.lightbox__images {
  position: absolute;
  bottom: 20px;
  height: calc((100vh - 60px) * 0.15);
  transform: translateX(-50%);
  max-width: 1000px;
  width: 90%;
  left: 50%;
}

.lightbox__images > * {
  margin: 0 -1vw;
}

.lightbox__images div {
  height: 100%;
}

.lightbox__images img {
  height: auto;
  max-height: 100%;
  padding: 0 1vw;
  margin: 0 auto;
}

.lightbox__images img.current {
  opacity: 0.5;
}

@media (min-width: 600px) {
  .lightbox__images > * {
    margin: 0 -0.5vw;
  }

  .lightbox__images img {
    padding: 0 0.5vw;
  }
}

.lightbox__prev,
.lightbox__next {
  position: absolute;
  z-index: 3;
  width: 50px;
  height: 100%;
  background: none;
  border: none;
  padding: 0;
  overflow: hidden;
  text-indent: 200%;
  cursor: pointer;
  top: 0;
  outline: none;
}

.lightbox__prev:before,
.lightbox__next:before {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border-bottom: 2px solid #FFF;
  border-right: 2px solid #FFF;
  transform: rotate(-45deg);
  left: 18px;
  top: calc(50% - 6px);
  opacity: 0;
}

@media (min-width: 48em) {
  .lightbox__prev:before,
  .lightbox__next:before {
    opacity: 1;
  }
}

.lightbox__prev:before {
  transform: rotate(135deg);
}

.lightbox__prev {
  left: 0;
}

.lightbox__next {
  right: 0;
}

.lightbox__close {
  position: absolute;
  right: 0;
  top: 0;
  width: 50px;
  height: 50px;
  z-index: 5;
  cursor: pointer;
  pointer-events: auto;
}

.lightbox__close:before,
.lightbox__close:after {
  content: '';
  height: 18px;
  width: 2px;
  background: #FFF;
  transform: rotate(-45deg);
  position: absolute;
  left: 24px;
  top: calc(50% - 6px);
}

.lightbox__close:after {
  transform: rotate(-135deg);
}

</style>
