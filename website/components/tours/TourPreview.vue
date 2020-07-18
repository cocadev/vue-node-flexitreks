<template>
  <article class="tour-preview">
    <div class="tour-preview__left">
      <div class="tour-preview__top">
        <figure
          :data-bg="tour.media_id ? `url(${tour.image.url}${$store.state.sizes.tour})` : false"
        >
          <nuxt-link :to="url" />
        </figure>

        <header>
          <div class="tour-top-info-container clear">
            <h4
              v-if="tour.destinations.length"
              class="destinations">
              <span
                v-for="(tourDestination, k) in tour.destinations"
                :key="k"
                class="tour-location-list">
                <nuxt-link :to="{ name: 'destinations-slug', params: { slug: tourDestination.slug } }">
                  {{ tourDestination.name }}
                </nuxt-link>
              </span>
            </h4>
            <div class="tour-code-container">
              <tour-code :code="tour.tour_code" />
            </div>
          </div>
          <h2>
            <nuxt-link :to="url">{{ tour.name_short || tour.name }}</nuxt-link>
          </h2>
          <div class="sub-info">
            <ul>
              <li v-html="tourType" />
              <li>{{ nights }}</li>
              <li>{{ ['Self Guided', 'Guided', 'Self Guided & Guided'][tour.guidance || 0] }}</li>
            </ul>
          </div>
          <div
            class="tour-highlights"
            v-html="tourHighlights"
          />
        </header>
      </div>

      <footer>
        <div class="footer-margin" />
        <feefo-rating
          v-if="tour.rating"
          :score="Number(tour.rating)"
        />
      </footer>
    </div>

    <aside>
      <tour-meta :tour="tour" />
      <nuxt-link
        :to="url"
        class="button button--grey"
      >View tour details</nuxt-link>
    </aside>

  </article>
</template>

<script>
import TourCode from './TourCode'
import TourMeta from './TourMeta'
import FeefoRating from '../global/FeefoRating'

export default {
  name: 'TourPreview',

  components: {
    FeefoRating,
    TourCode,
    TourMeta
  },

  props: {
    tour: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      url: { name: `tours-slug`, params: { slug: this.tour.slug } }
    }
  },

  computed: {
    tourHighlights() {
      if (! this.tour.highlights) {
        return ''
      }
      const maxChars = 316
      if (this.tour.highlights.length <= maxChars) {
        return this.tour.highlights
      }
      return this.tour.highlights.slice(0, maxChars) + '...'
    },
    nights () {
      const nights = this.tour.nights ? [...this.tour.nights] : []
      if (!nights.length) return ''
      if (nights.length === 1) return nights[0] + ' nights'

      nights.sort((a, b) => a - b)
      return `${nights[0]} - ${nights[nights.length - 1]} nights`
    },
    tourType () {
      return this.tour.bike_and_boat ? 'Bike &amp; boat' : 'Bike &amp; hotel';
    }
  }

}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

article {
  background: #FFF;
  @include clear;
  position: relative;
  margin: 0 0 20px;
}

figure {
  background-size: cover;
  background-position: center;
  background-color: #E3EBEE;
  background-repeat: no-repeat;
  min-height: 200px;
  height: 50vw;
  position: relative;

  a {
    position: absolute;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
  }
}

header,
footer,
aside {
  padding: 20px;
}

footer {
  display: none;
  font-size: 14px;
  border-bottom: 1px solid $lightest;

  .columns {
    max-width: 730px;
    margin: 0 auto;
  }

  .footer-margin {
    float: left;
    left: 0;
    height: 100%;
    max-width: 297px;
    min-height: auto;
    width: 40%;

    &::after {
      content: "\00a0";
    }

    @include mq(60em, 'true') {
      display: none;
    }
  }
}

h4 {
  margin-bottom: 3px;

  &.destinations {
    float: left;

    span {
      &::after {
        content: ' - ';
      }

      &:last-of-type {
        &::after {
          content: '';
        }
      }
    }
  }
}

h2 {
  margin-bottom: 0;
}

.tour-code-container {
  float: right;
}

.tour-preview {
  &__top {
    border-bottom: 1px solid $lightest;

    .sub-info {
      ul {
        font-weight: bold;
        list-style-type: none;
        margin-bottom: 10px;

        li{
          display: inline;

          &::after {
            margin: 0 5px;
            content: "\2022";
          }

          &:last-child {
            &::after {
              content: '';
            }
          }
        }
      }
    }
  }
}

@include mq(35em) {
  footer {
    display: block;
  }
}

@include mq(720px) {
  article:before {
    content: '';
    position: absolute;
    right: 35%;
    height: 100%;
    border-left: 1px solid $lightest;
    display: block;
  }

  .tour-preview__left {
    width: 65%;
    float: left;
  }

  aside {
    float: right;
    margin-top: 200px;
    width: 35%;;
  }

  footer {
    border-bottom: none;
  }

  figure {
    position: absolute;
    width: 35%;
    height: 200px;
    right: 0;
    top: 0;
  }
}

@include mq(900px) {
  .tour-preview__top {
    position: relative;
    padding-left: 40%;
  }

  figure {
    left: 0;
    height: 100%;
    max-width: 297px;
    min-height: auto;
    width: 40%;
  }

  article:before {
    right: 297px;
  }

  .tour-preview__left {
    width: calc(100% - 297px);
    float: left;
  }

  aside {
    margin-top: 0;
    padding: 25px 30px;
    width: 297px;
  }
}

.tour-meta {
  padding-bottom: 30px;
}

.button {
  max-width: 340px;
}

@include mq(1100px) {
  .tour-preview__top {
    padding-left: 297px;
  }

  .button {
    position: absolute;
    width: 236px;
    right: 30px;
    bottom: 40px;
  }

  aside {
    padding-bottom: 80px;
  }

  header {
    padding: 24px 30px;
    min-height: 235px;

    .small {
      max-width: 600px;
    }
  }
}

</style>
