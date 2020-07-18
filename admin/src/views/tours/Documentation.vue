<template>
  <div v-if="tour">
    <tour-nav :tour="tour" />
    <form @submit.prevent="save" id="tour-form">
      <f-editor name="arrival" label="Arrival" v-model="documentation.arrival" />
      <f-editor name="luggage" label="Luggage" v-model="documentation.luggage" />
      <f-editor name="food" label="Food" v-model="documentation.food" />
      <f-editor name="bike_details" label="Bike Details" v-model="documentation.bike_details" />
    </form>
  </div>
</template>

<script>
import FEditor from '@/components/FEditor'
import FButton from '@/components/FButton'
import TourNav from '@/components/tours/TourNav'

export default {
  data () {
    return {
      documentation: {
        arrival: '',
        luggage: '',
        food: '',
        bike_details: ''
      },
      tour: null
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    TourNav,
    FButton,
    FEditor
  },

  created () {
    this.axios.get(`tours/${this.id}/documentation`)
      .then(res => {
        this.documentation = res.data
      })
      .catch(e => {
        this.documentation = {
          arrival: '',
          luggage: '',
          food: '',
          bike_details: ''
        }
      })

    this.axios.get(`tours/${this.id}`)
      .then(res => {
        this.tour = res.data
      })
      .catch(console.error)
  },

  methods: {
    save () {
      const data = {
        arrival: this.documentation.arrival,
        food: this.documentation.food,
        luggage: this.documentation.luggage,
        bike_details: this.documentation.bike_details
      }

      if (this.documentation && this.documentation.id) data.id = Number(this.documentation.id)

      this.axios.put(`tours/${this.id}/documentation`, data)
        .then(() => this.$toasted.success('Saved'))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>
