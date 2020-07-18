<template>
  <div class="tour">
    <f-hero-slider
      :options="{
        duration: 500,
        loop: true,
        perPage: {
          500 : Math.min(tour.gallery ? tour.gallery.length : 2, 1),
        },
        count: ( tour.gallery ? tour.gallery.length : 0 ) + (tour.hero ? 1 : 0)
      }"
    >
      <f-hero
        v-if="tour.hero && tour.hero.url"
        :image="tour.hero && tour.hero.url"
        gradient="part"
      />
      <f-hero
        v-for="(feature, i) in tour.gallery"
        :key="i"
        :image="feature.url"
        gradient="part"
      />
    </f-hero-slider>

    <no-ssr>
      <f-lightbox
        v-if="lightboxOpen && tour.gallery && tour.gallery.length"
        :images="tour.gallery"
        @close="lightboxOpen = false"
      />
    </no-ssr>

    <div class="wrap">
      <div class="no-desktop relative">

        <tour-shortlist :slug="tour.slug" />
        <h1>{{ tour.name }}</h1>

        <div class="sub-info">
          <ul>
            <li v-html="tourType" />
            <li
              v-for="(tourDestination) in tour.destinations"
              :key="tourDestination.id"
              class="tour-location-list">
              <nuxt-link :to="{ name: 'destinations-slug', params: { slug: tourDestination.slug } }">
                {{ tourDestination.name }}
              </nuxt-link>
            </li>
          </ul>
        </div>

        <tour-content :content="tour.content" />
      </div>

      <tour-secondary
        :tour="tour"
        @viewReviews="viewReviews"
      />

      <main class="primary">
        <div class="no-mobile">

          <div
            ref="Overview"
            class="breadcrumbs"
          >

            <nuxt-link
              class="orange-link orange-link--arrow orange-link--large"
              style="font-size: 13px"
              to="/"
            >
              Home
            </nuxt-link>

            <nuxt-link
              class="orange-link orange-link--arrow orange-link--large"
              style="font-size: 13px"
              to="/destinations"
            >
              Destinations
            </nuxt-link>
            <a
              class="orange-link orange-link--arrow orange-link--large"
              style="font-size: 13px"
            >
              <a
                v-if="tour.destinations.length"
                class="tour__destination"
                style="font-size: 13px"
              >
                <span
                  v-for="(tourDestination) in tour.destinations"
                  :key="tourDestination.id"
                  class="tour-location-list">
                  <nuxt-link :to="{ name: 'destinations-slug', params: { slug: tourDestination.slug } }">
                    {{ tourDestination.name }}
                  </nuxt-link>
                </span>
              </a>
            </a>
            <a style="color: #003150">
              {{ tour.name_short }} Tour
            </a>
          </div>

          <div :class="navClass">
            <div
              v-for="nav in [
                { title: 'Overview', visible: true },
                { title: 'Itinerary', visible: true },
                { title: 'Bikes', visible: tour.bikes && tour.bikes.length },
                { title: 'Accommodation', visible: accommodation },
                { title: 'Getting there', visible: tour.meta && tour.meta.getting_there },
                { title: 'Reviews', visible: tour.reviews && tour.reviews.length },
              ]"
              v-show="nav.visible"
              :key="nav.title"
              :class="activeNav === nav.title ? 'subnav2': 'subnav'"
              @click="goto(nav.title)"
            >
              {{ nav.title }}
            </div>
          </div>

          <h1>{{ tour.name }}</h1>

          <div class="sub-info">
            <ul>
              <li v-html="tourType" />
              <li
                v-for="(tourDestination) in tour.destinations"
                :key="tourDestination.id"
                class="tour-location-list">
                <nuxt-link :to="{ name: 'destinations-slug', params: { slug: tourDestination.slug } }">
                  {{ tourDestination.name }}
                </nuxt-link>
              </li>
            </ul>
          </div>

          <tour-content :content="tour.content" />
        </div>

        <template v-if="tour.meta">
          <div ref="Itinerary">
            <tour-itinerary
              :content="tour.meta.itinerary_snippet || ''"
              :map="tour.meta.live_map"
              :itinerary="tour.itinerary"
            />
          </div>

          <div ref="Bikes">
            <div class="tour-section">
              <h2>Bikes</h2>
              <div
                class="content"
                v-html="tour.meta.bikes_snippet || ''"
              />
              <f-hero-slider
                :options="{
                  duration: 500,
                  loop: true,
                  type: 'small',
                  perPage: {
                    500 : Math.min(tour.bike_gallery ? tour.bike_gallery.length : 2, 1),
                  },
                  count: tour.bike_gallery ? tour.bike_gallery.length : 0
                }"
              >
                <gallery-slide
                  v-for="(feature, x) in tour.bike_gallery"
                  :key="x"
                  :image="feature.url"
                  :caption="feature.caption"
                  gradient="part"
                />
              </f-hero-slider>
            </div>
          </div>

          <div ref="Accommodation">
            <div class="tour-section">
              <h2>Accommodation</h2>
              <div
                class="content"
                v-html="accommodation || ''"
              />
              <div
                v-for="(boat, i) in tour.boats"
                :key="i"
              >
                <div class="boat_name"> {{ tour.boats[i].name }} </div>
                <div class="boat_description"> {{ tour.boats[i].description }} </div>
                <f-hero-slider
                  :options="{
                    duration: 500,
                    loop: true,
                    type: 'small',
                    perPage: {
                      500 : Math.min(tour.boats[i].gallery ? tour.boats[i].gallery.length : 2, 1),
                    },
                    count: tour.boats[0].gallery ? tour.boats[i].gallery.length : 0
                  }"
                >
                  <gallery-slide
                    v-for="(feature, x) in tour.boats[i].gallery"
                    :key="x"
                    :image="feature.url"
                    :caption="feature.caption"
                    gradient="part"
                  />
                </f-hero-slider>
              </div>
            </div>
          </div>

          <div ref="Getting there">
            <tour-section
              v-if="tour.meta.getting_there"
              :content="tour.meta.getting_there"
              title="Getting there"
            />
          </div>

          <div ref="Reviews">
            <tour-reviews
              v-if="tour.reviews.length"
              :reviews="tour.reviews"
              :slug="tour.slug"
              :code="tour.tour_code"
            />
          </div>
        </template>
      </main>
    </div>

    <tour-weather
      v-if="tour.weather && tour.weather.length"
      :months="tour.weather"
    />

    <div
      v-if="tour.related && tour.related.length"
      class="related wrap center"
    >
      <h2>You might also be interested in&hellip;</h2>
      <div class="clear three-col">
        <tour-simple-preview
          v-for="relatedTour in tour.related"
          :key="relatedTour.id"
          :tour="relatedTour"
        />
      </div>
      <nuxt-link
        v-if="tour.destinations && tour.destinations.length"
        :to="{
          name: 'destinations-slug',
          params: {
            slug: tour.destinations[0].slug
          }
        }"
        class="button button--grey"
      >
        Explore all tours in {{ tour.destinations[0].name }}
      </nuxt-link>
    </div>

    <back-to-top />

  </div>
</template>

<script>
import FHero from '@/components/global/Hero'
import GallerySlide from '@/components/global/GallerySlide'
import FHeroSlider from '@/components/global/HeroSlider'
import BackToTop from '@/components/global/BackToTop'
import FLightbox from '@/components/global/Lightbox'
import TourContent from '@/components/tours/TourContent'
import TourCode from '@/components/tours/TourCode'
import TourItinerary from '@/components/tours/TourItinerary'
import TourSection from '@/components/tours/TourSection'
import TourSecondary from '@/components/tours/TourSecondary'
import TourSimplePreview from '@/components/tours/TourSimplePreview'
import TourWeather from '@/components/tours/TourWeather'
import TourReviews from '@/components/tours/TourReviews'
import TourShortlist from '@/components/tours/TourShortlist'

export default {
  async asyncData({ params, store }, callback) {
    try {
      const detailed = store.state.detailedTours.find(t => t.slug === params.slug)
      if (detailed) {
        store.commit('setCurrentTour', detailed)
        await store.dispatch('getBuild')
        return callback(null)
      }

      const standard = store.state.tours.find(t => t.slug === params.slug)
      if (standard) {
        store.commit('setCurrentTour', standard)
        store.dispatch('getTour', params.slug)
        store.dispatch('getBuild')
        return callback(null)
      }

      await Promise.all([
        store.dispatch('getTour', params.slug),
        store.dispatch('getBuild')
      ])
      callback(null)
    } catch(e) {
      callback({ statusCode: 404, message: 'Page not found' })
    }
  },

  components: {
    GallerySlide,
    FHero,
    FHeroSlider,
    BackToTop,
    TourContent,
    TourCode,
    TourItinerary,
    TourSection,
    TourSecondary,
    TourSimplePreview,
    TourWeather,
    TourReviews,
    FLightbox,
    TourShortlist
  },

  data () {
    return {
      lightboxOpen: false,
      windowTop: 0,
      activeNav: 'Overview',
      navClass: 'stiky-nav'
    }
  },

  computed: {
    tour () {
      return this.$store.state.tour
    },

    tourType () {
      return this.tour.bike_and_boat ? 'Bike &amp; boat' : 'Bike &amp; hotel';
    },

    tourHeroUrl () {
      let heroUrl = ''
      if (this.tour.hero) {
        heroUrl = this.tour.hero.url
      }
      else if (this.tour.gallery && this.tour.gallery.length) {
        heroUrl = this.tour.gallery[0].url
      }
      return heroUrl
    },

    accommodation () {
      if (!this.tour || !this.tour.meta || !this.tour.meta.accommodation) return ''
      return this.tour.meta.accommodation.replace(/\<a/g, '<a target="_blank"')
    }
  },

  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },

  beforeDestroy() {
    window.removeEventListener("scroll", this.onScroll)
  },

  methods: {
    onScroll(e) {
      this.windowTop = window.top.scrollY
      if(window.top.scrollY > this.$refs['Overview'].offsetTop - 250) { this.activeNav = 'Overview'}
      if(window.top.scrollY > this.$refs['Itinerary'].offsetTop - 250) { this.activeNav = 'Itinerary'}
      if(window.top.scrollY > this.$refs['Bikes'].offsetTop - 250) { this.activeNav = 'Bikes'}
      if(window.top.scrollY > this.$refs['Accommodation'].offsetTop - 250) { this.activeNav = 'Accommodation'}
      if(window.top.scrollY > this.$refs['Getting there'].offsetTop - 250) { this.activeNav = 'Getting there'}
      if(window.top.scrollY > this.$refs['Reviews'].offsetTop - 250) { this.activeNav = 'Reviews'}

      if(window.top.scrollY > this.$refs['Overview'].offsetTop - 150) {
        this.navClass = 'stiky-nav2'
      } else {
        this.navClass = 'stiky-nav'
      }

    },
    goto(refName) {
        var element = this.$refs[refName];
        var top = element.offsetTop;
        window.scrollTo({ top: top- 170, behavior: 'smooth'});
    },

    viewReviews() {
      if (! this.tour.reviews.length) return

      const reviews = document.querySelector('.tour-review-section')
      const header = document.querySelector('header[role=banner]')
      const search = document.querySelector('.search')

      let top = reviews.offsetTop - header.offsetHeight
      if (getComputedStyle(search).visibility !== 'hidden') top -= search.offsetHeight

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      })
    }
  },

  head () {
    const title = this.tour.seo_title || this.tour.name
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/mixins.scss';
@import '@/assets/scss/global/settings.scss';

.hero__content {
  min-height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  flex-direction: column;
  position: relative;
  z-index: 1;

  .wrap {
    width: 100%;
  }

  .button {
    margin: 0 25px -5px 0;
  }

  .feefo-rating {
    color: #FFF;
    display: inline-block;
  }

  @include mq(40em, 'true') {
    .button {
      position: absolute;
      margin: 0;
      right: 15px;
      top: 15px;
      font-size: 12px;
      padding: 6px 20px;
    }

    .wrap {
      padding-bottom: 10px;
    }
  }
}

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

.wrap {
  padding-top: 15px;
  padding-bottom: 15px;

  @include mq(40em) {
    padding-top: 30px;
    padding-bottom: 30px;
  }
}

.primary {
  margin: 0 0 30px;
}

.tour {
  &__destination {
    margin: 0 0 2px;

    .tour-location-list {
      color: orange ;
      font-style: normal!important;
      &:not(:last-of-type) {
        &:after {
          content: ' / ';
        }
      }
    }
  }

  h1 {
    margin: 0 0 5px;
  }

  .tour-code {
    margin-bottom: 25px;
  }

  .content {
    margin-bottom: 30px;
  }

  &-section {
    border-top: 1px solid $light-grey;
    border-bottom: 1px solid $light-grey;
    padding-top: 30px;
    margin-bottom: 30px;
    padding-bottom: 40px;

    & + .tour-section {
      border-top: none;
      padding-top: 0;
    }
  }
}

.related {
  margin-bottom: 40px;

  h2 {
    margin: 0 0 40px;
  }

  .clear {
    margin-bottom: 30px;
  }
}

.secondary {
  margin: 0 -20px 30px;
}

@include mq(55em, 'true') {
  .no-mobile {
    display: none;
  }
}

@include mq(55em) {
  .no-desktop {
    display: none;
  }
}


@include mq(64em) {
  .primary {
    width: 60%;
    max-width: 736px;
    float: left;
  }

  .secondary {
    float: right;
    max-width: 407px;
    width: calc(40% - 30px);
  }

  .related {
    margin-bottom: 90px;
  }
}

@include mq(75em) {
  .primary {
    width: 65%;
  }

  .secondary {
    margin-right: 0;
    width: calc(35% - 30px);
  }
}
</style>

<style lang="scss">
@media (max-width: 55em) {
  .secondary .add-to-shortlist {
    display: none;
  }
}

.tour h2 {
  color: #003150;
  font-size: 1.375em;
  margin-bottom: 1em;
}

.tour-section p:empty {
  display: none;
}

.breadcrumbs {
  display: flex;
  flex-direction: row;
  margin-bottom: 80px;
  font-size: 13px;
}
.orange-link {
  margin-right: 25px;
}
.orange-link::before {
  margin: -1px;
  margin-left: -3px;
}
.stiky-nav {
  display: flex;
  flex-direction: row;
  position: sticky;
  max-width: 740px;
  padding-left: 8px;
  z-index: 17;
  margin-top: -40px;
  margin-left: -8px;
  margin-bottom: 30px;
}
.stiky-nav2 {
  display: flex;
  flex-direction: row;
  position: fixed;
  max-width: 740px;
  background: #fff;
  padding-left: 8px;
  top: 142px;
  z-index: 17;
}
.subnav {
  border: 1px solid #003150;
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  color: #003150;
  cursor: pointer;
}
.subnav2 {
  border-radius: 4px;
  margin-right: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  background: #B8C5CA;
  color: #fff;
  cursor: pointer;
}
.boat_name {
  color: #003150;
  font-size: 14px;
  font-weight: bold;
  padding-top: 32px;
}
.boat_description {
  color: #52869B;
  font-size: 14px;
  font-weight: lighter;
  margin-bottom: 12px;
}
</style>

