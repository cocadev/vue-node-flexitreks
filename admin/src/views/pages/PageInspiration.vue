<template>
  <div>
    <nav
      v-if="slug === 'home'"
      class="page-nav"
    >
      <router-link :to="{ name: 'page', params: { slug } }">Overview</router-link>
      <router-link :to="{ name: 'page-inspiration', params: { slug } }">Inspiration</router-link>
    </nav>
    <form
      v-if="page && page.meta"
      class="inspiration"
      @submit.prevent="submit"
    >
      <div
        v-for="(feature, i) in page.meta.inspiration"
        :key="i"
      >
        <f-input v-model="feature.name" label="Title" :name="`inspiration_${i}_name`" />
        <f-input v-model="feature.subtitle" label="Subtitle" :name="`inspiration_${i}_subtitle`" />
        <f-input v-model="feature.slug" label="Slug" :name="`inspiration_${i}_slug`" />
        <f-input v-model="feature.type" label="Route" :name="`inspiration_${i}_route`" />
        <media-picker v-model="feature.media_id" label="Image" :name="`inspiration_${i}_image`" />
        <f-input v-model="feature.order" label="Order" :name="`inspiration_${i}_order`" />
        <button
          type="button"
          class="remove-circle"
          @click="remove(i)"
        />
      </div>
      <button type="submit" class="button button--blue">Save</button>
    </form>
    <hr>
    <h2>Add another slide</h2>
    <form @submit.prevent="add" class="add-another">
      <select v-model="primary">
        <option value="">Pick a type to add</option>
        <option value="tours">Tour</option>
        <option value="destinations">Destination</option>
        <option value="regions">Region</option>
        <option value="offers">Offer</option>
      </select>
      <select v-model="toAdd">
        <option
          v-for="option in secondary"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
      <button
        class="button"
        type="submit"
      >Add</button>
    </form>
  </div>
</template>

<script>
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
    MediaPicker
  },

  computed: {
    secondary () {
      return this.primary ? this[this.primary] : []
    }
  },

  created () {
    const url = this.section ? `pages/${this.section}/${this.slug}` : `pages/${this.slug}`

    Promise.all([
      this.axios.get('tours/all'),
      this.axios.get('destinations'),
      this.axios.get('regions'),
      this.axios.get('offers'),
      this.axios.get(url)
    ]).then(([
      tours,
      destinations,
      regions,
      offers,
      page
    ]) => {
      this.tours = tours.data
      this.destinations = destinations.data
      this.regions = regions.data
      this.offers = offers.data

      if (!page.data.meta) page.data.meta = {}
      if (!page.data.meta.inspiration) {
        page.data.meta.inspiration = []
      } else {
        this.$store.commit('addImages', page.data.meta.inspiration.filter(x => x.image).map(x => x.image))
      }
      this.page = page.data
      this.page.related_tours = this.page.related || []
    })
  },

  methods: {
    submit () {
      this.axios.put(`pages/${this.page.id}`, this.page)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    },

    add () {
      const obj = this[this.primary].find(x => x.id === Number(this.toAdd))
      if (!obj) return

      if (obj.image) {
        this.$store.commit('addImages', [obj.image])
      } else if (obj.media_id) {
        this.axios.get(`media/${obj.media_id}`)
          .then((res) => {
            this.$store.commit('addImages', [res.data])
          })
      }

      this.page.meta.inspiration.push({
        name: obj.name,
        subtitle: obj.subtitle || (obj.destinations && obj.destinations.length ? obj.destinations[0].name : '') || '',
        slug: obj.slug,
        media_id: obj.media_id,
        type: (this.primary || 'tours') + '-slug',
        order: this.page.meta.inspiration.length + 1
      })
    },

    remove (id) {
      this.page.meta.inspiration.splice(id, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.inspiration > div {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(5, 1fr) 50px;
  position: relative;
  padding-right: 40px;
}

.inspiration > div button {
  top: 40px;
}

.add-another {
  grid-template-columns: 1fr 1fr 100px;
  display: grid;
  grid-gap: 30px;

  .button,
  select {
    margin: 0;
  }
}
</style>
