<template>
  <div class="overflow why-flexitreks">
    <div class="wrap">
      <div class="clear">
        
        <div class="why">
          <div v-html="$store.state.global.options.why_flexitreks_content || ''" />
          <p>
            <nuxt-link
              to="/about/"
              class="orange-link orange-link--arrow"
            >Find out more</nuxt-link>
          </p>
        </div>

        <div
          v-if="review"
          class="service"
        >
          <div>
            <div v-html="reviews_summary" />
            <a
              href="https://www.feefo.com/en-GB/reviews/flexitreks"
              class="orange-link orange-link--arrow"
              target="_blank"
            >
              View all reviews
            </a>
          </div>

          <div class="feefo-highlight">
            <div class="feefo-highlight__rating">
              <feefo-rating :score="Number(review.rating)" />
            </div>
            <p v-html="review.service_comment" />
            <a
              :href="review.feefo_url"
              class="orange-link"
              target="_blank"
            >
              Read full review
            </a>
            <button
              class="feefo-next"
              type="button"
              @click="nextReview"
            >
              <img
                src="~/assets/images/arrow.svg"
                alt="Next review"
              >
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FeefoRating from './FeefoRating'

export default {
  components: {
    FeefoRating,
  },

  data() {
    return {
      currentReview: 0
    }
  },

  computed: {
    review () {
      const reviews = this.reviews
      return reviews[this.currentReview] || {}
    },

    reviews () {
      return this.$store.state.global.options.reviews || []
    },

    reviews_count () {
      return this.$store.state.global.reviews_count || 0
    },

    reviews_rating () {
      return this.$store.state.global.options.feefo_average || 0
    },

    reviews_summary () {
      return this.$store.state.global.options.our_service_content
        .replace('{reviews_count}', this.reviews_count)
        .replace('{reviews_rating}', this.reviews_rating)
    }
  },

  methods: {
    nextReview() {
      this.currentReview = this.currentReview + 1;
      if (! this.review) this.currentReview = 0;
    }
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.why-flexitreks {
  background: $lightest;
  padding-top: 30px;

  .home &  {
    background: linear-gradient(#FFF, #E0E8ED);
  }

  .blocks + & {
    background: #FFF;
  }

  @include mq(50em) {
    padding-top: 0px;
    background: linear-gradient(#FFF, #E0E8ED);

    .blocks + & {
      padding-top: 60px;
    }

    .home &  {
      background: transparent;
    }

    .service {
      margin-bottom: 70px;
    }
  }
}

.why {
  max-width: 620px;
  margin: 0 0 60px;

  h2 {
    max-width: 550px;
    margin-bottom: 38px;
    line-height: 1.222;
  }

  h4 {
    margin-bottom: 20px;
  }

  .orange-link {
    margin-top: 30px;
    font-size: 1em;
    display: inline-block;
  }

  ul {
    list-style: none;
    padding-top: 10px;
  }

  li {
    padding: 1px 0 1px 40px;
    background: url('~/assets/images/tick.svg') 0 center no-repeat;
  }

  li + li {
    margin-top: calc(1em - 2px);
  }
}

.service {
  padding: 30px 20px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  background: #FFF;
  margin: 0 -20px;
  position: relative;

  p {
    font-size: 14px;
  }

  h4 {
    margin-bottom: 20px;
  }

  h2 {
    margin-bottom: 35px;
    line-height: 1.222;
  }

  .orange-link--arrow {
    font-size: 16px;
  }

  &:before,
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    background: #FFF;
    top: 0;
  }

  &:after {
    width: 20px;
    left: 100%;
  }

  &:before {
    width: 50vw;
    box-shadow: 20px 5px 20px rgba(0, 0, 0, 0.2);
    left: 100%;
    margin-left: -20px;
  }

  @include mq(40em, 50em) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 30px;
  }
}

.feefo-highlight {
  position: relative;
  background: $lightest;
  border-radius: 4px;
  padding: 30px 30px 20px 30px;
  margin-top: 35px;

  &__rating {
    margin-bottom: 15px;
  }

  p {
    font-family: 'Libre Baskerville';
    font-style: italic;
    line-height: 1.71;
    margin-bottom: 10px;

    & + .orange-link {
      font-size: 12px;
    }
  }
}

.feefo-next {
  cursor: pointer;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;

  position: absolute;
  right: 15px;
  bottom: 15px;
}

@include mq(50em) {
  .why {
    padding-top: 30px;
    width: calc(50% - 15px);
    float: left;
  }

  .service {
    max-width: 537px;
    width: calc(50% - 15px);
    float: right;
  }
}

@include mq(1000px) {
  .why {
    padding-top: 40px;
  }

  .service {
    padding: 40px;
  }
}

@include mq(1200px) {
  .service {
    padding: 65px 20px 100px 80px;
  }

  .why {
    padding-top: 65px;
  }
}
</style>
