<template>
  <div class="itinerary">
    <header class="itinerary__header">
      <h2>Itinerary</h2>
      <div
        class="content"
        v-html="'<p>' + content + '</p>'"
      />
      <div class="horizontal">
        <div
          v-if="map"
          class="live-map"
        >
          <div class="map">
            <a
              :class="{ 'orange-link--arrow-up': showMap }"
              @click="showMap = !showMap"
            >
              View route on the map
            </a>
            <img 
              src="/images/gmap.png" 
              class="map-icon"
            >
          </div>
        </div>
        <div
          type="button"
          class="expand-all"
          @click="toggleAll"
        >
          <span style="flex: 1">{{ open.length === itinerary.length ? 'Close' : 'Expand' }} all </span>
          <img
            :class="open.length === itinerary.length ? 'down-up' : 'down-icon'"
            src="/images/orange-down.png" 
          >
        </div>
      </div>
      <div
        v-if="showMap"
        class="embed"
        v-html="map"
      />
    </header>
    <div class="itineraries">
      <div
        v-for="(day, i) in itinerary"
        :key="day.id"
        :style="{'background-color': i % 2 === 0 ? '#EDF4F6' : '#fff'}"
        class="day"
      >
        <header
          style="height: 48px"
          @click="toggleItinerary(i)"
        >
          <div>
            <span style="color: #003150; font-weight: 600">Day {{ day.day }} : </span>
            <span style="color: #003150; font-weight: 400"> {{ day.title.split(',')[0] }} </span>
          </div>
          <div style="color: #003150; font-weight: 400; margin-top: 3px">
            {{ day.title.split(',')[1] }}
          </div>
          <f-plus :active="open.includes(i)" />
        </header>
        <div
          :class="{
            day__content: true,
            active: open.includes(i)
          }"
        >
          <img
            v-if="day.media_id"
            :src="day.media.url + $store.state.sizes.itinerary"
            :alt="day.media.alt"
          >
          <div
            class="content"
            v-html="day.content"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FPlus from '../global/Plus'

export default {
  components: {
    FPlus
  },

  props: {
    content: {
      type: String,
      default () {
        return ''
      }
    },
    map: {
      type: String,
      default () {
        return ''
      }
    },
    itinerary: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {
      open: [],
      showMap: false
    }
  },

  methods: {
    toggleItinerary(index) {
      const id = this.open.findIndex(i => i === index);
      if (id !== -1) this.open.splice(id, 1)
      else this.open.push(index)
    },

    toggleAll() {
      if (this.open.length === this.itinerary.length) {
        this.open = []
      } else {
        this.open = [...this.itinerary.keys()]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.itinerary {
  border-top: 1px solid $light-grey;
  border-bottom: 1px solid $light-grey;
  padding-top: 30px;
  margin-bottom: 60px;

  h2 {
    margin-bottom: 10px;
  }

  &__header {
    @include clear;
  }

  @include mq(55em, 'true') {
    border-top: none;
    padding-top: 0;
  }
}

.expand-all {
  font: inherit;
  font-size: 13px;
  border-radius: 3px;
  float: right;
  margin: 0 0 21px;
  border: 1px solid #B8C5CA;
  box-shadow: none;
  padding: 3px 19px 5px 26px;
  cursor: pointer;
  transition: 300ms background-color;
  width: 250px;
  display: flex;
  align-items: center;
  color: #52869B;
  font-size: 15px;
}

.day {
  border-top: 1px solid $light-grey;
  padding: 14px 10px;

  &__content {
    margin-top: 20px;
    @include clear;
  }

  h3 {
    margin-bottom: 8px;
  }

  h4 {
    color: $copy;
    margin-bottom: 4px;
    padding-right: 30px;
  }

  img {
    margin: 0 0 20px;
  }

  header {
    cursor: pointer;
    position: relative;
  }

  .plus {
    margin: 6px 20px 0 0;
  }

  &__content {
    display: none;

    &.active {
      display: block;
      margin-bottom: 20px;
    }
  }

  @include mq(40em) {
    @include clear;

    img {
      float: right;
      width: 297px;
      margin: 0 0 0 30px;
    }

    &__content {
      margin-top: 30px;
    }

    img + .content {
      max-width: calc(100% - 350px);
    }
  }
}

.live-map {
  margin-bottom: 20px;

  .embed {
    margin-top: 30px;
  }

  > a {
    cursor: pointer;
  }
}
.horizontal {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.map {
  background: #F88F2B;
  width: 250px;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  color: #fff;
  border-radius: 4px;
  font-weight: 400;
  font-size: 15px;
}
.map:hover {
  cursor: pointer;
}
.map-icon {
  width: 20px;
  height: 20px;
}
.down-icon {
  width: 15px;
  height: 9px;
}
.down-up {
  width: 15px;
  height: 9px;
  transform: rotate(180deg);
}

</style>
