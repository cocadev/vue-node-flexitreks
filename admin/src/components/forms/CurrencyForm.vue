<template>
  <FForm
    v-model="value"
    route="currencies"
    title="Currency"
    columns="1"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FInput',
        key: 'symbol',
        label: 'Symbol'
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
