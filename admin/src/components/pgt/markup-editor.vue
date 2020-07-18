<template>
  <div class="markup-model">
    <h4
      :class="{ open }"
      @click="open = !open"
    >Model {{ model.name }}</h4>
    <div v-if="open">
      <table class="pgt-table">
        <thead>
          <tr>
            <th>Commission (%)</th>
            <th>Tour Markup</th>
            <th>Supplement Markup</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(rate, idx) in model.rates"
            :key="rate.id"
            :class="{'error': errorRates.indexOf(rate.id.toString()) > -1}"
          >
            <td>
              <input
                type="number"
                :value="rate.commission"
                @input="$emit('update', [ model.id, rate.id, $event, 'commission' ])"
              >
            </td>
            <td>
              <input
                type="number"
                :value="rate.markup"
                @input="$emit('update', [ model.id, rate.id, $event, 'markup' ])"
              >
            </td>
            <td>
              <input
                type="number"
                :value="rate.supplement_markup"
                @input="$emit('update', [ model.id, rate.id, $event, 'supplement_markup' ])"
              >
            </td>
            <td class="remove-rate"><button type="button" class="remove-circle" @click="removeRate(idx)"></button></td>
          </tr>
        </tbody>
      </table>
      <scary-button
        :message="`Save model ${model.name}`"
        @click="save"
      />
      <button
        type="button"
        class="button-subtle button-subtle--right"
        @click="$emit('addRate', model.id)"
      >Add rate</button>
    </div>
  </div>
</template>

<script>
import ScaryButton from '../../components/ScaryButton'

export default {
  props: {
    model: Object
  },

  data () {
    return {
      open: false,
      removedRates: [],
      errorRates: []
    }
  },

  components: {
    ScaryButton
  },

  methods: {
    save () {
      this.errorRates = []
      this.axios.put(`models/${this.model.season_id}/${this.model.id}`, { model: this.model, removedRatesIds: this.removedRates.map(item => item.id) })
        .then(() => this.$toasted.success(`Updated model ${this.model.name}`))
        .catch(e => {
          this.model.rates = this.model.rates.concat(this.removedRates)
          this.removedRates = []
          this.errorRates = e.response.data.error.split(',')
          this.$store.dispatch('error', 'An error occurred while adding or removing some items')
        })
    },

    removeRate (index) {
      const options = { title: 'Are you sure?', cancelLabel: 'Cancel', okLabel: 'Delete', size: 'sm' }
      this.$dialogs.confirm('You will not be able to revert this after saving!', options)
        .then(res => {
          if (res.ok) {
            if (!this.model.rates[index]) return
            if (this.model.rates[index].id) this.removedRates.push(this.model.rates[index])
            this.model.rates.splice(index, 1)
          }
        })
    }
  }
}
</script>

<style>
.markup-model .button {
  margin-bottom: 30px;
}

.markup-model h4 {
  padding: 10px 15px;
  background: #D5DDE2;
  cursor: pointer;
}

.markup-model h4.open {
  background: #97A5AD;
  color: #FFF;
}

.remove-rate {
  position: relative;
}

.remove-rate .remove-circle {
  position: relative;
}

.error td {
  background-color: #ff9b9b!important;
}
</style>
