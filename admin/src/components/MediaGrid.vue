<template>
  <div class="media-list">
    <div class="media-grid">
      <figure
        v-for="image in images"
        :key="image.id" @click="imageSelected(image)"
        :class="{ selected: image.selected }"
      >
        <f-image :image="image" />
        <figcaption>{{ image.title }}</figcaption>
      </figure>
    </div>
    <footer class="media-grid__footer">
      <f-button v-if="!hideButton && nextPage" @click="loadMore">Load more images</f-button>
    </footer>
  </div>
</template>

<script>
import FImage from './FImage'
import FButton from '@/components/FButton'

export default {
  props: {
    additionalImages: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: [String, Number, Array],
      default () {
        return null
      }
    },
    deletedImagesIds: {
      type: Array,
      default () {
        return []
      }
    },
    search: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      serverImages: [],
      nextPage: false,
      popup: false,
      hideButton: true
    }
  },

  created () {
    this.fetchPage(1)
  },

  components: {
    FImage,
    FButton
  },

  computed: {
    images () {
      const images = this.additionalImages.concat(...this.serverImages).filter(img => this.deletedImagesIds.indexOf(img.id) === -1)
      const value = this.value
      const isArray = Array.isArray(value)

      images.forEach(i => {
        i.selected = isArray ? value.find(v => v === i.id) : i.id === value
      })

      return images
    }
  },

  methods: {
    fetchPage (page) {
      if (page === 1) this.serverImages = []
      let url = `media/page/${page}`
      if (this.search) url += `/all/${this.search}`
      this.axios.get(url)
        .then(res => {
          res.data.results.forEach(i => this.serverImages.push(i))
          this.$store.commit('addImages', res.data.results)
          this.nextPage = res.data.nextPage
          if (this.nextPage) this.hideButton = false
        })
    },

    imageSelected (image) {
      let value
      if (Array.isArray(this.value)) {
        value = [...this.value]
        const current = this.value.findIndex(i => i === image.id)
        if (current === -1) {
          value.push(image.id)
        } else {
          value.splice(current, 1)
        }
      } else {
        value = image.id === this.value ? null : image.id
      }

      this.$emit('input', value)
    },

    loadMore () {
      this.fetchPage(this.nextPage)
      this.hideButton = true
    }
  },

  watch: {
    search () {
      this.fetchPage(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.media-list {
  padding: 30px 30px 0 30px;
}

.media-grid {
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

  figure {
    padding: 0;
    margin: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    img {
      flex: 1 0 auto;
    }
    figcaption {
      height: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #7e8a99;
      font-size: 12px;
      font-weight: 300;
      text-align: center;
      line-height: 14px;
      margin-top: 5px;
      padding: 0 5px;
    }
  }

  .title {
    font-size: 12px;
    font-weight: 300;
    color: #7e8a99;
    text-align: center;
    line-height: 14px;
    margin-top: 5px;
  }

  .selected {
    position: relative;

    img {
      border: 2px solid #586678;
    }

    &:before {
      position: absolute;
      content: '';
      width: 15px;
      height: 15px;
      border-radius: 2px;
      background: #586678;
      position: absolute;
      right: -7px;
      top: -7px;
    }

    &:after {
      content: '';
      width: 4px;
      height: 8px;
      border-right: 1px solid #FFF;
      border-bottom: 1px solid #FFF;
      position: absolute;
      transform: rotate(45deg);
      right: -2px;
      top: -5px;
    }
  }

  &__footer {
    padding-top: 21px;
    padding-bottom: 21px;
    text-align: center;
  }
}

.media-popup {
  position: fixed;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;

  &__bg {
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
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
    width: 340px;
    height: auto;
    min-height: 200px;
    max-height: 100vh;
    max-width: calc(100vw - 40px);
    padding: 20px;

    @media (min-width: 700px) {
      width: 700px;
      display: grid;
      grid-gap: 30px;
      grid-template-columns: 300px 1fr;
    }
  }
}
</style>
