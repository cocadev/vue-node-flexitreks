<template>
  <div>
    <header class="header">
      <h1>Boats</h1>
      <router-link class="button" :to="{ name: 'boat-create' }">New</router-link>
    </header>

    <list-table :data="boats">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'boat', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="boats" v-model="boats" :id="props.instance.id"></remove-item-button>
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
      boats: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`boats`)
      .then(res => {
        this.boats = res.data.map(b => {
          b.name = b.name.replace(/&amp;/g, '&')
          return b
        })
      })
  }
}
</script>
