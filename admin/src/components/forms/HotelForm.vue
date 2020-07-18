<template>
  <FForm
    v-model="value"
    route="hotels"
    title="Hotel"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FEditor',
        key: 'content',
        label: 'Content'
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
