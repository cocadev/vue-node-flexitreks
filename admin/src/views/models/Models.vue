<template>
  <div>
    <header class="header">
      <h1>Models</h1>
      <router-link class="button" :to="{ name: 'model-create' }">New</router-link>
    </header>

    <list-table :data="models">
      <template slot="thead">
        <th>Name</th>
        <!--<th>Season</th>-->
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'model', params: { id: props.instance.id, season_id: props.instance.season_id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <!--<td>
          {{ props.instance.season_id }}
        </td>-->
        <td width="100px">
          <remove-item-button apiUrl="models" v-model="models" :id="props.instance.id"></remove-item-button>
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
      models: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`models`)
      .then(res => {
        this.models = res.data
      })
  }
}
</script>
