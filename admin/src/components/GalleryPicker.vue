<template>
  <div
    v-if="value"
  >
    <media-picker :value="gallery" @input="$emit('changeGallery', $event)" />
  </div>
  <div
    v-else-if="galleries.length"
  >
    <select :value="value" @change="fetchGallery">
      <option :value="null">Pick a gallery</option>
      <option
        v-for="gallery in galleries"
        :key="gallery.id"
        :value="gallery.id"
      >#{{ gallery.id }}
      </option>
    </select>
  </div>
  <div
    v-else
  >
    <button class="button--reset" type="button" @click="createGallery">Create gallery</button> &nbsp;
    <button class="button--reset" type="button" @click="getGalleries">Pick from existing</button>
  </div>
</template>

<script>
import MediaPicker from '@/components/MediaPicker'

export default {
  components: {
    MediaPicker
  },

  props: {
    value: {
      type: [String, Number],
      default () {
        return ''
      }
    },
    gallery: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      galleries: []
    }
  },

  methods: {
    createGallery () {
      this.axios.post('galleries', { media: [] })
        .then(res => {
          this.$emit('changeGallery', [])
          this.$emit('change', res.data.id)
        })
        .catch(console.error)
    },

    getGalleries () {
      this.axios.get('galleries')
        .then(res => {
          this.galleries = res.data
        })
        .catch(console.error)
    },

    fetchGallery (event) {
      const val = Number(event.target.value)
      this.$emit('change', val)
      if (!val) return
      this.axios.get(`galleries/${val}`)
        .then(res => {
          this.$emit('changeGallery', res.data.map(i => i.id))
          this.$store.commit('addImages', res.data)
        })
        .catch(console.error)
    }
  }
}
</script>
