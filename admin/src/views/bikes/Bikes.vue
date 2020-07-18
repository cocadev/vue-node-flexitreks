<template>
  <div>
    <header class="header">
      <h1>Bikes</h1>
      <router-link class="button" :to="{ name: 'bike-create' }">New</router-link>
    </header>

    <list-table :data="bikes">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'bike', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="bikes" v-model="bikes" :id="props.instance.id"></remove-item-button>
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
      bikes: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`bikes`)
      .then(res => {
        this.bikes = res.data.map(b => {
          b.name = b.name.replace(/&amp;/g, '&')
          return b
        })
      })
  }
}
</script>
