<template>
  <div>
    <header class="header">
      <h1>Room Types</h1>
      <router-link class="button" :to="{ name: 'room-type-create' }">New</router-link>
    </header>

    <list-table :data="roomTypes">
      <template slot="thead">
        <th>Name</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'room-type', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td width="100px">
          <remove-item-button apiUrl="room-types" v-model="roomTypes" :id="props.instance.id"></remove-item-button>
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
      roomTypes: []
    }
  },

  components: {
    ListTable,
    RemoveItemButton
  },

  mounted () {
    this.axios.get(`room-types`)
      .then(res => {
        this.roomTypes = res.data
      })
  }
}
</script>
