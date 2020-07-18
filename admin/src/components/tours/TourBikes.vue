<template>
  <div class="tour-bikes js-pgt">
    <TourBike
      v-for="(price, i) in value"
      :key="price.id || (i * 13)"
      :price="price"
      :allBikes="allBikes"
      :boats="boats"
      :seasonData="seasonData"
      :prices="value"
      @removePrice="$emit('removeBike', i)"
      @update="update"
    />
  </div>
</template>

<script>
import TourBike from './TourBike'

export default {
  props: {
    value: Array,
    allBikes: Array,
    boats: Array,
    seasonData: Object,
    models: Array
  },

  components: {
    TourBike
  },

  methods: {
    update ([ id, value, key ]) {
      const index = this.value.findIndex(p => p.id === id)
      if (index === -1) return
      this.value[index][key] = Number(value.target.value)
    }
  }
}
</script>

<style lang="scss">
.tour-bikes .bike {
  position: relative;
  margin: 0 0 50px;
  border: 1px solid #F2F2F2;

  &__primary {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 2fr 1fr 2fr;
    background: #F2F2F2;
    padding: 20px 35px 20px 20px;

    .button {
      margin-bottom: 0;
    }
  }

  p,
  select,
  input {
    margin: 0;
  }

  .remove-circle {
    top: 4px;
    right: 4px;
  }
}
</style>
