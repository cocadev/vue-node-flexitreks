<template>
  <div>
    <h3
      v-show="country && (gallery && gallery.length || heroImg)"
      class="title"
    >
      <span v-show="! showingSearchResults()">Cycling Holidays in {{ country }}</span>
      <span v-show="showingSearchResults()">Your search results</span>
    </h3>
    <f-hero-slider
      :options="{
        duration: 500,
        loop: true,
        perPage: {
          500 : Math.min(gallery ? gallery.length : 2, 1),
        },
        count: ( gallery ? gallery.length : 0 ) + (heroImg ? 1 : 0)
      }"
    >
      <f-hero
        v-if="heroImg && heroImg.url"
        :image="heroImg && heroImg.url"
        gradient="part"
      />
      <f-hero
        v-for="(feature, i) in gallery_details"
        :key="i"
        :image="feature.url"
        gradient="part"
      />
    </f-hero-slider>

    <div class="description">
      <div class="wrap">
        <div class="breadcrumbs">
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
          <a style="color: #003150">
            <span v-show="! showingSearchResults()">{{ country }}</span>
            <span v-show="showingSearchResults()">Search Results</span>
          </a>
        </div>
        <div v-show="! showingSearchResults()">
          <div class="header">Cycling Holidays in {{ country }}</div>
          <div
            class="html"
            v-html="description"
          />
        </div>
      </div>
    </div>

    <f-filters v-if="myContries.length > 0"/>
    <div
      v-if="myContries.length > 0"
      class="wrap"
    >
      <TourList :tours="tours" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  h1 {
    margin: 0;
    padding: 15px 20px;
    font-size: 14px;

    @media (min-width: 768px) {
      display: none;
    }
  }
</style>

<script>
import TourList from '@/components/tours/TourList.vue';
import FFilters from '@/components/global/Filters';
import FHero from '@/components/global/Hero';
import FHeroSlider from '@/components/global/HeroSlider';

export default {
  async asyncData({ params, store }) {
    await store.dispatch('getToursForDestination', { slug: params.slug })
  },

  components: {
    TourList,
    FFilters,
    FHero,
    FHeroSlider
  },

  data () {
    return {
      gallery: [],
      gallery_details: [],
      heroImg: null,
      description: null,
      country: null,
      myContries: [],
      hasSearchedCountries: false
    }
  },

  computed: {
    tours () {
      return this.$store.getters.currentTours
    }
  },

  beforeRouteUpdate (to, from, next) {
    // this.$store.commit('resetFilters')
    next()
  },

  async mounted () {
    // this.$store.commit('resetFilters')
    let country = this.$route.params.slug.split("-")[2];
    this.myContries = this.$store.state.filters.countries.slice(0) ? this.$store.state.filters.countries.slice(0) : [];
    country = country.charAt(0).toUpperCase() + country.slice(1);
    if(!this.myContries.includes(country)){
      this.myContries.push(country)
      this.$store.commit('changeFilter', { type: 'countries', value: this.myContries });
    }
    try {
      const { data } = await this.$axios.get(`destinations/${this.$route.params.slug}`)
      this.gallery = data.gallery
      this.gallery_details = data.gallery_details
      this.heroImg = data.image
      this.country = data.name
      this.description = data.description
    } catch(e) {
      this.gallery = []
    }
    // Searched countries?
    if (this.myContries.length > 1) {
      this.hasSearchedCountries = true;
    }
  },

  head () {
    const title = this.title || 'Destination'
    return {
      title,
      meta: [
        { property: 'og:title', content: title + ' | Flexitreks' },
        { name: 'twitter:title', content: title + ' | Flexitreks' }
      ]
    }
  },

  methods: {
    showingSearchResults () {
      if (this.$store.state.filters.countries.length > 1) {
        this.hasSearchedCountries = true;
      }
      return this.hasSearchedCountries;
    },
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/global/settings.scss';
@import '@/assets/scss/global/mixins.scss';

.title {
  color: white;
  font-size: 52px;
  font-weight: 600;
  text-shadow: 2px 2px 2px #333;
  text-align: center;
  align-self: center;
  position: absolute;
  z-index: 10;
  margin-top: 100px;
  width: 100%;
}
.description {
  background: #fff;
}
.header {
  color: #003150;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
}
.html {
  color: #52869B;
  font-size: 14px;
  font-weight: 300;
  margin-bottom: 16px;
}
.breadcrumbs {
  margin-top: 23px;
  display: flex;
  flex-direction: row;
  margin-bottom: 30px;
  font-size: 13px;
}
.orange-link {
  margin-right: 25px;
}
.orange-link::before {
  margin: -1px;
  margin-left: -3px;
}
@media (max-width: 900px) {
  .title {
    font-size: 42px;
    margin-top: 50px;
  }
}

@media (max-width: 750px) {
  .title {
    font-size: 22px;
    margin-top: 30px;
  }
}

@media (max-width: 450px) {
  .title {
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
