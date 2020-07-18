<template>
  <div v-if="available_extras.length">
    <slot name="before" />

    <div class="group clear">
      <div
        v-for="e in available_extras"
        :key="e.tour_room_extra_id"
        class="extra-picker checkboxes"
      >
        <label class="clear">
          <input
            :checked="open.includes(e.tour_room_extra_id) || e.pre || e.post"
            type="checkbox"
            @change="toggle(e.tour_room_extra_id)"
          >
          {{ e.extra.name }}
          <small class="cost">From {{ cost(e.from) }}</small>
        </label>

        <div
          v-if="open.includes(e.tour_room_extra_id) && e.extra.pre"
          class="options"
        >
          <h4>Pre-holiday</h4>
          <div
            :class="{
              option: true,
              'option--open': !!e.pre
            }"
          >
            No. of nights
            <span class="quantities">
              <button
                :disabled="!e.pre"
                type="button"
                class="quantity"
                @click="$emit('changeExtraQuantity', room.room_id, e.tour_room_extra_id, false, -1)"
              >
                Remove extra night
              </button>
              {{ e.pre ? e.pre.quantity : 0 }}
              <button
                type="button"
                class="quantity"
                @click="$emit('changeExtraQuantity', room.room_id, e.tour_room_extra_id, false, 1, !e.pre && e.roomsTypes.length ? e.roomsTypes[0] : {})"
              >
                Add extra night
              </button>
            </span>
            <strong class="cost">+ {{ cost(e.pre ? e.pre.cost : 0) }}</strong>
            <div
              v-show="e.pre"
              class="option__choices"
            >
              <time v-if="e.pre && e.pre.arrival">Your arrival date will be the {{ e.pre.arrival.format() }}</time>
              <div class="checkboxes">
                <label
                  v-for="room_type in e.roomsTypes"
                  :key="`${room_type.accommodation_category_id}_${room_type.room_type_id}_pre`"
                >
                  <input
                    :name="`${id}_${e.tour_room_extra_id}_pre`"
                    :checked="e.pre && e.pre.accommodation_category_id === room_type.accommodation_category_id && e.pre.room_type_id === room_type.room_type_id"
                    type="radio"
                    @change="$emit('changeExtraRoomType', room.room_id, e.tour_room_extra_id, false, room_type)"
                  >
                  <span>{{ build.rooms.find(r => r.id === room_type.room_type_id).name }}</span>
                  <small v-if="room_type.accommodation_category_id">{{ build.accommodation.find(r => r.id === room_type.accommodation_category_id).name }}</small>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="open.includes(e.tour_room_extra_id) && e.extra.post"
          class="options"
        >
          <h4>Post-holiday</h4>
          <div
            :class="{
              option: true,
              'option--open': !!e.post
            }"
          >
            No. of nights
            <span class="quantities">
              <button
                :disabled="!e.post"
                type="button"
                class="quantity"
                @click="$emit('changeExtraQuantity', room.room_id, e.tour_room_extra_id, true, -1)"
              >
                Remove extra night
              </button>
              {{ e.post ? e.post.quantity : 0 }}
              <button
                type="button"
                class="quantity"
                @click="$emit('changeExtraQuantity', room.room_id, e.tour_room_extra_id, true, 1, !e.post && e.roomsTypes.length ? e.roomsTypes[0] : {})"
              >
                Add extra night
              </button>
            </span>
            <strong class="cost">+ {{ cost(e.post ? e.post.cost : 0) }}</strong>
            <div
              v-show="e.post"
              class="option__choices"
            >
              <time v-if="e.post && e.post.departure">Your departure date will be the {{ e.post.departure.format() }}</time>
              <div class="checkboxes">
                <label
                  v-for="room_type in e.roomsTypes"
                  :key="`${room_type.accommodation_category_id}_${room_type.room_type_id}_post`"
                >
                  <input
                    :name="`${id}_${e.tour_room_extra_id}_post`"
                    :checked="e.post && e.post.accommodation_category_id === room_type.accommodation_category_id && e.post.room_type_id === room_type.room_type_id"
                    type="radio"
                    @change="$emit('changeExtraRoomType', room.room_id, e.tour_room_extra_id, true, room_type)"
                  >
                  <span>{{ build.rooms.find(r => r.id === room_type.room_type_id).name }}</span>
                  <small v-if="room_type.accommodation_category_id">{{ build.accommodation.find(r => r.id === room_type.accommodation_category_id).name }}</small>
                </label>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <slot name="after" />
  </div>
</template>

<script>
import Thyme from '@trys/thyme'
import currency from '@/mixins/currency'
import getDates from '@/mixins/getDates'

export default {
  mixins: [currency, getDates],

  props: {
    id: {
      type: String,
      required: true
    },
    value: {
      type: Array,
      default () {
        return []
      }
    },
    extras: {
      type: Array,
      default () {
        return []
      }
    },
    room: {
      type: Object,
      required: true
    },
    date: {
      type: Object,
      required: true
    },
    parentDeparture: {
      type: String,
      required: true
    },
    parentroom: {
      type: Number,
      required: true
    },
    parentaccom: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      open: []
    }
  },

  computed: {
    available_extras () {
      return this.extras
      .filter(extra => extra.variations.length)
      .map(extra => {
        let pre = false
        let post = false

        const roomsTypes = []

        const rooms = this.relevantExtras(extra).map(v => {
          if (!roomsTypes.find(r => r.accommodation_category_id === v.accommodation_category_id && r.room_type_id === v.room_type_id)) {
            roomsTypes.push({
              accommodation_category_id: v.accommodation_category_id,
              room_type_id: v.room_type_id
            })
          }
          const sleeps = this.build.rooms.find(r => r.id === v.room_type_id).sleeps || 1
          const totalCost = v.cost * sleeps
          return {
            totalCost: totalCost,
            accommodation_category_id: v.accommodation_category_id,
            room_type_id: v.room_type_id
          }
        })

        let from = Math.min(...rooms.map(v => v.totalCost)) || 0

        if (!rooms.length) return null

        const current = this.value.filter(e => e.tour_room_extra_id === extra.id)
        current.forEach(c => {
          if (c.post) post = c
          else pre = c
        })

        return {
          tour_room_extra_id: extra.id,
          extra,
          roomsTypes,
          rooms,
          from,
          pre,
          post
        }
      })
      .filter(a => a)
    },

    build () {
      return this.$store.state.build
    }
  },

  methods: {
    toggle (id) {
      const index = this.open.indexOf(id)
      if (index === -1) this.open.push(id)
      else this.open.splice(index, 1)
    },
    relevantExtras (e) {
      // Only show extra night options for the same room type
      return e.variations.filter(v => {
        let d = new Thyme(e.post ? this.parentDeparture : this.date.date)
        e.post ? d.add() : d.remove()
        const dates = this.getExtraVariationDates(v);
        if (!dates.contains(d)) return false;
        if (v.accommodation_category_id) {
          return v.room_type_id == this.parentroom && v.accommodation_category_id == this.parentaccom
        } else {
          return v.room_type_id == this.parentroom
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.extra-picker {
  padding: 15px 0 13px;
  border-bottom: 1px solid $line;
  font-size: 14px;
  font-weight: 300;
  clear: right;

  label {
    font-size: 14px;
    font-weight: 300;
    margin: 0;
  }
}

.cost {
  float: right;
}

.options {
  padding-top: 20px;
  border-top: 1px solid $line;
  margin-top: 13px;

  h4 {
    font-size: 14px;
  }
}

.option {
  border: 1px solid $lightest;
  margin: 0 0 30px;
  padding: 13px;
  transition: 300ms background-color;

  .quantities {
    margin-left: 10px;
  }

  &--open {
    background-color: $lightest;
  }

  time {
    background: #FFF;
    display: block;
    font-size: 12px;
    padding: 5px 10px;
    margin: 20px 0 0;
  }

  &__choices label {
    border-bottom: 1px solid $line;
    padding-top: 12px;
    padding-bottom: 12px;

    input {
      transform: translateY(-50%);
      top: 50%;
    }

    span {
      min-width: 120px;
      display: inline-block;
    }

    small {
      display: inline-block;
    }
  }
}

.quantity {
  width: 20px;
  height: 20px;
  background: $line;
  border-radius: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-indent: 200%;
  display: inline-block;
  padding: 0;
  border: none;
  cursor: pointer;
  position: relative;

  &[disabled] {
    opacity: 0.3;
  }

  &:before,
  &:after {
    content: '';
    width: 1px;
    height: 10px;
    background: $copy;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate3d(-50%, -50%, 0);
  }

  &:after {
    transform: translate3d(-50%, -50%, 0) rotate(90deg);
  }
}

.quantities {
  display: inline-block;
  margin-right: 22px;
  width: 68px;
  text-align: center;

  :first-child {
    float: left;

    &:before {
      display: none;
    }
  }

  :last-child {
    float: right;
  }

  &:after {
    content: '';
    clear: both;
    display: table;
  }
}
</style>
