<template>
  <div class="media-picker-field">
    <label v-if="label">{{ label }}</label>
    <figure
      v-show="image"
      class="picker-preview"
      :style="{
        'background-image': image
      }"
      @click="open = true"
    ></figure>
    <slick-list
      v-if="isArray"
      :value="value"
      class="picker-preview--array"
      axis="xy"
      @sortEnd="onSortEnd($event)"
      @input="$emit('input', $event)"
    >
      <slick-item
        class="picker-preview--slick-item"
        v-for="(id, index) in value"
        :index="index"
        :key="index"
        :item="id"
      >
        <div class="img-block">
          <figure
            :style="{
              'background-image': findImage(id)
            }"
            @click="open = true"
          />
          <button type="button" class="remove-button" @click.prevent="removeImage(index)">&times;</button>
        </div>
      </slick-item>
    </slick-list>
    <f-button @click="open = true" class="button--space button--full button--grey">Add image{{ isArray ? 's' : '' }}</f-button>
    <modal-media-library
      :isOpen="open"
      v-model="value"
      @input="$emit('input', $event)"
      @close="open=false"
    />
  </div>
</template>

<script>
import ModalMediaLibrary from '@/components/ModalMediaLibrary'
import FButton from '@/components/FButton'
import { SlickList, SlickItem } from 'vue-slicksort'

export default {
  props: {
    value: {
      type: [String, Number, Array]
    },
    label: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      open: true
    }
  },

  components: {
    ModalMediaLibrary,
    FButton,
    SlickList,
    SlickItem
  },

  computed: {
    isArray () {
      return Array.isArray(this.value)
    },

    image () {
      if (this.isArray || !this.value) return false
      return this.findImage(this.value)
    }
  },

  mounted () {
    this.open = false
  },

  methods: {
    findImage (id) {
      const image = this.$store.state.images.find(i => i.id === Number(id))
      if (!image) return false
      return `url(${image.url}${this.$store.state.sizes['thumbnail']})`
    },

    removeImage (index) {
      this.value.splice(index, 1)
    },

    onSortEnd (event) {
      setTimeout(() => {
        this.axios.put(`tours/re/orders`, { orders: this.value })
          .then(res => {
            console.log('reorder success')
          }).catch(e => {
            this.$store.dispatch('error', e.response.data.error)
          })
      }, 200)
    }
  }

}
</script>

<style lang="scss">
.picker-preview--slick-item figure,
.picker-preview {
  background-color: #E3E3E3;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 0;
  padding-bottom: 100%;
  margin: 0 0 10px;
  cursor: pointer;
}

.picker-preview--array {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.picker-preview--slick-item .img-block {
  position: relative;
}

.picker-preview--slick-item .remove-button {
  position: absolute;
  right: 0;
  top: 0;
  background: #CCC;
  padding: 0;
  border: none;
  border-radius: none;
  height: 20px;
  width: 20px;
  font: inherit;
  font-size: 15px;
  line-height: 1;
  cursor: pointer;
}
</style>
