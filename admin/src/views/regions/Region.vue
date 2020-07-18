<template>
  <region-form v-model="region" />
</template>

<script>
import RegionForm from '@/components/forms/RegionForm'
export default {
  data () {
    return {
      region: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    RegionForm
  },

  created () {
    this.axios.get(`regions/${this.id}`)
      .then(res => {
        delete res.data.tours
        this.region = res.data
      })
  }
}
</script>
