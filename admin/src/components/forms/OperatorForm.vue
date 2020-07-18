<template>
  <FForm
    v-model="value"
    route="operators"
    title="Operator"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FEditor',
        key: 'contact',
        label: 'Contact information'
      }
    ]"
  />
</template>

<script>
import FForm from '@/components/FForm'
export default {
  props: {
    value: Object
  },

  components: {
    FForm
  }
}
</script>
