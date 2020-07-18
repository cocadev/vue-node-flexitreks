<template>
  <div>
    <header class="header">
      <h1>Accommodation Categories</h1>
      <router-link class="button" :to="{ name: 'accommodation-category-create' }">New</router-link>
    </header>

    <list-table :data="accommodationCategories">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'accommodation-category', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="accommodation-categories" v-model="accommodationCategories" :id="props.instance.id"></remove-item-button>
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
      accommodationCategories: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`accommodation-categories`)
      .then(res => {
        this.accommodationCategories = res.data
      })
  }
}
</script>
