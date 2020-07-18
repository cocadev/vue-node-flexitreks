<template>
  <div>
    <header class="header">
      <h1>Pages</h1>
      <router-link class="button" :to="{ name: 'page-create' }">New</router-link>
    </header>

    <list-table :data="pages">
      <template slot="thead">
        <th>Name</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'page', params: { slug: props.instance.slug, section: props.instance.section } }">
            {{ props.instance.title }}
          </router-link>
        </td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
export default {
  data () {
    return {
      pages: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get('pages')
      .then(res => {
        this.pages = res.data
      })
  }
}
</script>
