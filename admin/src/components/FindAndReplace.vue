<template>
  <div>
    <header class="pgt__controls">
      <div>
        <button
          type="button"
          :class="{
            'button button--inline': true,
            'button--blue': !!open
          }"
          @click="open = !open"
        >Find &amp; Replace</button>
      </div>
      <div>
        <input
          placeholder="Adjust"
          type="number"
          @change="adjustPrices"
        >
      </div>
      <select @change="adjustCommission">
        <option value="">Change commission</option>
        <option
          v-for="rate in rates"
          :key="rate.id"
          :value="rate.id"
        >{{ rate.commission }}% - &times;{{ rate[markupType] }}</option>
      </select>
    </header>
    <form
      v-if="open"
      class="pgt-find"
      @submit="submit"
    >
      <input type="text" placeholder="Find" name="find" required>
      <input type="text" placeholder="Replace" name="replace">
      <select name="column">
        <option value="gross">Gross</option>
        <option value="non_com">Non-com</option>
        <option value="adjustment">Adjustment</option>
      </select>
      <input type="submit" class="button" value="Go!">
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false
    }
  },

  props: {
    rates: {
      type: Array
    },
    markupType: String
  },

  methods: {
    submit (event) {
      event.preventDefault()
      const { find, replace, column } = event.target
      this.$emit('submit', {
        find: find.value,
        replace: replace.value,
        column: column.value
      })
      event.target.reset()
    },

    adjustPrices (event) {
      const val = Number(event.target.value)
      event.target.value = ''
      if (!val) return

      this.$emit('adjustPrices', val)
    },

    adjustCommission (event) {
      const val = Number(event.target.value)
      event.target.value = ''
      if (!val) return

      this.$emit('adjustCommission', val)
    }
  }
}
</script>

<style>
.pgt-find {
  width: 100%;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(3, 1fr) 100px;
  align-items: center;
  padding: 10px;
  background: #F2F2F2;
  margin-bottom: 25px;
}

.pgt-find select,
.pgt-find input {
  margin: 0;
}

.pgt__controls {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 25px;
  width: 100%;
}

.pgt__controls > * {
  display: inline-block;
  margin-right: 20px;
}

.pgt__controls select,
.pgt__controls input {
  margin: 0;
  width: auto;
}

.pgt__controls .button {
  margin: 0;
}
</style>
