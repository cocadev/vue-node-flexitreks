<template>
  <destination-form v-model="destination" />
</template>

<script>
import destinationForm from '@/components/forms/DestinationForm'
export default {
  data () {
    return {
      destination: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    destinationForm
  },

  created () {
    this.axios.get(`destinations/${this.id}`)
      .then(res => {
        delete res.data.tours
        this.destination = res.data
      })
  }
}
</script>
