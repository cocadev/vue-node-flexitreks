<template>
  <div>
    <header class="header">
      <h1>Destinations</h1>
      <router-link class="button" :to="{ name: 'destination-create' }">New</router-link>
    </header>

    <list-table :data="destinations">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'destination', params: { id: props.instance.slug } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="destinations" v-model="destinations" :id="props.instance.id"></remove-item-button>
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
      destinations: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`destinations`)
      .then(res => {
        this.destinations = res.data
      })
  }
}
</script>
