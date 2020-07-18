<template>
  <deck-form v-model="deck" />
</template>

<script>
import DeckForm from '@/components/forms/DeckForm'
export default {
  data () {
    return {
      deck: {}
    }
  },

  props: {
    id: {
      type: [String, Number]
    }
  },

  components: {
    DeckForm
  },

  created () {
    this.axios.get(`decks`)
      .then(res => {
        this.deck = res.data.find(b => b.id === Number(this.id))
        if (this.deck) {
          this.deck.name = this.deck.name.replace(/&amp;/g, '&')
        }
      })
  }
}
</script>
