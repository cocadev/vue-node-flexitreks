<template>
  <div>
    <hr>
    <div v-if="tours.length && show">
      <h3>Copy From</h3>
      <select
        v-model="slug"
        @change="getTour"
      >
        <option value="">Pick a tour</option>
        <option
          v-for="tour in tours"
          :key="tour.id"
          :value="tour.slug"
        >
          {{ tour.name }}
        </option>
      </select>
      <select
        v-if="seasons.length"
        v-model="season"
      >
        <option value="">Pick a season</option>
        <option
          v-for="season in seasons"
          :key="season.id"
          :value="season"
        >
          {{ season.name }}
        </option>
      </select>
    </div>
    <button
      :class="['button', {'disabled': !this.season.id && this.show}]"
      type="button"
      @click="copy"
    >Copy</button>
  </div>
</template>

<script>
export default {
  props: {
    pageType: {
      type: String,
      default: ''
    }
  },

  data () {
    return {
      tour: null,
      slug: '',
      season: '',
      tours: [],
      show: false
    }
  },

  methods: {
    copy () {
      if (this.season.id && this.show) {
        this.seasonChange()
      }
      if (!this.show) {
        this.getTours()
      }
    },

    getTours () {
      this.show = true
      if (this.tours.length) return

      this.axios.get('tours/all')
        .then(res => {
          this.tours = res.data
        })
    },

    getTour () {
      if (!this.slug) return
      this.axios.get(`tours/${this.slug}`)
        .then(res => {
          this.tour = res.data
        })
    },

    seasonChange () {
      const options = { title: `Are you sure you want to copy ${this.pageType} data from ${this.tour.name} season ${this.season.name} to this tour?`, cancelLabel: 'No', okLabel: 'Yes' }
      return this.$dialogs.confirm('', options)
        .then(res => {
          if (res.ok) {
            this.$emit('change', {
              season_id: this.season.id,
              tour_id: this.tour.id
            })
            this.show = false
            this.slug = ''
            this.season = {}
          }
        })
    }
  },

  computed: {
    seasons () {
      return this.tour ? this.tour.allSeasons : []
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled {
  opacity: 0.5;
}
</style>
