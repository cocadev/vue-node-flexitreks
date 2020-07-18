<template>
<div>
  <form v-if="collection" @submit.prevent="submit">
  <div class="header">
    <h1>Collection</h1>
    <input type="submit" class="button button--blue" value="Save" />
  </div>
  <f-input v-model="collection.title" label="Title" />
  <f-editor v-model="collection.content" label="Content"  />
  <h2>Items</h2>
    <div >
      <SlickList class="disable-select" lockAxis="y" v-model="collection.items" :distance="distance" @sort-end="$emit('replace', $event)">
        <SlickItem v-for="(item, index) in collection.items" :index="index" :key="index">
          <div class="item">
            <i class="material-icons">more_vert</i>
            <div>
              <span style="margin-left: 1px">Image</span>
              <f-media-picker v-model="item.media_id" label="" :name="`inspiration_${index}_image`" />
            </div>
            <div>
              <span class="title">Title</span>
              <input label="Title" class="input" v-model="item.title"/>
            </div>
            <div>
              <span class="title">URL</span>
              <input label="URL" class="input" v-model="item.url"/>
            </div>
            <div style="flex: 1">
              <span class="title">Description</span>
              <input label="Description" class="input2" v-model="item.description"/>
            </div>
            <div class="minus" @click="remove(index)">
              <i class="fas fa-minus"></i>
            </div>
          </div>
        </SlickItem>
      </SlickList>
      <div class="right">
        <div class="btn" @click="add">
          Add Item
        </div>
      </div>

    </div>
  </form>
  <media-grid v-show="false"/>
</div>
</template>

<script>
import FForm from '@/components/FForm'
import FInput from '@/components/FInput'
import FEditor from '@/components/FEditor'
import FMediaPicker from '@/components/MediaPicker'
import MediaGrid from '@/components/MediaGrid'

import { SlickList, SlickItem } from 'vue-slicksort'

export default {
  props: {
    value: Object
  },

  data () {
    return {
      distance: 30,
      collection: null
    }
  },

  components: {
    FForm,
    FInput,
    FEditor,
    FMediaPicker,
    SlickList,
    SlickItem,
    MediaGrid
  },

  created () {
    this.axios.get('homepage-collections')
      .then(collection => {
        this.collection = JSON.parse(JSON.stringify(collection.data))
      })
  },

  methods: {
    submit (event) {
      let filters = this.collection.items.filter(obj => obj.media_id === '')
      if (filters.length) {
        this.$store.dispatch('error', "Item image shouldn't be null!")
        return false
      }

      const collection = JSON.parse(JSON.stringify(this.collection))
      this.axios.post('homepage-collections', collection)
        .then(() => {
          this.$toasted.success('Saved')
        })
        .catch(e => {
          this.$store.dispatch('error', e.response.data.error)
        })
    },
    add () {
      if (this.collection.items.length > 11) {
        this.$store.dispatch('error', 'Max items are limited to 12')
        return false
      }
      this.collection.items.push({ title: '', url: '', description: '', media_id: '' })
    },
    remove (index) {
      this.collection.items.splice(index, 1)
    }
  }
}
</script>
<style scoped>
.btn {
  width: 130px;
  height: 30px;
  border-radius: 2px;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  z-index: 100;
}
.minus {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 18px;
  margin-left: 15px;
  color: #fff;
  z-index: 100;
}
.item {
  display: flex;
  flex-direction: row;
}
.material-icons {
  margin-top: 20px;
  margin-left: -14px;
  margin-right: -6px;
  font-size: 30px;
}
.input {
  width: 125px;
  height: 40px;
  margin-left: 10px;
  padding-left: 8px;
}
.input2 {
  width: 99%;
  height: 40px;
  margin-left: 10px;
  padding-left: 8px;
}
.right {
  display: flex;
  justify-content: flex-end;
  margin-right: -16px;
}
.title {
  margin-left: 10px;
}
.disable-select {
    user-select: none;
}
</style>
