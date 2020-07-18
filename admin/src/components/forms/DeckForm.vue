<template>
  <FForm
    v-model="value"
    route="decks"
    title="Deck"
    :schema="[
      {
        component: 'FInput',
        key: 'name',
        label: 'Name'
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
