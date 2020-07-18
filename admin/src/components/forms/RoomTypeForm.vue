<template>
  <FForm
    v-model="value"
    route="room-types"
    title="Room Type"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
      },
      {
        component: 'FInput',
        key: 'sleeps',
        label: 'Sleeps',
        domProps: {
          type: 'number',
          min: 0,
          max: 10,
          step: 1
        }
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
