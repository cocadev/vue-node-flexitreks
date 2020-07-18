<template>
  <model-form v-model="model"/>
</template>

<script>
import ModelForm from '@/components/forms/ModelForm'
export default {
  data () {
    return {
      model: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    },
    season_id: {
      type: [String, Number]
    }
  },

  components: {
    ModelForm
  },

  created () {
    this.axios.get(`models/${this.season_id}/${this.id}`)
      .then(res => {
        this.model = res.data
      })
  }
}
</script>
