<template>
  <div class="media-picker">
    <span class="media-picker__bg" @click="$emit('close')" />
    <div class="media-picker__content">
      <span class="media-picker__close" @click="$emit('close')" />
      <div class="media-picker__container">
        <form class="uploader" ref="uploaderForm">
          <div class="uploader__primary">
            <figure
              class="image-preview"
              :style="{
                'background-image': 'url(' + value.url + ')'
              }"
            ></figure>
          </div>
          <div class="uploader__secondary">
            <f-input v-model="value.upload_alt" name="upload_alt" label="Alt text" />
            <f-input v-model="value.upload_credit" name="upload_credit" label="Credit" />
            <f-input v-model="value.upload_title" name="upload_title" label="Title" />
            <f-input v-model="value.upload_caption" name="upload_caption" label="Caption" />
            <button class="button" @click.prevent="$emit('close')">Close</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FInput from '@/components/FInput'

export default {
  name: 'media-modal-editor',

  components: {
    FInput
  },

  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
