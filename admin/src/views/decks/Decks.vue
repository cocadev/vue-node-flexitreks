<template>
  <div>
    <header class="header">
      <h1>Decks</h1>
      <router-link class="button" :to="{ name: 'deck-create' }">New</router-link>
    </header>

    <list-table :data="decks">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'deck', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="decks" v-model="decks" :id="props.instance.id"></remove-item-button>
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
      decks: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`decks`)
      .then(res => {
        this.decks = res.data
      })
  }
}
</script>
