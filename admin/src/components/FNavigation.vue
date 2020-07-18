<template>
  <div>
    <input
      placeholder="Column Title..."
      class="input"
      style="width: 350px"
      :value="title"
      v-on:input="$emit('input', $event.target.value)"
    />
    <div class="tel">
      <SlickList class="disable-select" lockAxis="y" v-model="links" :distance="distance" @sort-end="$emit('replace', $event)">
        <SlickItem v-for="(item, index) in links" :index="index" :key="index">
          <div class="row item">
            <i class="material-icons">more_vert</i>
            <div>
              <span>Link title</span>
              <input label="Link Title" class="input" @change="$emit('list_title', { value: $event.target.value, index: index})" v-model="item.title"/>
            </div>
            <div>
              <span>URL</span>
              <input label="URL" class="input" @change="$emit('list_url', { value: $event.target.value, index: index})" v-model="item.url"/>
            </div>
            <div class="minus" @click="$emit('remove', index)">
              <i class="fas fa-minus"></i>
            </div>
          </div>
        </SlickItem>
      </SlickList>
    </div>
    <div class="add" @click="$emit('push', { url: '', title: '', position: ''})">Add Link</div>
  </div>
</template>

<script>
import { SlickList, SlickItem } from 'vue-slicksort'

export default {
  components: {
    SlickList,
    SlickItem
  },
  props: {
    links: {
      type: Array,
      default () {
        return []
      }
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      distance: 30
    }
  }
}

</script>
<style scoped>
.tel {
  width: 350px;
  height: 420px;
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: -16px;
  overflow-y: scroll;
}
.item {
  display: flex;
  flex-direction: row;
}
.input {
  width: 125px;
  height: 30px;
  margin-right: 10px;
  padding-left: 8px;
}
::placeholder {
  color: #bbb;
  opacity: 0.8;
}
.material-icons {
  margin-top: 20px;
  margin-left: -14px;
  margin-right: -6px;
  font-size: 30px;
}
.minus {
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: grey;
  display: flex;
  justify-content: "center";
  align-items: center;
  padding-left: 8px;
  margin-top: 18px;
  color: #fff;
  z-index: 100;
}
.add {
  width: 80px;
  height: 30px;
  background: gray;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
}
.add,
.minus,
.material-icons:hover {
  cursor: pointer;
}
.disable-select {
    user-select: none;
}
</style>
