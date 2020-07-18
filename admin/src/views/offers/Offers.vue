<template>
  <div>
    <header class="header">
      <h1>Offers</h1>
      <router-link class="button" :to="{ name: 'offer-create' }">New</router-link>
    </header>

    <list-table :data="offers">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'offer', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="offers" v-model="offers" :id="props.instance.id"></remove-item-button>
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
      offers: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get('offers')
      .then(res => {
        this.offers = res.data
      })
  }
}
</script>
