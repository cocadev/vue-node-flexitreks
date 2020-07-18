<template>
  <div class="mix-picker">
    <hr>
    <label>{{ label }}</label>
    <div
      v-for="(term, i) in value"
      :key="i"
    >
      <f-input v-model="term.name" label="Name" :name="`popular_${i}_name`" />
      <f-input v-model="term.primary" label="Primary" :name="`popular_${i}_primary`" />
      <f-input v-model="term.slug" label="Slug" :name="`popular_${i}_slug`" />
      <f-input v-model="term.type" label="Route" :name="`popular_${i}_route`" />
      <f-input v-model="term.order" label="Order" :name="`popular_${i}_order`" />
      <button
        type="button"
        class="remove-circle"
        @click="remove(i)"
      />
    </div>
    <hr>
    <label>Add another</label>
    <form @submit.prevent="add" class="add-another">
      <select v-model="primary">
        <option value="">Pick a type to add</option>
        <option value="tour">Tour</option>
        <option value="destination">Destination</option>
        <option value="region">Region</option>
      </select>
      <select v-model="toAdd">
        <option
          v-for="option in secondary"
          :key="option.id"
          :value="option.id"
        >
          {{ option.name }}
        </option>
      </select>
      <button
        class="button"
        type="submit"
      >Add</button>
    </form>
    <hr>
  </div>
</template>

<script>
import FInput from '@/components/FInput'

export default {
  components: {
    FInput
  },

  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    label: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      primary: '',
      toAdd: '',
      tour: [],
      destination: [],
      region: []
    }
  },

  computed: {
    secondary () {
      return this.primary ? this[this.primary] : []
    }
  },

  created () {
    Promise.all([
      this.axios.get('tours/all'),
      this.axios.get('destinations'),
      this.axios.get('regions')
    ]).then(([
      tours,
      destinations,
      regions
    ]) => {
      this.tour = tours.data
      this.destination = destinations.data
      this.region = regions.data
    })
  },

  methods: {
    add () {
      const obj = this[this.primary].find(x => x.id === Number(this.toAdd))
      if (!obj) return

      this.$emit('add', {
        name: obj.name,
        primary: obj.name.toLowerCase(),
        slug: obj.slug,
        type: (this.primary || 'tour'),
        order: this.value.length + 1
      })
    },

    remove (index) {
      this.$emit('remove', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.mix-picker > div {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: repeat(5, 1fr) 50px;
  position: relative;
  padding-right: 40px;
}

.mix-picker > div button {
  top: 40px;
}

.add-another {
  grid-template-columns: 1fr 1fr 100px;
  display: grid;
  grid-gap: 30px;

  .button,
  select {
    margin: 0;
  }
}
</style>
