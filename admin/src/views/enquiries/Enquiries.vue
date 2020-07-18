<template>
  <div>
    <header class="header">
      <h1>Enquiries</h1>
    </header>

    <list-table :data="enquiries">
      <template slot="thead">
        <th>Received</th>
        <th>Customer name</th>
        <th>Actions</th>
      </template>

      <template slot-scope="props">
        <td>
          {{ format(props.instance.createdAt) }}
        </td>
        <td>
          <router-link :to="{ name: 'enquiry', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td>
          <router-link :to="{ name: 'enquiry', params: { id: props.instance.id } }">
            View
          </router-link>
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
      enquiries: []
    }
  },

  components: {
    ListTable
  },

  mounted () {
    this.axios.get('enquiries')
      .then(res => {
        this.enquiries = res.data
      })
  },

  methods: {
    format (d) {
      if (typeof d !== 'object') d = new Date(d)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    }
  }
}
</script>
