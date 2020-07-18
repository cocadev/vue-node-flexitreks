<template>
  <div>
    <header class="header">
      <h1>Seasons</h1>
      <router-link class="button" :to="{ name: 'season-create' }">New</router-link>
    </header>

    <list-table :data="seasons">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'season', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="seasons" v-model="seasons" :id="props.instance.id"></remove-item-button>
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
      seasons: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`seasons`)
      .then(res => {
        this.seasons = res.data
      })
  }
}
</script>
