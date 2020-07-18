<template>
  <div>
    <header class="header">
      <h1>Operators</h1>
      <router-link class="button" :to="{ name: 'operator-create' }">New</router-link>
    </header>

    <list-table :data="operators">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'operator', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="operators" v-model="operators" :id="props.instance.id"></remove-item-button>
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
      operators: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`operators`)
      .then(res => {
        this.operators = res.data
      })
  }
}
</script>
