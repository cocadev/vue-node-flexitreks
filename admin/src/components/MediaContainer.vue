<template>
  <div class="media-libary">
    <header class="media-library__header">
      <button type="button" :class="{ active: task === 'library' }" @click="task = 'library'">Media Library</button>
      <button type="button" :class="{ active: task === 'upload' }" @click="task = 'upload'">Upload</button>
    </header>
    <div class="media-upload" v-show="task === 'upload'">
      <div v-show="!additionalImages.length" class="drag-and-drop-zone">
        <input type="file" id="file" name="upload" accept="image/png, image/jpeg" ref="uploader" required @change="inputChange" multiple="multiple"/>
        <div class="description">Drop files anywhere to upload or</div>
        <button class="button" @click="loadImages">Select</button>
      </div>
      <div class="media-list" v-show="additionalImages.length">
        <table>
          <thead>
            <tr>
              <th>Thumb</th>
              <th>Title</th>
              <th>Alt text</th>
              <th>Caption</th>
              <th>Credit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, idx) in additionalImages" :key="file.url">
              <td class="image-preview-wrapper">
                <img
                  :src="file.url"
                  class="image-preview"
                  @click="loadImages"
                />
              </td>
              <td> {{ file.upload_title }} </td>
              <td> {{ file.upload_alt }} </td>
              <td> {{ file.upload_caption }} </td>
              <td> {{ file.upload_credit }} </td>
              <td>
                <a class="text-button" @click="editableFile = file; openEditor = true">Edit</a>
                <span> - </span>
                <a class="text-button" @click="deleteImageFromList(idx)">Delete</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="control-panel">
        <button class="button" @click="loadImages">Select</button>
        <button class="button" @click="upload">Upload</button>
      </div>
      <media-modal-editor
        v-if="openEditor"
        v-model="editableFile"
        @close="openEditor=false"
      ></media-modal-editor>
    </div>
    <div class="media-library" v-show="task === 'library'">
      <media-grid
        :value="selImage.id"
        :additionalImages="addedImages"
        @input="getSelImage"
        :deletedImagesIds="deletedImagesIds"
        :search="search"
      />
      <div class="right-column" v-if="task === 'library'">
        <div v-sticky="!isPicker" class="right-column__inner">
          <div class="search">
            <div class="section-title label-for-search">Search</div>
            <input type="text" v-model.lazy="search">
            <a class="button search-button brown">Search</a>
          </div>
          <div v-show="selImage.id" class="attachment-details">
            <div class="section-title">Attachment details</div>
            <div class="selected-img-info">
              <figure class="img"><f-image :image="selImage" /></figure>
              <div class="img-info">
                <div class="img-id">{{ "IMG_" + selImage.id }}</div>
                <div class="created_at">{{ formatCreatedAt(selImage.createdAt) }}</div>
                <div class="sizes">{{ selImageSizes }}</div>
                <div class="remove-media" @click="deleteImage">Delete image from library</div>
              </div>
            </div>
            <div class="selected-media-info">
              <f-input v-model="selImage.title" name="upload_title" label="Title" :disabled="!editable" />
              <f-input v-model="selImage.caption" name="upload_caption" label="Caption" :disabled="!editable" />
              <f-input v-if="!isPicker" v-model="selImage.alt" name="upload_alt" label="Alt" :disabled="!editable" />
              <f-input v-if="!isPicker" v-model="selImage.credit" name="upload_credit" label="Credit" :disabled="!editable" />
              <div class="insert-file-wrapper">
                <button v-if="editable" class="button insert-file brown" @click="save">Save</button>
                <button v-if="isPicker" class="button insert-file brown" @click="changeImage(selImage.id)"> {{ checkAddedImage(selImage.id) ? 'Remove image' : 'Add image' }} </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MediaGrid from '@/components/MediaGrid'
import FInput from '@/components/FInput'
import FImage from './FImage'
import Thyme from '@trys/thyme'
import MediaModalEditor from '@/components/MediaModalEditor'

export default {
  props: {
    value: {
      type: [String, Number, Array],
      default () {
        return null
      }
    },
    editable: {
      type: Boolean,
      default () {
        return false
      }
    },
    isPicker: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      addedImages: [],
      task: 'library',
      selImage: {},
      selImageSizes: '',
      deletedImagesIds: [],
      search: '',
      additionalImages: [],
      editableFile: {},
      openEditor: false
    }
  },

  components: {
    MediaGrid,
    FInput,
    FImage,
    MediaModalEditor
  },

  methods: {
    upload () {
      let imgs = this.additionalImages
      imgs.slice().map((file) => {
        let data = new FormData()
        data.append('upload', file.upload)
        data.append('upload_title', file.upload_title)
        data.append('upload_alt', file.upload_alt)
        data.append('upload_credit', file.upload_credit)
        data.append('upload_caption', file.upload_caption)

        this.axios.put('media/', data)
          .then(res => {
            let idx = imgs.indexOf(file)
            this.$toasted.success('Image uploaded')
            this.addedImages.push(res.data)
            this.$store.commit('addImages', [res.data])
            imgs.splice(idx, 1)
            if (imgs.length === 0) this.task = 'library'
          })
          .catch(e => {
            this.$store.dispatch('error', 'Image upload failed')
          })
      })
    },

    inputChange (event) {
      let newFiles = Array.from(event.target.files)
      newFiles.map((file, fileIdx) => {
        let idx = this.additionalImages.length
        this.additionalImages.push({ upload_title: file.name, upload: event.target.files[fileIdx] })
        const reader = new FileReader()
        reader.addEventListener('load', () => {
          this.$set(this.additionalImages[idx], 'url', `${reader.result}`)
        })
        reader.readAsDataURL(file)
      })
    },

    loadImages () {
      this.$refs.uploader.click()
    },

    formatCreatedAt (date) {
      let thymeDate = new Thyme(date)
      return [this.getZeroPrefix(thymeDate.getDay()), this.getZeroPrefix(thymeDate.getMonth()), thymeDate.getFullYear()].join('/')
    },

    getZeroPrefix (number) {
      if (number * 1 < 10) return '0' + number
      if (number * 1 >= 10) return number
    },

    async getSizeImg () {
      let img = new Image()
      let self = this
      img.addEventListener('load', function () {
        self.selImageSizes = this.naturalWidth + 'x' + this.naturalHeight
      })
      img.src = this.selImage.url
    },

    getSelImage ($event) {
      this.selImage = this.$store.state.images.find(i => i.id === Number($event)) || {}
      this.selImageSizes = ''
      this.getSizeImg()
    },

    checkAddedImage (id) {
      if (Number.isInteger(this.value) && this.value === id) {
        return true
      }
      if (Array.isArray(this.value) && this.value.indexOf(id) > -1) {
        return true
      }
      return false
    },

    changeImage (id) {
      let result = id
      if (Number.isInteger(this.value) && this.value === id) {
        result = null
      }
      if (Array.isArray(this.value)) {
        result = [...this.value]
        let current = this.value.findIndex(i => i === id)
        if (current === -1) {
          result.push(id)
        } else {
          result.splice(current, 1)
        }
      }
      this.$emit('input', result)
    },

    save () {
      if (!this.selImage.id) return
      let data = {
        title: this.selImage.title,
        caption: this.selImage.caption,
        alt: this.selImage.alt,
        credit: this.selImage.credit
      }
      this.axios.put(`media/${this.selImage.id}`, data)
        .then(() => {
          this.$toasted.success('Image saved')
        })
        .catch(e => this.$store.dispatch('error', 'Image failed to save'))
    },

    deleteImageFromList (idx) {
      this.additionalImages.splice(idx, 1)
    },

    deleteImage () {
      if (!this.selImage.id) return
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this!', options)
        .then(res => {
          if (res.ok) {
            this.axios.delete(`media/${this.selImage.id}`)
              .then(res => {
                this.deletedImagesIds.push(this.selImage.id)
                if (this.value && (this.selImage.id === this.value.id)) this.value = null
                this.selImage = {}
              }).catch(e => {
                this.$store.dispatch('error', e.response.data.error)
              })
          }
        })
    }
  },

  mounted () {
    this.getSelImage(this.value)
  }
}
</script>

<style lang="scss">
.media-library {
  .button, .search-button {
    border-radius: 3px;
    background-color: #586678;
    height: 25px;
    width: 151px;
    font-size: 12px;
    font-weight: 400;
    padding: 0;

    &.brown {
      background-color: #616161;
    }

    &::focus {
      outline: none;
    }

    &::-moz-focus-inner {
      border: 0;
    }
  }

  &__header {
    background: #D5DDE2;

    button {
      padding: 15px;
      font: inherit;
      margin: 0;
      background: transparent;
      cursor: pointer;
      width: 50%;
      border: none;
      color: #707B8E;
      font-size: 12px;
      box-shadow: none;
      outline: none;

      &.active {
        background: #586678;
        color: #FFF;
      }
    }
  }

  .search-button {
    display: block;
    text-align: center;
    width: 100%;
    padding-top: 4px;
  }
}

.image-preview {
  background-color: #E3E3E3;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 0;
  padding-bottom: 100%;
  margin: 0 0 10px;
  cursor: pointer;
}

.uploader {
  display: grid;
  grid-gap: 30px;
  padding-top: 30px;

  [type="file"] {
    display: none;

    &:invalid ~ [type="submit"] {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  @media (min-width: 700px) {
    grid-template-columns: 1fr 1.5fr;
  }

  @media (min-width: 900px) {
    grid-template-columns: 300px 1fr;
  }
}

.upload-button {
  background: #616161;
  color: #FFF;
  padding: 5px;
  margin: 0;
  font: inherit;
  font-size: 12px;
  outline: none;
  border: none;
  width: calc(50% - 5px);
  text-align: center;
  display: inline-block;
  border-radius: 3px;
  transition: 300ms background-color;
  cursor: pointer;

  &:hover {
    background-color: #414141;
  }

  & + .upload-button {
    margin-left: 10px;
  }
}

</style>

<style lang="scss" scoped>
.uploader__secondary {
  & > * {
    margin: 0 0 -14px;
  }
}

.media-library {
  padding-right: 299px;
  position: relative;

  .right-column {
    position: absolute;
    right: 0;
    top: 0;
    min-height: 100%;
    background-color: #f5f5f5;
    width: 299px!important;

    &__inner {
      padding: 30px;
    }
  }
}

.section-title {
  font-size: 14px;
  font-weight: 700;
  color: #586678;
  margin-bottom: 15px;

  &.label-for-search {
    margin-bottom: 6px;
  }
}

.attachment-details {
  margin-top: 40px;

  .selected-img-info {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    height: 100px;
    margin-bottom: 30px;

    figure.img {
      flex: 0 0 130px;
      height: 100%;
      background-color: #e3e3e3;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    .img-info {
      margin-left: 20px;
      color: #7e8a99;
      height: 100%;
      display: flex;
      flex-direction: column;
      flex: 0 1 auto;

      .img-id {
        font-size: 12px;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 9px;
      }

      .created_at {
        font-size: 11px;
        text-transform: uppercase;
      }

      .sizes {
        font-size: 11px;
        color: #7e8a99;
        margin-top: 5px;
      }

      .remove-media {
        margin-top: auto;
        margin-bottom: 0;
        color: #f88f2b;
        font-size: 10.5px;
        cursor: pointer;
        &:hover {
          color: red;
        }
      }
    }
  }

  .selected-media-info {
    & > * {
      margin: 0 0 -15px;
    }

    .insert-file-wrapper {
      text-align: right;
      margin-top: 40px;
    }

    .insert-file {
      display: inline-block;
      text-align: center;
    }
  }
}

.drag-and-drop-zone {
  height: 400px;
  width: 932px;
  border-radius: 5px;
  border: 2px dashed #7e8a99;
  margin: 50px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  #file {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
}

.media-upload {
  .media-list {
    table {
      margin-top: 30px;
      border-bottom: 1px solid #D5DDE2;
    }
  }
  .description {
    font-size: 20px;
    margin-bottom: 15px;
  }
  .text-button {
    cursor: pointer;
  }
}

.image-preview-wrapper {
  width: 200px;
}

.image-preview {
  background-color: #E3E3E3;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100px;
  width: 100%;
  margin: 0 0 10px;
  padding-bottom: 0;
  cursor: pointer;
  object-fit: cover;
}

.control-panel {
  border-bottom: 1px solid #D5DDE2;
  .button {
    margin: 15px;
  }
}

</style>
