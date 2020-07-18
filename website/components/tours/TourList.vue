<template>
  <section class="list-of-tours">
    <tour-preview
      v-for="(tour, k) in tours"
      :key="k"
      :tour="tour"
    />
  </section>
</template>

<script>
import TourPreview from './TourPreview'
export default {
  components: {
    TourPreview
  },

  props: {
    tours: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      observer: null
    }
  },

  watch: {
    tours () {
      setTimeout(() => {
        this.startObserving()
      }, 100);
    }
  },

  mounted () {
    this.startObserving()
  },

  beforeDestroy () {
    this.observer && this.observer.disconnect()
    this.observer = null
  },

  methods: {
    startObserving () {
      if (!('IntersectionObserver' in window)) return this.attachImages()
      if (this.observer) this.observer.disconnect()
      else this.observer = new IntersectionObserver(this.observe)
      this.attachHandlers()
    },

    observe (items) {
      items
        .filter(x => x.isIntersecting)
        .forEach(item => {
          item.target.style.backgroundImage = item.target.style.backgroundImage || item.target.dataset.bg
        })
    },

    attachHandlers () {
      if (!this.observer) return
      [].forEach.call(document.querySelectorAll('.tour-preview__top > figure[data-bg]'), (figure) => {
        this.observer.observe(figure)
      })
    },

    attachImages () {
      [].forEach.call(document.querySelectorAll('.tour-preview__top > figure[data-bg]'), (figure) => {
        figure.style.backgroundImage = figure.dataset.bg
      })
    }
  }
}
</script>
