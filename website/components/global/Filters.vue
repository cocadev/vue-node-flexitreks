<template>
  <form
    class="filters"
  >
    <div class="wrap">
      <header class="filters__header clear">
        <button
          type="button"
          class="filters__toggle"
          @click="filtersClosed = !filtersClosed"
        >Filter <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
        >
          <path
            :fill="filtersClosed ? '#2E2E2E' : '#F88F2B'"
            d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z "
          />
        </svg></button>
        <span class="tour-count">
          <strong>{{ tourCount }}</strong> tour{{ tourCount === 1 ? '' : 's' }}
        </span>
      </header>

      <div
        :class="{
          'tour-filters': true,
          'filters--closed': filtersClosed
        }"
      >

        <country-dropdown
          :value="filters.countries"
          :options="this.$store.state.global.destinations"
          name="countries"
          label="Countries"
          @change="filterChange($event)"
        />

        <radio-reset
          :value="filters.bike_and_boat"
          :options="[
            { value: 'hotel', label: 'Bike & hotel' },
            { value: 'boat', label: 'Bike & boat' }
          ]"
          name="bike_and_boat"
          @change="$store.commit('changeFilter', { type: 'bike_and_boat', value: $event })"
        />

        <radio-reset
          :value="filters.guidance"
          :options="[
            { value: 'self-guided', label: 'Self guided' },
            { value: 'guided', label: 'Guided' }
          ]"
          name="guidance"
          @change="$store.commit('changeFilter', { type: 'guidance', value: $event })"
        />

        <radio-dropdown
          :value="filters.difficulty"
          :options="difficulties()"
          name="difficulty"
          label="Level"
          @change="$store.commit('changeFilter', { type: 'difficulty', value: $event })"
        />

        <radio-dropdown
          :value="filters.nights"
          :options="[
            { value: '1-4', label: '1-4 nights' },
            { value: '5-8', label: '5-8 nights' },
            { value: '9-14', label: '9-14 nights' }
          ]"
          name="nights"
          label="Number of nights"
          @change="$store.commit('changeFilter', { type: 'nights', value: $event })"
        />

        <radio-reset
          :value="filters.offers"
          :options="[
            { value: 'true', label: 'Offers' },
          ]"
          name="offers"
          @change="$store.commit('changeFilter', { type: 'offers', value: $event })"
        />
      </div>

    </div>
  </form>
</template>

<script>
import RadioReset from './RadioReset'
import RadioDropdown from './RadioDropdown'
import CountryDropdown from './CountryDropdown'
import difficulties from '@/mixins/difficulties'

export default {
  components: {
    RadioReset,
    RadioDropdown,
    CountryDropdown
  },

  mixins: [difficulties],

  data () {
    return {
      filtersClosed: true
    }
  },

  computed: {
    tourCount () {
      return this.$store.getters.currentTours.length
    },

    filters () {
      return this.$store.state.filters
    },

  },

  mounted () {
    if (String(this.$route.query.offer) === 'true') this.$store.commit('changeFilter', { type: 'offers', value: 'true' })
  },

  methods: {
    filterChange (country) {
      let myFilters = this.$store.state.filters.countries.slice(0);
      if(!myFilters.includes(country)){
         this.$store.dispatch('getToursForDestination', { slug: 'cycling-holidays-' + country.toLowerCase() })
         myFilters.push(country)
      } else{
        myFilters.splice(myFilters.indexOf(country), 1)
      }
      this.$store.commit('changeFilter', { type: 'countries', value: myFilters })
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/global/mixins.scss';

.filters {
  background: #FFF;
  padding-top: 20px;
  margin: 0 0 30px;

  .tour-count {
    width: 75px;
    font-size: 0.875em;
    display: inline-block;
    margin-bottom: 20px;

    @include mq(800px) {
      width: 90px;
    }
  }
}

.tour-filters {
  display: inline-flex;
  flex-wrap: wrap;

  & > * {
    margin: 0 10px 10px 0;
    display: inline-block;

    @include mq(1000px) {
      margin: 0 20px 20px 0;
    }
  }
}

.filters__toggle {
  float: left;
  display: none;
  font: inherit;
  color: inherit;
  font-size: 13px;
  font-weight: 700;
  position: relative;
  padding: 0 25px 0 0;
  background: transparent;
  border: none;

  svg {
    position: absolute;
    right: 0;
    top: 2px;
  }
}

.filters__header {
  @include mq(768px) {
    display: inline;

    &:before,
    &:after {
      display: none;
    }
  }
}

@include mq(767px, 'true') {
  .tour-count {
    text-align: right;
    float: right;
  }

  .filters__toggle {
    display: block;
  }

  .filters--closed {
    display: none;
  }

  .radio-dropdown,
  .radio-dropdown button,
  .radio-reset {
    width: 100%;
    margin-right: 0;
  }

  .radio-reset {
    text-align: center;
  }

  .radio-reset label {
    width: 50%;
  }

  .radio-reset label:nth-last-child(2):first-child {
    width: 100%;
  }
}
</style>
