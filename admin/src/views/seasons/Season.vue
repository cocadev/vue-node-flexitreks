<template>
  <season-form v-model="season" />
</template>

<script>
import SeasonForm from '@/components/forms/SeasonForm'
export default {
  data () {
    return {
      season: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    SeasonForm
  },

  created () {
    this.axios.get(`seasons/${this.id}`)
      .then(res => {
        this.season = res.data
      })
  }
}
</script>
