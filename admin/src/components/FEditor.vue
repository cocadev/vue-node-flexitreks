<template>
  <p class="editor" :class="classLabel">
    <label>{{ label }}</label>
    <quill-editor :value="value" @input="$emit('input', $event)" ref="quill"/>
    <modal-media-library
      :isOpen="isOpenMediaLibrary"
      @input="addImage"
      @close="isOpenMediaLibrary=false"
    />
  </p>
</template>

<script>
import ModalMediaLibrary from '@/components/ModalMediaLibrary'
import { mapState } from 'vuex'

export default {
  name: 'FEditor',

  props: {
    label: String,
    value: String
  },

  data () {
    return {
      isOpenMediaLibrary: false
    }
  },

  components: {
    ModalMediaLibrary
  },

  computed: {
    ...mapState([
      'images'
    ]),

    classLabel () {
      return this.label.toLowerCase().trim()
    }
  },

  methods: {
    showImageUI () {
      this.isOpenMediaLibrary = true
    },

    addImage (e) {
      if (!this.$refs.quill.quill) return false
      const index = this.$refs.quill.quill.getSelection().index
      const newImage = this.images.find(img => img.id === e)
      if (newImage) {
        this.$refs.quill.quill.insertEmbed(index, 'image', newImage.url)
      }
      this.isOpenMediaLibrary = false
    }
  },

  mounted () {
    this.$refs.quill.quill.getModule('toolbar').addHandler('image', this.showImageUI)
  }
}
</script>

<style lang="scss">
.home .editor.overview{
  display: none;
}
</style>
