<template>
  <div>
    <header class="header">
      <h1>Restaurants</h1>
      <router-link class="button" :to="{ name: 'restaurant-create' }">New</router-link>
    </header>

    <list-table :data="restaurants">
      <template slot="thead">
        <th>Name</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'restaurant', params: { id: props.instance.id } }">
            {{ props.instance.name }}
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
      restaurants: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get(`restaurants`)
      .then(res => {
        this.restaurants = res.data
      })
  }
}
</script>
