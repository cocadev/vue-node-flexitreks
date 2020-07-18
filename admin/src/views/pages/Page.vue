<template>
  <div class="test" :class="slug">
    <nav
      v-if="slug === 'home' || section === 'explore'"
      class="page-nav"
    >
      <router-link :to="{ name: 'page', params: { slug, section } }">Overview</router-link>
      <router-link v-if="slug === 'home'" :to="{ name: 'page-inspiration', params: { slug } }">Inspiration</router-link>
      <router-link v-if="section === 'explore'" :to="{ name: 'explore', params: { slug, section } }">Explore</router-link>
    </nav>
    <page-form v-model="page" />
  </div>
</template>

<script>
import PageForm from '@/components/forms/PageForm'
export default {
  data () {
    return {
      page: {}
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
    PageForm
  },

  created () {
    const url = this.section ? `pages/${this.section}/${this.slug}` : `pages/${this.slug}`
    this.axios.get(url)
      .then(res => {
        this.page = res.data
        this.page.related_tours = this.page.related || []
      })
  }
}
</script>
