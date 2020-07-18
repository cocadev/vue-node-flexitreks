<template>
  <div class="tour-picker__wrapper">
    <label>Tours</label>
    <div class="tour-picker">
      <div class="tour-picker__list">
        <div v-for="tour in tours" :key="tour.id">
          <input
            type="checkbox"
            name="tour_ids"
            :id="`tour_ids_${tour.id}`"
            :value="tour.id"
            :checked="value.find(i => i.tour_id === tour.id)"
            @change="changeTour(tour.id)"
          />
          <label :for="`tour_ids_${tour.id}`">{{ tour.name }}</label>
        </div>
      </div>
      <div class="tour-picker__list tour-picker__selected">
        <div v-for="tour in selected" :key="`selected_${tour.id}`">
          <label
            :for="`tour_ids_${tour.id}_selected`"
            @click="changeTour(tour.id)"
          >{{ tour.name }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      tours: []
    }
  },

  created () {
    this.axios.get('tours/all')
      .then(res => {
        res.data.sort(this.sortTours)
        this.tours = res.data
      })
  },

  methods: {
    changeTour (id) {
      const current = this.value.findIndex(item => item.tour_id === id)
      if (current === -1) {
        this.value.push({ tour_id: this.tours.find(item => item.id === id).id })
      } else {
        this.value.splice(current, 1)
      }

      this.$emit('input', this.value)
    },

    sortTours (a, b) {
      const n1 = a.name.toLowerCase()
      const n2 = b.name.toLowerCase()
      if (n1 < n2) return -1
      if (n1 > n2) return 1
      return 0
    }
  },

  computed: {
    selected () {
      const tours = this.tours.filter(tour => this.value.find(x => x.tour_id === tour.id))
      tours.sort(this.sortTours)
      return tours
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/settings.scss';

.tour-picker {
  border: 1px solid $line;
  display: grid;
  grid-template-columns: 1fr 1fr;

  &__wrapper {
    grid-column: 1 / -1;
    margin: 0 0 30px;
  }

  &__list {
    height: 350px;
    overflow: scroll;
    padding: 20px;

    input {
      display: none;

      &:checked + label {
        opacity: 0.5;
        pointer-events: none;
      }
    }
  }

  &__selected {
    border-left: 1px solid $line;
  }
}
</style>
