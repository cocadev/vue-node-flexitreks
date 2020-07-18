<template>
  <div class="currency">
    <h4
      :class="{ open }"
      @click="open = !open"
    >{{ currency.name }}</h4>
    <div v-if="open">
      <table class="pgt-table">
        <thead>
          <tr>
            <th>Season</th>
            <th>Exchange rate</th>
            <th>Save</th>
          </tr>
        </thead>
        <tbody v-if="seasons.length">
          <tr
            v-for="season in seasons"
            :key="season.id"
          >
            <td>{{ season.name }}</td>
            <td>
              <input
                type="number"
                :value="currency.rates.find(x => x.season_id === season.id) ? currency.rates.find(x => x.season_id === season.id).rate : null"
                @input="$emit('update', [ currency.id, season.id, $event, 'rate' ])"
              >
            </td>
            <td>
              <scary-button
                message="Save"
                @click="save(season.id)"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import ScaryButton from '../../components/ScaryButton'

export default {
  props: {
    currency: Object,
    seasons: Array
  },

  data () {
    return {
      open: true
    }
  },

  components: {
    ScaryButton
  },

  methods: {
    save (season_id) {
      const rate = this.currency.rates.find(x => x.season_id === season_id)
      if (!rate) return
      this.axios.put(`currencies/${this.currency.id}/${season_id}`, { rate: rate.rate })
        .then(() => this.$toasted.success(`Saved`))
        .catch(e => this.$store.dispatch('error', e.response.data.error))
    }
  }
}
</script>

<style>
.currency .button {
  margin: 0;
}

.currency h4 {
  padding: 10px 15px;
  background: #D5DDE2;
  cursor: pointer;
}

.currency h4.open {
  background: #97A5AD;
  color: #FFF;
}
</style>
