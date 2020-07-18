<template>
  <tr>
    <td class="pgt-id">{{ price.id }}</td>
    <td>
      <small class="label">{{ room }} - {{ accommodation }}{{ deck }}</small>
    </td>
    <td>
      <output>{{ price.gross }}</output>
    </td>
    <td>
      <output>{{ price.non_com }}</output>
    </td>
    <td>
      <output>{{ price.markup_rate_id }}</output>
    </td>
    <td>
      <output>{{ format(net) }}</output>
    </td>
    <td>
      <output>{{ format(subtotal) }}</output>
    </td>
    <td>
      <output>{{ price.adjustment }}</output>
    </td>
    <td>
      <output><strong>{{ cost }}</strong></output>
    </td>
    <td>
      <output>{{ profit }}</output>
    </td>
  </tr>
</template>

<script>
import pricing from '../../mixins/pricing'

export default {
  mixins: [pricing],

  data () {
    return {
      markupType: 'markup'
    }
  },

  computed: {
    room () {
      const room = this.$store.state.room_types.find(x => x.id === this.price.room_type_id)
      return room ? room.name : ''
    },

    accommodation () {
      const ac = this.$store.state.accommodation_categories.find(x => x.id === this.price.accommodation_category_id)
      return ac ? ac.name : ''
    },

    deck () {
      const deck = this.$store.state.decks.find(x => x.id === this.price.deck_id)
      return deck ? ` (${deck.name.substring(0, 1)})` : ''
    }
  }
}
</script>
