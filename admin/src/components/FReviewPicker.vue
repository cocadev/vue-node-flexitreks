<template>
  <div class="review-picker__wrapper">
    <label>Reviews</label>
    <div class="review-picker">
      <div class="review-picker__list">
        <div v-for="review in reviews" :key="review.id">
          <input
            type="checkbox"
            name="review_ids"
            :id="`review_ids_${review.id}`"
            :value="review.id"
            :checked="value.find(i => i === review.id)"
            @change="changeReview(review.id)"
          />
          <label :for="`review_ids_${review.id}`">{{ review.author }} {{ review.rating }}/5</label>
        </div>
      </div>
      <div class="review-picker__list review-picker__selected">
        <div v-for="review in selected" :key="`selected_${review.id}`">
          <label
            :for="`review_ids_${review.id}_selected`"
            @click="changeReview(review.id)"
          >{{ review.author }} {{ review.rating }}/5</label>
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
      reviews: []
    }
  },

  created () {
    this.axios.get('reviews')
      .then(res => {
        res.data.sort(this.sortReviews)
        this.reviews = res.data
      })
  },

  methods: {
    changeReview (id) {
      const current = this.value.findIndex(item => item === id)
      if (current === -1) {
        this.value.push(this.reviews.find(item => item.id === id).id)
      } else {
        this.value.splice(current, 1)
      }

      this.$emit('input', this.value)
    },

    sortReviews (a, b) {
      const r1 = a.date
      const r2 = b.date
      if (r1 < r2) return -1
      if (r1 > r2) return 1
      return 0
    }
  },

  computed: {
    selected () {
      const reviews = this.reviews.filter(review => this.value.find(x => x === review.id))
      reviews.sort(this.sortReviews)
      return reviews
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/scss/settings.scss';

.review-picker {
  border: 1px solid $line;
  display: grid;
  grid-template-columns: 1fr 1fr;

  &__wrapper {
    grid-column: 1 / -1;
    margin: 0 0 30px;
  }

  label {
    font-weight: 400;
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
