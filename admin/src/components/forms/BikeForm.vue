<template>
  <FForm
    v-model="value"
    route="bikes"
    title="Bike"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FInput',
        key: 'default_order',
        label: 'Order'
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
