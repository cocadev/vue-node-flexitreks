<template>
  <div>
    <header class="header">
      <h1>Tours</h1>
      <div class="tours-filter"><input type="text" v-model="filter" placeholder="Filter"></div>
      <router-link :to="{ name: 'tour-create' }" class="button">Create</router-link>
    </header>

    <list-table :data="sortedTours">
      <template slot="thead">
        <th @click="sort('name')">Name</th>
        <th>Seasons</th>
        <th @click="sort('tour_code')">Tour code</th>
        <th @click="sort('status')">Status</th>
        <th>Actions</th>
        <th></th>
      </template>

      <template slot-scope="props">
        <td>
          <router-link :to="{ name: 'tour', params: { id: props.instance.id } }">
            {{ props.instance.name }}
          </router-link>
        </td>
        <td>
          <div class="season" v-for="(season, idx) in Object.keys(props.instance.seasons)" :key="idx">
            {{ season + ' :' }}
            <span class="model" v-for="(model, idx) in props.instance.seasons[season]" :key="idx">{{ 'Model ' + model }}</span>
          </div>
        </td>
        <td>
          <router-link :to="{ name: 'tour', params: { id: props.instance.id } }">
            {{ props.instance.tour_code }}
          </router-link>
        </td>
        <td class="status">
          {{ props.instance.status }}
        </td>
        <td>
          <router-link :to="{ name: 'tour', params: { id: props.instance.id } }">
            Edit
          </router-link> -
          <a :href="`https://flexitreks.netlify.com/tours/${props.instance.slug}/`" target="_blank">
            View
          </a>
        </td>
        <td width="100px">
          <button class="remove-item" @click="removeTour(props.instance.id)">Delete</button>
        </td>
      </template>
    </list-table>
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
import prepareTour from '@/mixins/prepareTour'
export default {
  data () {
    return {
      tours: [],
      key: 'name',
      dir: true,
      filter: ''
    }
  },

  mixins: [prepareTour],

  components: {
    ListTable
  },

  mounted () {
    this.axios.get('tours/all')
      .then(res => {
        this.tours = res.data
      })
  },

  computed: {
    sortedTours () {
      const filter = this.filter.toLowerCase()
      const sort = this.dir ? this.sortTours : this.sortReverse
      return this.tours.slice().sort(sort).filter(t => {
        if (!filter) return true
        return t.name.toLowerCase().includes(filter)
      })
    }
  },

  methods: {
    async removeTour (id) {
      let res = await this.axios.get(`tours/${id}`)
      let tour = this.prepareTour(res.data)
      tour.deleted = true
      tour.status = 'draft'
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this!', options)
        .then(res => {
          if (res.ok) {
            this.axios.put(`tours/${id}`, tour)
              .then(res => {
                this.$toasted.success('Deleted')
                this.tours = this.tours.filter(t => t.id !== id)
              }).catch(e => {
                this.$store.dispatch('error', e.response.data.error)
              })
          }
        })
    },

    sort (key) {
      if (this.key === key) {
        this.dir = !this.dir
      } else {
        this.key = key
        this.dir = true
      }
    },

    sortReverse (a, b) {
      return this.sortTours(b, a)
    },

    sortTours (a, b) {
      const n1 = a[this.key].toLowerCase()
      const n2 = b[this.key].toLowerCase()
      if (n1 < n2) return -1
      if (n1 > n2) return 1
      return 0
    }
  }
}
</script>

<style scoped>
.status {
  text-transform: capitalize;
}

.tours-filter {
  margin-right: 10px;
}

.tours-filter input {
  margin: 0;
  padding: 10px;
}

.model:not(:last-child)::after {
  content: ', ';
}

.remove-item {
  border: 0;
  background: transparent;
  box-shadow: none;
  color: #586678;
  font-weight: 400;
  cursor: pointer;
}
</style>
