<template>
  <div>
    <header class="header">
      <h1>Categories</h1>
      <router-link class="button" :to="{ name: 'category-create' }">New</router-link>
    </header>

    <list-table :data="categories">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'category', params: { id: props.instance.slug } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="categories" v-model="categories" :id="props.instance.id"></remove-item-button>
        </td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
import RemoveItemButton from '@/components/RemoveItemButton'
export default {
  data () {
    return {
      categories: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`categories`)
      .then(res => {
        this.categories = res.data
      })
  }
}
</script>
