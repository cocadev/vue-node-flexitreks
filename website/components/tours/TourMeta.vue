<template>
  <div class="tour-meta">
    <tour-shortlist :slug="tour.slug" />

    <div
      v-if="tour.min_price"
      class="price"
    >
      <h4>From</h4>
      <template v-if="tour.max_price && tour.max_price !== tour.min_price">
        <strong>£{{ tour.min_price }}</strong> to <strong>£{{ tour.max_price }}</strong>pp
      </template>
      <template v-else>
        <strong>£{{ tour.min_price }}</strong>pp
      </template>
    </div>

    <div
      v-if="tour.offers && tour.offers.length"
      class="offers"
    >
      <template v-for="offer in tour.offers">
        <info-box
          v-if="offer.content"
          :key="offer.id"
        >
          <template
            slot="toggle"
            slot-scope="info"
          >
            <a
              :class="{ active: info.open }"
              class="offer"
              @click="info.toggle"
            >{{ offer.name }}</a>
          </template>
          <div v-html="`<h5>${offer.name}</h5>` + offer.content" />
        </info-box>
        <span
          v-else
          :key="offer.id"
          class="offer"
        >
          {{ offer.name }}
        </span>
      </template>
    </div>

    <div class="meta">
      <div v-if="tourPage">
        <span>
          <tour-code :code="tour.tour_code" />
        </span>
        <span v-if="nights">
          {{ nights }}
        </span>
        <br v-if="nights">
        <span>
          {{ ['Self Guided', 'Guided', 'Self Guided & Guided'][tour.guidance || 0] }}
        </span>
        <br>
      </div>

      <template v-if="difficulty">
        {{ difficulty }}
        <info-box>
          <template v-for="difficulty in difficulties()">
            <h5 :key="`${difficulty.value}-label`">{{ difficulty.label }}</h5>
            <p :key="`${difficulty.value}-description`">{{ difficulty.description }}</p>
          </template>
        </info-box>
        <br>
      </template>

      <div v-if="! tourPage && tour.arrival_days">{{ 'Arrival days - ' + tour.arrival_days }}<br></div>

      {{ distance }} <br v-if="distance">

      <div v-if="tourPage && tour.arrival_days">{{ 'Arrival days - ' + tour.arrival_days }}<br></div>

      {{ tour.months }} <br v-if="tour.months">
      <div v-if="tourPage">
        <div v-if="tour.start_point">Start point - <span v-html="tour.start_point" /><br></div>
        <div v-if="tour.finish_point">Finish point - <span v-html="tour.finish_point" /><br></div>
      </div>
      {{ ! tour.solo_cyclists_allowed ? 'No solo cyclists allowed' : '' }}
    </div>

  </div>
</template>

<script>
import TourShortlist from './TourShortlist'
import InfoBox from '../global/InfoBox'
import difficulties from '@/mixins/difficulties'
import TourCode from './TourCode'

export default {
  components: {
    TourShortlist,
    InfoBox,
    TourCode
  },

  mixins: [difficulties],

  props: {
    tour: {
      type: Object,
      required: true
    },
    tourPage: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    difficulty () {
      const difficulties = this.difficulties().filter(difficulty => (this.tour.difficulty || []).indexOf(difficulty.value) !== -1).map(difficulty => difficulty.label)

      if (difficulties.length > 1) return `${difficulties[0]} to ${difficulties[difficulties.length - 1]}`
      if (difficulties.length) return difficulties[0];
      return ''
    },

    nights () {
      const nights = this.tour.nights ? [...this.tour.nights] : []
      if (!nights.length) return ''
      if (nights.length === 1) return nights[0] + ' nights'

      nights.sort((a, b) => a - b)
      return `${nights[0]} - ${nights[nights.length - 1]} nights`
    },

    distance () {
      let distance = this.tour.length
      if (!distance) return ''
      return distance ? Math.round(distance * 0.621371) + ' miles/' + distance + ' kms' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.price {
  font-size: 0.875em;

  h4 {
    margin-bottom: -2px;
  }

  strong {
    font-size: 2em;
    color: $dark;
    margin-right: 3px;

    & + strong {
      margin-left: 3px;
    }
  }
}

.tour-meta {
  position: relative;
}

.meta {
  line-height: 2em;
  font-size: 0.875em;
}

.offers {
  margin: 0 0 10px;
}

.offers /deep/ .offer {
  background: $orange;
  display: inline-block;
  color: #FFF;
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.05em;
  white-space: nowrap;
  padding: 8px 16px 8px 8px;
  position: relative;
  max-width: calc(100% - 22px);
  margin: 0 30px 5px 0;
  border-radius: 3px;
  z-index: 0;

  &:before {
    content: '';
    background: $orange;
    position: absolute;
    width: 21px;
    height: 21px;
    top: 11px;
    right: -1px;
    border-radius: 3px;
    transform: rotate(45deg) translateY(-50%);
    z-index: -1;
  }

  &:after {
    content: '';
    background: #fff;
    position: absolute;
    width: 6px;
    height: 6px;
    top: 11px;
    right: 0;
    border-radius: 100%;
  }
}

.offers /deep/ a.offer {
  cursor: pointer;

  &,
  &:before {
    transition: background-color 150ms;
  }

  &.active,
  &:hover {
    &,
    &:before {
      background: $light-blue;
    }
  }
}
</style>
