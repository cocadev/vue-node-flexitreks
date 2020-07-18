<template>
  <div>
    <header class="header">
      <h1>Hotels</h1>
      <router-link class="button" :to="{ name: 'hotel-create' }">New</router-link>
    </header>

    <list-table :data="hotels">
      <template slot="thead">
        <th>Name</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'hotel', params: { id: props.instance.id } }">
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
      hotels: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get(`hotels`)
      .then(res => {
        this.hotels = res.data
      })
  }
}
</script>
