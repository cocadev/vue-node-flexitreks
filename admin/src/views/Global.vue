<template>
  <div>
    <header class="header">
      <h1>Global data</h1>
    </header>

    <list-table :data="list">
      <template slot="thead">
        <th>Name</th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: props.instance.name || props.instance.title.toLowerCase().replace(/\s/g, '-') }">{{ props.instance.title }}</router-link>
        </td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
export default {
  data () {
    return {
      list: [
        { title: 'Bulk Pricing Editor', name: 'pgt' },
        { title: 'Accommodation Categories' },
        { title: 'Bikes' },
        { title: 'Boats' },
        { title: 'Categories' },
        { title: 'Currencies' },
        { title: 'Decks' },
        { title: 'Destinations' },
        { title: 'Enquiries' },
        { title: 'Homepage Collections' },
        { title: 'Media' },
        { title: 'Models' },
        { title: 'Navigation', name: 'navigations' },
        { title: 'Offers' },
        { title: 'Operators' },
        { title: 'Pages' },
        { title: 'Payments' },
        { title: 'Regions' },
        { title: 'Room Types' },
        { title: 'Seasons' },
        { title: 'Site options', name: 'options' }
      ]
    }
  },

  components: {
    ListTable
  }
}
</script>
