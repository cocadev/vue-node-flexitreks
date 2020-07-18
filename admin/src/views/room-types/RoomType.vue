<template>
  <room-type-form v-model="roomType" />
</template>

<script>
import RoomTypeForm from '@/components/forms/RoomTypeForm'
export default {
  data () {
    return {
      roomType: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    RoomTypeForm
  },

  created () {
    this.axios.get(`room-types`)
      .then(res => {
        this.roomType = res.data.find(b => b.id === Number(this.id))
      })
  }
}
</script>
