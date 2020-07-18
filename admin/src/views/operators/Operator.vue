<template>
  <operator-form v-model="operator" />
</template>

<script>
import OperatorForm from '@/components/forms/OperatorForm'
export default {
  data () {
    return {
      operator: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    OperatorForm
  },

  created () {
    this.axios.get(`operators/${this.id}`)
      .then(res => {
        this.operator = res.data
      })
  }
}
</script>
