<template>
  <FForm
    v-model="value"
    route="models"
    title="Model"
    columns="1"
    :url="value ? ('/models/' + $route.params.season_id + '/' + value.id) : null"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name',
        required: true
      },
      {
        component: 'FSelect',
        key: 'season_id',
        label: 'Season',
        items: seasons
      }
    ]"
  />
</template>

<script>
import FForm from '@/components/FForm'
export default {
  data () {
    return {
      seasons: []
    }
  },

  props: {
    value: Object
  },

  components: {
    FForm
  },

  mounted () {
    this.axios.get(`seasons`)
      .then(res => {
        this.seasons = res.data
        this.seasons.unshift({ id: '', name: 'Select' })
      })
  }
}
</script>
