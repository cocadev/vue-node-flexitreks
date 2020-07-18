<template>
  <div class="tour-section tour-review-section">
    <header class="reviews-header clear">
      <h2>Feefo reviews</h2>
      <img
        src="/images/feefo.svg"
        alt="Feefo logo"
      >
    </header>
    <article
      v-for="review in reviews"
      :key="review.id"
      class="review"
    >
      <dl class="review-header">
        <template v-if="review.service_rating">
          <dt>Service rating</dt>
          <dd>
            <f-stars :score="review.service_rating" />
          </dd>
          <br>
        </template>
        <template v-if="review.product_rating">
          <dt>Product rating</dt>
          <dd><f-stars :score="review.product_rating" /></dd>
        </template>
      </dl>

      <p>
        <template v-if="review.date"><strong>Date</strong> {{ format(review.date) }}<br></template>
        <template v-if="review.author"><strong>Name</strong> {{ review.author }}</template>
      </p>

      <template v-if="review.service_comment">
        <strong>Service comment</strong><br>
        <div
          class="review__content"
          v-html="review.service_comment"
        />
      </template>

      <template v-if="review.product_comment">
        <strong>Product comment</strong><br>
        <div
          class="review__content"
          v-html="review.product_comment"
        />
      </template>

      <template v-if="review.response">
        <strong>Flexitreks Response</strong><br>
        <div
          class="review__content"
          v-html="review.response"
        />
      </template>

    </article>

    <div class="relative">
      <a
        v-if="slug"
        :href="`https://www.feefo.com/en-gb/reviews/flexitreks/products/${slug}?sku=${code}`"
        class="orange-link orange-link--arrow orange-link--large"
        target="_blank"
      >View more tour reviews</a>
    </div>
  </div>
</template>

<script>
import Thyme from '@trys/thyme'
import FStars from '../global/FStars'

export default {
  components: {
    FStars
  },

  props: {
    reviews: {
      type: Array,
      required: true
    },

    slug: {
      type: String,
      default () {
        return ''
      }
    },

    code: {
      type: String,
      default () {
        return ''
      }
    }
  },

  methods: {
    format (d) {
      const date = new Thyme(d)
      const double = digit => digit <= 9 ? '0' + digit : digit
      return `${double(date.getDate())}/${double(date.getMonth() + 1)}/${date.getFullYear()}`
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';

.tour-section + .tour-review-section {
  border-top: none;
  position: relative;
  margin-bottom: 72px;
  margin-top: -30px;
}

.orange-link {
  position: absolute;
  left: 0;
  top: calc(100% + 65px);
}

.reviews-header {
  padding: 30px 0;

  h2 {
    float: left;
    margin: 0;
  }

  img {
    float: right;
    width: 100px;
    margin: 4px 0 0;
  }
}

.review-header {
  border-top: 1px solid $light-grey;
  border-bottom: 1px solid $light-grey;
  padding: 16px 0 17px;
  margin-bottom: 20px;
}

dl {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;

  dt {
    width: 170px;
    display: inline-block;
    margin: 0;
  }
  
  dd {
    display: inline-block;
    margin: 0;
  }
}

.review {
  margin-bottom: 25px;
  font-size: 16px;
  line-height: 1.7;

  strong {
    min-width: 86px;
    display: inline-block;
    color: $dark;
  }

  &__content {
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}

</style>

