<template>
  <div>
    <nav
      v-if="slug === 'home' || section === 'explore'"
      class="page-nav"
    >
      <router-link :to="{ name: 'page', params: { slug, section } }">Overview</router-link>
      <router-link v-if="slug === 'home'" :to="{ name: 'page-inspiration', params: { slug } }">Inspiration</router-link>
      <router-link v-if="section === 'explore'" :to="{ name: 'explore', params: { slug, section } }">Explore</router-link>
    </nav>
    <form
      v-if="page && page.meta"
      class="blocks"
      @submit.prevent="submit"
    >
      <div
        v-for="(block, i) in page.blocks"
        :key="i"
      >
        <f-editor v-model="block.content" label="Content" :name="`blocks_${i}_content`" />
        <media-picker v-model="block.media_id" label="Image" :name="`blocks_${i}_image`" />
        <f-input v-model="block.order" label="Order" :name="`blocks_${i}_order`" />
        <button
          type="button"
          class="remove-circle"
          @click="remove(i)"
        />
      </div>
      <button type="button" class="button" @click="add">Add</button> &nbsp; <button type="submit" class="button button--blue">Save</button>
    </form>
  </div>
</template>

<script>
import FEditor from '@/components/FEditor'
import FInput from '@/components/FInput'
import MediaPicker from '@/components/MediaPicker'

export default {
  data () {
    return {
      page: {},
      tours: [],
      destinations: [],
      regions: [],
      offers: [],
      primary: '',
      toAdd: ''
    }
  },

  props: {
    slug: {
      type: [String]
    },
    section: {
      type: [String],
      default: ''
    }
  },

  components: {
    FInput,
    FEditor,
    MediaPicker
  },

  computed: {
    secondary () {
      return this.primary ? this[this.primary] : []
    }
  },

  created () {
    const url = this.section ? `pages/${this.section}/${this.slug}` : `pages/${this.slug}`
    this.axios.get(url)
      .then(page => {
        this.$store.commit('addImages', page.data.blocks.filter(x => x.media).map(x => x.media))
        this.page = page.data
      })
  },

  methods: {
    submit () {
      this.axios.put(`pages/${this.page.id}/blocks`, this.page.blocks)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    add () {
      this.page.blocks.push({
        content: '',
        media_id: null,
        order: this.page.blocks.length + 1
      })
    },

    remove (id) {
      this.page.blocks.splice(id, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.blocks > div {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 150px 50px;
  position: relative;
  padding-right: 40px;
}

.blocks > div button {
  top: 40px;
}
</style>
