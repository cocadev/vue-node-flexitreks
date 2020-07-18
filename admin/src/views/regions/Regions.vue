<template>
  <div>
    <header class="header">
      <h1>Regions</h1>
      <router-link class="button" :to="{ name: 'region-create' }">New</router-link>
    </header>

    <list-table :data="regions">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'region', params: { id: props.instance.slug } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="regions" v-model="regions" :id="props.instance.id"></remove-item-button>
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
      regions: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`regions`)
      .then(res => {
        this.regions = res.data
      })
  }
}
</script>
