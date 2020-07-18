<template>
  <FForm
    v-model="value"
    route="regions"
    title="Region"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FInput',
        key: 'slug',
        label: 'Slug'
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
